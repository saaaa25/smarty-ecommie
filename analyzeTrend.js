function analyzeProductHistory(history) {
    if (!history || history.length < 2) {
        return {
            current: history?.[0] || {},
            recommendation: '❌ Not enough data for analysis yet. Please check back later.'
        };
    }

    const sorted = [...history].sort((a, b) => new Date(a.date) - new Date(b.date));
    const current = sorted[sorted.length - 1];
    const min = sorted.reduce((min, d) => d.price < min.price ? d : min, sorted[0]);
    const max = sorted.reduce((max, d) => d.price > max.price ? d : max, sorted[0]);

    const change = (((current.price - min.price) / min.price) * 100).toFixed(2);

    let recommendation;
    if (current.price === min.price) {
        recommendation = '✅ Best price now. Good time to buy!';
    } else if (current.price > min.price && current.price < max.price) {
        recommendation = `⚠️ Price is up ${change}%. You might want to wait.`;
    } else {
        recommendation = `❌ Highest price seen. Definitely wait.`;
    }

    return {
        current,
        min,
        max,
        change: `${change}%`,
        recommendation
    };
}


module.exports = { analyzeProductHistory };
