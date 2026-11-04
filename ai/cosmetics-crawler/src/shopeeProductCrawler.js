const https = require('https');
const fs = require('fs');
const path = require('path');

const pageUrl = 'https://rohto.com.vn/san-pham/san-pham-noi-dia-viet-nam/cham-soc-moi/lip-on-lip/son-trang-diem-lip-on-lip-glowy-satin.html';

https.get(pageUrl, {
  headers: {
    'User-Agent': 'Mozilla/5.0'
  }
}, (res) => {
  let b = '';
  res.on('data', chunk => b += chunk);
  res.on('end', () => {
    const shopeeLinks = b.match(/https:\/\/shopee\.vn\/[^\s\"']+/g) || [];
    console.log('Shopee links:', shopeeLinks);

    const vnImgs = b.match(/vn-11134207-[a-zA-Z0-9_\-]+/g) || [];
    console.log('VN images:', Array.from(new Set(vnImgs)));
  });
});
