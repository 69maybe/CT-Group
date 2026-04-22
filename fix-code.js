const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      if (file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.json')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(srcDir);

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Replace .png, .jpg, .jpeg with .webp but ONLY in strings that look like file paths.
  // E.g. .png', .png", .png`, or .jpg', etc.
  content = content.replace(/\.(png|jpg|jpeg)(['"`}])/gi, '.webp$2');
  
  // Fix specific replaces like replace(/\.png$/i, '')}.png`
  content = content.replace(/replace\(\/\\\.png\$\/i, ''\)}/gi, "replace(/\\.(png|webp)$/i, '')}");
  
  // Add loading="lazy" to <img> tags if missing
  // Careful not to duplicate if it already has loading=
  content = content.replace(/<img(?![^>]*loading=)([^>]*)>/gi, '<img loading="lazy"$1>');

  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Updated ${file}`);
  }
});
