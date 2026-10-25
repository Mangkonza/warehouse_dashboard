const fs = require('fs');
const path = require('path');

function walk(d) {
  for (const f of fs.readdirSync(d)) {
    const p = path.join(d, f);
    if (p.includes('node_modules') || p.includes('.next') || p.includes('.git') || p.includes('dist')) continue;
    if (fs.statSync(p).isDirectory()) {
      walk(p);
    } else if (/\.(tsx?|jsx?)$/.test(f)) {
      const c = fs.readFileSync(p, 'utf8');
      if (c.includes('b6520503525') && !p.includes('seed') && !p.includes('test')) {
        console.log('Found b6520503525 in:', p);
      }
      if (c.includes("includes('admin')") || c.includes('includes("admin")')) {
        console.log('Found admin name check in:', p);
      }
    }
  }
}

walk('warehouse_dashboard/src');
walk('backend/src');
console.log('Search complete.');
