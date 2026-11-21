const fs = require('fs');

const files = [
  'components/landing/AllRounderStudioShowcase.tsx',
  'app/page.tsx',
  'app/globals.css'
];

const forbiddenPatterns = [
  { name: 'HEX_BLACK_FULL', re: /#000000\b/i },
  { name: 'HEX_BLACK_SHORT', re: /#000\b/i },
  { name: 'THREE_HEX_BLACK', re: /0x000000\b/i },
  { name: 'RGB_BLACK', re: /rgb\(0\s*,\s*0\s*,\s*0\)/i },
  { name: 'BG_BLACK', re: /\bbg-black\b/i },
  { name: 'TEXT_BLACK', re: /\btext-black\b/i },
  { name: 'CHARCOAL', re: /\bcharcoal\b/i },
  { name: 'NAVY', re: /\bnavy\b/i },
  { name: 'HEX_CHARCOAL_1', re: /#1c241b\b/i },
  { name: 'HEX_CHARCOAL_2', re: /#202d1e\b/i },
  { name: 'HEX_CHARCOAL_3', re: /#172215\b/i }
];

let violations = [];

files.forEach(f => {
  if (!fs.existsSync(f)) {
    console.error('File not found:', f);
    process.exit(1);
  }
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.toLowerCase().includes('zero') ||
      trimmed.toLowerCase().includes('banned') ||
      trimmed.toLowerCase().includes('prohibit')
    ) {
      return;
    }
    forbiddenPatterns.forEach(({ name, re }) => {
      if (re.test(line)) {
        violations.push({ file: f, line: idx + 1, rule: name, content: trimmed });
      }
    });
  });
});

console.log('Total violations found:', violations.length);
if (violations.length > 0) {
  console.log(JSON.stringify(violations, null, 2));
  process.exit(1);
} else {
  console.log('PASS: Zero forbidden black, charcoal, or navy colors detected across active landing files!');
}
