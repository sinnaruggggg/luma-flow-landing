package kr.nanaweb.admin

import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.net.URLEncoder

// 나나웹 서버 주소. 도메인이 바뀌면 app/build.gradle.kts 의 baseUrl 기본값만 고치면 됩니다.
private val BASE_URL = BuildConfig.BASE_URL

data class Inquiry(
    val id: String,
    val createdAt: String,
    val status: String,
    val memo: String,
    val contactName: String,
    val company: String,
    val phone: String,
    val email: String,
    val budget: String,
    val timeline: String,
    val references: String,
    val details: String,
    val sourcePath: String,
)

data class Counts(val total: Int = 0, val new: Int = 0, val progress: Int = 0, val done: Int = 0)

data class InquiryList(val inquiries: List<Inquiry>, val counts: Counts)

class ApiException(val status: Int, message: String) : Exception(message)

object Api {
    suspend fun login(username: String, password: String): String {
        val body = JSONObject()
            .put("username", username)
            .put("password", password)
            .put("client", "android-app")
        return request("POST", "/api/admin/login", null, body).getString("token")
    }

    suspend fun list(token: String, since: String? = null): InquiryList {
        val query = if (since.isNullOrBlank()) "" else "?since=" + URLEncoder.encode(since, "UTF-8")
        val json = request("GET", "/api/admin/inquiries$query", token, null)
        val array = json.optJSONArray("inquiries")
        val items = buildList {
            if (array != null) for (i in 0 until array.length()) add(parse(array.getJSONObject(i)))
        }
        val c = json.optJSONObject("counts")
        val counts = if (c == null) Counts() else Counts(c.optInt("total"), c.optInt("new"), c.optInt("progress"), c.optInt("done"))
        return InquiryList(items, counts)
    }

    suspend fun update(token: String, id: String, status: String? = null, memo: String? = null): Inquiry {
        val body = JSONObject().put("id", id)
        if (status != null) body.put("status", status)
        if (memo != null) body.put("memo", memo)
        return parse(request("PATCH", "/api/admin/inquiries", token, body).getJSONObject("inquiry"))
    }

    private fun parse(o: JSONObject) = Inquiry(
        id = o.optString("id"),
        createdAt = o.optString("createdAt"),
        status = o.optString("status").ifBlank { "new" },
        memo = o.optString("memo"),
        contactName = o.optString("contactName"),
        company = o.optString("sampleBrand"),
        phone = o.optString("phone"),
        email = o.optString("email"),
        budget = o.optString("budget"),
        timeline = o.optString("timeline"),
        references = o.optString("references"),
        details = o.optString("details"),
        sourcePath = o.optString("sourcePath"),
    )

    private suspend fun request(method: String, path: String, token: String?, body: JSONObject?): JSONObject =
        withContext(Dispatchers.IO) {
            val conn = (URL(BASE_URL + path).openConnection() as HttpURLConnection).apply {
                requestMethod = method
                connectTimeout = 15_000
                readTimeout = 20_000
                setRequestProperty("Accept", "application/json")
                if (token != null) setRequestProperty("Authorization", "Bearer $token")
            }
            try {
                if (body != null) {
                    conn.doOutput = true
                    conn.setRequestProperty("Content-Type", "application/json; charset=utf-8")
                    conn.outputStream.use { it.write(body.toString().toByteArray(Charsets.UTF_8)) }
                }
                val code = conn.responseCode
                val stream = if (code in 200..299) conn.inputStream else conn.errorStream
                val text = stream?.bufferedReader(Charsets.UTF_8)?.use { it.readText() }.orEmpty()
                val json = runCatching { JSONObject(text) }.getOrDefault(JSONObject())
                if (code !in 200..299) {
                    throw ApiException(code, json.optString("message").ifBlank { "서버 오류 ($code)" })
                }
                json
            } catch (e: ApiException) {
                throw e
            } catch (e: Exception) {
                throw ApiException(0, "인터넷 연결을 확인해 주세요.")
            } finally {
                conn.disconnect()
            }
        }

}
