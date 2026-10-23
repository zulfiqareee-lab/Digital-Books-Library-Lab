import { Book, Order, UserEntitlement, BkashConfigStatus } from '../types';
import { INITIAL_BOOKS, MOCK_ORDERS } from '../data/initialBooks';

const BASE_URL = '';

export async function fetchBooks(includeAll = false): Promise<Book[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/books?all=${includeAll}`, {
      headers: {
        'x-admin-token': includeAll ? 'admin-verified' : ''
      }
    });
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data.books || INITIAL_BOOKS;
  } catch (err) {
    console.warn('Falling back to local books cache:', err);
    return INITIAL_BOOKS.filter(b => includeAll || b.isPublished);
  }
}

export async function fetchBookById(id: string): Promise<Book | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/books/${id}`);
    if (!res.ok) throw new Error('API request failed');
    const data = await res.json();
    return data.book || null;
  } catch {
    return INITIAL_BOOKS.find(b => b.id === id) || null;
  }
}

export async function fetchProtectedPage(bookId: string, pageNum: number) {
  try {
    const res = await fetch(`${BASE_URL}/api/books/${bookId}/read-page/${pageNum}`);
    if (!res.ok) throw new Error('Failed to fetch page');
    return await res.json();
  } catch {
    const book = INITIAL_BOOKS.find(b => b.id === bookId);
    const samplePage = book?.samplePages.find(p => p.pageNumber === pageNum) || book?.samplePages[0];
    return {
      success: true,
      bookId,
      titleBn: book?.titleBn || '',
      pageNumber: pageNum,
      totalPages: book?.totalPages || 100,
      pageData: samplePage,
      watermark: 'Digital Book Library • Read-Only Online Access',
      serverGeneratedAt: new Date().toISOString()
    };
  }
}

export async function createBkashPayment(params: {
  userId: string;
  userEmail: string;
  userName: string;
  bookId: string;
}) {
  const res = await fetch(`${BASE_URL}/api/bkash/create-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'বিকাশ পেমেন্ট সেশন তৈরি করতে সমস্যা হয়েছে।');
  }
  return data;
}

export async function executeBkashPayment(params: {
  orderId: string;
  paymentId: string;
  customerMsisdn: string;
  otp: string;
  pin: string;
  userId: string;
}) {
  const res = await fetch(`${BASE_URL}/api/bkash/execute-payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'বিকাশ লেনদেন যাচাইকরণ ব্যর্থ হয়েছে।');
  }
  return data;
}

export async function requestDownloadToken(bookId: string, userId: string) {
  const res = await fetch(`${BASE_URL}/api/books/${bookId}/download-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId })
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'ডাউনলোড টোকেন অনুমোদন ব্যর্থ হয়েছে।');
  }
  return data;
}

export async function fetchUserEntitlements(userId: string): Promise<UserEntitlement[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/entitlements`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.entitlements || [];
  } catch {
    return [];
  }
}

export async function fetchUserOrders(userId: string): Promise<Order[]> {
  try {
    const res = await fetch(`${BASE_URL}/api/users/${userId}/orders`);
    if (!res.ok) throw new Error('API error');
    const data = await res.json();
    return data.orders || [];
  } catch {
    return MOCK_ORDERS.filter(o => o.userId === userId);
  }
}

export async function adminUploadBookWithPdf(formData: FormData, adminEmail: string): Promise<Book> {
  const res = await fetch(`${BASE_URL}/api/admin/upload-book`, {
    method: 'POST',
    headers: {
      'x-user-email': adminEmail,
      'x-admin-token': 'admin-verified'
    },
    body: formData
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'বই আপলোড করতে ব্যর্থ হয়েছে।');
  }
  return data.book;
}

export async function adminPreviewPdf(pdfFile: File) {
  const formData = new FormData();
  formData.append('pdfFile', pdfFile);

  const res = await fetch(`${BASE_URL}/api/admin/preview-pdf`, {
    method: 'POST',
    body: formData
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'পিডিএফ প্রিভিউ তৈরি করা সম্ভব হয়নি।');
  }
  return data;
}

export async function adminCreateBook(bookData: Partial<Book>, adminEmail: string) {
  const res = await fetch(`${BASE_URL}/api/admin/books`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': adminEmail,
      'x-admin-token': 'admin-verified'
    },
    body: JSON.stringify(bookData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'বই যোগ করতে ব্যর্থ হয়েছে।');
  }
  return data.book;
}

export async function adminUpdateBook(id: string, bookData: Partial<Book>, adminEmail: string) {
  const res = await fetch(`${BASE_URL}/api/admin/books/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'x-user-email': adminEmail,
      'x-admin-token': 'admin-verified'
    },
    body: JSON.stringify(bookData)
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'বই আপডেট করতে ব্যর্থ হয়েছে।');
  }
  return data.book;
}

export async function adminDeleteBook(id: string, adminEmail: string) {
  const res = await fetch(`${BASE_URL}/api/admin/books/${id}`, {
    method: 'DELETE',
    headers: {
      'x-user-email': adminEmail,
      'x-admin-token': 'admin-verified'
    }
  });
  const data = await res.json();
  if (!res.ok || !data.success) {
    throw new Error(data.message || 'বই মুছতে ব্যর্থ হয়েছে।');
  }
  return true;
}

export async function adminFetchSales() {
  const res = await fetch(`${BASE_URL}/api/admin/sales`);
  if (!res.ok) throw new Error('Sales report fetch failed');
  return await res.json();
}

export async function fetchSystemStatus() {
  try {
    const res = await fetch(`${BASE_URL}/api/system/status`);
    if (!res.ok) throw new Error('Status failed');
    return await res.json();
  } catch {
    return {
      success: true,
      bkash: {
        isConfigured: false,
        merchantAccount: 'Interactive Testbed Active',
        environment: 'sandbox',
        hasAppKey: false,
        hasAppSecret: false
      },
      firebase: {
        isConfigured: false,
        adminEmail: 'zulfiqareee@gmail.com'
      }
    };
  }
}
