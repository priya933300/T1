import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  FileText, 
  ExternalLink, 
  Trash2, 
  RefreshCw, 
  LogOut, 
  FolderCheck,
  ShieldCheck
} from 'lucide-react';
import { User } from 'firebase/auth';
import { initAuth, googleSignIn, logout, getAccessToken } from '../services/googleAuth';
import { 
  DriveFile, 
  getOrCreateAppFolder, 
  listAppDriveFiles, 
  uploadFileToDrive, 
  deleteDriveFile 
} from '../services/googleDrive';
import { 
  getStoredRegistrations, 
  getStoredBookings, 
  getStoredProfiles, 
  getStoredSettings,
  generateRegistrationsCSV,
  generateBookingsCSV
} from '../utils/storage';

interface GoogleDriveSyncProps {
  onNotify?: (msg: string) => void;
}

export const GoogleDriveSync: React.FC<GoogleDriveSyncProps> = ({ onNotify }) => {
  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [driveFiles, setDriveFiles] = useState<DriveFile[]>([]);
  const [folderId, setFolderId] = useState<string | null>(null);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Delete confirmation modal state per SKILL.md destructive operations requirement
  const [fileToDelete, setFileToDelete] = useState<DriveFile | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        loadFolderAndFiles(token);
      },
      () => {
        setGoogleUser(null);
        setDriveFiles([]);
        setFolderId(null);
      }
    );

    return () => unsubscribe();
  }, []);

  const loadFolderAndFiles = async (token: string) => {
    setIsLoadingFiles(true);
    setErrorMsg('');
    try {
      const fId = await getOrCreateAppFolder(token);
      setFolderId(fId);
      const files = await listAppDriveFiles(token, fId);
      setDriveFiles(files);
    } catch (err: any) {
      console.error('Drive load error:', err);
      setErrorMsg(err.message || 'গুগল ড্রাইভ ফাইল লোড করতে ব্যর্থ হয়েছে।');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSignIn = async () => {
    setIsSigningIn(true);
    setErrorMsg('');
    try {
      const res = await googleSignIn();
      if (res) {
        setGoogleUser(res.user);
        await loadFolderAndFiles(res.accessToken);
        setSuccessMsg('গুগল ড্রাইভ সফলভাবে সংযুক্ত হয়েছে!');
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err: any) {
      console.error('Google Sign In failed:', err);
      setErrorMsg(err.message || 'গুগল সাইন-ইন সম্পন্ন করা যায়নি।');
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    setGoogleUser(null);
    setDriveFiles([]);
    setFolderId(null);
    setSuccessMsg('গুগল ড্রাইভ সংযোগ বিচ্ছিন্ন করা হয়েছে।');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  const handleBackupToDrive = async () => {
    const token = await getAccessToken();
    if (!token) {
      setErrorMsg('গুগল ড্রাইভ টোকেন পাওয়া যায়নি। অনুগ্রহ করে পুনরায় সাইন-ইন করুন।');
      return;
    }

    setIsUploading(true);
    setErrorMsg('');
    try {
      const targetFolderId = folderId || (await getOrCreateAppFolder(token));
      const timeStamp = new Date().toISOString().slice(0, 10);
      const timeFormatted = new Date().toLocaleTimeString('en-US', { hour12: false }).replace(/:/g, '-');

      // 1. Export Registrations CSV
      const regs = getStoredRegistrations();
      if (regs.length > 0) {
        const regCsv = generateRegistrationsCSV();
        await uploadFileToDrive(
          token,
          `Customer_Registrations_${timeStamp}_${timeFormatted}.csv`,
          'text/csv',
          regCsv,
          targetFolderId
        );
      }

      // 2. Export Bookings CSV
      const bookings = getStoredBookings();
      if (bookings.length > 0) {
        const bookCsv = generateBookingsCSV();
        await uploadFileToDrive(
          token,
          `VIP_Bookings_Tickets_${timeStamp}_${timeFormatted}.csv`,
          'text/csv',
          bookCsv,
          targetFolderId
        );
      }

      // 3. Export Full System State JSON
      const fullBackup = {
        exportedAt: new Date().toISOString(),
        settings: getStoredSettings(),
        profiles: getStoredProfiles(),
        registrations: regs,
        bookings: bookings,
      };
      await uploadFileToDrive(
        token,
        `Royal_App_Full_Backup_${timeStamp}_${timeFormatted}.json`,
        'application/json',
        JSON.stringify(fullBackup, null, 2),
        targetFolderId
      );

      // Refresh file list
      const updatedFiles = await listAppDriveFiles(token, targetFolderId);
      setDriveFiles(updatedFiles);

      setSuccessMsg('সব গ্রাহক, টিকেট ও সেটিংস ডেটা গুগল ড্রাইভে ব্যাকআপ নেওয়া হয়েছে!');
      if (onNotify) onNotify('গুগল ড্রাইভে ব্যাকআপ সম্পন্ন হয়েছে!');
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err: any) {
      console.error('Backup upload error:', err);
      setErrorMsg(err.message || 'গুগল ড্রাইভে ব্যাকআপ আপলোড করতে সমস্যা হয়েছে।');
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    const token = await getAccessToken();
    if (!token) return;

    setIsDeleting(true);
    try {
      await deleteDriveFile(token, fileToDelete.id);
      setDriveFiles(prev => prev.filter(f => f.id !== fileToDelete.id));
      setSuccessMsg(`"${fileToDelete.name}" গুগল ড্রাইভ থেকে মুছে ফেলা হয়েছে।`);
      setFileToDelete(null);
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'ফাইল মোছা সম্ভব হয়নি।');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0a0a14] border border-amber-500/40 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-amber-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-400/40 flex items-center justify-center text-blue-400 shadow-md">
            <Cloud className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-black text-gold-gradient flex items-center gap-2">
              <span>Google Drive ক্লাউড ব্যাকআপ ও সিঙ্ক</span>
              {googleUser && (
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-400/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> কানেক্টেড
                </span>
              )}
            </h4>
            <p className="text-[11px] text-amber-200/70">
              গ্রাহকের তথ্য, বুকিং ও টিকিট ডেটা সরাসরি আপনার গুগল ড্রাইভ অ্যাকাউন্টে নিরাপদে সংরক্ষণ করুন
            </p>
          </div>
        </div>

        {/* Auth Button or User Badge */}
        {googleUser ? (
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-bold text-white truncate max-w-[160px]">{googleUser.displayName || 'Google User'}</div>
              <div className="text-[10px] text-amber-300/70 truncate max-w-[160px]">{googleUser.email}</div>
            </div>
            <button
              onClick={handleSignOut}
              title="Google Drive সংযোগ বিচ্ছিন্ন করুন"
              className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 transition-all flex items-center gap-1 text-xs font-bold"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">লগআউট</span>
            </button>
          </div>
        ) : (
          /* Official Sign in with Google Button per SKILL.md */
          <button
            onClick={handleSignIn}
            disabled={isSigningIn}
            className="flex items-center justify-center gap-2.5 px-4 py-2 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 border border-slate-300"
          >
            <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-4 h-4 flex-shrink-0">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
              <path fill="none" d="M0 0h48v48H0z"></path>
            </svg>
            <span>{isSigningIn ? 'সংযোগ স্থাপিত হচ্ছে...' : 'Sign in with Google'}</span>
          </button>
        )}
      </div>

      {/* Messages */}
      {errorMsg && (
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* If Connected */}
      {googleUser ? (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-black/60 border border-amber-500/20">
            <div className="flex items-center gap-2 text-xs text-amber-200">
              <FolderCheck className="w-4 h-4 text-emerald-400" />
              <span>গুগল ড্রাইভ ফোল্ডার: <strong>Royal Companion Backups</strong></span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={async () => {
                  const token = await getAccessToken();
                  if (token) loadFolderAndFiles(token);
                }}
                disabled={isLoadingFiles}
                className="p-2 rounded-lg bg-[#141420] text-amber-300 hover:text-white border border-amber-500/30 transition-all text-xs flex items-center gap-1 font-bold"
                title="ফাইল তালিকা রিফ্রেশ করুন"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">রিফ্রেশ</span>
              </button>

              <button
                type="button"
                onClick={handleBackupToDrive}
                disabled={isUploading}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600 hover:from-amber-300 hover:to-yellow-400 text-black font-black text-xs shadow-md transition-all flex items-center gap-1.5 active:scale-95 disabled:opacity-50"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{isUploading ? 'ড্রাইভে আপলোড হচ্ছে...' : 'এখনই ড্রাইভে ব্যাকআপ নিন'}</span>
              </button>
            </div>
          </div>

          {/* Drive Files List */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>গুগল ড্রাইভে থাকা ব্যাকআপ ফাইলসমূহ ({driveFiles.length}):</span>
              {driveFiles.length > 0 && (
                <span className="text-[10px] text-amber-400/60 font-normal">ক্লাউডে সুরক্ষিত</span>
              )}
            </div>

            {isLoadingFiles ? (
              <div className="text-center py-6 text-xs text-amber-400/60 flex items-center justify-center gap-2">
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
                <span>ড্রাইভ থেকে ব্যাকআপ ফাইল লোড হচ্ছে...</span>
              </div>
            ) : driveFiles.length === 0 ? (
              <div className="text-center py-6 px-4 rounded-xl bg-black/40 border border-dashed border-amber-500/20 text-xs text-amber-300/60">
                এখনও কোনো ব্যাকআপ ফাইল আপলোড করা হয়নি। ওপরে <strong>'এখনই ড্রাইভে ব্যাকআপ নিন'</strong> বাটনে ক্লিক করে ডেটা সেভ করুন।
              </div>
            ) : (
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                {driveFiles.map((file) => (
                  <div
                    key={file.id}
                    className="p-2.5 rounded-xl bg-black/70 hover:bg-[#12121e] border border-amber-500/25 flex items-center justify-between gap-3 text-xs transition-colors"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <FileText className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-amber-100 truncate">{file.name}</div>
                        <div className="text-[10px] text-amber-400/60">
                          {file.modifiedTime ? new Date(file.modifiedTime).toLocaleString('en-IN') : 'তারিখ নেই'}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      {file.webViewLink && (
                        <a
                          href={file.webViewLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-300 border border-blue-500/30 transition-all"
                          title="গুগল ড্রাইভে ফাইলটি দেখুন"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setFileToDelete(file)}
                        className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all"
                        title="ড্রাইভ থেকে এই ফাইলটি মুছুন"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-black/40 border border-amber-500/20 text-xs text-amber-200/80 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-bold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>গুগল ড্রাইভ ব্যবহারের সুবিধাসমূহ:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-amber-300/70 pl-1">
            <li>সকল কাস্টমার রেজিস্ট্রেশন স্বয়ংক্রিয়ভাবে Google Drive স্প্রেডশিটে ব্যাকআপ থাকবে।</li>
            <li>সকল ₹৩৬৯ পেমেন্ট ও ৬-সংখ্যার টিকেট ক্লাউডে সংরক্ষিত থাকবে।</li>
            <li>ডিভাইস পরিবর্তন বা ব্রাউজার ক্যাশ ক্লিয়ার হলেও কোনো ডেটা হারাবে না।</li>
          </ul>
        </div>
      )}

      {/* MANDATORY USER CONFIRMATION MODAL FOR DESTRUCTIVE OPERATIONS PER SKILL.MD */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="w-full max-w-sm bg-[#0c0c14] border-2 border-rose-500/50 rounded-2xl p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="p-2 rounded-xl bg-rose-500/15 border border-rose-500/30">
                <Trash2 className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white">ফাইল মোছার নিশ্চিতকরণ</h4>
            </div>

            <p className="text-xs text-amber-100/90 leading-relaxed">
              আপনি কি নিশ্চিত যে <strong>"{fileToDelete.name}"</strong> ফাইলটি আপনার গুগল ড্রাইভ থেকে স্থায়ীভাবে মুছে ফেলতে চান? এই কাজটি ফিরিয়ে আনা যাবে না।
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-[#14141e] hover:bg-[#1a1a28] text-amber-200 text-xs font-bold border border-amber-400/30 transition-all"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center gap-1.5"
              >
                {isDeleting ? 'মোছা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
