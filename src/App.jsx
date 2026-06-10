import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { CheckCircle2, AlertCircle, Info, ExternalLink, ShieldCheck, Settings, X, MessageSquare, Globe, Heart } from 'lucide-react';

const DONATION_URL = "https://buymeacoffee.com/helderlagrr"; 
const FEEDBACK_URL = "https://github.com/LagrisolaHelder";

const LANGUAGES = {
  en: {
    welcome: "Welcome to openArchv",
    engine: "Unzip files",
    nativeEngine: "Universal Unzipper",
    ready: "Ready to unpack your files.",
    initializing: "Getting things ready...",
    decompressing: "Unpacking your archive...",
    success: "Done! Your files are ready inside their own folder.",
    canceled: "Unpacking canceled.",
    aborted: "Stopped by user. Cleanup complete.",
    storageFull: "Could not unpack: Your computer is out of storage space.",
    pipelineErr: "Something went wrong: ",
    failErr: "Could not unpack: ",
    termsTitle: "Terms of Use (GPL Open Source)",
    termsBody: "openArchv is completely free for all macOS users and is distributed under the GPL Open Source License. It cannot be resold. If you use or modify this source code, your version must also remain entirely open-source. Unpacking files writes data to your machine; use this tool at your own discretion.",
    remember: "Remember my choice for the next execution",
    confirmBtn: "Agree & Continue",
    exitBtn: "Disagree & Exit",
    actionBtn: "Choose & Unpack File",
    processing: "Working on it...",
    dragHint: "...or drop your file right here",
    openFolder: "Open Unpacked Folder",
    supportedExt: "Supported Files",
    settingsTitle: "Settings",
    settingLang: "Language",
    settingLinks: "Links",
    donateLink: "Support the Creator",
    feedbackLink: "Report a Problem"
  },
  id: {
    welcome: "Selamat Datang di openArchv",
    engine: "Ekstrak berkas",
    nativeEngine: "Pengekstrak Universal",
    ready: "Siap untuk membuka berkas Anda.",
    initializing: "Menyiapkan semuanya...",
    decompressing: "Membuka arsip Anda...",
    success: "Selesai! Berkas Anda sudah siap di dalam foldernya sendiri.",
    canceled: "Ekstraksi dibatalkan.",
    aborted: "Dihentikan oleh pengguna. Pembersihan selesai.",
    storageFull: "Gagal mengekstrak: Ruang penyimpanan komputer Anda penuh.",
    pipelineErr: "Ada masalah: ",
    failErr: "Gagal mengekstrak: ",
    termsTitle: "Ketentuan Penggunaan (GPL Open Source)",
    termsBody: "openArchv sepenuhnya gratis untuk semua pengguna macOS dan didistribusikan di bawah Lisensi Open Source GPL. Aplikasi ini tidak boleh diperjualbelikan. Jika Anda menggunakan atau mengubah kode sumber ini, versi Anda juga harus tetap open-source sepenuhnya. Mengekstrak berkas akan menulis data ke komputer Anda; gunakan aplikasi ini dengan bijak.",
    remember: "Ingat pilihan saya untuk eksekusi berikutnya",
    confirmBtn: "Setuju & Lanjutkan",
    exitBtn: "Tolak & Keluar",
    actionBtn: "Pilih & Ekstrak Berkas",
    processing: "Sedang diproses...",
    dragHint: "...atau lepas berkas Anda di sini",
    openFolder: "Buka Folder Hasil Ekstrak",
    supportedExt: "Format yang Didukung",
    settingsTitle: "Pengaturan",
    settingLang: "Bahasa",
    settingLinks: "Tautan",
    donateLink: "Dukung Pembuat Aplikasi",
    feedbackLink: "Laporkan Masalah"
  },
  tet: {
    welcome: "Benvindu mai openArchv",
    engine: "Loke fail sira",
    nativeEngine: "Pengekstrak Universál",
    ready: "Prontu ona atu foti sai ita-nia fail sira.",
    initializing: "Prepara hela buat hotu...",
    decompressing: "Loke hela ita-nia arkivu...",
    success: "Prontu ona! Ita-nia fail sira iha ona ninia pasta rasik.",
    canceled: "Kansela tiha.",
    aborted: "Hapara tiha husi uza-na'in. Hamoos tiha ona.",
    storageFull: "Labele loke: Ita-nia komputadór nia memória nakonu ona.",
    pipelineErr: "Iha problema ruma: ",
    failErr: "Labele loke: ",
    termsTitle: "Termu ba Uza (GPL Open Source)",
    termsBody: "openArchv ne'e gratuitu duni ba uza-na'in macOS hotu no fahe iha Lisensa Open Source GPL nia okos. Labele fa'an fali softwér ne'e. Se ita uza ka hadi'a kódigu ida-ne'e, ita-nia versaun mós tenke nafatin open-source. Loke fail sira sei rai dadus iha ita-nia komputadór; uza ho ita rasik nia konsiderasaun.",
    remember: "Rai ha'u-nia eskolha ba ezekusaun tuirmai",
    confirmBtn: "Konkorda & Kontinuá",
    exitBtn: "La Konkorda & Sai",
    actionBtn: "Hili & Loke Fail",
    processing: "Halo hela...",
    dragHint: "...ka hatoba de'it fail iha ne'e",
    openFolder: "Loke Pasta",
    supportedExt: "Fail sira-ne'ebé Suporta",
    settingsTitle: "Konfigurasaun",
    settingLang: "Lia-fuan",
    settingLinks: "Link sira",
    donateLink: "Suporta Dezenvolvedór",
    feedbackLink: "Submete Feedback / Bug"
  },
  es: {
    welcome: "Bienvenido a openArchv",
    engine: "Descomprimir archivos",
    nativeEngine: "Extractor Universal",
    ready: "Listo para abrir tus archivos.",
    initializing: "Preparando todo...",
    decompressing: "Desempaquetando tu archivo...",
    success: "¡Listo! Tus archivos están guardados en su propia carpeta.",
    canceled: "Extracción cancelada.",
    aborted: "Detenido por el usuario. Limpieza completada.",
    storageFull: "No se pudo extraer: Tu computadora no tiene espacio suficiente.",
    pipelineErr: "Ocurrió un problema: ",
    failErr: "No se pudo extraer: ",
    termsTitle: "Términos de Uso (GPL Open Source)",
    termsBody: "openArchv es completamente gratis para todos los usuarios de macOS y se distribuye bajo la Licencia Código Abierto GPL. Está prohibida su reventa. Si usas o modificas este código fuente, tu versión también debe ser totalmente de código abierto. Abrir archivos guarda datos en tu equipo; hazlo bajo tu propia responsabilidad.",
    remember: "Recordar mi elección para la próxima ejecución",
    confirmBtn: "Aceptar & Continuar",
    exitBtn: "Rechazar & Salir",
    actionBtn: "Elegir & Abrir Archivo",
    processing: "Trabajando en ello...",
    dragHint: "...o arrastra tu archivo directamente aquí",
    openFolder: "Abrir Carpeta Guardada",
    supportedExt: "Formatos Soportados",
    settingsTitle: "Ajustes",
    settingLang: "Idioma",
    settingLinks: "Enlaces",
    donateLink: "Apoyar al creador",
    feedbackLink: "Reportar un problema"
  },
  fr: {
    welcome: "Bienvenue sur openArchv",
    engine: "Décompresser des fichiers",
    nativeEngine: "Extracteur Universel",
    ready: "Prêt à ouvrir vos fichiers.",
    initializing: "Préparation en cours...",
    decompressing: "Extraction de votre archive...",
    success: "Terminé ! Vos fichiers sont disponibles dans leur dossier.",
    canceled: "Extraction annulée.",
    aborted: "Arrêté par l'utilisateur. Nettoyage terminé.",
    storageFull: "Impossible d'extraire : Votre ordinateur n'a plus d'espace.",
    pipelineErr: "Un problème est survenu : ",
    failErr: "Impossible d'extraire : ",
    termsTitle: "Conditions d'Utilisation (GPL Open Source)",
    termsBody: "openArchv est entièrement gratuit pour tous les utilisateurs macOS et est distribué sous licence Open Source GPL. Il ne peut pas être revendu. Si vous utilisez ou modifiez ce code source, votre version doit également rester open-source. L'ouverture de fichiers écrit des données sur votre disque; utilisez cet outil sous votre responsabilité.",
    remember: "Se souvenir de mon choix pour la prochaine exécution",
    confirmBtn: "Accepter & Continuer",
    exitBtn: "Refuser & Quitter",
    actionBtn: "Choisir & Extraire le Fichier",
    processing: "Traitement en cours...",
    dragHint: "...ou glissez-déposez votre fichier ici",
    openFolder: "Ouvrir le Dossier Extrait",
    supportedExt: "Formats Supportés",
    settingsTitle: "Paramètres",
    settingLang: "Langue",
    settingLinks: "Liens utiles",
    donateLink: "Soutenir le créateur",
    feedbackLink: "Signaler un problème"
  },
  pt: {
    welcome: "Bem-vindo ao openArchv",
    engine: "Extrair arquivos",
    nativeEngine: "Extrator Universal",
    ready: "Pronto para abrir os seus arquivos.",
    initializing: "Preparando tudo...",
    decompressing: "Extraindo o seu arquivo...",
    success: "Pronto! Seus arquivos estão salvos na pasta deles.",
    canceled: "Extração cancelada.",
    aborted: "Interrompido pelo usuário. Limpeza concluída.",
    storageFull: "Não foi possível extrair: Seu computador está sem espaço.",
    pipelineErr: "Ocorreu um problema: ",
    failErr: "Não foi possível extrair: ",
    termsTitle: "Termos de Uso (GPL Open Source)",
    termsBody: "O openArchv é totalmente gratuito para todos os usuários do macOS e distribuído sob a Licença Open Source GPL. É proibida a sua revenda. Se você usar ou modificar este código-fonte, sua versão também deverá ser totalmente open-source. Abrir arquivos grava dados no seu computador; use-o por sua própria conta e risco.",
    remember: "Lembrar minha escolha para a próxima execução",
    confirmBtn: "Aceitar & Continuar",
    exitBtn: "Recusar & Sair",
    actionBtn: "Escolher & Extrair Arquivo",
    processing: "Trabalhando nisso...",
    dragHint: "...ou arraste seu arquivo direto para cá",
    openFolder: "Abrir Pasta Extraída",
    supportedExt: "Formatos Suportados",
    settingsTitle: "Configurações",
    settingLang: "Idioma",
    settingLinks: "Links",
    donateLink: "Apoiar o criador",
    feedbackLink: "Reportar um problema"
  },
  de: {
    welcome: "Willkommen bei openArchv",
    engine: "Dateien entpacken",
    nativeEngine: "Universal-Entpacker",
    ready: "Bereit, Ihre Dateien zu entpacken.",
    initializing: "Alles wird vorbereitet...",
    decompressing: "Archiv wird entpackt...",
    success: "Fertig! Ihre Dateien liegen im eigenen Ordner bereit.",
    canceled: "Entpacken abgebrochen.",
    aborted: "Vom Benutzer gestoppt. Bereinigung abgeschlossen.",
    storageFull: "Fehler: Nicht genügend Speicherplatz auf dem Computer.",
    pipelineErr: "Ein Problem ist aufgetreten: ",
    failErr: "Entpacken fehlgeschlagen: ",
    termsTitle: "Nutzungsbedingungen (GPL Open Source)",
    termsBody: "openArchv ist für alle macOS-Benutzer völlig kostenlos und steht unter der GPL Open Source Lizenz. Ein Weiterverkauf ist nicht erlaubt. Wenn Sie diesen Quellcode nutzen oder verändern, muss auch Ihre Version komplett Open-Source bleiben. Das Entpacken schreibt Daten auf Ihren Computer; Nutzung auf eigene Verantwortung.",
    remember: "Auswahl für die nächste Ausführung merken",
    confirmBtn: "Zustimmen & Weiter",
    exitBtn: "Ablehnen & Beenden",
    actionBtn: "Datei wählen & entpacken",
    processing: "Wird bearbeitet...",
    dragHint: "...oder Datei einfach hierher ziehen",
    openFolder: "Entpackten Ordner öffnen",
    supportedExt: "Unterstützte Formate",
    settingsTitle: "Einstellungen",
    settingLang: "Sprache",
    settingLinks: "Links",
    donateLink: "Entwickler unterstützen",
    feedbackLink: "Problem melden"
  }
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [progress, setProgress] = useState(0); 
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedPath, setExtractedPath] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 🔒 FORCED TERMS DISPLAY ON RUN: Starts as false to always display layout
  const [hasConfirmedTerms, setHasConfirmedTerms] = useState(false);
  
  // 🔘 FORCED AUTOMATIC TICK: Pre-checked configuration setup
  const [rememberTermsChoice, setRememberTermsChoice] = useState(true);

  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  const [statusKey, setStatusKey] = useState('ready');
  const [statusType, setStatusType] = useState('info');
  const [customStatusError, setCustomStatusError] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Hardening Shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      if (
        e.key === 'F12' || e.key === 'F5' ||
        ((e.ctrlKey || (isMac && e.metaKey)) && e.shiftKey && ['I', 'J', 'C'].includes(e.key.toUpperCase())) ||
        ((e.ctrlKey || (isMac && e.metaKey)) && e.key.toUpperCase() === 'R') ||
        ((e.ctrlKey || (isMac && e.metaKey)) && e.key.toUpperCase() === 'U')
      ) {
        e.preventDefault();
        e.stopPropagation();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu, true);
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu, true);
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  // 🔄 Fixed Background Tauri IPC Event Loop Integration
  useEffect(() => {
    let unlistenProgress;
    let unlistenError;
    
    async function setupListeners() {
      unlistenProgress = await listen('extraction-progress', (event) => {
        const currentProgress = event.payload.percentage;
        setProgress(currentProgress);
        
        if (currentProgress === 100) {
          setIsExtracting(false);
          setStatusType('success');
          setStatusKey('success');
        }
      });

      unlistenError = await listen('extraction-error', (event) => {
        setIsExtracting(false);
        setProgress(0);
        setExtractedPath(null);
        
        if (event.payload === "STORAGE_FULL") {
          setStatusType('error');
          setStatusKey('storageFull');
        } else {
          setStatusType('error');
          setStatusKey('failErr');
          setCustomStatusError(event.payload);
        }
      });
    }

    setupListeners();
    return () => {
      if (unlistenProgress) unlistenProgress();
      if (unlistenError) unlistenError();
    };
  }, []);

  const handleAcceptTerms = () => {
    setHasConfirmedTerms(true);
  };

  const handleRejectTerms = async () => {
    try {
      await invoke('exit_app'); 
    } catch (err) {
      window.close();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!isExtracting) setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (isExtracting) return;

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const droppedFilePath = files[0].path || files[0].name;
      triggerExtractionPipeline(droppedFilePath);
    }
  };

  const handleExtract = async () => {
    try {
      const selectedFile = await open({
        multiple: false,
        filters: [{ name: 'Archives', extensions: ['zip', '7z', 'rar', 'tar', 'gz', 'bz2', 'xz'] }]
      });
      if (!selectedFile) {
        setStatusType('info');
        setStatusKey('canceled');
        return;
      }
      triggerExtractionPipeline(selectedFile);
    } catch (err) {
      setStatusType('error');
      setStatusKey('failErr');
      setCustomStatusError(err.toString());
      setIsExtracting(false);
    }
  };

  const triggerExtractionPipeline = (filePath) => {
    setExtractedPath(null);
    setProgress(0);
    setIsExtracting(true);
    setStatusType('info');
    setStatusKey('initializing');

    setTimeout(async () => {
      try {
        setStatusType('info');
        setStatusKey('decompressing');
        const targetFolder = await invoke('extract_archive', { filePath });
        setExtractedPath(targetFolder);
      } catch (innerErr) {
        setStatusType('error');
        setStatusKey('pipelineErr');
        setCustomStatusError(innerErr.toString());
        setIsExtracting(false);
      }
    }, 2000);
  };

  const handleCancel = async () => {
    try {
      await invoke('cancel_extraction');
      setIsExtracting(false);
      setProgress(0);
      setExtractedPath(null);
      setStatusType('error');
      setStatusKey('aborted');
    } catch (err) {
      setStatusType('error');
      setStatusKey('failErr');
      setCustomStatusError(err.toString());
    }
  };

  const openTargetFolder = async () => {
    if (extractedPath) {
      try {
        await invoke('open_browser', { url: extractedPath });
      } catch (err) {
        setStatusType('error');
        setStatusKey('failErr');
        setCustomStatusError("Could not open folder.");
      }
    }
  };

  const handleExternalLink = async (url) => {
    try {
      await invoke('open_browser', { url });
    } catch (err) {
      console.error("Could not open external link.");
    }
  };

  const getStatusClasses = () => {
    if (statusType === 'success') {
      return {
        box: "bg-emerald-950/20 border-emerald-900 text-emerald-400 rounded-xl border",
        icon: <CheckCircle2 size={15} className="text-emerald-400" />
      };
    }
    if (statusType === 'error') {
      return {
        box: "bg-red-950/20 border-red-900 text-red-400 rounded-xl border",
        icon: <AlertCircle size={15} className="text-red-400" />
      };
    }
    return {
      box: "", 
      icon: isExtracting ? (
        <div className="relative w-4 h-4 mr-0.5">
          <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
          <div className="absolute inset-0 border-2 border-transparent border-t-zinc-200 rounded-full animate-spin"></div>
        </div>
      ) : (
        <Info size={15} className="text-zinc-500" />
      )
    };
  };

  const t = LANGUAGES[lang] || LANGUAGES.en;
  const activeStatus = getStatusClasses();
  
  let activeStatusMessage = t[statusKey] || t.ready;
  if (statusKey === 'failErr' || statusKey === 'pipelineErr') {
    activeStatusMessage = `${t[statusKey]}${customStatusError}`;
  }

  const monoTheme = {
    bg: "bg-black text-white",
    border: "border-zinc-900",
    button: "bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800",
    inputAccent: "accent-white",
    dragActive: "border-zinc-400 bg-zinc-900/30",
    loadingBar: "bg-zinc-200"
  };

  if (showSplash) {
    return (
      <div className={`absolute top-0 left-0 w-screen h-screen flex flex-col items-center justify-center ${monoTheme.bg} select-none pointer-events-none z-50`}>
        <div className="flex flex-col items-center gap-4 text-center animate-fade-in">
          <h1 className="text-2xl font-bold tracking-tight">openArchv</h1>
          <div className="relative w-6 h-6 mt-2">
            <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
            <div className="absolute inset-0 border-2 border-transparent border-t-zinc-200 rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute top-0 left-0 w-screen h-screen px-8 py-10 font-sans select-none transition-all duration-300 flex flex-col justify-between ${monoTheme.bg} animate-fade-in`}>
      
      {/* 🔝 TOP NAVIGATION HEADER */}
      <header className={`flex justify-between items-center w-full max-w-4xl mx-auto border-b ${monoTheme.border} pb-5`}>
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <span className="text-lg font-bold tracking-tight">openArchv</span>
        </div>
        
        <div className="flex items-center gap-4">
          <p className="hidden sm:block text-[11px] tracking-wider text-zinc-500 uppercase font-medium">{t.engine}</p>
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900/50 transition-colors"
          >
            <Settings size={18} />
          </button>
        </div>
      </header>

      {/* 🎛️ CENTER MAIN WINDOW */}
      <div className="flex justify-center w-full my-auto py-4">
        <main className="w-full max-w-[380px] transition-all duration-300">
          
          {/* 📜 DISPLAYS PROMPT UNTIL AGREE & CONTINUE ACTION EXECUTED */}
          {!hasConfirmedTerms ? (
            <div className={`p-6 border ${monoTheme.border} bg-neutral-900/20 rounded-xl shadow-sm text-center animate-fade-in`}>
              <div className="flex justify-center mb-3">
                <ShieldCheck size={28} />
              </div>
              <h2 className="text-base font-bold tracking-tight mb-2">{t.termsTitle}</h2>
              <p className="text-[11px] leading-relaxed mb-4 text-zinc-400 text-left">{t.termsBody}</p>
              
              <div className="flex items-center justify-start gap-2 mb-5 cursor-pointer text-left">
                <input 
                  type="checkbox" 
                  id="rememberChoice"
                  checked={rememberTermsChoice}
                  onChange={(e) => setRememberTermsChoice(e.target.checked)}
                  className={`w-3.5 h-3.5 ${monoTheme.inputAccent} cursor-pointer rounded border-zinc-800 bg-black`}
                />
                <label htmlFor="rememberChoice" className="text-[11px] font-semibold text-zinc-500 cursor-pointer select-none">
                  {t.remember}
                </label>
              </div>

              <div className="flex flex-col gap-2">
                <button onClick={handleAcceptTerms} className={`w-full py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 shadow-sm ${monoTheme.button}`}>
                  {t.confirmBtn}
                </button>
                <button onClick={handleRejectTerms} className="w-full py-2.5 text-xs font-semibold rounded-xl border border-zinc-900 bg-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-950/50 transition-all duration-200">
                  {t.exitBtn}
                </button>
              </div>
            </div>
          ) : (
            <>
              {statusType !== 'info' ? (
                <div className={`flex items-center gap-3 p-4 mb-5 text-xs font-medium transition-all duration-300 ${activeStatus.box}`}>
                  {activeStatus.icon}
                  <span className="leading-relaxed">{activeStatusMessage}</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 mb-5 text-xs font-medium text-zinc-500 text-center transition-all duration-300">
                  {activeStatus.icon}
                  <span>{activeStatusMessage}</span>
                </div>
              )}

              {isExtracting && (
                <div className={`p-6 mb-5 border ${monoTheme.border} bg-neutral-900/10 flex flex-col items-center justify-center text-center shadow-sm rounded-xl`}>
                  <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                    <div className="absolute w-full h-full rounded-full border border-zinc-800 animate-ping opacity-25"></div>
                    <div className="absolute w-12 h-12 rounded-full border border-dashed border-zinc-800 animate-[spin_4s_linear_infinite]"></div>
                    <div className={`absolute w-10 h-10 rounded-full border-2 border-transparent ${monoTheme.loadingBar} animate-spin`}></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  </div>

                  <div className="w-full max-w-[240px] mb-4">
                    <div className="flex justify-between mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Unpacking</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className={`h-full ${monoTheme.loadingBar} transition-all duration-150 ease-out`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <button onClick={handleCancel} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-950 hover:bg-red-950/30 rounded-lg transition-all duration-150">
                    Stop
                  </button>
                </div>
              )}

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full p-6 text-center flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
                  isDragging ? monoTheme.dragActive : `${monoTheme.border} bg-transparent hover:border-zinc-800`
                }`}
              >
                <button onClick={handleExtract} disabled={isExtracting} className={`w-full py-3 text-xs font-semibold rounded-xl border transition-all duration-200 ${isExtracting ? 'bg-zinc-900/50 border-zinc-900 text-zinc-600 cursor-not-allowed' : monoTheme.button}`}>
                  {isExtracting ? t.processing : t.actionBtn}
                </button>

                {!isExtracting && <p className="mt-3 text-[11px] font-medium text-zinc-500 transition-colors">{t.dragHint}</p>}

                {extractedPath && !isExtracting && (
                  <button onClick={openTargetFolder} className="w-full mt-3 py-3 text-xs font-semibold rounded-xl border border-zinc-800 text-zinc-300 bg-zinc-950/40 hover:bg-zinc-900 flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200">
                    <ExternalLink size={14} /> {t.openFolder}
                  </button>
                )}
              </div>

              {/* ℹ️ SIMPLIFIED HOVER TOOLTIP ELEMENT */}
              <div className="mt-6 flex justify-center">
                <div className="relative group flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-zinc-900/80 bg-zinc-950/40 text-zinc-500 hover:text-zinc-400 hover:border-zinc-800 cursor-help transition-all duration-200">
                  <Info size={13} className="text-zinc-500 group-hover:text-zinc-400" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{t.supportedExt}</span>
                  
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 p-2 rounded-xl bg-zinc-950 border border-zinc-800 text-zinc-400 font-semibold tracking-wide text-[10px] text-center shadow-xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-200 z-10">
                    <div className="grid grid-cols-3 gap-1">
                      {['.ZIP', '.7Z', '.RAR', '.TAR', '.GZ', '.BZ2', '.XZ'].map(ext => (
                        <span key={ext} className="py-0.5 px-1 bg-zinc-900 rounded text-zinc-300">{ext}</span>
                      ))}
                      <span className="col-span-2 py-0.5 px-1 bg-zinc-900/30 rounded text-zinc-500 font-medium text-[9px] flex items-center justify-center">CORE APP</span>
                    </div>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-zinc-800"></div>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* ⚙️ SIDEBAR OPTIONS PANEL */}
      {sidebarOpen && (
        <div className="fixed inset-0 w-screen h-screen z-50 flex justify-end animate-fade-in">
          <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
          
          <div className={`relative w-full max-w-[320px] h-full border-l p-6 flex flex-col justify-between bg-zinc-950 border-zinc-900 text-white`}>
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-zinc-900 mb-6">
                <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
                  <Settings size={16} />
                  <span>{t.settingsTitle}</span>
                </div>
                <button onClick={() => setSidebarOpen(false)} className="p-1 rounded-lg text-zinc-500 hover:text-white hover:bg-zinc-900/50 transition-colors">
                  <X size={18} />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase text-zinc-500 mb-2.5">
                  <Globe size={13} />
                  <span>{t.settingLang}</span>
                </div>
                <select 
                  value={lang} 
                  onChange={(e) => setLang(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-xl outline-none focus:border-zinc-700 select-none"
                >
                  <option value="en">🇺🇸 English (US)</option>
                  <option value="id">🇮🇩 Indonesia</option>
                  <option value="tet">🇹🇱 Tetun (Timor-Leste)</option>
                  <option value="es">🇪🇸 Español</option>
                  <option value="fr">🇫🇷 Français</option>
                  <option value="pt">🇧🇷 Português</option>
                  <option value="de">🇩🇪 Deutsch</option>
                </select>
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-900 flex flex-col gap-2">
              <span className="text-[9px] font-bold tracking-widest uppercase text-zinc-600 block mb-1">{t.settingLinks}</span>
              <button 
                onClick={() => handleExternalLink(DONATION_URL)}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Heart size={14} className="text-red-500 fill-red-500/10" />
                <span>{t.donateLink}</span>
              </button>
              <button 
                onClick={() => handleExternalLink(FEEDBACK_URL)}
                className="w-full py-2.5 px-3 rounded-xl bg-zinc-900/60 border border-zinc-900 hover:border-zinc-800 text-zinc-300 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <MessageSquare size={14} className="text-zinc-400" />
                <span>{t.feedbackLink}</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ⬇️ SYSTEM FOOTER */}
      <footer className={`w-full text-center max-w-4xl mx-auto border-t ${monoTheme.border} pt-4`}>
        <p className="text-[10px] tracking-wider text-zinc-500 font-bold">
          &copy; 2026 openArchv &bull; GPL Open Source Software
        </p>
      </footer>
    </div>
  );
}

export default App;