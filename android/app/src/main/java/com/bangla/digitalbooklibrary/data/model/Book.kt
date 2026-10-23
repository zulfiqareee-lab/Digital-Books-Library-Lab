package com.bangla.digitalbooklibrary.data.model

data class Book(
    val id: String,
    val titleBn: String,
    val titleEn: String,
    val authorBn: String,
    val authorEn: String,
    val category: String,
    val language: String,
    val priceBdt: Int,
    val coverUrl: String,
    val descriptionBn: String,
    val totalPages: Int,
    val isPublished: Boolean,
    val featured: Boolean = false,
    val publishedYear: Int = 2024
)

data class SamplePage(
    val pageNumber: Int,
    val titleBn: String,
    val contentBn: String,
    val contentEn: String? = null
)

data class BkashPaymentRequest(
    val userId: String,
    val userEmail: String,
    val userName: String,
    val bookId: String
)

data class BkashPaymentResponse(
    val success: Boolean,
    val orderId: String,
    val paymentId: String,
    val amountBdt: Int,
    val currency: String,
    val bookTitleBn: String
)

data class BkashExecuteRequest(
    val orderId: String,
    val paymentId: String,
    val customerMsisdn: String,
    val otp: String,
    val pin: String,
    val userId: String
)

data class BkashExecuteResponse(
    val success: Boolean,
    val trxId: String,
    val orderId: String,
    val bookId: String,
    val message: String
)

data class DownloadTokenResponse(
    val success: Boolean,
    val token: String,
    val downloadUrl: String,
    val expiresInSeconds: Int
)
