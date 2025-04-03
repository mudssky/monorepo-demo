const fs = require('fs');
const path = require('path');

const envFiles = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.development.local',
  '.env.production',
  '.env.production.local'
];

const distPath = path.join(__dirname, '../dist');

envFiles.forEach(file => {
  const srcPath = path.join(__dirname, '../', file);
  if (fs.existsSync(srcPath)) {
    fs.copyFileSync(srcPath, path.join(distPath, file));
    console.log(`Copied ${file} to dist folder`);
  }
});