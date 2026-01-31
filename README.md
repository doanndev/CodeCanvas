<div align="center">
  <img width="1200" height="475" alt="CodeCanvas banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CodeCanvas

A small, beautiful utility for creating and exporting screenshot-style images of source code. Built with React + Vite, Monaco Editor, and Tailwind CSS. This repo contains the app source and a simple dev setup so you can run, modify, and deploy locally.

## Features
- Edit code in a Monaco-based editor with syntax highlighting
- Export the editor area as a PNG image (uses html-to-image)
- Upload a source file to replace editor contents and auto-detect language
- Editable filename shown in the editor window — updates extension when language changes unless customized
- Theme presets that update the editor background and contrast
- Non-blocking toasts for user feedback (copy/export errors, success messages)

## Quick start (run locally)

Requirements: Node.js (16+ recommended)

1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

Open http://localhost:5173 (or the port Vite prints) in your browser.

## Project structure (important files)
- `App.tsx` — main app layout, toolbar, export logic, toast wiring
- `components/CodeWindow.tsx` — Monaco editor wrapper and editable filename
- `components/Toolbar.tsx` — language/theme dropdowns and export/copy actions
- `components/Toast.tsx` — toast UI
- `constants.tsx` — language/theme/background presets
- `icon.svg` — project icon (used as header logo and favicon)

## Favicon / branding
The app includes `icon.svg` at the repo root and `index.html` references it with `<link rel="icon" href="/icon.svg" type="image/svg+xml">`. If you want broader compatibility (older browsers), add a PNG/ICO and include appropriate `<link>` tags.

## Notes for contributors
- Monaco needs an explicit height (or parent height) to render correctly. The editor in this project uses a fixed height and scrollbars to ensure reliable exports.
- The theme implementation sets editor background/foreground using Monaco's theme API. Token colors are inherited from the base theme; to implement exact theme palettes, register token color rules in `CodeWindow.tsx`.

## Troubleshooting
- If the editor appears blank or extremely short: ensure the editor has an explicit height or its parent allows it to expand. See `CodeWindow.tsx` and the container styles in `App.tsx`.
- Export fails in some browsers: html-to-image can be sensitive to cross-origin images. Avoid external images inside the export area or ensure proper CORS headers.

## Contributing
Feel free to open issues or PRs. Small improvements that help the UX are welcome: better theme palettes, export presets, or favicon export variants.

## License
MIT
