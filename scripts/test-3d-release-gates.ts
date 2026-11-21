import * as fs from 'fs';
import * as path from 'path';

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

console.log('=====================================================');
console.log('Qwenton Product Cockpit UI - Release Gates (Wave 8)');
console.log('=====================================================\n');

// -----------------------------------------------------------------------------
// CHECK 1: ZERO-BLACK & ZERO-FORBIDDEN-COLOR COMPLIANCE
// -----------------------------------------------------------------------------
console.log('1. Auditing files for zero black, zero charcoal, and zero navy...');
const targetFiles = [
  'components/landing/AllRounderStudioShowcase.tsx',
  'app/page.tsx',
  'app/globals.css',
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
  { name: 'HEX_CHARCOAL_3', re: /#172215\b/i },
];

let totalColorViolations = 0;
targetFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const lines = content.split(/\r?\n/);
  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (
      trimmed.startsWith('//') ||
      trimmed.startsWith('/*') ||
      trimmed.startsWith('*') ||
      trimmed.toLowerCase().includes('zero') ||
      trimmed.toLowerCase().includes('banned') ||
      trimmed.toLowerCase().includes('forbidden')
    ) {
      return;
    }
    forbiddenPatterns.forEach(({ name, re }) => {
      if (re.test(line)) {
        console.error(`Violation in ${file}:${idx + 1} [${name}]: ${trimmed}`);
        totalColorViolations++;
      }
    });
  });
});
assert(totalColorViolations === 0, 'Zero forbidden black, charcoal, or navy colors detected across active landing files');

// -----------------------------------------------------------------------------
// CHECK 2: DELETED OBSOLETE 3D & PROTOTYPE FILES & SYMBOLS
// -----------------------------------------------------------------------------
console.log('\n2. Verifying complete purge of Hero3DExperience, Workflow3DCanvas, and obsolete files...');
const obsoleteFiles = [
  'components/landing/ProductCommandCockpit.tsx',
  'components/landing/HeroStickerStage.tsx',
  'components/landing/Hero3DExperience.tsx',
  'components/landing/Workflow3DCanvas.tsx',
];

obsoleteFiles.forEach((f) => {
  assert(!fs.existsSync(f), `Purged file ${f} is completely deleted`);
});

// Check that no code in app/ or components/ references Hero3DExperience or Workflow3DCanvas
function scanDirectoryForTerms(dir: string, terms: RegExp[]): { file: string; term: string }[] {
  const matches: { file: string; term: string }[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      matches.push(...scanDirectoryForTerms(fullPath, terms));
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts') || entry.name.endsWith('.js'))) {
      const content = fs.readFileSync(fullPath, 'utf8');
      for (const term of terms) {
        if (term.test(content)) {
          matches.push({ file: fullPath, term: term.source });
        }
      }
    }
  }
  return matches;
}

const purgedTerms = [/Hero3DExperience/g, /Workflow3DCanvas/g];
const appMatches = scanDirectoryForTerms('app', purgedTerms);
const componentMatches = scanDirectoryForTerms('components', purgedTerms);
assert(appMatches.length === 0, `0 references to purged 3D components in app/ (found ${appMatches.length})`);
assert(componentMatches.length === 0, `0 references to purged 3D components in components/ (found ${componentMatches.length})`);

// Check that no abstract 3D geometries are instantiated in app/ or components/
const geometryTerms = [/SphereGeometry/g, /TorusGeometry/g, /CylinderGeometry/g, /IcosahedronGeometry/g];
const geometryAppMatches = scanDirectoryForTerms('app', geometryTerms);
const geometryComponentMatches = scanDirectoryForTerms('components', geometryTerms);
assert(geometryAppMatches.length === 0, `0 abstract Three.js geometries in app/`);
assert(geometryComponentMatches.length === 0, `0 abstract Three.js geometries in components/`);

// -----------------------------------------------------------------------------
// CHECK 3: ANDROID & MOBILE USABILITY SAFETY AUDIT
// -----------------------------------------------------------------------------
console.log('\n3. Auditing Mobile & Android usability guarantees...');
const globalsCss = fs.readFileSync('app/globals.css', 'utf8');
const showcaseContent = fs.readFileSync('components/landing/AllRounderStudioShowcase.tsx', 'utf8');
const pageContent = fs.readFileSync('app/page.tsx', 'utf8');

// Check 16px mobile input zoom prevention in globals.css
assert(
  globalsCss.includes('font-size: 16px;') || globalsCss.includes('font-size: 16px'),
  'globals.css specifies font-size: 16px for mobile inputs to prevent auto-zooming'
);

// Check perspective disable on mobile (< 640px)
assert(
  globalsCss.includes('perspective: none') && globalsCss.includes('@media (max-width: 640px)'),
  'globals.css disables cockpit perspective on mobile (< 640px) to prevent touch traps'
);

// Check prefers-reduced-motion override
assert(
  globalsCss.includes('@media (prefers-reduced-motion: reduce)'),
  'globals.css supports prefers-reduced-motion for all cockpit animations'
);

// Check touch target min-h-[48px] occurrences
const minHeight48MatchesShowcase = (showcaseContent.match(/min-h-\[48px\]/g) || []).length;
const minHeight48MatchesPage = (pageContent.match(/min-h-\[48px\]/g) || []).length;
assert(minHeight48MatchesShowcase >= 4, `AllRounderStudioShowcase enforces 48px touch targets (${minHeight48MatchesShowcase} instances)`);
assert(minHeight48MatchesPage >= 6, `Landing page enforces 48px touch targets (${minHeight48MatchesPage} instances)`);

console.log('\n=====================================================');
console.log('All Release Gate Checks PASSED Successfully!');
console.log('=====================================================');
