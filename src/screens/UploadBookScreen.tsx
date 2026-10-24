import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLibrary } from '../context/LibraryContext';
import { adminUploadBookWithPdf, adminPreviewPdf } from '../services/api';
import { CATEGORIES } from '../data/initialBooks';
import { PdfCanvasViewer } from '../components/PdfCanvasViewer';
import {
  ArrowLeft,
  UploadCloud,
  FileText,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  Save,
  Send,
  X,
  BookOpen,
  HelpCircle
} from 'lucide-react';

export const UploadBookScreen: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { navigateTo, language, refreshBooks } = useLibrary();

  const isBn = language === 'bn';

  // Form Fields
  const [titleBn, setTitleBn] = useState('');
  const [titleEn, setTitleEn] = useState('');
  const [authorBn, setAuthorBn] = useState('');
  const [authorEn, setAuthorEn] = useState('');
  const [descriptionBn, setDescriptionBn] = useState('');
  const [category, setCategory] = useState('novel');
  const [bookLanguage, setBookLanguage] = useState<'bn' | 'en'>('bn');
  const [priceBdt, setPriceBdt] = useState<number>(120);

  // File States
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string>('/src/assets/images/book_cover_novel_1792737262147.jpg');

  // UI / Progress States
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // PDF Preview Modal
  const [previewData, setPreviewData] = useState<any>(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Refs for hidden inputs
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 p-8 bg-white rounded-3xl border border-slate-200 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900">
          {isBn ? 'প্রবেশাধিকার সংরক্ষিত' : 'Access Restricted'}
        </h2>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'বই আপলোড শুধুমাত্র সার্ভার-অনুমোদিত অ্যাডমিনের (zulfiqareee@gmail.com) জন্য সংরক্ষিত।'
            : 'Book upload is restricted strictly to server-authorized administrator.'}
        </p>
        <button
          onClick={() => navigateTo('admin_login')}
          className="px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-semibold"
        >
          {isBn ? 'অ্যাডমিন লগইন' : 'Admin Login'}
        </button>
      </div>
    );
  }

  // Handle PDF file selection from file picker
  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    setSuccessMessage(null);

    // Validate PDF file format
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setErrorMessage(isBn ? 'ত্রুটি: শুধুমাত্র ভ্যালিড .pdf ফাইল নির্বাচন করুন।' : 'Error: Only valid .pdf files are accepted.');
      return;
    }

    // Validate size (max 50 MB)
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage(isBn ? 'ত্রুটি: পিডিএফ ফাইল সর্বোচ্চ ৫০ মেগাবাইট (50 MB) হতে পারবে।' : 'Error: File must be under 50 MB.');
      return;
    }

    setPdfFile(file);
  };

  // Handle Cover Image selection
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage(isBn ? 'ত্রুটি: শুধুমাত্র ইমেজ ফাইল (JPG, PNG, WebP) নির্বাচন করুন।' : 'Error: Select an image file.');
      return;
    }

    setCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setCoverPreviewUrl(objectUrl);
  };

  // PDF Preview Handler
  const handlePdfPreview = async () => {
    if (!pdfFile) {
      setErrorMessage(isBn ? 'প্রিভিউ দেখতে প্রথমে একটি PDF ফাইল নির্বাচন করুন।' : 'Please select a PDF file first.');
      return;
    }

    setIsPreviewLoading(true);
    setErrorMessage(null);

    try {
      const data = await adminPreviewPdf(pdfFile);
      setPreviewData(data);
      setShowPreviewModal(true);
    } catch (err: any) {
      setErrorMessage(err.message || 'পিডিএফ প্রিভিউ লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsPreviewLoading(false);
    }
  };

  // Form Submit: Save as Draft or Publish Book
  const handleFormSubmit = async (publishImmediate: boolean) => {
    setErrorMessage(null);
    setSuccessMessage(null);

    // Required Field Validations
    if (!titleBn.trim()) {
      setErrorMessage(isBn ? 'বইয়ের নাম (বাংলা) আবশ্যক।' : 'Book title in Bengali is required.');
      return;
    }
    if (!authorBn.trim()) {
      setErrorMessage(isBn ? 'লেখকের নাম আবশ্যক।' : 'Author name is required.');
      return;
    }
    if (priceBdt === undefined || priceBdt < 0) {
      setErrorMessage(isBn ? 'সঠিক বইয়ের মূল্য নির্ধারণ করুন।' : 'Please specify a valid price in BDT.');
      return;
    }
    if (!pdfFile) {
      setErrorMessage(isBn ? 'অনুগ্রহ করে আসল PDF ফাইল নির্বাচন করুন।' : 'Please select the original PDF file to upload.');
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(15);

    try {
      const formData = new FormData();
      formData.append('titleBn', titleBn);
      formData.append('titleEn', titleEn || titleBn);
      formData.append('authorBn', authorBn);
      formData.append('authorEn', authorEn || authorBn);
      formData.append('descriptionBn', descriptionBn);
      formData.append('category', category);
      formData.append('language', bookLanguage);
      formData.append('priceBdt', priceBdt.toString());
      formData.append('isPublished', publishImmediate.toString());
      formData.append('pdfFile', pdfFile);

      if (coverFile) {
        formData.append('coverFile', coverFile);
      } else {
        formData.append('coverUrl', coverPreviewUrl);
      }

      setUploadProgress(45);

      // Perform real upload to backend private storage
      const uploadedBook = await adminUploadBookWithPdf(formData, user!.email);
      setUploadProgress(100);

      setSuccessMessage(
        isBn
          ? `সফল! "${uploadedBook.titleBn}" বইটি সফলভাবে আপলোড ও ${publishImmediate ? 'ক্যাটালগে প্রকাশিত' : 'ড্রাফট হিসেবে সংরক্ষিত'} হয়েছে।`
          : `Success! "${uploadedBook.titleBn}" uploaded and ${publishImmediate ? 'published' : 'saved as draft'}.`
      );

      await refreshBooks();

      // Navigate to catalogue or dashboard after short feedback
      setTimeout(() => {
        if (publishImmediate) {
          navigateTo('catalogue');
        } else {
          navigateTo('admin_dashboard');
        }
      }, 1200);
    } catch (err: any) {
      setUploadProgress(0);
      setErrorMessage(err.message || 'বই আপলোড করতে ব্যর্থ হয়েছে। নেটওয়ার্ক সংযোগ যাচাই করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 flex-1 pb-24">
      {/* Top Back Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateTo('admin_dashboard')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{isBn ? 'অ্যাডমিন ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</span>
        </button>

        <span className="text-xs text-slate-400 font-mono">
          Admin: {user?.email}
        </span>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-md p-6 sm:p-10 space-y-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200 mb-2">
            <UploadCloud className="w-3.5 h-3.5 text-emerald-600" />
            <span>{isBn ? 'সুরক্ষিত পিডিএফ আপলোড ও ক্যাটালগ প্রকাশনা' : 'Protected PDF Upload System'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isBn ? 'নতুন ডিজিটাল বই আপলোড' : 'Upload Digital Book'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isBn
              ? 'বইয়ের মেটাডাটা, প্রচ্ছদ ও আসল পিডিএফ ফাইল প্রদান করুন। আসল পিডিএফ ফাইলটি প্রাইভেট স্টোরেজে সংরক্ষিত থাকবে।'
              : 'Provide book metadata, cover artwork, and original PDF. Raw PDFs remain securely in private cloud storage.'}
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-2.5 text-xs text-rose-800">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">{isBn ? 'আপলোড সতর্কতা' : 'Upload Alert'}</span>
              <span>{errorMessage}</span>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5 text-xs text-emerald-800">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold block mb-0.5">{isBn ? 'সফল হয়েছে!' : 'Success!'}</span>
              <span>{successMessage}</span>
            </div>
          </div>
        )}

        {/* Progress Bar when Submitting */}
        {isSubmitting && (
          <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span>{isBn ? 'পিডিএফ আপলোড ও মেটাডাটা সংরক্ষণ চলছে...' : 'Uploading PDF & saving metadata...'}</span>
              <span className="font-mono text-emerald-700 font-bold">{uploadProgress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Form Fields Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Field: বইয়ের নাম (Book Title) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isBn ? 'বইয়ের নাম (Book Title) *' : 'Book Title *'}
            </label>
            <input
              type="text"
              required
              value={titleBn}
              onChange={e => setTitleBn(e.target.value)}
              placeholder={isBn ? 'যেমন: সোনার তরী' : 'e.g. Sonar Tori'}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Field: লেখকের নাম (Author) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isBn ? 'লেখকের নাম (Author) *' : 'Author *'}
            </label>
            <input
              type="text"
              required
              value={authorBn}
              onChange={e => setAuthorBn(e.target.value)}
              placeholder={isBn ? 'যেমন: রবীন্দ্রনাথ ঠাকুর' : 'e.g. Rabindranath Tagore'}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden transition-colors"
            />
          </div>

          {/* Field: ক্যাটাগরি (Category) */}
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1.5">
              {isBn ? 'ক্যাটাগরি (Category) *' : 'Category *'}
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden cursor-pointer"
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {isBn ? cat.nameBn : cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          {/* Field: ভাষা & বইয়ের মূল্য (Price in BDT) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {isBn ? 'ভাষা (Language)' : 'Language'}
              </label>
              <select
                value={bookLanguage}
                onChange={e => setBookLanguage(e.target.value as any)}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:outline-hidden cursor-pointer"
              >
                <option value="bn">বাংলা (Bengali)</option>
                <option value="en">English</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                {isBn ? 'বইয়ের মূল্য (Price in BDT ৳) *' : 'Price (BDT ৳) *'}
              </label>
              <input
                type="number"
                min={0}
                required
                value={priceBdt}
                onChange={e => setPriceBdt(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full px-3 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Field: বইয়ের বিবরণ (Description) */}
        <div>
          <label className="block text-xs font-bold text-slate-800 mb-1.5">
            {isBn ? 'বইয়ের বিবরণ (Description)' : 'Description / Synopsis'}
          </label>
          <textarea
            rows={4}
            value={descriptionBn}
            onChange={e => setDescriptionBn(e.target.value)}
            placeholder={isBn ? 'বইয়ের সারসংক্ষেপ বা মূল কাহিনী লিখুন...' : 'Write book description here...'}
            className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:bg-white focus:border-emerald-600 focus:outline-hidden leading-relaxed"
          />
        </div>

        {/* Field: বইয়ের কভার ছবি (Cover Image) & Button: কভার ছবি নির্বাচন করুন */}
        <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-900">
                {isBn ? 'বইয়ের কভার ছবি (Cover Image)' : 'Book Cover Image'}
              </label>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {isBn ? 'স্ট্যান্ডার্ড ৩:৪ অনুপাতে বইয়ের প্রচ্ছদ ছবি নির্বাচন করুন' : 'Select a 3:4 portrait cover image'}
              </p>
            </div>

            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              <span>{isBn ? 'কভার ছবি নির্বাচন করুন' : 'Select Cover Image'}</span>
            </button>
            <input
              ref={coverInputRef}
              type="file"
              accept="image/*"
              onChange={handleCoverChange}
              className="hidden"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="w-16 aspect-3/4 rounded-xl overflow-hidden bg-slate-200 border border-slate-300 shrink-0 shadow-xs">
              <img src={coverPreviewUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            </div>
            <div className="text-xs text-slate-600">
              <span className="font-semibold block text-slate-800">
                {coverFile ? coverFile.name : (isBn ? 'ডিফল্ট প্রচ্ছদ আর্টওয়ার্ক নির্বাচিত' : 'Default Curated Artwork')}
              </span>
              <span className="text-[11px] text-slate-400">
                {coverFile ? `${(coverFile.size / 1024).toFixed(1)} KB` : 'High-resolution editorial cover'}
              </span>
            </div>
          </div>
        </div>

        {/* Field: PDF বই নির্বাচন করুন (Select PDF File) & Button: PDF নির্বাচন করুন & Button: PDF Preview */}
        <div className="p-6 bg-emerald-50/50 rounded-3xl border-2 border-dashed border-emerald-300 space-y-4 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'PDF বই নির্বাচন করুন (Select PDF File) *' : 'Select PDF File *'}
                </h3>
              </div>
              <p className="text-xs text-slate-600">
                {isBn
                  ? 'আপনার ডিভাইস থেকে আসল মূল PDF ফাইলটি বাছাই করুন (সর্বোচ্চ ৫০ MB)'
                  : 'Select original PDF from device storage (max 50 MB)'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Button: PDF নির্বাচন করুন */}
              <button
                type="button"
                onClick={() => pdfInputRef.current?.click()}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{isBn ? 'PDF নির্বাচন করুন' : 'Select PDF File'}</span>
              </button>
              <input
                ref={pdfInputRef}
                type="file"
                accept=".pdf,application/pdf"
                onChange={handlePdfChange}
                className="hidden"
              />

              {/* Button: PDF Preview */}
              <button
                type="button"
                onClick={handlePdfPreview}
                disabled={!pdfFile || isPreviewLoading}
                className="px-4 py-2.5 bg-white hover:bg-slate-100 disabled:opacity-40 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                {isPreviewLoading ? (
                  <div className="w-3.5 h-3.5 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Eye className="w-4 h-4 text-emerald-700" />
                )}
                <span>{isBn ? 'PDF Preview' : 'PDF Preview'}</span>
              </button>
            </div>
          </div>

          {/* Selected PDF File Info Card */}
          {pdfFile ? (
            <div className="p-3.5 bg-white rounded-2xl border border-emerald-200 flex items-center justify-between text-xs text-slate-800 shadow-xs">
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold block truncate">{pdfFile.name}</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {formatFileSize(pdfFile.size)} · application/pdf
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                {isBn ? 'ভ্যালিড PDF' : 'Valid PDF'}
              </span>
            </div>
          ) : (
            <div className="text-center py-2 text-xs text-slate-400 italic">
              {isBn ? 'এখনও কোনো PDF ফাইল নির্বাচন করা হয়নি।' : 'No PDF file selected yet.'}
            </div>
          )}
        </div>

        {/* Action Buttons: Save as Draft | Publish Book | Cancel */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-slate-200">
          {/* Button: Cancel */}
          <button
            type="button"
            onClick={() => navigateTo('admin_dashboard')}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
          >
            {isBn ? 'Cancel (বাতিল)' : 'Cancel'}
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {/* Button: Save as Draft */}
            <button
              type="button"
              onClick={() => handleFormSubmit(false)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4 text-slate-300" />
              <span>{isBn ? 'Save as Draft (খসড়া সংরক্ষণ)' : 'Save as Draft'}</span>
            </button>

            {/* Button: Publish Book */}
            <button
              type="button"
              onClick={() => handleFormSubmit(true)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition-colors cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isBn ? 'Publish Book (সরাসরি প্রকাশ)' : 'Publish Book'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* PDF Preview Modal */}
      {showPreviewModal && previewData && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-700" />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {isBn ? 'PDF প্রিভিউ ও পৃষ্ঠা বিশ্লেষণ' : 'PDF Preview & Extracted Pages'}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    {previewData.fileName} · {previewData.totalPages} {isBn ? 'পৃষ্ঠা' : 'pages'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 font-medium">
                {isBn
                  ? 'নির্বাচিত আসল পিডিএফ ফাইলের বাস্তব পাতা প্রিভিউ:'
                  : 'Real PDF Page Preview:'}
              </div>

              {pdfFile && (
                <div className="w-full flex justify-center bg-slate-100 p-4 rounded-2xl border border-slate-200">
                  <PdfCanvasViewer
                    source={pdfFile}
                    currentPage={1}
                    zoomLevel={85}
                    readerTheme="light"
                  />
                </div>
              )}

              {previewData.samplePages && previewData.samplePages.length > 0 && (
                <div className="space-y-3 pt-2">
                  <p className="font-bold text-slate-700">{isBn ? 'অধ্যায় ও পাঠ্য বিবরণ:' : 'Chapters & Content Stream:'}</p>
                  {previewData.samplePages?.slice(0, 3).map((page: any, idx: number) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                      <span className="text-[11px] font-bold text-emerald-700 block">{page.titleBn}</span>
                      <p className="text-slate-700 leading-relaxed font-serif whitespace-pre-line">
                        {page.contentBn}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setShowPreviewModal(false)}
                className="px-5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold"
              >
                {isBn ? 'প্রিভিউ বন্ধ করুন' : 'Close Preview'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
