
import React, { useState, useRef, useEffect } from 'react';
import { LANGUAGES, THEMES } from '../constants';
import { EditorState, Language, Theme } from '../types';

interface DropdownProps<T> {
  label: string;
  icon: string;
  value: T;
  options: { id: string; label: string }[];
  onChange: (value: T) => void;
}

const CustomDropdown = <T extends string>({ label, icon, value, options, onChange }: DropdownProps<T>) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.id === value);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 rounded-lg px-3 py-1.5 border border-slate-200 dark:border-zinc-700 hover:border-primary transition-colors min-w-[140px] text-left"
      >
        <span className="material-icons-outlined text-sm opacity-60">{icon}</span>
        <span className="text-sm font-medium flex-1 truncate">{selectedOption?.label || label}</span>
        <span className={`material-icons-outlined text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>expand_more</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full min-w-[180px] bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-xl shadow-2xl z-[100] py-1 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.id}
                onClick={() => {
                  onChange(option.id as T);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center justify-between ${
                  value === option.id 
                    ? 'bg-primary/10 text-primary font-bold' 
                    : 'hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300'
                }`}
              >
                {option.label}
                {value === option.id && <span className="material-icons-outlined text-xs">check</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

interface ToolbarProps {
  state: EditorState;
  setState: React.Dispatch<React.SetStateAction<EditorState>>;
  onExport: () => void;
  isExporting: boolean;
  onCopyCode: () => void;
}

const Toolbar: React.FC<ToolbarProps> = ({ state, setState, onExport, isExporting, onCopyCode }) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-4 border-b border-slate-100 dark:border-zinc-800">
      <CustomDropdown
        label="Language"
        icon="language"
        value={state.language}
        options={LANGUAGES}
        onChange={(val) => setState(prev => ({ ...prev, language: val as Language }))}
      />

      <CustomDropdown
        label="Theme"
        icon="palette"
        value={state.theme}
        options={THEMES}
        onChange={(val) => setState(prev => ({ ...prev, theme: val as Theme }))}
      />

      <div className="w-px h-6 bg-slate-200 dark:bg-zinc-700 mx-1"></div>

      <button 
        onClick={() => setState(prev => ({ ...prev, showLineNumbers: !prev.showLineNumbers }))}
        className={`p-2 rounded-lg transition-colors ${state.showLineNumbers ? 'bg-primary text-black' : 'hover:bg-slate-100 dark:hover:bg-zinc-800'}`}
        title="Toggle Line Numbers"
      >
        <span className="material-icons-outlined text-xl">format_list_numbered</span>
      </button>

      <button 
        onClick={onCopyCode}
        className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        title="Copy Code to Clipboard"
      >
        <span className="material-icons-outlined text-xl">content_copy</span>
      </button>

      <div className="ml-auto flex items-center gap-2">
        <div className="hidden md:flex items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">Pro</span>
        </div>
        <button 
          onClick={onExport}
          disabled={isExporting || !state.code.trim()}
          className={`flex items-center gap-2 px-6 py-2 bg-primary text-black font-bold rounded-lg transition-all ${
            (isExporting || !state.code.trim()) ? 'opacity-50 cursor-not-allowed scale-95' : 'hover:scale-105 active:scale-95 shadow-lg shadow-primary/20'
          }`}
        >
          {isExporting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4 text-black" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Rendering...
            </span>
          ) : (
            <>
              <span>Export</span>
              <span className="material-icons-outlined text-sm">download</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;
