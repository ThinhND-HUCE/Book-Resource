import { copyFileSync, mkdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const sourceFile = join(__dirname, '../node_modules/mathjax/es5/tex-mml-chtml.js');
const targetDir = join(__dirname, '../public');
const targetFile = join(targetDir, 'mathjax.js');

mkdirSync(targetDir, { recursive: true });
copyFileSync(sourceFile, targetFile);

console.log('Đã sao chép MathJax vào thư mục public'); 