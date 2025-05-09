# Smarty Ecommie

A desktop e-commerce application built with Electron.

## 🚀 Features

- Simple Electron-based UI
- Modular structure with `main.js`, `preload.js`, and `renderer.js`
- Styled with `style.css`
- Local assets support


- ## 🛠 Requirements

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Electron](https://www.electronjs.org/) (installed via `npm install`)


## 📦 Installation

1. **Download or Clone this repository**:
   ```bash
   git clone https://github.com/saaaa25/smarty-ecommie.git
   cd smarty-ecommie
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

## ▶️ Running the App

Start the Electron app with:

```bash
npm start
```

## 📁 Project Structure

```
.
├── assets/             # Images and other static files
├── index.html          # Main HTML file loaded in the window
├── main.js             # Main process script
├── preload.js          # Preload script to bridge between main and renderer
├── renderer.js         # Renderer script (runs in browser context)
├── style.css           # Stylesheet
├── package.json        # App metadata and dependencies
└── package-lock.json   # Exact dependency versions
```

