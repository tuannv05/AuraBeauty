const fs = require('fs');
const path = require('path');

const images = [
  {
    name: 'niche-body-011.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-k.jpg'
  },
  {
    name: 'dove-pomegranate-main.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-k.jpg'
  },
  {
    name: 'dove-pomegranate-cream-texture.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-kc.jpg'
  },
  {
    name: 'dove-pomegranate-back-label.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-ke.jpg'
  },
  {
    name: 'dove-pomegranate-swatch.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-kg.jpg'
  },
  {
    name: 'dove-pomegranate-top-lid.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-kd.jpg'
  },
  {
    name: 'dove-pomegranate-side-view.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-kf.jpg'
  },
  {
    name: 'dove-pomegranate-barcode.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-kb.jpg'
  },
  {
    name: 'dove-pomegranate-model.jpg',
    url: 'https://wowmart.vn/wp-content/uploads/2022/06/tay-te-bao-chet-dove-exfoliating-body-polish-pomegranate-seeds-shea-butter-298g-kh.jpg'
  }
];

async function downloadAll() {
  const targetDir = path.resolve('frontend/public/products');
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  for (const item of images) {
    const dest = path.join(targetDir, item.name);
    try {
      console.log(`Downloading ${item.url} -> ${item.name}...`);
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (!res.ok) {
        console.error(`Failed ${item.url}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`Saved ${item.name} (${buffer.length} bytes)`);
    } catch (err) {
      console.error(`Error downloading ${item.name}:`, err.message);
    }
  }
}

downloadAll();
