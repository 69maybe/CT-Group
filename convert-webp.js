const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const publicDir = path.join(__dirname, 'frontend', 'public');

async function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      await processDirectory(fullPath);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (['.jpg', '.jpeg', '.png'].includes(ext)) {
        const webpPath = fullPath.replace(new RegExp(`\\${ext}$`, 'i'), '.webp');
        console.log(`Converting ${fullPath} to ${webpPath}`);
        try {
          await sharp(fullPath)
            .webp({ quality: 75 })
            .toFile(webpPath);
          fs.unlinkSync(fullPath); // Delete old image
          console.log(`Successfully converted and deleted ${file}`);
        } catch (error) {
          console.error(`Error converting ${file}:`, error);
        }
      }
    }
  }
}

processDirectory(publicDir).then(() => {
  console.log('All done!');
});
