
import React, { useState, useCallback, useRef, useEffect } from 'react';
import * as htmlToImage from 'html-to-image';
import Toolbar from './components/Toolbar';
import CodeWindow from './components/CodeWindow';
import Toast from './components/Toast';
import { EditorState } from './types';
import { BACKGROUNDS, INITIAL_CODE } from './constants';

const App: React.FC = () => {
  const [state, setState] = useState<EditorState>({
    code: INITIAL_CODE,
    language: 'javascript',
    theme: 'night-owl',
    padding: 64,
    background: BACKGROUNDS[0],
    showLineNumbers: false,
    fontSize: 14,
    filename: 'javascript.js',
  });

  const [isExporting, setIsExporting] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type?: 'success' | 'error' | 'info' }>>([]);

  // keep filename extension in sync when the language changes only if the user hasn't customized it
  const prevLangRef = useRef(state.language);
  useEffect(() => {
    const prevLang = prevLangRef.current;
    if (prevLang === state.language) return;

    const extMap: Record<string, string> = {
      javascript: 'js',
      typescript: 'ts',
      python: 'py',
      rust: 'rs',
      html: 'html',
      css: 'css',
      go: 'go',
      cpp: 'cpp',
      json: 'json'
    };

    const prevExt = extMap[prevLang] || '';
    const newExt = extMap[state.language] || '';

    setState(prev => {
      // if user kept default filename like `${prevLang}.${prevExt}` or filename ends with the old extension,
      // update the extension to the new one. Otherwise leave filename unchanged.
      if (!prev.filename) return prev;
      if ((prev.filename === `${prevLang}.${prevExt}`) || prev.filename.endsWith(`.${prevExt}`)) {
        return { ...prev, filename: prev.filename.replace(new RegExp(`\.${prevExt}$`), `.${newExt}`) };
      }
      return prev;
    });

    prevLangRef.current = state.language;
  }, [state.language]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    // auto-dismiss
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleCodeChange = useCallback((value: string | undefined) => {
    if (value !== undefined) {
      setState(prev => ({ ...prev, code: value }));
    }
  }, []);

  const rotateBackground = () => {
    const currentIndex = BACKGROUNDS.indexOf(state.background);
    const nextIndex = (currentIndex + 1) % BACKGROUNDS.length;
    setState(prev => ({ ...prev, background: BACKGROUNDS[nextIndex] }));
  };

  const handleExport = async () => {
    if (!containerRef.current) return;
    
    setIsExporting(true);
    try {
      await new Promise(r => setTimeout(r, 100));

      const dataUrl = await htmlToImage.toPng(containerRef.current, {
        pixelRatio: 3,
        quality: 1,
        style: {
          borderRadius: '0px',
        }
      });

      const link = document.createElement('a');
      link.download = `code-canvas-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (error) {
      console.error('Failed to export image:', error);
      showToast('Failed to generate image. Please try again.', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(state.code)
      .then(() => showToast('Code copied to clipboard!', 'success'))
      .catch(() => showToast('Failed to copy to clipboard', 'error'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const extension = file.name.split('.').pop()?.toLowerCase();
      
      let lang: any = 'javascript';
      if (extension === 'ts' || extension === 'tsx') lang = 'typescript';
      else if (extension === 'py') lang = 'python';
      else if (extension === 'rs') lang = 'rust';
      else if (extension === 'html' || extension === 'css') lang = 'html';
      else if (extension === 'cpp' || extension === 'h') lang = 'cpp';
      else if (extension === 'go') lang = 'go';
      else if (extension === 'json') lang = 'json';

      setState(prev => ({
        ...prev,
        code: content,
        language: lang
      }));
    };
    reader.readAsText(file);
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4">
      {/* Header */}
      <header className="w-full max-w-6xl flex justify-between items-center mb-16">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:rotate-12 overflow-hidden">
            <img src="/icon.svg" alt="CodeCanvas" className="w-6 h-6 block" />
          </div>
          <span className="text-2xl font-bold tracking-tight">CodeCanvas</span>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors"
          >
            <span className="material-icons-outlined">
              {isDarkMode ? 'light_mode' : 'dark_mode'}
            </span>
          </button>
          <a className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-zinc-700 rounded-lg hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all text-sm font-medium" href="#">
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.382 1.235-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.839 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"></path>
            </svg>
            Sign in
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-5xl flex flex-col items-center">
        <div className="text-center mb-12">
          <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary to-green-400 select-none animate-gradient-x">
            CodeCanvas
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-light">
            Create and share beautiful images of your source code.
            Start typing or <label className="text-primary cursor-pointer hover:underline">drop a file<input type="file" className="hidden" onChange={handleFileUpload}/></label> to get started.
          </p>
        </div>

        {/* Editor Container */}
        <div className="w-full bg-white dark:bg-card-dark rounded-2xl border border-slate-200 dark:border-zinc-800 p-2 shadow-2xl transition-all duration-500 overflow-hidden">
          <Toolbar 
            state={state} 
            setState={setState} 
            onExport={handleExport} 
            isExporting={isExporting}
            onCopyCode={copyToClipboard}
          />
          
          <div 
            ref={containerRef}
            className="relative bg-slate-200 dark:bg-zinc-900 rounded-xl mt-2 overflow-hidden p-12 transition-all duration-500 group min-h-[360px] md:min-h-[520px]"
            style={{ 
              background: state.background,
              padding: `${state.padding}px`
            }}
          >
            <div 
              className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity"
              title="Click to change background"
            >
              <button 
                onClick={rotateBackground}
                className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <span className="material-icons-outlined text-lg">autorenew</span>
              </button>
            </div>

            <CodeWindow
              state={state}
              onChange={handleCodeChange}
              onRename={(name: string) => setState(prev => ({ ...prev, filename: name }))}
            />
          </div>
        </div>

        {/* Improved & Larger Sponsor Section */}
        <div className="mt-20 w-full max-w-2xl flex flex-col md:flex-row items-center gap-8 p-10 bg-white dark:bg-zinc-900 border-2 border-slate-200 dark:border-zinc-800 rounded-2xl hover:border-primary/50 transition-all cursor-pointer group shadow-xl">
          <div className="w-24 h-24 bg-slate-100 dark:bg-zinc-800 rounded-xl flex-shrink-0 flex items-center justify-center overflow-hidden border border-slate-200 dark:border-zinc-700 transition-transform group-hover:scale-105">
            <img 
              alt="Sponsor Logo" 
              className="w-full h-full object-cover" 
              src="https://picsum.photos/id/20/400/400"
            />
          </div>
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-widest font-black">Sponsored</span>
            </div>
            <h3 className="text-lg font-bold mb-2 dark:text-white">Build high-performance websites</h3>
            <p className="text-slate-600 dark:text-zinc-400 leading-relaxed">
              Accelerate your development cycle with our new enterprise-grade SDK. Seamlessly integrate your codebases and ship faster than ever.
            </p>
          </div>
        </div>

        <footer className="mt-24 flex flex-col items-center gap-6 pb-12 w-full">
          <nav className="flex flex-wrap justify-center gap-10 text-sm font-medium text-slate-500 dark:text-zinc-400">
            <a className="hover:text-primary transition-colors" href="#">About</a>
            <a className="hover:text-primary transition-colors" href="#">Source</a>
            <a className="hover:text-primary transition-colors" href="#">Terms</a>
            <a className="hover:text-primary transition-colors" href="#">Privacy</a>
            <a className="hover:text-primary transition-colors" href="#">Contact</a>
          </nav>
          <div className="flex items-center gap-2 text-sm text-slate-400 dark:text-zinc-500">
            <span>Created by</span>
            <a className="text-slate-900 dark:text-white font-bold hover:underline" href="#">@doanndev</a>
            <span>¬</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 px-3 py-1 rounded-full">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">Powered by Derkal</span>
          </div>
        </footer>
      </main>

  <Toast toasts={toasts} onRemove={removeToast} />

  <style>{`
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-move 10s ease infinite;
        }
        @keyframes gradient-move {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(0,0,0,0.1);
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.1);
        }
      `}</style>
    </div>
  );
};

export default App;
