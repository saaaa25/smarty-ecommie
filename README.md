# 🛒 Smarty Ecommie

**Smarty Ecommie** is a desktop e-commerce price tracking and trend analysis application built using **Electron**, featuring multi-platform web scraping, price history generation, and a clean UI for real-time visualization.

---

## 🚀 Features

- 🔍 Scrapes product prices from:
  - Amazon
  - eBay
  - Alibaba
  - Best Buy
  - Croma
- 📈 Generates and analyzes price trends
- 🕰️ Maintains historical price data
- 🧠 Trend insights with `analyzeTrend.js`
- 📊 JSON-based visualization-ready price data
- 🖥️ Electron-powered desktop GUI
- 💅 Styled with modern CSS

---

## 🛠 Requirements

- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)
- [Electron](https://www.electronjs.org/) (installed via npm)

---

## 📦 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/saaaa25/smarty-ecommie.git
   cd smarty-ecommie
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

---

## ▶️ Running the App

Launch the Electron app:
```bash
npm start
```

---

## 📁 Project Structure

```
.
├── assets/                  # Static images or icons
├── index.html               # Electron window's HTML content
├── style.css                # Styling
├── main.js                  # Electron main process
├── preload.js               # Preload bridge between main and renderer
├── renderer.js              # Renderer logic (front-end)
├── analyzeTrend.js          # Script to analyze price trends
├── generate_price_hist.py   # Python script to generate price history
├── price_history.json       # Stored price history data
├── mockHistory.js           # Mock historical data for testing
├── scrapeAmazon.js          # Amazon scraper
├── scrapeEbay.js            # eBay scraper
├── scrapeAlibaba.js         # Alibaba scraper
├── scrapeBestBuy.js         # Best Buy scraper
├── scrapeCroma.js           # Croma scraper
├── package.json             # App metadata and dependencies
└── package-lock.json        # Locked versions of packages
```

---

## 📌 Future Improvements

- 🔔 Price drop notifications
- 📅 Scheduled automatic scraping
- ☁️ Cloud sync and storage
- 📱 Mobile companion app

---

## 🧑‍💻 Author

Developed by [saaaa25](https://github.com/saaaa25)

---

## 📄 License

This project is licensed under the MIT License.
