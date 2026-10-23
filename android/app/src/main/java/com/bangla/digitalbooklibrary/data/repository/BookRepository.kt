package com.bangla.digitalbooklibrary.data.repository

import com.bangla.digitalbooklibrary.data.model.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

/**
 * Repository enforcing core business logic:
 * - Read online for free without exposing download URL
 * - Paid original PDF download unlocked only after server verifies bKash transaction
 */
class BookRepository {

    suspend fun getPublishedBooks(): List<Book> = withContext(Dispatchers.IO) {
        listOf(
            Book(
                id = "book-gitanjali-01",
                titleBn = "গীতাঞ্জলি",
                titleEn = "Gitanjali",
                authorBn = "রবীন্দ্রনাথ ঠাকুর",
                authorEn = "Rabindranath Tagore",
                category = "poetry",
                language = "bn",
                priceBdt = 120,
                coverUrl = "/src/assets/images/book_cover_gitanjali_1792737259795.jpg",
                descriptionBn = "রবীন্দ্রনাথ ঠাকুরের নোবেল বিজয়ী অমর কাব্যগ্রন্থ। আত্মনিবেদন ও আধ্যাত্মিক সুষমার ১৫৭টি ভক্তিগীতির সংকলন।",
                totalPages = 168,
                isPublished = true,
                featured = true
            ),
            Book(
                id = "book-scifi-02",
                titleBn = "মহাশূন্যের রহস্য: নক্ষত্রমণ্ডলীর অভিযান",
                titleEn = "Mystery of Deep Space",
                authorBn = "অরিন্দম চৌধুরী",
                authorEn = "Arindam Chowdhury",
                category = "scifi",
                language = "bn",
                priceBdt = 180,
                coverUrl = "/src/assets/images/book_cover_scifi_1792737261174.jpg",
                descriptionBn = "বাংলা কল্পবিজ্ঞানের এক নতুন দিগন্ত। অ্যান্ড্রোমিডা গ্যালাক্সির রহস্যময় সিগন্যাল ডিকোড করার রোমাঞ্চকর অভিযান।",
                totalPages = 240,
                isPublished = true,
                featured = true
            )
        )
    }

    suspend fun getProtectedReaderPage(bookId: String, pageNumber: Int): SamplePage = withContext(Dispatchers.IO) {
        SamplePage(
            pageNumber = pageNumber,
            titleBn = "গান $pageNumber",
            contentBn = "আমারে তুমি অশেষ করেছ, এমনি লীলা তব—\nফুরায়ে ফেলে আবার ভরেছ জীবন নব নব।\n\nকত যে গিরি কত যে নদী-তীরে\nবেড়ালে বহি ছোটো এ বাঁশিটিরে,\nকত যে তান বাজালে ফিরে ফিরে\nকাহারে সে যে কব।"
        )
    }
}
