import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { Sun, Moon, Unlock, FolderArchive, CheckCircle2, AlertCircle, Info, ExternalLink, Layers, Heart, XCircle } from 'lucide-react';

const DONATION_URL = "https://buymeacoffee.com/helderlagrr"; 

function App() {
  const [progress, setProgress] = useState(0); 
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedPath, setExtractedPath] = useState(null);
  
  const [status, setStatus] = useState({
    message: 'Ready to unpack system containers natively.',
    type: 'info'
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true;
  });

  // ✨ Theme Engine Sync: Controls document root class injection
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    let unlistenProgress;
    let unlistenError;
    
    async function setupListeners() {
      unlistenProgress = await listen('extraction-progress', (event) => {
        const currentProgress = event.payload.percentage;
        setProgress(currentProgress);
        
        if (currentProgress === 100) {
          setIsExtracting(false);
          setStatus({ message: 'Archive successfully unpacked into its own folder!', type: 'success' });
        }
      });

      unlistenError = await listen('extraction-error', (event) => {
        setIsExtracting(false);
        setProgress(0);
        setExtractedPath(null);
        
        if (event.payload === "STORAGE_FULL") {
          setStatus({ 
            message: 'Extraction Failed: Insufficient disk space. Your machine storage is full.', 
            type: 'error' 
          });
        } else {
          setStatus({ message: `Extraction failed: ${event.payload}`, type: 'error' });
        }
      });
    }

    setupListeners();
    return () => {
      if (unlistenProgress) unlistenProgress();
      if (unlistenError) unlistenError();
    };
  }, []);

  const handleExtract = async () => {
    try {
      const selectedFile = await open({
        multiple: false,
        filters: [{ name: 'Archives', extensions: ['zip', '7z', 'rar', 'tar', 'gz', 'bz2', 'xz'] }]
      });

      if (!selectedFile) {
        setStatus({ message: 'Extraction canceled.', type: 'info' });
        return;
      }

      setExtractedPath(null);
      setProgress(0);
      setIsExtracting(true);
      setStatus({ message: 'Decompressing archive architecture natively...', type: 'info' });
      
      const targetFolder = await invoke('extract_archive', { filePath: selectedFile });
      setExtractedPath(targetFolder);
      
    } catch (err) {
      setStatus({ message: `Extraction failed: ${err}`, type: 'error' });
      setIsExtracting(false);
    }
  };

  const handleCancel = async () => {
    try {
      await invoke('cancel_extraction');
      setIsExtracting(false);
      setProgress(0);
      setExtractedPath(null);
      setStatus({ message: 'Extraction aborted by user. Temporary components wiped.', type: 'error' });
    } catch (err) {
      setStatus({ message: `Failed to signal cancellation sequence: ${err}`, type: 'error' });
    }
  };

  const openTargetFolder = async () => {
    if (extractedPath) {
      try {
        await invoke('open_browser', { url: extractedPath });
      } catch (err) {
        setStatus({ message: "Failed to open target folder context.", type: "error" });
      }
    }
  };

  const handleDonate = async () => {
    try {
      await invoke('open_browser', { url: DONATION_URL });
    } catch (err) {
      setStatus({ message: "Could not open system browser link.", type: "error" });
    }
  };

  // ✨ FIXED: Dynamic theme color palettes mapped explicitly for both light & dark contrast profiles
  const getStatusClasses = () => {
    if (status.type === 'success') {
      return {
        box: "bg-emerald-50 border-emerald-200 text-emerald-900 dark:bg-zinc-900/40 dark:text-white dark:border-yellow-400/40 rounded-xl",
        icon: <CheckCircle2 size={15} className="text-emerald-600 dark:text-yellow-400" />
      };
    }
    if (status.type === 'error') {
      return {
        box: "bg-red-50 border-red-200 text-red-900 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20 rounded-xl",
        icon: <AlertCircle size={15} className="text-red-600" />
      };
    }
    return {
      box: "bg-zinc-100 border-zinc-200 text-zinc-800 dark:bg-zinc-500/5 dark:text-zinc-300 dark:border-zinc-800 rounded-xl",
      icon: isExtracting ? (
        <div className="relative w-4 h-4 mr-0.5">
          <div className="absolute inset-0 border-2 border-zinc-300 dark:border-yellow-400/30 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-t-zinc-800 dark:border-t-yellow-400 rounded-full animate-spin"></div>
        </div>
      ) : (
        <Info size={15} className="text-zinc-500 dark:text-zinc-400" />
      )
    };
  };

  const activeStatus = getStatusClasses();

  return (
    <div className="absolute top-0 left-0 w-screen h-screen px-8 py-10 font-sans select-none transition-colors duration-300 flex flex-col justify-between bg-zinc-50 text-zinc-900 dark:bg-black dark:text-white">
      
      {/* 🔝 TOP NAVIGATION HEADER */}
      <header className="flex justify-between items-center w-full max-w-4xl mx-auto border-b border-zinc-200 dark:border-zinc-900 pb-5">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <FolderArchive size={22} className="text-zinc-900 dark:text-white transition-colors duration-200 dark:group-hover:text-yellow-400" />
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white transition-colors duration-200 dark:group-hover:text-yellow-400">openArchv</span>
        </div>
        <p className="hidden sm:block text-[11px] tracking-wider text-zinc-500 dark:text-zinc-400 uppercase font-medium">
          Native Universal Engine
        </p>
      </header>

      {/* 🎛️ CENTER STAGE */}
      <div className="flex justify-center w-full my-auto py-4">
        <main className="w-full max-w-[380px] transition-all duration-300">
          
          {/* Status Alert Bar */}
          <div className={`flex items-center gap-3 p-4 mb-6 text-xs font-medium transition-all duration-300 ${activeStatus.box}`}>
            {activeStatus.icon}
            <span className="leading-relaxed">{status.message}</span>
          </div>

          {/* Visual Extraction Loading Stage */}
          {isExtracting && (
            <div className="p-6 mb-6 border rounded-xl border-zinc-200 dark:border-zinc-900 bg-white dark:bg-zinc-950/60 flex flex-col items-center justify-center text-center shadow-sm">
              <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                <div className="absolute w-full h-full rounded-full border border-zinc-200 dark:border-yellow-400/20 animate-ping opacity-75"></div>
                <div className="absolute w-12 h-12 rounded-full border border-dashed border-zinc-300 dark:border-white/20 animate-[spin_4s_linear_infinite]"></div>
                <div className="absolute w-10 h-10 rounded-full border-2 border-transparent border-t-zinc-900 dark:border-t-yellow-400 border-r-zinc-900 dark:border-r-yellow-400 animate-spin"></div>
                <div className="w-3 h-3 rounded-full bg-zinc-900 dark:bg-white"></div>
              </div>

              <div className="w-full max-w-[240px] mb-4">
                <div className="flex justify-between mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
                  <span>Decompressing</span>
                  <span className="text-zinc-900 dark:text-yellow-400">{progress}%</span>
                </div>
                <div className="w-full h-1 bg-zinc-200 dark:bg-zinc-900 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-zinc-900 dark:bg-yellow-400 transition-all duration-150 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              <button
                onClick={handleCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-200 hover:bg-red-50 dark:text-red-400 dark:border-red-500/20 dark:hover:bg-red-500/10 dark:hover:border-red-500 rounded-lg transition-all duration-150"
              >
                <XCircle size={12} /> Cancel Operation
              </button>
            </div>
          )}

          {/* Core Unlocked Operational Console */}
          <div className="text-center flex flex-col gap-3">
            {!isExtracting && !extractedPath && (
              <div className="flex justify-center mb-1 animate-fade-in">
                <Unlock size={24} className="text-zinc-900 dark:text-white" />
              </div>
            )}

            <button 
              onClick={handleExtract} 
              disabled={isExtracting} 
              className={`w-full py-3 text-xs font-semibold rounded-xl transition-all duration-200 border ${
                isExtracting 
                  ? 'bg-zinc-100 border-zinc-200 text-zinc-400 dark:bg-zinc-950 dark:text-zinc-600 dark:border-zinc-900 cursor-not-allowed' 
                  : 'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-black dark:border-white dark:hover:bg-yellow-400 dark:hover:border-yellow-400 shadow-sm'
              }`}
            >
              {isExtracting ? "Processing Operation..." : "Select & Extract Archive"}
            </button>

            {extractedPath && !isExtracting && (
              <button
                onClick={openTargetFolder}
                className="w-full py-3 text-xs font-semibold rounded-xl transition-all duration-200 border border-zinc-300 text-zinc-800 bg-white hover:bg-zinc-50 dark:bg-transparent dark:border-yellow-400 dark:text-yellow-400 dark:hover:bg-yellow-400 dark:hover:text-black flex items-center justify-center gap-1.5 shadow-sm animate-fade-in"
              >
                <ExternalLink size={14} /> Open Extracted Folder
              </button>
            )}

            {!isExtracting && (
              <button
                onClick={handleDonate}
                className="mt-2 text-[11px] font-semibold tracking-wide text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-yellow-400 transition-colors duration-200 flex items-center justify-center gap-1.5 self-center"
              >
                <Heart size={12} className="text-zinc-400 dark:text-zinc-400 hover:scale-110 transition-transform duration-150" /> 
                Support openArchv Development
              </button>
            )}
          </div>

          {/* Engine Integration Notes */}
          <div className="mt-6 pt-5 border-t border-zinc-200 dark:border-zinc-900">
            <div className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-zinc-200 dark:bg-zinc-950/40 dark:border-zinc-900 shadow-sm">
              <Layers size={14} className="mt-0.5 text-zinc-400 dark:text-zinc-500 shrink-0" />
              <div className="text-left">
                <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
                  Engine Architecture Note:
                </span>
                <p className="text-[11px] leading-relaxed text-zinc-600 dark:text-zinc-300">
                  This native system layer fully decompresses and maps structures for <strong className="font-semibold text-zinc-900 dark:text-white">.zip</strong>, <strong className="font-semibold text-zinc-900 dark:text-white">.7z</strong>, <strong className="font-semibold text-zinc-900 dark:text-white">.rar</strong>, <strong className="font-semibold text-zinc-900 dark:text-white">.tar</strong>, <strong className="font-semibold text-zinc-900 dark:text-white">.gz</strong>, <strong className="font-semibold text-zinc-900 dark:text-white">.bz2</strong>, and <strong className="font-semibold text-zinc-900 dark:text-white">.xz</strong> files.
                </p>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* 🌓 FIXED FLOATING ACTION BUTTON */}
      <div className="fixed bottom-8 right-8 z-50">
        <button 
          onClick={() => setDarkMode(!darkMode)} 
          className="flex items-center justify-center w-10 h-10 rounded-full border border-zinc-200 bg-white shadow-md hover:scale-105 active:scale-95 transition-all duration-150 dark:bg-black dark:border-zinc-900 dark:text-white dark:hover:border-yellow-400 dark:hover:text-yellow-400"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={15} /> : <Moon size={15} className="text-zinc-800" />}
        </button>
      </div>

      {/* ⬇️ SYSTEM FOOTER */}
      <footer className="w-full text-center max-w-4xl mx-auto border-t border-zinc-200 dark:border-zinc-900 pt-4">
        <p className="text-[10px] tracking-wider text-zinc-400 dark:text-zinc-500 font-medium">
          &copy; {new Date().getFullYear()} openArchv &bull; Designed by Helder Lagrisola
        </p>
      </footer>
    </div>
  );
}

export default App;