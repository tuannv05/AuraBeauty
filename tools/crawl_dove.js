const fs = require('fs');

async function crawl() {
  const url = 'https://wowmart.vn/sp/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g/';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    console.log('Status:', res.status, 'HTML length:', html.length);
    
    // Title
    const titleMatch = html.match(/<h1[^>]*class="[^"]*product_title[^"]*"[^>]*>([\s\S]*?)<\/h1>/i) || html.match(/<title>([\s\S]*?)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1].trim() : 'N/A');

    // Price
    const priceMatch = html.match(/<ins>[\s\S]*?<bdi>([\s\S]*?)<\/bdi>[\s\S]*?<\/ins>/i) || html.match(/<bdi>([\s\S]*?)<\/bdi>/i);
    console.log('Price:', priceMatch ? priceMatch[1].replace(/<[^>]+>/g, '').trim() : 'N/A');

    // Images
    const imgRegex = /https:\/\/[^"'\s]+\.(?:jpg|jpeg|png|webp)/gi;
    const allImgs = [...html.matchAll(imgRegex)].map(m => m[0]);
    const doveImgs = [...new Set(allImgs.filter(u => u.includes('wowmart.vn') && u.includes('wp-content/uploads')))];
    console.log('All wowmart upload images:', doveImgs);

    // Save full HTML for inspection if needed
    fs.writeFileSync('tools/wowmart_dove.html', html, 'utf8');
  } catch (err) {
    console.error('Error fetching wowmart:', err);
  }
}

crawl();
