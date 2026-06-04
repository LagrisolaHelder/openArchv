 import React, { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';
import { listen } from '@tauri-apps/api/event';
import { CheckCircle2, AlertCircle, Info, ExternalLink, Layers, Heart, XCircle, ShieldCheck, Settings, X, MessageSquare, Globe } from 'lucide-react';

// 🌟 Import your custom branding logo directly into the React tree
import appLogo from './assets/app-logo.png';

const DONATION_URL = "https://buymeacoffee.com/helderlagrr"; 
const FEEDBACK_URL = "https://github.com/LagrisolaHelder";

// 🌐 Comprehensive Dictionary Mapping for Global Translation
const LANGUAGES = {
  en: {
    welcome: "Welcome to openArchv",
    engine: "Decompress files",
    nativeEngine: "Native Universal Engine",
    ready: "Ready to unpack system containers natively.",
    initializing: "Initializing decompression layout matrix...",
    decompressing: "Decompressing archive architecture natively...",
    success: "Archive successfully unpacked into its own folder!",
    canceled: "Extraction canceled.",
    aborted: "Extraction aborted by user. Temporary components wiped.",
    storageFull: "Extraction Failed: Insufficient disk space. Your machine storage is full.",
    pipelineErr: "Extraction pipeline error: ",
    failErr: "Extraction failed: ",
    termsTitle: "Terms of Software Use",
    termsBody: "By operating openArchv, you acknowledge that decompressing large disk payloads performs local system file writing. You agree to use this binary utility at your own discretion.",
    remember: "Remember choice on this machine",
    confirmBtn: "Confirm & Access Software",
    actionBtn: "Select & Extract Archive",
    processing: "Processing Operation...",
    dragHint: "...or drag and drop your file here",
    openFolder: "Open Extracted Folder",
    supportBtn: "Support openArchv Development",
    supportedExt: "Supported Extensions",
    settingsTitle: "Application Settings",
    settingLang: "Language Selection",
    settingTheme: "Interface Accent Theme",
    settingLinks: "Developer Context",
    donateLink: "Donate to Developer",
    feedbackLink: "Submit Feedback Bug",
    themeMono: "Minimal Mono",
    themeBlue: "Light Blue",
    themePink: "Cyber Pink"
  },
  id: { // 🇮🇩 Indonesian
    welcome: "Selamat Datang di openArchv",
    engine: "Dekompresi berkas",
    nativeEngine: "Mesin Universal Asli",
    ready: "Siap untuk mengekstrak kontainer sistem secara bawaan.",
    initializing: "Menginisialisasi matriks tata letak dekompresi...",
    decompressing: "Mendekompresi arsitektur arsip secara bawaan...",
    success: "Arsip berhasil diekstrak ke dalam foldernya sendiri!",
    canceled: "Ekstraksi dibatalkan.",
    aborted: "Ekstraksi digagalkan oleh pengguna. Komponen sementara dihapus.",
    storageFull: "Ekstraksi Gagal: Ruang penyimpanan disk tidak mencukupi. Penyimpanan penuh.",
    pipelineErr: "Kesalahan jalur ekstraksi: ",
    failErr: "Ekstraksi gagal: ",
    termsTitle: "Ketentuan Penggunaan Perangkat Lunak",
    termsBody: "Dengan mengoperasikan openArchv, Anda mengetahui bahwa mendekompresi data disk besar akan melakukan penulisan berkas sistem lokal. Anda setuju untuk menggunakan utilitas biner ini atas kebijakan Anda sendiri.",
    remember: "Ingat pilihan di mesin ini",
    confirmBtn: "Konfirmasi & Akses Perangkat Lunak",
    actionBtn: "Pilih & Ekstrak Arsip",
    processing: "Memproses Operasi...",
    dragHint: "...atau seret dan lepas berkas Anda di sini",
    openFolder: "Buka Folder Hasil Ekstraksi",
    supportBtn: "Dukung Pengembangan openArchv",
    supportedExt: "Ekstensi yang Didukung",
    settingsTitle: "Pengaturan Aplikasi",
    settingLang: "Pilihan Bahasa",
    settingTheme: "Tema Aksen Antarmuka",
    settingLinks: "Konteks Pengembang",
    donateLink: "Donasi ke Pengembang",
    feedbackLink: "Kirim Umpan Balik / Bug",
    themeMono: "Mono Minimalis",
    themeBlue: "Biru Muda",
    themePink: "Cyber Pink"
  },
  tet: { // 🇹🇱 Tetun (Timor-Leste)
    welcome: "Benvindu mai openArchv",
    engine: "Kumpresa fail sira",
    nativeEngine: "Motór Universál Nativu",
    ready: "Prontu ona atu lori sai kontentór sistema nian.",
    initializing: "Inisia hela matris layout dekompresaun nian...",
    decompressing: "Kumpresa hela arkivu arkitetura nian ho nativu...",
    success: "Arkivu konsege lori sai ona ba ninia pasta rasik!",
    canceled: "Kansela tiha estraun.",
    aborted: "Estraun hapara de'it husi uza-na'in. Komponente provizóriu sira hamoos tiha.",
    storageFull: "Estraun Labele: Memória disk nian la to'o. Ita-nia baze storage nakonu ona.",
    pipelineErr: "Erro pipeline estraun nian: ",
    failErr: "Estraun la konsege: ",
    termsTitle: "Termu sira ba Uza Softwér",
    termsBody: "Hodi opera openArchv, ita rekoñese katak dekompresa karga disk boot nian sei halo eskrita fail sistema lokál. Ita konkorda atu uza utilitáriu bináriu ne'e ho ita rasik nia konsiderasaun.",
    remember: "Hetan de'it eskolha iha mákina ne'e",
    confirmBtn: "Konfirma & Asesu Softwér",
    actionBtn: "Hili & Estrai Arkivu",
    processing: "Prosesu hela Operasaun...",
    dragHint: "...ka dada no hatoba ita-nia fail iha ne'e",
    openFolder: "Loke Pasta Estraída",
    supportBtn: "Suporta Dezenvolvimentu openArchv",
    supportedExt: "Estensaun sira-ne'ebé Suporta",
    settingsTitle: "Konfigurasaun App nian",
    settingLang: "Hili Lia-fuan",
    settingTheme: "Azentu Teatru Antarmuka",
    settingLinks: "Konteks Dezenvolvedór nian",
    donateLink: "Doa ba Dezenvolvedór",
    feedbackLink: "Submete Feedback / Bug",
    themeMono: "Mono Minimalista",
    themeBlue: "Azul Kmaan",
    themePink: "Cyber Pink"
  },
  es: {
    welcome: "Bienvenido a openArchv",
    engine: "Descomprimir archivos",
    nativeEngine: "Motor Universal Nativo",
    ready: "Listo para desempaquetar contenedores del sistema de forma nativa.",
    initializing: "Inicializando la matriz de diseño de descompresión...",
    decompressing: "Descomprimiendo la arquitectura del archivo de forma nativa...",
    success: "¡Archivo desempaquetado con éxito en su Acrylic carpeta!",
    canceled: "Extracción cancelada.",
    aborted: "Extracción abortada por el usuario. Componentes temporales eliminados.",
    storageFull: "Extracción fallida: espacio en disco insuficiente. El almacenamiento está lleno.",
    pipelineErr: "Error en el pipeline de extracción: ",
    failErr: "Extracción fallida: ",
    termsTitle: "Términos de Uso del Software",
    termsBody: "Al operar openArchv, usted reconoce que la descompresión de grandes cargas de disco realiza la escritura de archivos en el sistema local. Acepta usar esta utilidad binaria bajo su propia discreción.",
    remember: "Recordar elección en este equipo",
    confirmBtn: "Confirmar y Acceder al Software",
    actionBtn: "Seleccionar y Extraer Archivo",
    processing: "Procesando Operación...",
    dragHint: "...o arrastra y suelta tu archivo aquí",
    openFolder: "Abrir Carpeta Extraída",
    supportBtn: "Apoyar el Desarrollo de openArchv",
    supportedExt: "Extensiones Soportadas",
    settingsTitle: "Ajustes del Sistema",
    settingLang: "Selección de Idioma",
    settingTheme: "Tema de Acento de Interfaz",
    settingLinks: "Contexto del Desarrollador",
    donateLink: "Donar al Desarrollador",
    feedbackLink: "Enviar Comentarios o Errores",
    themeMono: "Mono Minimalista",
    themeBlue: "Azul Claro",
    themePink: "Cyber Pink"
  },
  fr: {
    welcome: "Bienvenue sur openArchv",
    engine: "Décompresser les fichiers",
    nativeEngine: "Moteur Universel Natif",
    ready: "Prêt à décompresser les conteneurs système nativement.",
    initializing: "Initialisation de la matrice de décompression...",
    decompressing: "Décompression native de l'architecture de l'archive...",
    success: "Archive décompressée avec succès dans son propre dossier !",
    canceled: "Extraction annulée.",
    aborted: "Extraction interrompue par l'utilisateur. Composants temporaires nettoyés.",
    storageFull: "Échec de l'extraction : Espace disque insuffisant. Votre stockage est plein.",
    pipelineErr: "Erreur du pipeline d'extraction : ",
    failErr: "Échec de l'extraction : ",
    termsTitle: "Conditions d'Utilisation du Logiciel",
    termsBody: "En utilisant openArchv, vous reconnaissez que la décompression de charges importantes effectue des écritures sur votre système local. Vous acceptez d'utiliser cet utilitaire binaire à votre seule détention.",
    remember: "Se souvenir du choix sur cette machine",
    confirmBtn: "Confirmer & Accéder au Logiciel",
    actionBtn: "Sélectionner & Extraer l'Archive",
    processing: "Opération en cours...",
    dragHint: "...ou glisser-déposer votre fichier ici",
    openFolder: "Ouvrir le Dossier Extrait",
    supportBtn: "Soutenir le Développement",
    supportedExt: "Extensions Supportées",
    settingsTitle: "Paramètres de l'Application",
    settingLang: "Choix de la Langue",
    settingTheme: "Thème d'Accentuation",
    settingLinks: "Liens Développeur",
    donateLink: "Faire un don au développeur",
    feedbackLink: "Envoyer un commentaire",
    themeMono: "Mono Minimaliste",
    themeBlue: "Bleu Clair",
    themePink: "Cyber Pink"
  },
  pt: {
    welcome: "Bem-vindo ao openArchv",
    engine: "Descompactar arquivos",
    nativeEngine: "Motor Universal Nativo",
    ready: "Pronto para descompactar containers do sistema nativamente.",
    initializing: "Inicializando matriz de layout de descompactação...",
    decompressing: "Descompactando arquitetura de arquivo nativamente...",
    success: "Arquivo descompactado com sucesso em sua própria pasta!",
    canceled: "Extração cancelada.",
    aborted: "Extração abortada pelo usuário. Componentes temporários apagados.",
    storageFull: "Falha na Extração: Espaço em disco insuficiente. Seu armazenamento está cheio.",
    pipelineErr: "Erro no pipeline de extração: ",
    failErr: "Extração falhou: ",
    termsTitle: "Termos de Uso do Software",
    termsBody: "Ao operar o openArchv, você reconhece que a descompactação de grandes cargas de dados executa a escrita de arquivos no sistema local. Você concorda em usar este utilitário binário por sua própria conta e risco.",
    remember: "Lembrar escolha nesta máquina",
    confirmBtn: "Confirmar & Acessar Software",
    actionBtn: "Selecionar & Extrair Arquivo",
    processing: "Processando Operação...",
    dragHint: "...ou arraste e solte seu arquivo aqui",
    openFolder: "Abrir Pasta Extraída",
    supportBtn: "Apoiar o Desenvolvimento do openArchv",
    supportedExt: "Extensões Suportadas",
    settingsTitle: "Configurações do App",
    settingLang: "Seleção de Idioma",
    settingTheme: "Tema de Acento da Interface",
    settingLinks: "Contexto do Desenvolvedor",
    donateLink: "Doar para o Desenvolvedor",
    feedbackLink: "Enviar Feedback / Erros",
    themeMono: "Mono Minimalista",
    themeBlue: "Azul Claro",
    themePink: "Cyber Pink"
  },
  de: {
    welcome: "Willkommen bei openArchv",
    engine: "Dateien entpacken",
    nativeEngine: "Native Universal Engine",
    ready: "Bereit, Systemcontainer nativ zu entpacken.",
    initializing: "Dekomprimierungslayout-Matrix wird initialisiert...",
    decompressing: "Archivarchitektur wird nativ entpackt...",
    success: "Archiv erfolgreich in eigenen Ordner entpackt!",
    canceled: "Entpacken abgebrochen.",
    aborted: "Entpacken durch Benutzer abgebrochen. Temporäre Dateien gelöscht.",
    storageFull: "Entpacken fehlgeschlagen: Unzureichender Speicherplatz. Festplatte voll.",
    pipelineErr: "Fehler in der Entpackungspipeline: ",
    failErr: "Entpacken fehlgeschlagen: ",
    termsTitle: "Nutzungsbedingungen der Software",
    termsBody: "Mit dem Betrieb von openArchv erkennen Sie an, dass das Entpacken großer Datenmengen lokale Systemdateien schreibt. Sie stimmen zu, dieses Binärprogramm nach eigenem Ermessen zu nutzen.",
    remember: "Auswahl auf diesem Computer merken",
    confirmBtn: "Bestätigen & Software aufrufen",
    actionBtn: "Archiv auswählen & entpacken",
    processing: "Operation wird verarbeitet...",
    dragHint: "...oder ziehen Sie Ihre Datei hierher",
    openFolder: "Entpackten Ordner öffnen",
    supportBtn: "openArchv-Entwicklung unterstützen",
    supportedExt: "Unterstützte Erweiterungen",
    settingsTitle: "Anwendungseinstellungen",
    settingLang: "Sprachauswahl",
    settingTheme: "Oberflächen-Farbe",
    settingLinks: "Entwickler-Kontext",
    donateLink: "Dem Entwickler spenden",
    feedbackLink: "Feedback oder Fehler senden",
    themeMono: "Minimales Mono",
    themeBlue: "Hellblau",
    themePink: "Cyber Pink"
  }
};

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [splashProgress, setSplashProgress] = useState(0);
  const [progress, setProgress] = useState(0); 
  const [isExtracting, setIsExtracting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [extractedPath, setExtractedPath] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // 📜 Terms of Use State Variables
  const [hasConfirmedTerms, setHasConfirmedTerms] = useState(false);
  const [rememberTermsChoice, setRememberTermsChoice] = useState(false);

  // 🌍 Configurable Dynamic Language State
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('app_lang') || 'en';
  });

  // 🎨 Configurable Accent Color Themes State
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app_theme') || 'mono';
  });

  // Dynamic dynamic status message tracker key mapping
  const [statusKey, setStatusKey] = useState('ready');
  const [statusType, setStatusType] = useState('info');
  const [customStatusError, setCustomStatusError] = useState('');

  // ⏱️ 3-Second Application Boot Splash Loader Logic
  useEffect(() => {
    const duration = 3000;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      const nextProgress = Math.min((currentStep / steps) * 100, 100);
      setSplashProgress(nextProgress);

      if (currentStep >= steps) {
        clearInterval(timer);
        setTimeout(() => setShowSplash(false), 200);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  // 🔒 HARDENING LAYER: Block Right-Click Context Menu and App Reloading Shortcuts
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

  // Sync Preferences to Storage
  useEffect(() => {
    localStorage.setItem('app_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('app_theme', theme);
  }, [theme]);

  // ✨ Check for remembered Terms of Use consent configuration on initialization
  useEffect(() => {
    const consentPassed = localStorage.getItem('terms_consent_granted');
    if (consentPassed === 'true') {
      setHasConfirmedTerms(true);
    }
  }, []);

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
  }, []); // Empty array lets hook safely stay persistent without language-reloading trace bugs!

  const handleAcceptTerms = () => {
    if (rememberTermsChoice) {
      localStorage.setItem('terms_consent_granted', 'true');
    }
    setHasConfirmedTerms(true);
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
        setCustomStatusError("Failed to open path.");
      }
    }
  };

  const handleExternalLink = async (url) => {
    try {
      await invoke('open_browser', { url });
    } catch (err) {
      console.error("Could not open external context map.");
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
          <div className={`absolute inset-0 border-2 border-transparent ${theme === 'pink' ? 'border-t-pink-500' : theme === 'lightblue' ? 'border-t-blue-400' : 'border-t-zinc-200'} rounded-full animate-spin`}></div>
        </div>
      ) : (
        <Info size={15} className="text-zinc-500" />
      )
    };
  };

  // Resolve current reactive local copy state strings cleanly
  const t = LANGUAGES[lang] || LANGUAGES.en;
  const activeStatus = getStatusClasses();
  
  // Resolve localized messages error payloads safely
  let activeStatusMessage = t[statusKey] || t.ready;
  if (statusKey === 'failErr' || statusKey === 'pipelineErr') {
    activeStatusMessage = `${t[statusKey]}${customStatusError}`;
  }

  // 🎨 Color Palette Maps for Accents
  const themeClasses = {
    mono: {
      bg: "bg-black text-white",
      border: "border-zinc-900",
      accentText: "text-zinc-200 group-hover:text-white",
      button: "bg-zinc-900 text-white border-zinc-800 hover:bg-zinc-800",
      accentItem: "border-zinc-800 text-zinc-400 bg-zinc-950/50",
      activeTab: "bg-zinc-900 text-white border-zinc-700",
      inputAccent: "accent-white",
      dragActive: "border-zinc-400 bg-zinc-900/30",
      loadingBar: "bg-zinc-200"
    },
    lightblue: {
      bg: "bg-slate-950 text-slate-100",
      border: "border-slate-900",
      accentText: "text-blue-400 group-hover:text-blue-300",
      button: "bg-blue-600 text-white border-blue-500 hover:bg-blue-500 shadow-blue-900/20",
      accentItem: "border-slate-900 text-slate-400 bg-slate-900/50",
      activeTab: "bg-blue-950 text-blue-400 border-blue-800",
      inputAccent: "accent-blue-500",
      dragActive: "border-blue-400 bg-blue-950/30",
      loadingBar: "bg-blue-400"
    },
    pink: {
      bg: "bg-zinc-950 text-zinc-100",
      border: "border-pink-950/30",
      accentText: "text-pink-500 group-hover:text-pink-400",
      button: "bg-pink-600 text-white border-pink-500 hover:bg-pink-500 shadow-pink-900/20",
      accentItem: "border-neutral-900 text-zinc-400 bg-neutral-900/30",
      activeTab: "bg-pink-950 text-pink-400 border-pink-900",
      inputAccent: "accent-pink-500",
      dragActive: "border-pink-500 bg-pink-950/20",
      loadingBar: "bg-pink-500"
    }
  }[theme];

  // 🚀 RENDER SPLASH SCENARIO
  if (showSplash) {
    return (
      <div className={`absolute top-0 left-0 w-screen h-screen flex flex-col items-center justify-center ${themeClasses.bg} select-none pointer-events-none transition-all duration-300`}>
        <div className="flex flex-col items-center max-w-[260px] w-full text-center animate-fade-in">
          <img 
            src={appLogo} 
            alt="openArchv Logo" 
            className="w-20 h-20 mb-4 object-contain animate-pulse rounded-2xl" 
          />
          <h1 className="text-xl font-bold tracking-tight">{t.welcome}</h1>
          <p className="text-[10px] font-bold tracking-wider uppercase text-zinc-500 mt-1">{t.nativeEngine}</p>
          <div className="w-full h-1 bg-zinc-900/60 rounded-full overflow-hidden mt-6">
            <div className={`h-full ${themeClasses.loadingBar} transition-all duration-300 ease-out rounded-full`} style={{ width: `${splashProgress}%` }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`absolute top-0 left-0 w-screen h-screen px-8 py-10 font-sans select-none transition-all duration-300 flex flex-col justify-between ${themeClasses.bg} animate-fade-in`}>
      
      {/* 🔝 TOP NAVIGATION HEADER */}
      <header className={`flex justify-between items-center w-full max-w-4xl mx-auto border-b ${themeClasses.border} pb-5`}>
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <img src={appLogo} alt="Logo" className="w-6 h-6 object-contain rounded-md" />
          <span className="text-lg font-bold tracking-tight transition-colors duration-200">openArchv</span>
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

      {/* 🎛️ CENTER STAGE MAIN SYSTEM CONSOLE */}
      <div className="flex justify-center w-full my-auto py-4">
        <main className="w-full max-w-[380px] transition-all duration-300">
          
          {!hasConfirmedTerms ? (
            <div className={`p-6 border ${themeClasses.border} bg-neutral-900/20 rounded-xl shadow-sm text-center animate-fade-in`}>
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
                  className={`w-3.5 h-3.5 ${themeClasses.inputAccent} cursor-pointer rounded border-zinc-800 bg-black`}
                />
                <label htmlFor="rememberChoice" className="text-[11px] font-semibold text-zinc-500 cursor-pointer select-none">
                  {t.remember}
                </label>
              </div>

              <button onClick={handleAcceptTerms} className={`w-full py-2.5 text-xs font-semibold rounded-xl border transition-all duration-200 shadow-sm ${themeClasses.button}`}>
                {t.confirmBtn}
              </button>
            </div>
          ) : (
            <>
              {/* Dynamic Reactive Translation Status Header Layer */}
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
                <div className={`p-6 mb-5 border ${themeClasses.border} bg-neutral-900/10 flex flex-col items-center justify-center text-center shadow-sm rounded-xl`}>
                  <div className="relative flex items-center justify-center w-16 h-16 mb-4">
                    <div className="absolute w-full h-full rounded-full border border-zinc-800 animate-ping opacity-25"></div>
                    <div className="absolute w-12 h-12 rounded-full border border-dashed border-zinc-800 animate-[spin_4s_linear_infinite]"></div>
                    <div className={`absolute w-10 h-10 rounded-full border-2 border-transparent ${themeClasses.loadingBar} animate-spin`}></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  </div>

                  <div className="w-full max-w-[240px] mb-4">
                    <div className="flex justify-between mb-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      <span>Decompressing</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                      <div className={`h-full ${themeClasses.loadingBar} transition-all duration-150 ease-out`} style={{ width: `${progress}%` }}></div>
                    </div>
                  </div>

                  <button onClick={handleCancel} className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-red-600 border border-red-950 hover:bg-red-950/30 rounded-lg transition-all duration-150">
                    <XCircle size={12} /> Cancel Operation
                  </button>
                </div>
              )}

              <div 
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`w-full p-6 text-center flex flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all duration-200 ${
                  isDragging ? themeClasses.dragActive : `${themeClasses.border} bg-transparent hover:border-zinc-800`
                }`}
              >
                {/* 🔒 FIXED: Text uses explicit dynamic token matrix mapping context */}
                <button onClick={handleExtract} disabled={isExtracting} className={`w-full py-3 text-xs font-semibold rounded-xl border transition-all duration-200 ${isExtracting ? 'bg-zinc-900/50 border-zinc-900 text-zinc-600 cursor-not-allowed' : themeClasses.button}`}>
                  {isExtracting ? t.processing : t.actionBtn}
                </button>

                {/* 🔒 FIXED: Text maps cleanly to lang preference array parameters */}
                {!isExtracting && <p className="mt-3 text-[11px] font-medium text-zinc-500 transition-colors">{t.dragHint}</p>}

                {/* 🔒 FIXED: Text remains accurate to active translations forever */}
                {extractedPath && !isExtracting && (
                  <button onClick={openTargetFolder} className="w-full mt-3 py-3 text-xs font-semibold rounded-xl border border-zinc-800 text-zinc-300 bg-zinc-950/40 hover:bg-zinc-900 flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200">
                    <ExternalLink size={14} /> {t.openFolder}
                  </button>
                )}
              </div>

              {/* 🔒 FIXED: Link anchor node tracks dynamically */}
              <button onClick={() => handleExternalLink(DONATION_URL)} className="mt-4 text-[11px] font-bold tracking-wide text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5 mx-auto">
                <Heart size={12} className="text-zinc-500 hover:scale-110 transition-transform" /> {t.supportBtn}
              </button>

              <div className="mt-6 pt-5 border-t border-zinc-900">
                <div className={`flex flex-col gap-2 p-3.5 rounded-xl ${themeClasses.accentItem} border shadow-sm`}>
                  {/* 🔒 FIXED: Header metrics match active user locale configuration */}
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                    <Layers size={13} />
                    <span>{t.supportedExt}</span>
                  </div>
                  <div className="grid grid-cols-4 gap-1.5 text-center text-[10px] font-bold tracking-wide">
                    {['.ZIP', '.7Z', '.RAR', '.TAR', '.GZ', '.BZ2', '.XZ'].map(ext => (
                      <span key={ext} className="px-1.5 py-1 rounded bg-zinc-900/60 text-zinc-400">{ext}</span>
                    ))}
                    <span className="px-1.5 py-1 rounded bg-zinc-900/20 text-zinc-600 font-medium">NATIVE</span>
                  </div>
                </div>
              </div>
            </>
          )}

        </main>
      </div>

      {/* ⚙️ SIDEBAR SETTINGS NAVIGATION FRAMEWORK LAYER */}
      {sidebarOpen && (
        <div className="fixed inset-0 w-screen h-screen z-50 flex justify-end animate-fade-in">
          <div onClick={() => setSidebarOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
          
          <div className={`relative w-full max-w-[320px] h-full border-l p-6 flex flex-col justify-between ${themeClasses.bg === 'bg-black text-white' ? 'bg-zinc-950 border-zinc-900' : `${themeClasses.bg} ${themeClasses.border}`}`}>
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

              {/* Setting Element 1: Multi Language Selector */}
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

              {/* Setting Element 2: Tri Theme Selector Layout */}
              <div className="mb-6">
                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wide uppercase text-zinc-500 mb-2.5">
                  <Layers size={13} />
                  <span>{t.settingTheme}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {[
                    { id: 'mono', label: t.themeMono, color: 'bg-zinc-400' },
                    { id: 'lightblue', label: t.themeBlue, color: 'bg-blue-400' },
                    { id: 'pink', label: t.themePink, color: 'bg-pink-500' }
                  ].map(tItem => (
                    <button
                      key={tItem.id}
                      onClick={() => setTheme(tItem.id)}
                      className={`w-full p-3 rounded-xl border text-left text-xs font-semibold flex items-center justify-between transition-all duration-150 ${
                        theme === tItem.id ? themeClasses.activeTab : 'bg-zinc-900/40 border-zinc-900 text-zinc-400 hover:border-zinc-800'
                      }`}
                    >
                      <span>{tItem.label}</span>
                      <span className={`w-2.5 h-2.5 rounded-full ${tItem.color}`} />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Setting Element 3: Context Developer Target Hub Actions */}
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

      {/* ⬇️ ACCESSIBLE SYSTEM FOOTER */}
      <footer className={`w-full text-center max-w-4xl mx-auto border-t ${themeClasses.border} pt-4`}>
        <p className="text-[10px] tracking-wider text-zinc-500 font-bold">
          &copy; {new Date().getFullYear()} openArc hv &bull; Designed by Helder Lagrisola
        </p>
      </footer>
    </div>
  );
}

export default App;