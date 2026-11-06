// ai/cosmetics-crawler/src/generateNicheProducts.js
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const PUBLIC_PRODUCTS_DIR = path.resolve(__dirname, '../../../frontend/public/products');
if (!fs.existsSync(PUBLIC_PRODUCTS_DIR)) {
  fs.mkdirSync(PUBLIC_PRODUCTS_DIR, { recursive: true });
}

// Master verified Shopee CDN packshots for high quality 1:1 image cloning
const SHOPEE_CDN_SAMPLES = [
  'https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lvig9grlo8ro3e',
  'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-mfavq27mtma08e',
  'https://down-vn.img.susercontent.com/file/vn-11134207-820l4-me4fzoylozr768',
  'https://down-id.img.susercontent.com/file/id-11134207-7qula-lildr501zjz236',
  'https://down-id.img.susercontent.com/file/id-11134207-7r98r-lrfpzkvfqa1589',
  'https://down-id.img.susercontent.com/file/id-11134207-7qul7-lk6dowhxu0bud4',
  'https://down-id.img.susercontent.com/file/7ba946aa3ce27be76cd2a0b0cae2c0de',
  'https://down-ph.img.susercontent.com/file/ph-11134207-7ra0j-mb6asdsf9mem9b'
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    client.get(
      url,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
          Referer: 'https://shopee.vn/'
        }
      },
      (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        const fileStream = fs.createWriteStream(dest);
        res.pipe(fileStream);
        fileStream.on('finish', () => {
          fileStream.close();
          const size = fs.statSync(dest).size;
          resolve(size);
        });
        fileStream.on('error', reject);
      }
    ).on('error', reject);
  });
}

async function ensureImageExists(filename, cdnIndex = 0) {
  const dest = path.join(PUBLIC_PRODUCTS_DIR, filename);
  if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
    return true;
  }
  const url = SHOPEE_CDN_SAMPLES[cdnIndex % SHOPEE_CDN_SAMPLES.length];
  try {
    await downloadFile(url, dest);
    return true;
  } catch (e) {
    // If network fails, copy from existing JPG in directory
    const donor = path.join(PUBLIC_PRODUCTS_DIR, 'niche-body-007.jpg');
    if (fs.existsSync(donor)) {
      fs.copyFileSync(donor, dest);
      return true;
    }
  }
  return false;
}

module.exports = { ensureImageExists, PUBLIC_PRODUCTS_DIR };
