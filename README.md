# 🖋️ Font Previewer

A Vue 3 + Vite application that allows designers to preview fonts hosted on a CDN in real-time. Features include style customization, contrast checking, category filtering, side-by-side comparison, and Style Dictionary token export.

---

## 🚀 Features

- 📚 Live font previews from CDN
- 🎨 Adjustable typography controls (size, weight, spacing, colors)
- 🌓 Light/Dark mode toggle
- 📱 Mobile mode preview
- 🧩 Modular component architecture
- 🏷️ Font category and tag filtering
- 🧠 Lazy-load and virtualized font list rendering
- 🌗 Contrast ratio analysis (WCAG AA/AAA)
- 📦 Style Dictionary token export
- 📋 Copy CDN path + direct font downloads
- ⭐ Favorite fonts + 👥 Compare up to 3 fonts
- 🛠 Fully responsive UI

---

## 🛠️ Project Setup

```bash
npm install
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Build for Production

```bash
npm run build
```

The compiled static files will be in the `dist/` folder.

---

## 🧩 Project Structure

```
font-previewer/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── App.vue
│   ├── main.js
│   ├── style.css
│   ├── assets/
│   │   └── fonts.json
│   └── components/
│       ├── FontPreviewer.vue
│       ├── FontCard.vue
│       ├── FontControls.vue
│       ├── ComparisonView.vue
│       ├── TokenExport.vue
│       └── useFontLoader.js
```

---

## 📤 Exporting Font Tokens

Use the **Token Export** panel to export heading, body, and UI font tokens in [Style Dictionary](https://amzn.github.io/style-dictionary/) format. Output is automatically downloaded as `style-dictionary.tokens.json`.

---

## 📋 Font Data Example (`fonts.json`)

```json
[
  {
    "name": "Roboto Mono",
    "url": "https://your-cdn.com/fonts/roboto-mono.woff2",
    "tags": ["monospace"],
    "supports": ["latin"],
    "weights": ["400", "700"]
  }
]
```

---

## 🌐 Deployment

This is a static site. Deploy `dist/` to Netlify, Vercel, GitHub Pages, or any static host.

---

## 📄 License

MIT License — Exsurgo Strong & Fit / Leonardo Design Studio
