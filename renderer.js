// renderer.js
let timer = null;
let timeLeft = 0;

const { ipcRenderer } = require('electron');

// Window controls
document.getElementById('close-btn').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

document.getElementById('minimize-btn').addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

// View navigation
function showView(viewId) {
    document.querySelectorAll('.view').forEach(view => {
        view.classList.remove('active');
    });
    document.getElementById(viewId).classList.add('active');
}

// Start app button
document.getElementById('startAppBtn').addEventListener('click', () => {
    showView('selectionView');
});

// Back buttons
document.querySelectorAll('.back-btn').forEach(button => {
    button.addEventListener('click', () => {
        const currentView = document.querySelector('.view.active').id;
        if (currentView === 'timerView') {
            showView('selectionView');
        } else {
            showView('welcomeView');
        }
        resetTimer();
    });
});

// Minimize and Close Buttons
document.querySelectorAll('.window-btn').forEach(btn => {
    btn.addEventListener('mousedown', () => {
        btn.style.transform = 'scale(0.9)';
    });
    
    btn.addEventListener('mouseup', () => {
        btn.style.transform = 'scale(1)';
    });
    
    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });
});

// Make second set of window controls work
document.getElementById('close-btn-2').addEventListener('click', () => {
    ipcRenderer.send('window-close');
});

document.getElementById('minimize-btn-2').addEventListener('click', () => {
    ipcRenderer.send('window-minimize');
});

// Handle search button
// document.getElementById('searchBtn').addEventListener('click', () => {
//     const query = document.getElementById('searchInput').value.trim();
//     if (query !== '') {
//         alert(`Searching for "${query}"...`);
//         // You can call your API / logic here
//     }
// });


document.getElementById('searchBtn').addEventListener('click', () => {
  const product = document.getElementById('searchInput').value;
  console.log('Searching for:', product);

  // Later we'll call the scraper here
});


// Move to analysis page (page 3)
function goToAnalysisPage() {
    showView('analysisView');
}

let currentProduct = ""; // global variable

document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value.trim();
    if (query !== '') {
        currentProduct = query; // store product name globally
        goToAnalysisPage(); // go to page 3
        startScraping(currentProduct); // call scraping function
    }
});

function startScraping(productName) {
    document.getElementById('productTitle').textContent = `Tracking Price for: ${productName}`;

    // Simulate scrape from multiple sites
    const scrapedData = [
        { site: "Amazon", price: 499, timestamp: "2024-04-01" },
        { site: "Flipkart", price: 489, timestamp: "2024-04-02" },
        { site: "Alibaba", price: 470, timestamp: "2024-04-03" },
        { site: "Amazon", price: 519, timestamp: "2024-04-04" },
        { site: "Flipkart", price: 460, timestamp: "2024-04-05" },
        { site: "Temp", price: 475, timestamp: "2024-04-06" },
    ];

    // Store in hash table
    const productTable = {};
    productTable[productName] = scrapedData;

    // Sort by price (ascending)
    const sorted = [...scrapedData].sort((a, b) => a.price - b.price);
    const best = sorted[0];
    const latest = scrapedData[scrapedData.length - 1];

    // Generate insights
    let html = `<p><strong>Best Price:</strong> ₹${best.price} on ${best.site} (${best.timestamp})</p>`;
    html += `<p><strong>Latest Price:</strong> ₹${latest.price} on ${latest.site}</p>`;

    if (latest.price > best.price) {
        html += `<p style="color: yellow;">Better deals were available before. Consider waiting.</p>`;
    } else {
        html += `<p style="color: lightgreen;">Now might be a good time to buy!</p>`;
    }

    // Show full table
    html += `<h3>Full Price History:</h3><ul>`;
    for (let item of sorted) {
        html += `<li>${item.site}: ₹${item.price} (${item.timestamp})</li>`;
    }
    html += `</ul>`;

    document.getElementById('outputArea').innerHTML = html;
}


// Initialize app
showView('welcomeView');