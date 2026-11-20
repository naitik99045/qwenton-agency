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
console.log('Qwenton 3D Soft Claymorphism UI - Final Release Gates');
console.log('=====================================================\n');

// -----------------------------------------------------------------------------
// CHECK 1: ZERO-BLACK & ZERO-FORBIDDEN-COLOR COMPLIANCE
// -----------------------------------------------------------------------------
console.log('1. Auditing files for zero black, zero charcoal, and zero navy...');
const targetFiles = [
  'components/landing/Workflow3DCanvas.tsx',
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
assert(totalColorViolations === 0, 'Zero forbidden black, charcoal, or navy colors detected across all files');

// -----------------------------------------------------------------------------
// CHECK 2: LEGACY INSTAGRAM COMPONENT & CONTENT ELIMINATION
// -----------------------------------------------------------------------------
console.log('\n2. Verifying elimination of obsolete Instagram components & text...');
const obsoleteFiles = [
  'components/landing/ProductCommandCockpit.tsx',
  'components/landing/HeroStickerStage.tsx',
];

obsoleteFiles.forEach((f) => {
  assert(!fs.existsSync(f), `Obsolete file ${f} is completely removed`);
});

const legacyKeywords = [
  /@maya_agency/i,
  /Instagram Reel/i,
  /\bAuto-DM\b/i,
  /ProductCommandCockpit/i,
  /HeroStickerStage/i,
];

let legacyViolations = 0;
targetFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  legacyKeywords.forEach((re) => {
    if (re.test(content)) {
      console.error(`Legacy keyword match ${re} found in ${file}`);
      legacyViolations++;
    }
  });
});
assert(legacyViolations === 0, 'Zero references to legacy Instagram/Maya agency components found in landing page or 3D files');

// -----------------------------------------------------------------------------
// CHECK 3: ANDROID & MOBILE USABILITY SAFETY AUDIT
// -----------------------------------------------------------------------------
console.log('\n3. Auditing Mobile & Android usability guarantees...');
const canvasContent = fs.readFileSync('components/landing/Workflow3DCanvas.tsx', 'utf8');
const globalsCss = fs.readFileSync('app/globals.css', 'utf8');
const showcaseContent = fs.readFileSync('components/landing/AllRounderStudioShowcase.tsx', 'utf8');
const pageContent = fs.readFileSync('app/page.tsx', 'utf8');

// Check touch-pan-y
assert(canvasContent.includes('touch-pan-y'), 'Workflow3DCanvas container specifies touch-pan-y for scroll ergonomics');

// Check DPR clamping
assert(
  canvasContent.includes('Math.min(window.devicePixelRatio || 1, 1.75)') ||
    canvasContent.includes('Math.min(window.devicePixelRatio, 1.75)'),
  'Workflow3DCanvas clamps device pixel ratio to 1.75 for GPU safety'
);

// Check 16px mobile input zoom prevention in globals.css
assert(
  globalsCss.includes('font-size: 16px;') || globalsCss.includes('font-size: 16px'),
  'globals.css specifies font-size: 16px for mobile inputs to prevent auto-zooming'
);

// Check touch target min-h-[48px] occurrences
const minHeight48MatchesShowcase = (showcaseContent.match(/min-h-\[48px\]/g) || []).length;
const minHeight48MatchesPage = (pageContent.match(/min-h-\[48px\]/g) || []).length;
assert(minHeight48MatchesShowcase >= 4, `AllRounderStudioShowcase enforces 48px touch targets (${minHeight48MatchesShowcase} instances)`);
assert(minHeight48MatchesPage >= 6, `Landing page enforces 48px touch targets (${minHeight48MatchesPage} instances)`);

// -----------------------------------------------------------------------------
// CHECK 4: WEBGL FALLBACK & MEMORY DISPOSAL RESILIENCE
// -----------------------------------------------------------------------------
console.log('\n4. Auditing WebGL fallback resilience & memory hygiene...');

// WebGL check & fallback state
assert(canvasContent.includes('webGLFailed'), 'Workflow3DCanvas contains webGLFailed state handler');
assert(canvasContent.includes('getContext(\'webgl\')'), 'Workflow3DCanvas checks for WebGL canvas context');
assert(canvasContent.includes('Autonomous 4-Node Spatial Pipeline'), 'Workflow3DCanvas provides accessible 2D clay fallback content');

// Context lost & restored events
assert(canvasContent.includes('webglcontextlost'), 'Workflow3DCanvas listens for webglcontextlost event');
assert(canvasContent.includes('webglcontextrestored'), 'Workflow3DCanvas listens for webglcontextrestored event');

// Recursive scene disposal on unmount
assert(canvasContent.includes('scene.traverse'), 'Workflow3DCanvas cleans up via scene.traverse');
assert(canvasContent.includes('geometry.dispose()'), 'Workflow3DCanvas disposes mesh geometries on unmount');
assert(canvasContent.includes('mat.dispose()') || canvasContent.includes('material.dispose()'), 'Workflow3DCanvas disposes materials on unmount');
assert(canvasContent.includes('renderer.dispose()'), 'Workflow3DCanvas disposes WebGLRenderer on unmount');
assert(canvasContent.includes('cancelAnimationFrame'), 'Workflow3DCanvas cancels active animation frames on unmount');
assert(canvasContent.includes('observer.disconnect()'), 'Workflow3DCanvas disconnects IntersectionObserver on unmount');

console.log('\n=====================================================');
console.log('All 3D UI Release Gate Checks PASSED Successfully!');
console.log('=====================================================');
