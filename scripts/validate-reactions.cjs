const fs = require('fs');

const elemContent = fs.readFileSync('src/lib/data/elements.ts', 'utf8');
const elemMatches = elemContent.match(/\b(\w+)\s*:\s*\{[^}]*name:/g) || [];
const elementKeys = new Set(elemMatches.map(function(m) { return m.match(/^(\w+)/)[1]; }));
console.log('Total elements:', elementKeys.size);

const reactContent = fs.readFileSync('src/lib/data/reactions.ts', 'utf8');
const reactLines = reactContent.split('\n');
const missingProducts = [];
const missingIngredients = [];
reactLines.forEach(function(line, i) {
  const m = line.match(/:\s+'(\w+)'\s*,?\s*$/);
  if (m) {
    const product = m[1];
    if (!elementKeys.has(product)) {
      missingProducts.push(product + ' at line ' + (i+1));
    }
  }
  const km = line.match(/^\s+'([^']+)'\s*:/);
  if (km) {
    const combo = km[1];
    const parts = combo.split('+');
    parts.forEach(function(part) {
      if (!elementKeys.has(part)) {
        missingIngredients.push(part + ' (in combo: ' + combo + ')');
      }
    });
  }
});

if (missingProducts.length === 0) {
  console.log('All reaction products exist!');
} else {
  console.log('MISSING PRODUCTS:');
  missingProducts.forEach(function(p) { console.log('  ' + p); });
}

const uniqueMissing = [];
missingIngredients.forEach(function(x) { if (uniqueMissing.indexOf(x) < 0) uniqueMissing.push(x); });
if (uniqueMissing.length === 0) {
  console.log('All ingredient keys exist!');
} else {
  console.log('MISSING INGREDIENTS:');
  uniqueMissing.forEach(function(p) { console.log('  ' + p); });
}
