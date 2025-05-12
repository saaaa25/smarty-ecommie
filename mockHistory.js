function generateHistory(productName, basePrice, startDateStr = "2025-05-02") {
    const history = [];
    const start = new Date(startDateStr);
    
    let price = basePrice;
    for (let i = 0; i < 10; i++) {
        const date = new Date(start);
        date.setDate(start.getDate() + i);

        // simulate small random price changes
        const change = (Math.random() - 0.5) * 5;
        price = Math.max(5, price + change);
        price = Math.round(price * 100) / 100;

        history.push({ date: date.toISOString().split('T')[0], price });
    }
    return history;
}


const mockHistory = {
    "Logitech Mouse": generateHistory("Logitech Mouse", 24.99),
    "SteelSeries Pad": generateHistory("SteelSeries Pad", 29.99),
    "USB-C Charger": generateHistory("USB-C Charger", 19.99),
    "Amazon Echo Dot": generateHistory("Amazon Echo Dot", 49.99),
    "Wireless Keyboard": generateHistory("Wireless Keyboard", 34.99),
};

module.exports = { mockHistory };