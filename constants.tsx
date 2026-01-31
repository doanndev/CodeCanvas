
import React from 'react';

export const LANGUAGES = [
  { id: 'javascript', label: 'JavaScript' },
  { id: 'typescript', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'rust', label: 'Rust' },
  { id: 'html', label: 'HTML/CSS' },
  { id: 'cpp', label: 'C++' },
  { id: 'go', label: 'Go' },
  { id: 'json', label: 'JSON' },
];

export const THEMES = [
  { id: 'night-owl', label: 'Night Owl', color: '#011627' },
  { id: 'one-dark', label: 'One Dark', color: '#282c34' },
  { id: 'dracula', label: 'Dracula', color: '#282a36' },
  { id: 'nord', label: 'Nord', color: '#2e3440' },
];

export const BACKGROUNDS = [
  'linear-gradient(135deg, #71717a 0%, #3f3f46 100%)',
  'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)',
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #C0FF00 0%, #22c55e 100%)',
  'linear-gradient(to right, #833ab4, #fd1d1d, #fcb045)',
  'linear-gradient(to right, #00c6ff, #0072ff)',
  'linear-gradient(to right, #f8ff00, #3ad59f)',
];

export const INITIAL_CODE = `const pluckDeep = key => obj => key.split('.').reduce((acc, k) => acc[k], obj)

const compose = (...fns) => res => fns.reduceRight((acc, f) => f(acc), res)

// Create something beautiful...`;
