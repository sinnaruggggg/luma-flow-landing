package kr.nanaweb.admin

import android.content.Context
import androidx.work.Constraints
import androidx.work.CoroutineWorker
import androidx.work.ExistingPeriodicWorkPolicy
import androidx.work.NetworkType
import androidx.work.PeriodicWorkRequestBuilder
import androidx.work.WorkManager
import androidx.work.WorkerParameters
import java.util.concurrent.TimeUnit

// 앱이 꺼져 있어도 15분마다(안드로이드 최소 간격) 새 문의를 확인해 알림을 띄웁니다.
class InquiryWorker(context: Context, params: WorkerParameters) : CoroutineWorker(context, params) {
    override suspend fun doWork(): Result {
        val prefs = Prefs(applicationContext)
        val token = prefs.token
        if (token.isBlank()) return Result.success()
        return try {
            val since = prefs.lastSeen.ifBlank { null }
            val result = Api.list(token, since)
            if (since == null) {
                // 처음 확인이면 기존 문의는 알리지 않고 기준 시각만 잡습니다.
                prefs.markSeen(result.inquiries)
                if (result.inquiries.isEmpty()) prefs.lastSeen = java.time.Instant.now().truncatedTo(java.time.temporal.ChronoUnit.MILLIS).toString()
            } else {
                val fresh = result.inquiries.filter { it.status == "new" }
                Notifications.showNew(applicationContext, fresh)
                prefs.markSeen(result.inquiries)
            }
            Result.success()
        } catch (e: ApiException) {
            if (e.status == 401) Result.success() else Result.retry()
        }
    }

    companion object {
        private const val NAME = "inquiry-check"

        fun schedule(context: Context) {
            val request = PeriodicWorkRequestBuilder<InquiryWorker>(15, TimeUnit.MINUTES)
                .setConstraints(Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
                .build()
            WorkManager.getInstance(context)
                .enqueueUniquePeriodicWork(NAME, ExistingPeriodicWorkPolicy.KEEP, request)
        }

        fun cancel(context: Context) {
            WorkManager.getInstance(context).cancelUniqueWork(NAME)
        }
    }
}
