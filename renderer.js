const { ipcRenderer } = require('electron');

let timer = null;
let timeLeft = 0;
let currentProduct = ""; // global
const productTable = {}; // hash map

document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM fully loaded");
    showView('welcomeView');

    // Window controls
    document.getElementById('close-btn').addEventListener('click', () => ipcRenderer.send('window-close'));
    document.getElementById('minimize-btn').addEventListener('click', () => ipcRenderer.send('window-minimize'));
    document.getElementById('close-btn-2').addEventListener('click', () => ipcRenderer.send('window-close'));
    document.getElementById('minimize-btn-2').addEventListener('click', () => ipcRenderer.send('window-minimize'));
    document.getElementById('close-btn-3').addEventListener('click', () => ipcRenderer.send('window-close'));
    document.getElementById('minimize-btn-3').addEventListener('click', () => ipcRenderer.send('window-minimize'));

    function showView(viewId) {
        document.querySelectorAll('.view').forEach(view => {
          view.classList.remove('active');
        });
        const view = document.getElementById(viewId);
        if (view) {
          view.classList.add('active');
        }
      }
      

    // View switching
    document.getElementById('startAppBtn').addEventListener('click', () => {
        console.log("Start button clicked");
        showView('selectionView');
    });

    document.querySelectorAll('.back-btn').forEach(button => {
        button.addEventListener('click', () => {
            const currentView = document.querySelector('.view.active').id;
            if (currentView === 'analysisView') {
                showView('selectionView');
            } else {
                showView('welcomeView');
            }
            resetTimer();
        });
    });

    // Handle search
    document.getElementById('searchBtn').addEventListener('click', async () => {
        const product = document.getElementById('searchInput').value.trim();
        if (!product) return;
    
        currentProduct = product;
    
        // Step 1: Show loading view
        showView('loadingView');
    
        // Step 2: Start scraping (slow operation)
        await startScraping(currentProduct);
    
        // Step 3: Show results view once data is ready
        showView('analysisView');
    });
    

    // Button animation
    document.querySelectorAll('.window-btn').forEach(btn => {
        btn.addEventListener('mousedown', () => btn.style.transform = 'scale(0.9)');
        btn.addEventListener('mouseup', () => btn.style.transform = 'scale(1)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
    });
});

// View switching helper
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));
    const nextView = document.getElementById(viewId);
    if (nextView) nextView.classList.add('active');
}

// Reset dummy timer
function resetTimer() {
    if (timer) clearInterval(timer);
    timeLeft = 0;
}

// Scraping and result rendering
async function startScraping(productName) {
    document.getElementById('productTitle').textContent = `Tracking Price for: ${productName}`;
    try {
        const scrapedData = await ipcRenderer.invoke('scrape-product', productName);
        console.log("Received data:", scrapedData);
        if (!scrapedData || scrapedData.length === 0) {
            document.getElementById('outputArea').innerHTML = `<p>No data found for ${productName}</p>`;
            return;
        }

        productTable[productName] = scrapedData;

        const sorted = [...scrapedData].sort((a, b) => a.price - b.price);
        const best = sorted[0];
        const latest = scrapedData[scrapedData.length - 1];

        let html = `<p><strong>Best Price:</strong> $${best.price} on ${best.site} (${best.timestamp})</p>`;
        html += `<p><strong>Latest Price:</strong> $${latest.price} on ${latest.site}</p>`;
        html += latest.price > best.price
            ? `<p style="color: yellow;">Better deals were available before. Consider waiting.</p>`
            : `<p style="color: lightgreen;">Now might be a good time to buy!</p>`;

        html += `<h3>Full Price History:</h3><ul>`;
        sorted.forEach(item => {
            html += `<li>${item.site}: $${item.price} (${item.timestamp})</li>`;
        });
        html += `</ul>`;

        document.getElementById('outputArea').innerHTML = html;
    } catch (error) {
        console.error('Scraping failed:', error);
        document.getElementById('outputArea').innerHTML = `<p>Error fetching price data.</p>`;
    }
}

// Initialize app
showView('welcomeView');