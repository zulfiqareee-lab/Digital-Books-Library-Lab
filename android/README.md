# Digital Book Library - Native Android (Kotlin & Jetpack Compose)

This directory contains the native Android project structure for **Digital Book Library (ডিজিটাল বই লাইব্রেরি)**, a Bengali-first digital reading and selling app for Bangladesh built with Kotlin, Jetpack Compose, and Material 3.

## Core Architecture & Business Model

- **Core Rule**: Everyone can read published books online for **free**. Downloading the original print-quality PDF requires a **verified bKash payment**.
- **Architecture**: MVVM with Kotlin Coroutines, Repository Pattern, and Android Jetpack Compose Material 3.
- **bKash PGW Integration**: Follows official bKash Merchant Tokenized Checkout API v1.2.0. Secret keys are kept strictly on the trusted backend (`server.ts` or Cloud Run/Functions). The Android client never handles merchant secrets or client-side trust shortcuts.
- **Protected PDF Delivery**: Server issues single-use, 60-second time-expiring cryptographically signed download tokens. Unpaid access attempts strictly return HTTP 403 Forbidden.

## How to Open in Android Studio

1. Open Android Studio (Ladybug or newer).
2. Choose **Open Project** and select the `/android` directory.
3. Allow Gradle to sync dependencies defined in `build.gradle.kts`.
4. Run on an Android Emulator (Pixel 8 / Pixel Tablet recommended, API 34+).

## Backend Endpoints

The native Android app connects to the trusted backend server (`server.ts`):
- `GET /api/books`: Public book catalog
- `GET /api/books/{id}/read-page/{page}`: Protected canvas page streaming (no raw PDF link exposed)
- `POST /api/bkash/create-payment`: Initiates bKash payment session with server-authoritative price
- `POST /api/bkash/execute-payment`: Validates transaction with bKash MFS and grants entitlement
- `POST /api/books/{id}/download-token`: Emits 60-second single-use signed download token
- `GET /api/books/{id}/download?token=...`: Streams verified original PDF attachment
