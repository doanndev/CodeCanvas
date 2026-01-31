
export type Language = 'javascript' | 'typescript' | 'python' | 'rust' | 'html' | 'css' | 'go' | 'cpp' | 'json';

export type Theme = 'night-owl' | 'one-dark' | 'dracula' | 'nord';

export interface EditorState {
  code: string;
  language: Language;
  theme: Theme;
  padding: number;
  background: string;
  showLineNumbers: boolean;
  fontSize: number;
  filename: string;
}
