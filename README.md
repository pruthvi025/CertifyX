# CertifyX — Bulk Certificate Generator

> Generate hundreds of personalized certificates in seconds, entirely in your browser.

## Features

- 🖼️ Upload any PNG/JPG certificate template
- 📊 Import Excel (.xlsx, .xls) or CSV data files
- 🔗 Flexible field mapping — place any column anywhere on the cert
- 🎨 Font family, size, color, and alignment controls
- 👁️ Live preview before generating
- 📦 Bulk ZIP download — named by your chosen column
- 🔒 100% private — no server uploads, runs entirely in your browser

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
certifyX/
├── index.html          # Main HTML entry point
├── vite.config.js      # Vite configuration
├── package.json
├── public/
│   └── favicon.svg
└── src/
    ├── main.js         # All JavaScript logic
    └── style.css       # All styles
```

## How It Works

1. **Upload** your certificate image template (PNG or JPG)
2. **Upload** your Excel/CSV file with recipient data
3. **Map** Excel columns to text fields on the certificate
4. **Configure** font, size, color, and position
5. **Generate** — download a ZIP of all certificates

## Tech Stack

- Vite (build tool & dev server)
- Vanilla JS + HTML Canvas API
- [SheetJS (xlsx)](https://sheetjs.com/) — Excel/CSV parsing
- [JSZip](https://stuk.github.io/jszip/) — ZIP generation
- [FileSaver.js](https://github.com/eligrey/FileSaver.js/) — file download

## Author

**Pruthviraj Thorbole** — Built for course coordinator demonstration.

## License

MIT
