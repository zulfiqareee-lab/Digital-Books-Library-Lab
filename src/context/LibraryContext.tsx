import React, { createContext, useContext, useState, useEffect } from 'react';
import { Book, Order, UserEntitlement, DeviceMode, AppLanguage, AppTheme } from '../types';
import { fetchBooks, fetchUserEntitlements, fetchUserOrders } from '../services/api';
import { useAuth } from './AuthContext';

export type ScreenName =
  | 'home'
  | 'catalogue'
  | 'search'
  | 'book_detail'
  | 'pdf_reader'
  | 'bkash_checkout'
  | 'payment_result'
  | 'my_library'
  | 'purchase_history'
  | 'login'
  | 'admin_login'
  | 'admin_dashboard'
  | 'admin_upload'
  | 'admin_edit'
  | 'admin_sales'
  | 'settings'
  | 'about_terms';

interface LibraryContextType {
  books: Book[];
  isLoadingBooks: boolean;
  entitlements: UserEntitlement[];
  orders: Order[];
  currentScreen: ScreenName;
  selectedBook: Book | null;
  editingBook: Book | null;
  activeOrder: Order | null;
  lastPaymentResult: {
    success: boolean;
    trxId?: string;
    orderId?: string;
    book?: Book;
    amount?: number;
    message?: string;
  } | null;
  deviceMode: DeviceMode;
  language: AppLanguage;
  theme: AppTheme;
  readerPage: number;
  setDeviceMode: (mode: DeviceMode) => void;
  setLanguage: (lang: AppLanguage) => void;
  setTheme: (theme: AppTheme) => void;
  navigateTo: (screen: ScreenName, params?: { book?: Book; page?: number; order?: Order }) => void;
  refreshBooks: () => Promise<void>;
  refreshUserData: () => Promise<void>;
  hasEntitlement: (bookId: string) => boolean;
  setLastPaymentResult: (res: any) => void;
  setEditingBook: (book: Book | null) => void;
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoadingBooks, setIsLoadingBooks] = useState(true);
  const [entitlements, setEntitlements] = useState<UserEntitlement[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const [currentScreen, setCurrentScreen] = useState<ScreenName>('home');
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [activeOrder, setActiveOrder] = useState<Order | null>(null);
  const [readerPage, setReaderPage] = useState<number>(1);
  const [lastPaymentResult, setLastPaymentResult] = useState<any>(null);

  // Responsive device view: default to 'phone' or 'desktop' based on screen size, with interactive switcher
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [language, setLanguage] = useState<AppLanguage>('bn');
  const [theme, setTheme] = useState<AppTheme>('light');

  const refreshBooks = async () => {
    setIsLoadingBooks(true);
    try {
      const data = await fetchBooks(isAdmin);
      setBooks(data);
      if (selectedBook) {
        const updated = data.find(b => b.id === selectedBook.id);
        if (updated) setSelectedBook(updated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingBooks(false);
    }
  };

  const refreshUserData = async () => {
    if (!user) {
      setEntitlements([]);
      setOrders([]);
      return;
    }
    try {
      const [ents, ords] = await Promise.all([
        fetchUserEntitlements(user.uid),
        fetchUserOrders(user.uid)
      ]);
      setEntitlements(ents);
      setOrders(ords);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    refreshBooks();
  }, [isAdmin]);

  useEffect(() => {
    refreshUserData();
  }, [user]);

  const hasEntitlement = (bookId: string) => {
    if (!user) return false;
    return entitlements.some(e => e.bookId === bookId);
  };

  const navigateTo = (screen: ScreenName, params?: { book?: Book; page?: number; order?: Order }) => {
    if (params?.book) setSelectedBook(params.book);
    if (params?.page !== undefined) setReaderPage(params.page);
    if (params?.order) setActiveOrder(params.order);
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <LibraryContext.Provider
      value={{
        books,
        isLoadingBooks,
        entitlements,
        orders,
        currentScreen,
        selectedBook,
        editingBook,
        activeOrder,
        lastPaymentResult,
        deviceMode,
        language,
        theme,
        readerPage,
        setDeviceMode,
        setLanguage,
        setTheme,
        navigateTo,
        refreshBooks,
        refreshUserData,
        hasEntitlement,
        setLastPaymentResult,
        setEditingBook
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
