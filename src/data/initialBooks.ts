import { Book, Order } from '../types';

export const CATEGORIES = [
  { id: 'all', nameBn: 'সব বই', nameEn: 'All Books' },
  { id: 'poetry', nameBn: 'কবিতা', nameEn: 'Poetry' },
  { id: 'novel', nameBn: 'উপন্যাস ও থ্রিলার', nameEn: 'Novels & Thrillers' },
  { id: 'scifi', nameBn: 'কল্পবিজ্ঞান ও মহাকাশ', nameEn: 'Sci-Fi & Space' },
  { id: 'history', nameBn: 'ইতিহাস ও ঐতিহ্য', nameEn: 'History & Heritage' },
  { id: 'biography', nameBn: 'জীবনী ও আত্মকথা', nameEn: 'Biography' },
  { id: 'research', nameBn: 'গবেষণা ও সাহিত্য', nameEn: 'Research & Literature' },
];

export const INITIAL_BOOKS: Book[] = [
  {
    id: 'book-gitanjali-01',
    titleBn: 'গীতাঞ্জলি',
    titleEn: 'Gitanjali (Song Offerings)',
    authorBn: 'রবীন্দ্রনাথ ঠাকুর',
    authorEn: 'Rabindranath Tagore',
    category: 'poetry',
    language: 'bn',
    priceBdt: 120,
    coverUrl: '/src/assets/images/book_cover_gitanjali_1792737259795.jpg',
    descriptionBn: 'রবীন্দ্রনাথ ঠাকুরের নোবেল বিজয়ী অমর কাব্যগ্রন্থ। আত্মনিবেদন ও আধ্যাত্মিক সুষমার ১৫৭টি ভক্তিগীতির সংকলন। ১৯১৩ সালে এই কাব্যের ইংরেজি অনুবাদের জন্য বিশ্বভারতীর প্রতিষ্ঠাতা রবীন্দ্রনাথ ঠাকুর এশিয়ার প্রথম নোবেল পুরস্কার অর্জন করেন।',
    descriptionEn: 'The world-famous Nobel Prize winning collection of 157 devotional poems by Rabindranath Tagore, published in 1910 and honored in 1913.',
    totalPages: 168,
    fileSizeBytes: 4259840,
    isPublished: true,
    featured: true,
    publishedYear: 1910,
    isbn: '978-984-05-1234-5',
    publisherBn: 'বিশ্বভারতী গ্রন্থন বিভাগ',
    publisherEn: 'Visva-Bharati Publications',
    samplePages: [
      {
        pageNumber: 1,
        titleBn: 'প্রথম গান (গান ১)',
        contentBn: `আমারে তুমি অশেষ করেছ, এমনি লীলা তব—
ফুরায়ে ফেলে আবার ভরেছ জীবন নব নব।

কত যে গিরি কত যে নদী-তীরে
বেড়ালে বহি ছোটো এ বাঁশিটিরে,
কত যে তান বাজালে ফিরে ফিরে
কাহারে সে যে কব।

তোমার ওই পরশ পেলে তবে
আমার এই আকুল হিয়া রবে,
পরান মোর আনন্দগান গাবে
তোমার পদতলে।

দিনান্তে যখন আঁধার নামে বনে,
আলোটি জ্বেলে রেখো মনের কোণে,
তোমার পানে চাহিয়া প্রতিক্ষণে
নিখিল সুখ লব।`,
        contentEn: `Thou hast made me endless, such is thy pleasure.
This frail vessel thou emptiest again and again,
and fillest it ever with fresh life.

Over these hills and streams
thou hast carried this little flute of a reed,
and hast breathed through it melodies
eternally new.`
      },
      {
        pageNumber: 2,
        titleBn: 'দ্বিতীয় গান (গান ২)',
        contentBn: `যখন গান গেয়ে উঠি তোমার কাছে,
তখন আমার বুক ভরে যায় সুখে।
আমার অহংকার সব কোথায় লুকায়,
আমার ক্ষুদ্রতা টুটে যায় তোমার চরণতলে।

আমি শুধু তোমার গানের পাখি হতে চাই—
যে পাখি প্রভাতের প্রথম আলো দেখে
আনন্দসুরে ডানা মেলে দেয় নীল আকাশে।

হৃদয় আমার নাচে রে আজিকে,
ময়ূরের মতো নাচে রে হৃদয় নাচে।
শত বরনের ভাব-উচ্ছ্বাস
কলাপের মতো করেছে বিকাশ,
আকুল পরান আকাশে চাহিয়া
উল্লাসে কারে যাচে রে।`
      },
      {
        pageNumber: 3,
        titleBn: 'তৃতীয় গান (চিত্ত যেথা ভয়শূন্য)',
        contentBn: `চিত্ত যেথা ভয়শূন্য, উচ্চ যেথা শির,
জ্ঞান যেথা মুক্ত, যেথা গৃহের প্রাচীর
আপন প্রাঙ্গণমাঝে দিবসশর্বরী
বসুধারে রাখে নাই খণ্ড ক্ষুদ্র করি,

যেথা বাক্য হৃদয়ের উৎসমুখ হতে
উচ্ছ্বসিয়া উঠে, যেথা নির্বারিত স্রোতে
দেশে দেশে দিশে দিশে কর্মধারা ধায়
অজস্র সহস্রবিধ চরিতার্থতায়,

যেথা তুচ্ছ আচারের মরুবালুরাশি
বিচারের স্রোতোপথ ফেলে নাই গ্রাসি—
পৌরুষেরে করে নি শতধা; নিত্য যেথা
তুমি সর্ব কর্ম চিন্তা আনন্দের নেতা,

নিজ হস্তে নির্দয় আঘাত করি, পিতঃ,
ভারতেরে সেই স্বর্গে করো জাগরিত।`
      },
      {
        pageNumber: 4,
        titleBn: 'চতুর্থ গান (গান ৩৫)',
        contentBn: `যেখানে পথ নাই সেখানে চলিবার ব্রত লয়েছি।
অন্তরের মধ্যে যাহার ডাক শুনিয়াছি
তাহার উদ্দেশেই এই চিরপথিক মন ছুটিয়াছে।

প্রভাতের অরুণালোকে যাহার স্পর্শ পাই,
সন্ধ্যার শান্ত নীরবতায় যাহার বাণী শুনি,
তাহাকেই আমার জীবন অর্পণ করিলাম।

হে ঈশ্বর, আমাকে এমন শক্তি দাও
যেন আমি কখনও দুর্বলকে উপেক্ষা না করি,
উদ্ধত শক্তির কাছে মস্তক নত না করি।`
      }
    ],
    createdAt: '2026-01-15T10:00:00.000Z',
    updatedAt: '2026-03-20T12:00:00.000Z',
  },
  {
    id: 'book-scifi-02',
    titleBn: 'মহাশূন্যের রহস্য: নক্ষত্রমণ্ডলীর অভিযান',
    titleEn: 'Mystery of Deep Space: Voyage to the Constellations',
    authorBn: 'অরিন্দম চৌধুরী',
    authorEn: 'Arindam Chowdhury',
    category: 'scifi',
    language: 'bn',
    priceBdt: 180,
    coverUrl: '/src/assets/images/book_cover_scifi_1792737261174.jpg',
    descriptionBn: 'বাংলা কল্পবিজ্ঞানের এক নতুন দিগন্ত। ২১৫০ সালের বঙ্গীয় ডিপ-স্পেস প্রজেক্টের ক্রু কিভাবে অ্যান্ড্রোমিডা গ্যালাক্সির সীমানায় এক রহস্যময় এলিয়েন সিগনাল ডিকোড করে, তা নিয়ে রোমাঞ্চকর উপাখ্যান। বাস্তব পদার্থবিজ্ঞান ও মননশীল গল্পের মেলবন্ধন।',
    descriptionEn: 'A high-concept hard science fiction novel chronicling the deep-space voyage to unravel enigmatic interstellar signals on the fringes of the Milky Way.',
    totalPages: 240,
    fileSizeBytes: 5890200,
    isPublished: true,
    featured: true,
    publishedYear: 2024,
    isbn: '978-984-78-9012-1',
    publisherBn: 'ছায়াপথ প্রকাশনী, ঢাকা',
    publisherEn: 'Chhayapath Publications, Dhaka',
    samplePages: [
      {
        pageNumber: 1,
        titleBn: 'অধ্যায় ১: কসমিক সিগনাল',
        contentBn: `ঘড়ির কাঁটায় তখন আন্তর্জাতিক মহাকাশ সময় ০৩:৪৩।
'মেঘনা-৯' ডিপ-স্পেস রিচার্জ স্টেশনের মূল ককপিটে লাল অ্যালার্ম জ্বলছিল। কমান্ডার নিশান আহমেদ সেন্ট্রাল কনসোলের দিকে তাকালেন। স্পেকট্রাম অ্যানালাইজারে একটি অদ্ভুত প্যাটার্ন ভেসে উঠছে।

"ডা. ফারহানা, এই ওয়েভলেংথটা দেখুন তো," নিশানের কণ্ঠ শান্ত হলেও ভেতরে চাপা উদ্বেগ।
ফারহানা কোয়ান্টাম ডেস্কে চোখ রাখলেন। "এটা কোনো পালসার বা সুপারনোভার শব্দ নয় কমান্ডার। এটা পরিষ্কার ফিবোনাচ্চি ধারার সিগন্যাল। প্রতি ৮.৩ সেকেন্ড পর পর পুনরাবৃত্তি হচ্ছে।"

সৌরজগতের বাইরের কোনো বুদ্ধিমান সত্তা কি তাদের ডাকছে?`
      },
      {
        pageNumber: 2,
        titleBn: 'অধ্যায় ২: ডার্ক ম্যাটারের কিনারায়',
        contentBn: `নভোজাহাজ 'মেঘনা-৯' সাব-লাইট স্পিডে এগিয়ে চলেছে ওরিয়ন স্পারের দিকে। চারপাশের তারাগুলো এখন আর স্থির বিন্দুর মতো নেই; আলোর গতিশীল রেখা হয়ে জানালার ওপারে নাচছে।

ফারহানা ডেস্কে বসে জটিল ম্যাট্রিক্সের হিসাব কষছিলেন। "আমরা যে গ্র্যাভিটেশনাল অ্যানোমালি দেখতে পাচ্ছি, তা সাধারণ ব্ল্যাকহোলের মতো নয়। এটা যেন কোনো কৃত্রিম গেটওয়ে।"

কমান্ডার নিশান রেডিও ট্রান্সমিটার অন করলেন, "গ্রাউন্ড কন্ট্রোল ঢাকা, আমরা পয়েন্ট অফ নো রিটার্ন অতিক্রম করছি।"`
      },
      {
        pageNumber: 3,
        titleBn: 'অধ্যায় ৩: প্রথম সংস্পর্শ',
        contentBn: `জাহাজের বাইরে এখন সম্পূর্ণ অন্ধকার। কিন্তু কনসোলের সেন্সরে একটি ভাসমান মেটালিক স্পিয়ার ধরা পড়ল। কোনো তাপীয় বিকিরণ নেই, কোনো ইঞ্জিন নেই, তবুও সেটি শূন্যে স্থির।

যখন জাহাজের লেজার স্ক্যানার গোলকটিকে স্পর্শ করল, পুরো ককপিটের ডিজিটাল স্ক্রিনে একঝাঁক প্রাচীন জ্যামিতিক নকশা ফুটে উঠল। ফারহানার চোখ বিস্ফারিত হয়ে গেল—এই চিহ্নের সাথে মহাস্থানগড়ের প্রাচীন টেরাকোটা সিলমোহরের অবিশ্বাস্য মিল!`
      }
    ],
    createdAt: '2026-02-10T11:20:00.000Z',
    updatedAt: '2026-03-15T09:15:00.000Z',
  },
  {
    id: 'book-history-03',
    titleBn: 'স্থাপত্য ও নদীর ইতিহাস: মাটির উত্তরাধিকার',
    titleEn: 'Legacy of Clay & Cloud: Rivers and Architecture of Bangladesh',
    authorBn: 'ফাহমিদা খান',
    authorEn: 'Fahmida Khan',
    category: 'history',
    language: 'bn',
    priceBdt: 150,
    coverUrl: '/src/assets/images/book_cover_history_1792737261431.jpg',
    descriptionBn: 'পলিমাটি আর বহমান নদী কীভাবে বাংলার টেরাকোটা মন্দির, মোগল মসজিদ এবং গ্রামীণ জীবনধারাকে রূপ দিয়েছে তার প্রামাণ্য ইতিহাস। কান্তজির মন্দির, ষাট গম্বুজ মসজিদ এবং পানাম নগরের স্থাপত্যের নিবিড় বিশ্লেষণ।',
    descriptionEn: 'An authoritative architectural and cultural survey of how alluvial soil and deltaic rivers shaped the monumental heritage and daily life of Bangladesh.',
    totalPages: 312,
    fileSizeBytes: 7120400,
    isPublished: true,
    featured: true,
    publishedYear: 2023,
    isbn: '978-984-33-4567-8',
    publisherBn: 'ঐতিহ্য প্রকাশন',
    publisherEn: 'Oitijjho Prakashan',
    samplePages: [
      {
        pageNumber: 1,
        titleBn: 'ভূমিকা: নদী ও পলিমাটির মেলবন্ধন',
        contentBn: `পৃথিবীর বৃহত্তম ব-দ্বীপ বাংলাদেশ। এখানকার মাটির প্রতিটি স্তরে মিশে আছে হাজার বছরের ভাঙা-গড়ার গল্প। পাথরের প্রাচুর্য না থাকায় বাংলার স্থপতিরা শরণাপন্ন হয়েছিলেন কাদামাটির।

সেই নরম মাটিকে আগুনে পুড়িয়ে তৈরি হয়েছে অমর টেরাকোটা। দিনাজপুরের কান্তজিউ মন্দির থেকে শুরু করে বাগেরহাটের ষাট গম্বুজ মসজিদ—সবখানেই ইট আর পোড়ামাটির শিল্পকর্ম বাংলার নিজস্ব নান্দনিকতার সাক্ষ্য বহন করে।

নদী শুধু জলপ্রবাহ নয়; নদী এখানে স্থাপত্যের মালমশলা সরবরাহের পথ এবং নগর গড়ে ওঠার সূতিকাগার।`
      },
      {
        pageNumber: 2,
        titleBn: 'অধ্যায় ১: কান্তজিউ মন্দিরের শিল্পকলা',
        contentBn: `দিনাজপুরের ঢেপা নদীর তীরে অবস্থিত কান্তজিউ মন্দির বাংলার পোড়ামাটির অলংকরণের সর্বোৎকৃষ্ট নিদর্শন। ১৭০৪ সালে মহারাজা প্রাণনাথ এর নির্মাণকাজ শুরু করেন এবং ১৭২২ সালে তাঁর দত্তকপুত্র রামনাথ এটি সম্পন্ন করেন।

মন্দিরের বহির্ভাগে রামায়ণ ও মহাভারতের পৌরাণিক দৃশ্য ছাড়াও সমকালীন বাংলার সামাজিক জীবন—নৌকাযাত্রা, শিকার, উৎসব এবং জমিদারি আড়ম্বর নিখুঁতভাবে ফুটিয়ে তোলা হয়েছে পোড়ামাটির ফলকে।`
      },
      {
        pageNumber: 3,
        titleBn: 'অধ্যায় ২: মোগল সুবাহ ও পানাম নগর',
        contentBn: `মেঘনার শাখা শীতলক্ষ্যার কোলে গড়ে ওঠা পানাম নগরী ছিল বাংলার প্রাচীন রাজধানী সোনারগাঁয়ের অভিজাত ব্যবসায়ী কেন্দ্র। উনিশ শতকে যখন ইস্ট ইন্ডিয়া কোম্পানির মসলিন বাণিজ্যের রমরমা, তখন হিন্দু ও মুসলিম ধনী সওদাগররা এখানে গড়ে তোলেন ঔপনিবেশিক ও নব্য-ধ্রুপদী শৈলীর এক অদ্ভুত সংমিশ্রণ।`
      }
    ],
    createdAt: '2026-01-05T08:30:00.000Z',
    updatedAt: '2026-03-12T14:40:00.000Z',
  },
  {
    id: 'book-novel-04',
    titleBn: 'অন্ধকার ঢাকা: রহস্যের অলিগলি',
    titleEn: 'Darkness Over Dhaka: Alleys of Mystery',
    authorBn: 'নাবিল আহমেদ',
    authorEn: 'Nabil Ahmed',
    category: 'novel',
    language: 'bn',
    priceBdt: 140,
    coverUrl: '/src/assets/images/book_cover_novel_1792737262147.jpg',
    descriptionBn: 'পুরান ঢাকার শাখারি বাজার ও লালবাগের প্রাচীন সুরঙ্গে ঘটে যাওয়া একটি নিখোঁজ তদন্ত। সাবেক ইনভেস্টিগেটর সাইফ হাসানের এক রুদ্ধশ্বাস থ্রিলার। প্রাচীন পুথি, গোপন চক্র এবং কুয়াশাচ্ছন্ন ঢাকার এক রোমাঞ্চকর আখ্যান।',
    descriptionEn: 'A gritty urban noir thriller set in the atmospheric historical alleys and hidden underground networks of Old Dhaka.',
    totalPages: 198,
    fileSizeBytes: 3950100,
    isPublished: true,
    featured: false,
    publishedYear: 2024,
    isbn: '978-984-90-5678-2',
    publisherBn: 'বাতিঘর প্রকাশনী',
    publisherEn: 'Batighar Publications',
    samplePages: [
      {
        pageNumber: 1,
        titleBn: 'সূচনা: শাখারি বাজারের বৃষ্টি',
        contentBn: `রাত তখন প্রায় এগারোটা। কার্তিক মাসের ভেজা বাতাসে ঢাকার বাতাসে কেমন যেন সোঁদা গন্ধ।
শাখারি বাজারের সরু গলিতে জল জমেছে। পুরনো বাড়িগুলোর দেওয়াল ঘেঁষে হেঁটে আসছিল সাইফ হাসান। হাতে একটি পুরনো জলরোধী খাম।

খামের ভেতরে ছিল লালবাগের এক পরিত্যক্ত সিন্দুক থেকে উদ্ধার হওয়া ছেঁড়া তাম্রশাসন। এতে লেখা ছিল মাত্র তিনটি শব্দ: 'বংশাল, সাতাশ নম্বর কুয়ো'।

সাইফ জানত, এই সংকেতটিই হয়তো খুঁজে দেবে সেই প্রাচীন প্রত্নতাত্ত্বিক দলের হারিয়ে যাওয়া প্রধান অধ্যাপককে।`
      },
      {
        pageNumber: 2,
        titleBn: 'অধ্যায় ২: ভূগর্ভস্থ সুড়ঙ্গ',
        contentBn: `তাঁতীবাজারের এক অন্ধকার গুদামঘরের পেছনের গোপন দরজার তালা খুলল সাইফ। টর্চের সরু আলোয় দেখা গেল স্যাঁতসেঁতে পাথুরে সিঁড়ি নেমে গেছে মাটির গভীরে।

বাতাসে প্রাচীন কাঠের গন্ধ। সাইফ রিভলবারের সেফটি ক্যাচ অফ করল। সিঁড়ির প্রতিটি ধাপে শত বছরের কাদার আস্তরণ। হঠাৎ নিচে থেকে ধাতব কোনো বস্তুর মৃদু টুং শব্দ ভেসে এল।`
      }
    ],
    createdAt: '2026-02-18T16:00:00.000Z',
    updatedAt: '2026-03-22T17:10:00.000Z',
  }
];

export const MOCK_ORDERS: Order[] = [
  {
    id: 'ORD-BKASH-78210',
    userId: 'mock-user-1',
    userEmail: 'reader.dhaka@gmail.com',
    userName: 'তাহমিদ রহমান',
    bookId: 'book-gitanjali-01',
    bookTitleBn: 'গীতাঞ্জলি',
    bookTitleEn: 'Gitanjali',
    amountBdt: 120,
    bkashPaymentId: 'BKASH_PAY_991823412',
    bkashTrxId: 'BKASH_TRX_9A81C4',
    customerMsisdn: '01711***892',
    status: 'COMPLETED',
    createdAt: '2026-03-10T14:22:00.000Z',
    completedAt: '2026-03-10T14:23:15.000Z'
  },
  {
    id: 'ORD-BKASH-78211',
    userId: 'mock-user-2',
    userEmail: 'shirin.akter@gmail.com',
    userName: 'শিরিন আক্তার',
    bookId: 'book-scifi-02',
    bookTitleBn: 'মহাশূন্যের রহস্য: নক্ষত্রমণ্ডলীর অভিযান',
    bookTitleEn: 'Mystery of Deep Space',
    amountBdt: 180,
    bkashPaymentId: 'BKASH_PAY_991823413',
    bkashTrxId: 'BKASH_TRX_8B72D1',
    customerMsisdn: '01819***341',
    status: 'COMPLETED',
    createdAt: '2026-03-12T09:15:00.000Z',
    completedAt: '2026-03-12T09:16:30.000Z'
  }
];
