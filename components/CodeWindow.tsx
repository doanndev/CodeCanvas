
import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import { EditorState } from '../types';
import { THEMES } from '../constants';

interface CodeWindowProps {
  state: EditorState;
  onChange: (value: string | undefined) => void;
  onRename?: (name: string) => void;
}

const CodeWindow: React.FC<CodeWindowProps> = ({ state, onChange, onRename }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    // define and set initial theme
    applyMonacoTheme(monaco, state.theme);
  };

  const hexToLuminance = (hex: string) => {
    // remove # if present
    const h = hex.replace('#', '').trim();
    const bigint = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    // relative luminance
    const srgb = [r, g, b].map((v) => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
  };

  const applyMonacoTheme = (monaco: any, themeId: string) => {
    try {
      const themeObj = THEMES.find(t => t.id === themeId) || THEMES[0];
      const bg = themeObj.color || '#151515';
      const luminance = hexToLuminance(bg || '#000000');
      const foreground = luminance > 0.5 ? '#000000' : '#ffffff';
      const customName = `custom-${themeId}`;
      monaco.editor.defineTheme(customName, {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': bg,
          'editor.foreground': foreground,
          'editorLineNumber.foreground': foreground + '99'
        }
      });
      monaco.editor.setTheme(customName);
    } catch (e) {
      // ignore monaco errors in SSR or if monaco not available
      // console.warn('Could not apply monaco theme', e);
    }
  };

  // Map our themes to Monaco-compatible names or define them
  const monacoTheme = `custom-${state.theme}`;

  useEffect(() => {
    if (monacoRef.current) applyMonacoTheme(monacoRef.current, state.theme);
  }, [state.theme]);

  return (
    <div 
      id="code-export-target"
      className="relative z-10 w-full max-w-3xl rounded-xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 overflow-hidden transform transition-all duration-300"
      style={{ backgroundColor: (THEMES.find(t => t.id === state.theme)?.color) || '#151515' }}
    >
      {/* MacOS Style Buttons */}
      <div className="flex items-center gap-2 px-4 py-4 bg-black/30">
        <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F56] shadow-inner"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-[#FFBD2E] shadow-inner"></div>
        <div className="w-3.5 h-3.5 rounded-full bg-[#27C93F] shadow-inner"></div>
        <div className="ml-4 text-xs font-mono truncate max-w-[40%]">
          <input
            aria-label="filename"
            value={state.filename}
            onChange={(e) => onRename?.(e.target.value)}
            className={`bg-transparent border-none placeholder-white/20 focus:outline-none w-full text-xs font-mono truncate ${
              hexToLuminance((THEMES.find(t => t.id === state.theme)?.color) || '#000000') > 0.5 ? 'text-black/70' : 'text-white/80'
            }`}
          />
        </div>
      </div>

      <div className="py-6">
        <Editor
          height="420px"
          language={state.language}
          value={state.code}
          theme={monacoTheme}
          onMount={handleEditorDidMount}
          onChange={onChange}
          options={{
            fontSize: state.fontSize,
            fontFamily: 'Fira Code, monospace',
            lineNumbers: state.showLineNumbers ? 'on' : 'off',
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            padding: { top: 0, bottom: 0 },
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto'
            },
            overviewRulerBorder: false,
            renderLineHighlight: 'none',
            hideCursorInOverviewRuler: true,
            contextmenu: false,
            readOnly: false,
            domReadOnly: false,
            wordWrap: 'on'
          }}
          className="monaco-editor-container"
        />
      </div>
    </div>
  );
};

export default CodeWindow;
