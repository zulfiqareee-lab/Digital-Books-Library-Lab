export interface Book {
  id: string;
  titleBn: string;
  titleEn: string;
  authorBn: string;
  authorEn: string;
  category: string;
  language: 'bn' | 'en' | 'bilingual';
  priceBdt: number;
  coverUrl: string;
  descriptionBn: string;
  descriptionEn: string;
  totalPages: number;
  fileSizeBytes: number;
  storageIdentifier?: string;
  pdfFileName?: string;
  pdfUrl?: string;
  hasPdfDocument?: boolean;
  isPublished: boolean;
  featured?: boolean;
  publishedYear: number;
  isbn?: string;
  publisherBn?: string;
  publisherEn?: string;
  samplePages: {
    pageNumber: number;
    titleBn: string;
    contentBn: string;
    contentEn?: string;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Order {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  bookId: string;
  bookTitleBn: string;
  bookTitleEn: string;
  amountBdt: number;
  bkashPaymentId: string;
  bkashTrxId?: string;
  customerMsisdn?: string;
  status: OrderStatus;
  createdAt: string;
  completedAt?: string;
}

export interface UserEntitlement {
  userId: string;
  bookId: string;
  orderId: string;
  bkashTrxId: string;
  grantedAt: string;
  downloadCount: number;
  lastDownloadedAt?: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: 'user' | 'admin';
  phone?: string;
}

export interface BkashConfigStatus {
  isConfigured: boolean;
  merchantAccount: string;
  environment: 'sandbox' | 'production' | 'testbed';
  hasAppKey: boolean;
  hasAppSecret: boolean;
}

export type DeviceMode = 'phone' | 'tablet' | 'desktop';
export type AppLanguage = 'bn' | 'en';
export type AppTheme = 'light' | 'dark' | 'sepia';
