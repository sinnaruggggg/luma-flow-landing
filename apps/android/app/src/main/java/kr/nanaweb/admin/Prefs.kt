package kr.nanaweb.admin

import android.content.Context

// 로그인 토큰과 "마지막으로 확인한 문의 시각"을 휴대폰에 저장합니다.
class Prefs(context: Context) {
    private val sp = context.getSharedPreferences("nanaweb", Context.MODE_PRIVATE)

    var token: String
        get() = sp.getString("token", "").orEmpty()
        set(value) = sp.edit().putString("token", value).apply()

    var username: String
        get() = sp.getString("username", "").orEmpty()
        set(value) = sp.edit().putString("username", value).apply()

    // 이 시각 이후에 들어온 문의만 알림으로 보냅니다.
    var lastSeen: String
        get() = sp.getString("lastSeen", "").orEmpty()
        set(value) = sp.edit().putString("lastSeen", value).apply()

    fun markSeen(inquiries: List<Inquiry>) {
        val newest = inquiries.maxOfOrNull { it.createdAt } ?: return
        if (newest > lastSeen) lastSeen = newest
    }

    fun logout() = sp.edit().remove("token").remove("lastSeen").apply()
}
