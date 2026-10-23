package com.bangla.digitalbooklibrary

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController

/**
 * Digital Book Library - Android Jetpack Compose Native Entry Point
 * 
 * Architecture:
 * - MVVM Pattern
 * - Jetpack Compose with Material 3
 * - Kotlin Coroutines & Flow
 * - Protected Online Reading Engine (server-rendered protected pages)
 * - Server-authoritative bKash Checkout
 */
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MaterialTheme(
                colorScheme = lightColorScheme(
                    primary = androidx.compose.ui.graphics.Color(0xFF047857), // Emerald 700
                    secondary = androidx.compose.ui.graphics.Color(0xFFE2136E), // bKash Pink
                    background = androidx.compose.ui.graphics.Color(0xFFF8FAFC),
                    surface = androidx.compose.ui.graphics.Color.White
                )
            ) {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                    val navController = rememberNavController()

                    NavHost(navController = navController, startDestination = "home") {
                        composable("home") {
                            Text(text = "Digital Book Library - বাংলা ডিজিটাল গ্রন্থালয়")
                        }
                        composable("book_detail/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId")
                            Text(text = "Book Detail: $bookId")
                        }
                        composable("reader/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId")
                            Text(text = "Protected PDF Reader: $bookId")
                        }
                        composable("bkash_checkout/{bookId}") { backStackEntry ->
                            val bookId = backStackEntry.arguments?.getString("bookId")
                            Text(text = "bKash Merchant Checkout: $bookId")
                        }
                        composable("admin_dashboard") {
                            Text(text = "Admin Dashboard (zulfiqareee@gmail.com)")
                        }
                    }
                }
            }
        }
    }
}
