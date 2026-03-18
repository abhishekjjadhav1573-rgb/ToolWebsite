import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const svgPath = path.join(__dirname, 'public', 'favicon.svg');
const svgBuffer = fs.readFileSync(svgPath);

const sizes = [16, 32, 48];

sizes.forEach(size => {
  sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(__dirname, 'public', `favicon-${size}.png`))
    .then(() => console.log(`Generated favicon-${size}.png`))
    .catch(err => console.error(err));
});