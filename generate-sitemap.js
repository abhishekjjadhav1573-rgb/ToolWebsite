import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Base URL of the website
const baseUrl = 'https://www.smartfinmetrics.com';

// Array of routes
const routes = [
  '/',
  '/tool/emi',
  '/tool/sip',
  '/tool/compound-interest',
  '/tool/gst',
  '/tool/income-tax',
  '/tool/fd',
  '/tool/rd',
  '/tool/bmi',
  '/tool/calorie',
  '/tool/percentage',
  '/tool/average',
  '/tool/profit-loss',
  '/tool/scientific',
  '/tool/age',
  '/tool/password-generator',
  '/tool/qr-code-generator',
  '/tool/image-to-pdf',
  '/tool/image-format-converter'
];

// Current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Function to generate sitemap XML
function generateSitemap() {
  let sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n';
  sitemap += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  routes.forEach(route => {
    sitemap += '  <url>\n';
    sitemap += `    <loc>${baseUrl}${route}</loc>\n`;
    sitemap += `    <lastmod>${currentDate}</lastmod>\n`;
    sitemap += '  </url>\n';
  });

  sitemap += '</urlset>';

  return sitemap;
}

// Write sitemap to file
const sitemapPath = path.join(__dirname, 'public', 'sitemap.xml');
console.log('Sitemap will be written to:', sitemapPath);
fs.writeFileSync(sitemapPath, generateSitemap(), 'utf8');

console.log('Sitemap generated successfully at:', sitemapPath);

// Run the script
// node generate-sitemap.js