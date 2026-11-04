const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.resolve(__dirname, '../../../frontend/public/products');

const downloads = [
  {
    name: 'PROD-LIPONLIP.jpg',
    url: 'https://down-vn.img.susercontent.com/file/vn-11134207-81ztc-mux5rroheqrq88'
  },
  {
    name: 'PROD-LIPONLIP-STUDIO.jpg',
    url: 'https://rohto.com.vn/images/2026/son-trang-diem-lip-on-lip-glowy-satin-1026_1.jpg'
  },
  {
    name: 'SKU-LIPONLIP-01.jpg', // Cam Gạch - Brick Orange
    url: 'https://media.hcdn.vn/catalog/product/f/a/facebook-dynamic-422206739-1695630803_img_450x450_31d6f9_fit_center.jpg'
  },
  {
    name: 'SKU-LIPONLIP-02.jpg', // Đỏ Gạch - Terra Red
    url: 'https://rohto.com.vn/images/2021/son-trang-diem-lip-on-lip-glowy-satin-do-gach.jpg'
  },
  {
    name: 'SKU-LIPONLIP-03.jpg', // Cam Đào - Sunset Peach
    url: 'https://rohto.com.vn/images/2021/son-trang-diem-lip-on-lip-glowy-satin-cam-dao.jpg'
  },
  {
    name: 'SKU-LIPONLIP-04.jpg', // Đỏ Ruby - Ruby Star
    url: 'https://rohto.com.vn/images/2021/son-trang-diem-lip-on-lip-glowy-satin-do-ruby.jpg'
  },
  {
    name: 'SKU-LIPONLIP-05.jpg', // Hồng Đỏ - Poppy Pink
    url: 'https://rohto.com.vn/images/2021/son-trang-diem-lip-on-lip-glowy-satin-hong-do.jpg'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: HTTP ${res.statusCode}`));
      }
      const fileStream = fs.createWriteStream(dest);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        resolve(fs.statSync(dest).size);
      });
      fileStream.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  console.log('Downloading 100% exact Lip On Lip Glowy Satin images...');
  for (const item of downloads) {
    const dest = path.join(targetDir, item.name);
    try {
      const size = await downloadFile(item.url, dest);
      console.log(`✓ Saved ${item.name} (${size} bytes)`);
    } catch (err) {
      console.error(`✗ Error downloading ${item.name}:`, err.message);
    }
  }
}

run();
