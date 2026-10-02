package kr.nanaweb.admin

import android.Manifest
import android.content.ClipData
import android.content.ClipboardManager
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.ComponentActivity
import androidx.activity.compose.BackHandler
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawingPadding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.filled.ArrowBack
import androidx.compose.material.icons.automirrored.filled.ExitToApp
import androidx.compose.material.icons.filled.Email
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.LifecycleResumeEffect
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Locale

private val Ink = Color(0xFF172023)
private val Accent = Color(0xFFD9492F)
private val Paper = Color(0xFFF3F3EF)
private val Muted = Color(0xFF6A716F)
private val Line = Color(0xFFE3E5E0)

private val STATUS = linkedMapOf("new" to "새 문의", "progress" to "진행 중", "done" to "완료")
private val STATUS_COLOR = mapOf("new" to Accent, "progress" to Color(0xFFE2A93B), "done" to Color(0xFF43A06B))

class MainActivity : ComponentActivity() {
    private val openId = mutableStateOf<String?>(null)

    private val askNotification = registerForActivityResult(ActivityResultContracts.RequestPermission()) { }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        Notifications.createChannel(this)
        openId.value = intent?.getStringExtra(Notifications.EXTRA_INQUIRY_ID)
        val prefs = Prefs(this)
        if (prefs.token.isNotBlank()) InquiryWorker.schedule(this)
        setContent {
            MaterialTheme(colorScheme = lightColorScheme(primary = Ink, secondary = Accent, background = Paper, surface = Color.White)) {
                Surface(Modifier.fillMaxSize(), color = Paper) {
                    NanawebApp(prefs, openId.value, onOpened = { openId.value = null }, askNotification = ::askNotificationPermission)
                }
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        setIntent(intent)
        openId.value = intent.getStringExtra(Notifications.EXTRA_INQUIRY_ID)
    }

    private fun askNotificationPermission() {
        if (Build.VERSION.SDK_INT >= 33 && !Notifications.canNotify(this)) {
            askNotification.launch(Manifest.permission.POST_NOTIFICATIONS)
        }
    }
}

@Composable
private fun NanawebApp(prefs: Prefs, openId: String?, onOpened: () -> Unit, askNotification: () -> Unit) {
    val context = LocalContext.current
    var token by remember { mutableStateOf(prefs.token) }
    if (token.isBlank()) {
        LoginScreen(initialUser = prefs.username) { newToken, user ->
            prefs.token = newToken
            prefs.username = user
            token = newToken
            InquiryWorker.schedule(context)
        }
    } else {
        LaunchedEffect(Unit) { askNotification() }
        InboxScreen(
            token = token,
            prefs = prefs,
            openId = openId,
            onOpened = onOpened,
            onLogout = {
                prefs.logout()
                InquiryWorker.cancel(context)
                token = ""
            },
        )
    }
}

@Composable
private fun LoginScreen(initialUser: String, onLogin: (String, String) -> Unit) {
    val scope = rememberCoroutineScope()
    var username by remember { mutableStateOf(initialUser) }
    var password by remember { mutableStateOf("") }
    var pending by remember { mutableStateOf(false) }
    var error by remember { mutableStateOf("") }
    val submit = {
        if (!pending && username.isNotBlank() && password.isNotBlank()) {
            pending = true
            error = ""
            scope.launch {
                try {
                    onLogin(Api.login(username.trim(), password), username.trim())
                } catch (e: ApiException) {
                    error = e.message.orEmpty()
                } finally {
                    pending = false
                }
            }
        }
    }
    // 키보드가 올라와도 로그인 버튼까지 스크롤할 수 있게 합니다. (safeDrawing 에 키보드 영역 포함)
    BoxWithConstraints(Modifier.fillMaxSize().safeDrawingPadding()) {
        val minHeight = maxHeight
        Column(Modifier.fillMaxSize().verticalScroll(rememberScrollState())) {
            Column(
                Modifier.fillMaxWidth().heightIn(min = minHeight).padding(20.dp),
                verticalArrangement = Arrangement.Center,
            ) {
                Column(
                    Modifier.fillMaxWidth().clip(RoundedCornerShape(20.dp)).background(Color.White).padding(28.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp),
                ) {
                    Text("나나웹 관리자", color = Muted, fontWeight = FontWeight.Bold)
                    Text("문의 관리", fontSize = 28.sp, fontWeight = FontWeight.ExtraBold)
                    OutlinedTextField(
                        username, { username = it }, label = { Text("아이디") }, singleLine = true,
                        keyboardOptions = KeyboardOptions(imeAction = ImeAction.Next),
                        modifier = Modifier.fillMaxWidth(),
                    )
                    OutlinedTextField(
                        password, { password = it }, label = { Text("비밀번호") }, singleLine = true,
                        visualTransformation = PasswordVisualTransformation(),
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Password, imeAction = ImeAction.Done),
                        keyboardActions = KeyboardActions(onDone = { submit() }),
                        modifier = Modifier.fillMaxWidth(),
                    )
                    if (error.isNotBlank()) Text(error, color = Color(0xFFA3331D), fontWeight = FontWeight.SemiBold)
                    Button(
                        onClick = submit,
                        enabled = !pending && username.isNotBlank() && password.isNotBlank(),
                        shape = RoundedCornerShape(10.dp),
                        modifier = Modifier.fillMaxWidth().height(50.dp),
                    ) { Text(if (pending) "확인 중…" else "로그인", fontWeight = FontWeight.Bold) }
                    Text("로그인하면 새 문의가 들어올 때 휴대폰 알림을 받습니다.", color = Muted, fontSize = 13.sp)
                }
            }
        }
    }
}

@Composable
private fun InboxScreen(token: String, prefs: Prefs, openId: String?, onOpened: () -> Unit, onLogout: () -> Unit) {
    val scope = rememberCoroutineScope()
    var items by remember { mutableStateOf(emptyList<Inquiry>()) }
    var counts by remember { mutableStateOf(Counts()) }
    var loading by remember { mutableStateOf(true) }
    var error by remember { mutableStateOf("") }
    var filter by remember { mutableStateOf("all") }
    var selectedId by remember { mutableStateOf<String?>(null) }

    suspend fun load() {
        loading = true
        try {
            val result = Api.list(token)
            items = result.inquiries
            counts = result.counts
            error = ""
            prefs.markSeen(result.inquiries)
        } catch (e: ApiException) {
            if (e.status == 401) onLogout() else error = e.message.orEmpty()
        } finally {
            loading = false
        }
    }

    // 앱을 열 때마다 바로 확인하고, 켜 둔 동안은 1분마다 새로고침합니다.
    LifecycleResumeEffect(token) {
        val job = scope.launch {
            while (true) {
                load()
                delay(60_000)
            }
        }
        onPauseOrDispose { job.cancel() }
    }

    LaunchedEffect(openId, items) {
        if (openId != null && items.any { it.id == openId }) {
            selectedId = openId
            onOpened()
        }
    }

    val selected = items.firstOrNull { it.id == selectedId }
    if (selected != null) {
        BackHandler { selectedId = null }
        DetailScreen(
            item = selected,
            token = token,
            onBack = { selectedId = null },
            onSaved = { updated ->
                items = items.map { if (it.id == updated.id) updated else it }
                counts = recount(items)
            },
            onDeleted = { id ->
                items = items.filter { it.id != id }
                counts = recount(items)
                selectedId = null
            },
        )
        return
    }

    val visible = if (filter == "all") items else items.filter { it.status == filter }
    Column(Modifier.fillMaxSize().safeDrawingPadding()) {
        Row(Modifier.fillMaxWidth().padding(start = 20.dp, end = 8.dp, top = 8.dp), verticalAlignment = Alignment.CenterVertically) {
            Text("나나웹", fontWeight = FontWeight.ExtraBold, fontSize = 20.sp)
            Text("  문의 관리", color = Muted, fontSize = 15.sp, modifier = Modifier.weight(1f))
            IconButton(onClick = { scope.launch { load() } }) {
                if (loading) CircularProgressIndicator(Modifier.size(20.dp), strokeWidth = 2.dp)
                else Icon(Icons.Default.Refresh, contentDescription = "새로고침")
            }
            IconButton(onClick = onLogout) { Icon(Icons.AutoMirrored.Filled.ExitToApp, contentDescription = "로그아웃") }
        }
        Row(Modifier.fillMaxWidth().padding(horizontal = 16.dp, vertical = 10.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            listOf("all" to "전체" to counts.total, "new" to "새 문의" to counts.new, "progress" to "진행 중" to counts.progress, "done" to "완료" to counts.done)
                .forEach { (pair, count) ->
                    val (value, label) = pair
                    val on = filter == value
                    Column(
                        Modifier.weight(1f).clip(RoundedCornerShape(14.dp)).background(Color.White)
                            .border(if (on) 2.dp else 1.dp, if (on) Ink else Line, RoundedCornerShape(14.dp))
                            .clickable { filter = value }.padding(horizontal = 12.dp, vertical = 10.dp),
                    ) {
                        Text(label, fontSize = 12.sp, color = Muted)
                        Text("$count", fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = if (value == "new") Accent else Ink)
                    }
                }
        }
        if (error.isNotBlank()) {
            Text(error, color = Color(0xFFA3331D), modifier = Modifier.padding(horizontal = 20.dp, vertical = 4.dp))
        }
        if (visible.isEmpty()) {
            Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
                Text(if (loading) "불러오는 중…" else "해당하는 문의가 없습니다.", color = Muted)
            }
        } else {
            LazyColumn(Modifier.fillMaxSize().background(Color.White)) {
                items(visible, key = { it.id }) { item ->
                    Row(
                        Modifier.fillMaxWidth().clickable { selectedId = item.id }.padding(horizontal = 18.dp, vertical = 14.dp),
                        horizontalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Box(Modifier.padding(top = 6.dp).size(10.dp).clip(CircleShape).background(STATUS_COLOR[item.status] ?: Line))
                        Column(Modifier.weight(1f)) {
                            Text(item.contactName, fontWeight = FontWeight.Bold)
                            if (item.company.isNotBlank()) Text(item.company, fontSize = 12.sp, color = Muted)
                            Text(item.details, fontSize = 13.sp, color = Color(0xFF50585A), maxLines = 1, overflow = TextOverflow.Ellipsis)
                        }
                        Text(formatTime(item.createdAt), fontSize = 12.sp, color = Color(0xFF8A908E))
                    }
                    HorizontalDivider(color = Color(0xFFF0F1ED))
                }
            }
        }
    }
}

@Composable
private fun DetailScreen(item: Inquiry, token: String, onBack: () -> Unit, onSaved: (Inquiry) -> Unit, onDeleted: (String) -> Unit) {
    var askDelete by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()
    var memo by remember(item.id) { mutableStateOf(item.memo) }
    var saving by remember { mutableStateOf("") }

    fun save(label: String, status: String? = null, newMemo: String? = null) {
        saving = label
        scope.launch {
            try {
                onSaved(Api.update(token, item.id, status, newMemo))
                if (newMemo != null) Toast.makeText(context, "메모를 저장했습니다.", Toast.LENGTH_SHORT).show()
            } catch (e: ApiException) {
                Toast.makeText(context, e.message, Toast.LENGTH_LONG).show()
            } finally {
                saving = ""
            }
        }
    }

    Column(Modifier.fillMaxSize().safeDrawingPadding().verticalScroll(rememberScrollState()).padding(20.dp), verticalArrangement = Arrangement.spacedBy(18.dp)) {
        Row(Modifier.clickable(onClick = onBack).padding(vertical = 6.dp), verticalAlignment = Alignment.CenterVertically) {
            Icon(Icons.AutoMirrored.Filled.ArrowBack, contentDescription = null, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(4.dp))
            Text("목록", fontWeight = FontWeight.Bold)
        }
        Column {
            Text(
                STATUS[item.status] ?: "새 문의",
                color = Color.White, fontSize = 12.sp, fontWeight = FontWeight.ExtraBold,
                modifier = Modifier.clip(RoundedCornerShape(99.dp)).background(STATUS_COLOR[item.status] ?: Accent).padding(horizontal = 10.dp, vertical = 3.dp),
            )
            Spacer(Modifier.height(8.dp))
            Text(item.contactName, fontSize = 26.sp, fontWeight = FontWeight.ExtraBold)
            if (item.company.isNotBlank()) Text(item.company, color = Muted, fontWeight = FontWeight.SemiBold)
            Text("${formatTime(item.createdAt)} 접수", color = Muted, fontSize = 13.sp)
        }
        val compact = PaddingValues(horizontal = 8.dp)
        Row(Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            if (item.phone.isNotBlank()) {
                OutlinedButton(modifier = Modifier.weight(1f), contentPadding = compact, onClick = { open(context, Intent(Intent.ACTION_DIAL, Uri.parse("tel:" + item.phone.filter { it.isDigit() || it == '+' }))) }) {
                    Icon(Icons.Default.Phone, contentDescription = null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(6.dp)); Text("전화")
                }
            }
            if (item.email.isNotBlank()) {
                OutlinedButton(modifier = Modifier.weight(1f), contentPadding = compact, onClick = { open(context, Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:" + item.email))) }) {
                    Icon(Icons.Default.Email, contentDescription = null, modifier = Modifier.size(16.dp)); Spacer(Modifier.width(6.dp)); Text("메일")
                }
            }
            OutlinedButton(modifier = Modifier.weight(1f), contentPadding = compact, onClick = { copy(context, item) }) { Text("복사", maxLines = 1) }
        }
        Field("연락처", listOf(item.phone, item.email).filter { it.isNotBlank() }.joinToString("\n").ifBlank { "-" })
        Field("예상 예산", item.budget.ifBlank { "-" })
        Field("공개 희망 시기", item.timeline.ifBlank { "-" })
        Field("참고", item.references.ifBlank { "-" })
        Field("문의 내용", item.details)
        Text("처리 상태", color = Muted, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
            STATUS.forEach { (value, label) ->
                val on = item.status == value
                Button(
                    onClick = { save(value, status = value) },
                    enabled = saving.isEmpty(),
                    shape = RoundedCornerShape(10.dp),
                    contentPadding = PaddingValues(horizontal = 4.dp),
                    elevation = null,
                    colors = if (on) ButtonDefaults.buttonColors() else ButtonDefaults.buttonColors(containerColor = Color.White, contentColor = Ink),
                    modifier = Modifier.weight(1f).border(1.dp, if (on) Ink else Line, RoundedCornerShape(10.dp)),
                ) { Text(if (saving == value) "저장 중…" else label, fontWeight = FontWeight.Bold, maxLines = 1) }
            }
        }
        Text("메모", color = Muted, fontWeight = FontWeight.Bold, fontSize = 14.sp)
        OutlinedTextField(memo, { memo = it }, placeholder = { Text("통화 내용, 다음 할 일 등") }, minLines = 3, modifier = Modifier.fillMaxWidth())
        Button(
            onClick = { save("memo", newMemo = memo) },
            enabled = saving.isEmpty() && memo != item.memo,
            shape = RoundedCornerShape(10.dp),
        ) { Text(if (saving == "memo") "저장 중…" else "메모 저장", fontWeight = FontWeight.Bold) }
        HorizontalDivider(color = Line)
        Text("고객이 삭제를 요청했거나 스팸·테스트 문의일 때 지웁니다. 접수 후 1년이 지난 문의는 자동으로 삭제됩니다.", color = Muted, fontSize = 13.sp)
        OutlinedButton(
            onClick = { askDelete = true },
            enabled = saving.isEmpty(),
            shape = RoundedCornerShape(10.dp),
            colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFFC43E25)),
        ) { Text(if (saving == "delete") "삭제 중…" else "이 문의 삭제", fontWeight = FontWeight.Bold) }
        Spacer(Modifier.height(24.dp))
    }

    if (askDelete) {
        AlertDialog(
            onDismissRequest = { askDelete = false },
            title = { Text("문의를 삭제할까요?") },
            text = { Text("${item.contactName}님의 문의를 삭제합니다. 삭제하면 되돌릴 수 없습니다.") },
            confirmButton = {
                TextButton(onClick = {
                    askDelete = false
                    saving = "delete"
                    scope.launch {
                        try {
                            Api.delete(token, item.id)
                            Toast.makeText(context, "삭제했습니다.", Toast.LENGTH_SHORT).show()
                            onDeleted(item.id)
                        } catch (e: ApiException) {
                            Toast.makeText(context, e.message, Toast.LENGTH_LONG).show()
                            saving = ""
                        }
                    }
                }) { Text("삭제", color = Color(0xFFC43E25), fontWeight = FontWeight.Bold) }
            },
            dismissButton = { TextButton(onClick = { askDelete = false }) { Text("취소") } },
        )
    }
}

@Composable
private fun Field(label: String, value: String) {
    Column(Modifier.fillMaxWidth().clip(RoundedCornerShape(12.dp)).background(Color.White).padding(horizontal = 14.dp, vertical = 12.dp)) {
        Text(label, fontSize = 12.sp, color = Muted)
        Text(value)
    }
}

private fun recount(items: List<Inquiry>) = Counts(
    total = items.size,
    new = items.count { it.status == "new" },
    progress = items.count { it.status == "progress" },
    done = items.count { it.status == "done" },
)

private val timeFormat = DateTimeFormatter.ofPattern("M월 d일 a h:mm", Locale.KOREA)

private fun formatTime(iso: String): String =
    runCatching { Instant.parse(iso).atZone(ZoneId.systemDefault()).format(timeFormat) }.getOrDefault("")

private fun open(context: Context, intent: Intent) {
    runCatching { context.startActivity(intent) }.onFailure {
        Toast.makeText(context, "열 수 있는 앱이 없습니다.", Toast.LENGTH_SHORT).show()
    }
}

private fun copy(context: Context, item: Inquiry) {
    val text = listOf(
        "[나나웹 문의] ${item.contactName}",
        "회사: ${item.company.ifBlank { "-" }}",
        "연락처: ${item.phone.ifBlank { "-" }} / ${item.email.ifBlank { "-" }}",
        "예산: ${item.budget.ifBlank { "-" }} · 시기: ${item.timeline.ifBlank { "-" }}",
        "",
        item.details,
    ).joinToString("\n")
    context.getSystemService(ClipboardManager::class.java).setPrimaryClip(ClipData.newPlainText("문의", text))
    Toast.makeText(context, "복사했습니다.", Toast.LENGTH_SHORT).show()
}
