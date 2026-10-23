package com.bangla.digitalbooklibrary

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.util.Log
import android.view.ViewGroup
import android.webkit.*
import android.widget.FrameLayout
import android.widget.Toast
import androidx.activity.OnBackPressedCallback
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout
import java.io.InputStream
import java.net.URLConnection

/**
 * Digital Book Library - Android Native Client
 *
 * Runs the full Digital Book Library app natively with:
 * - Bengali UI, Book Catalog, & Free Online PDF Reader
 * - bKash Sandbox / Merchant Checkout Flow
 * - Admin Panel with Native PDF & Cover Image File Chooser
 * - Fast & Resilient Asset Interceptor with Explicit MIME Types & CORS
 * - Full Offline Cache, LocalStorage & IndexedDB Support
 * - Native Emerald Status Bar & Back Button Navigation
 */
class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private lateinit var swipeRefreshLayout: SwipeRefreshLayout
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    companion object {
        private const val TAG = "DigitalBookLibrary"
        private const val APP_ASSETS_HOST = "appassets.androidplatform.net"
        private const val START_URL = "https://appassets.androidplatform.net/index.html"
    }

    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val intentData = result.data
            val results = WebChromeClient.FileChooserParams.parseResult(result.resultCode, intentData)
            filePathCallback?.onReceiveValue(results)
        } else {
            filePathCallback?.onReceiveValue(null)
        }
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        // Set status bar to Emerald 700 (#047857)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            window.statusBarColor = Color.parseColor("#047857")
        }

        // Enable Chrome DevTools remote debugging via chrome://inspect
        WebView.setWebContentsDebuggingEnabled(true)

        val rootLayout = FrameLayout(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.parseColor("#064E3B"))
        }

        swipeRefreshLayout = SwipeRefreshLayout(this).apply {
            setColorSchemeColors(Color.parseColor("#047857"), Color.parseColor("#E2136E"))
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
        }

        webView = WebView(this).apply {
            layoutParams = ViewGroup.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT
            )
            setBackgroundColor(Color.parseColor("#064E3B"))
        }

        setupWebSettings()
        setupClients()

        swipeRefreshLayout.addView(webView)
        rootLayout.addView(swipeRefreshLayout)
        setContentView(rootLayout)

        swipeRefreshLayout.setOnRefreshListener {
            webView.reload()
        }

        // Keep pull-to-refresh enabled only when scrolled to the top
        webView.viewTreeObserver.addOnScrollChangedListener {
            swipeRefreshLayout.isEnabled = webView.scrollY == 0
        }

        // Android hardware / gesture back button handling
        onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
            override fun handleOnBackPressed() {
                if (webView.canGoBack()) {
                    webView.goBack()
                } else {
                    isEnabled = false
                    onBackPressedDispatcher.onBackPressed()
                }
            }
        })

        // Load the complete Digital Book Library app bundled inside APK assets
        Log.i(TAG, "Loading initial URL: $START_URL")
        webView.loadUrl(START_URL)
    }

    @SuppressLint("SetJavaScriptEnabled")
    private fun setupWebSettings() {
        webView.settings.apply {
            javaScriptEnabled = true
            domStorageEnabled = true
            databaseEnabled = true
            allowFileAccess = true
            allowContentAccess = true
            allowFileAccessFromFileURLs = true
            allowUniversalAccessFromFileURLs = true
            useWideViewPort = true
            loadWithOverviewMode = true
            setSupportZoom(false)
            builtInZoomControls = false
            displayZoomControls = false
            mediaPlaybackRequiresUserGesture = false
            cacheMode = WebSettings.LOAD_DEFAULT
            mixedContentMode = WebSettings.MIXED_CONTENT_ALWAYS_ALLOW
            userAgentString = "${userAgentString} DigitalBookLibraryApp/1.0.0"
        }
    }

    private fun setupClients() {
        webView.webViewClient = object : WebViewClient() {
            override fun shouldInterceptRequest(
                view: WebView?,
                request: WebResourceRequest?
            ): WebResourceResponse? {
                val uri = request?.url ?: return null
                return handleAssetRequest(uri)
            }

            override fun onPageFinished(view: WebView?, url: String?) {
                super.onPageFinished(view, url)
                swipeRefreshLayout.isRefreshing = false
                Log.d(TAG, "Page finished loading: $url")
            }

            override fun onReceivedError(
                view: WebView?,
                request: WebResourceRequest?,
                error: WebResourceError?
            ) {
                super.onReceivedError(view, request, error)
                swipeRefreshLayout.isRefreshing = false
                if (request?.isForMainFrame == true) {
                    Log.e(TAG, "Main frame error: ${error?.errorCode} - ${error?.description} for ${request.url}")
                }
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            override fun onShowFileChooser(
                mWebView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                try {
                    val intent = fileChooserParams?.createIntent() ?: Intent(Intent.ACTION_GET_CONTENT).apply {
                        type = "*/*"
                        addCategory(Intent.CATEGORY_OPENABLE)
                    }
                    fileChooserLauncher.launch(intent)
                    return true
                } catch (e: Exception) {
                    this@MainActivity.filePathCallback = null
                    Toast.makeText(this@MainActivity, "ফাইল সিলেক্টর খুলতে ব্যর্থ হয়েছে", Toast.LENGTH_SHORT).show()
                    return false
                }
            }

            override fun onProgressChanged(view: WebView?, newProgress: Int) {
                if (newProgress == 100) {
                    swipeRefreshLayout.isRefreshing = false
                }
            }

            override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
                val msg = consoleMessage?.message() ?: ""
                val line = consoleMessage?.lineNumber() ?: 0
                val src = consoleMessage?.sourceId() ?: ""
                val level = consoleMessage?.messageLevel()?.name ?: "LOG"
                Log.d("DigitalBookLibrary-JS", "[$level] $msg (at $src:$line)")
                return true
            }
        }

        webView.setDownloadListener { url, _, _, _, _ ->
            try {
                val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                startActivity(intent)
            } catch (e: Exception) {
                Toast.makeText(this, "ডাউনলোড শুরু করা যাচ্ছে না", Toast.LENGTH_SHORT).show()
            }
        }
    }

    /**
     * Intercepts requests to appassets.androidplatform.net or localhost and serves
     * packaged web assets directly from APK assets with strict, accurate MIME types
     * and permissive CORS headers.
     */
    private fun handleAssetRequest(uri: Uri): WebResourceResponse? {
        val host = uri.host ?: return null
        if (host != APP_ASSETS_HOST && host != "localhost") {
            return null
        }

        var path = uri.path?.trimStart('/') ?: ""
        if (path.isEmpty() || path == "assets" || path == "assets/" || path == "index.html" || path == "assets/index.html") {
            path = "index.html"
        }

        // Clean any duplicate assets prefix: e.g. "assets/assets/index.js" -> "assets/index.js"
        while (path.startsWith("assets/assets/")) {
            path = path.substring("assets/".length)
        }

        // Search in priority order across standard APK asset locations
        val candidates = mutableListOf<String>()
        candidates.add(path)
        if (!path.startsWith("assets/")) {
            candidates.add("assets/$path")
        } else {
            candidates.add(path.removePrefix("assets/"))
        }
        candidates.add("www/$path")
        if (!path.startsWith("assets/")) {
            candidates.add("www/assets/$path")
        }

        var stream: InputStream? = null
        var resolvedPath = path
        for (candidate in candidates) {
            try {
                stream = assets.open(candidate)
                resolvedPath = candidate
                break
            } catch (_: Exception) {}
        }

        // Fallback for SPA routing: if requesting a route path without file extension, serve index.html
        if (stream == null) {
            val lastSegment = uri.lastPathSegment ?: ""
            if (!lastSegment.contains(".")) {
                try {
                    stream = assets.open("index.html")
                    resolvedPath = "index.html"
                } catch (_: Exception) {
                    try {
                        stream = assets.open("www/index.html")
                        resolvedPath = "www/index.html"
                    } catch (_: Exception) {}
                }
            }
        }

        if (stream == null) {
            Log.w(TAG, "Asset not found: $path (URI: $uri)")
            return WebResourceResponse("text/plain", "UTF-8", 404, "Not Found", null, null)
        }

        val mimeType = getMimeType(resolvedPath)
        val response = WebResourceResponse(mimeType, "UTF-8", stream)

        val headers = HashMap<String, String>().apply {
            put("Access-Control-Allow-Origin", "*")
            put("Access-Control-Allow-Methods", "GET, POST, OPTIONS, HEAD")
            put("Access-Control-Allow-Headers", "*")
            put("Cache-Control", "no-cache")
        }
        response.responseHeaders = headers

        return response
    }

    /**
     * Maps file extensions to accurate MIME types so that Android WebView strictly
     * accepts JavaScript modules, CSS stylesheets, Web fonts, and multimedia.
     */
    private fun getMimeType(path: String): String {
        val lower = path.lowercase()
        return when {
            lower.endsWith(".js") || lower.endsWith(".mjs") -> "application/javascript"
            lower.endsWith(".css") -> "text/css"
            lower.endsWith(".html") || lower.endsWith(".htm") -> "text/html"
            lower.endsWith(".json") || lower.endsWith(".map") -> "application/json"
            lower.endsWith(".png") -> "image/png"
            lower.endsWith(".jpg") || lower.endsWith(".jpeg") -> "image/jpeg"
            lower.endsWith(".webp") -> "image/webp"
            lower.endsWith(".svg") -> "image/svg+xml"
            lower.endsWith(".pdf") -> "application/pdf"
            lower.endsWith(".woff") -> "font/woff"
            lower.endsWith(".woff2") -> "font/woff2"
            lower.endsWith(".ttf") -> "font/ttf"
            lower.endsWith(".otf") -> "font/otf"
            lower.endsWith(".ico") -> "image/x-icon"
            else -> URLConnection.guessContentTypeFromName(path) ?: "application/octet-stream"
        }
    }

    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
