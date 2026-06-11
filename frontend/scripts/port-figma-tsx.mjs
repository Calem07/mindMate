import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '../src/components/figma');
const srcDir = path.join(root, '_src');

function collectHooks(content) {
  const hooks = new Set();
  if (/\buseState\b/.test(content)) hooks.add('useState');
  if (/\buseEffect\b/.test(content)) hooks.add('useEffect');
  if (/\buseRef\b/.test(content)) hooks.add('useRef');
  if (/\buseMemo\b/.test(content)) hooks.add('useMemo');
  if (/\bFragment\b/.test(content)) hooks.add('Fragment');
  return hooks;
}

function portBase(content) {
  let s = content.replace(/^\uFEFF/, '');

  s = s.replace(/^import React from ["']react["'];?\r?\n/m, '');
  s = s.replace(
    /import \{ LunaCat \} from ["']\.\/LunaCat["'];?/g,
    "import { LunaCat } from '../../companion/LunaCat.jsx'",
  );

  s = s.replace(/React\.useState/g, 'useState');
  s = s.replace(/React\.useEffect/g, 'useEffect');
  s = s.replace(/React\.useRef/g, 'useRef');
  s = s.replace(/React\.useMemo/g, 'useMemo');
  s = s.replace(/React\.Fragment/g, 'Fragment');

  s = s.replace(/^type [^\n]+\r?\n/gm, '');
  s = s.replace(/^interface [\s\S]*?^}\r?\n/gm, '');

  s = s.replace(/useState<[^>]+>/g, 'useState');
  s = s.replace(/useRef<[^>]+>/g, 'useRef');
  s = s.replace(/useMemo<[^>]+>/g, 'useMemo');
  s = s.replace(/: ChatMessage\[\]/g, '');
  s = s.replace(/: Set<number>/g, '');

  s = s.replace(/ as ChatEmotion\[\]/g, '');
  s = s.replace(/ as AccessoryTab\[\]/g, '');
  s = s.replace(/ as const/g, '');

  s = s.replace(/function GardenTree\(\{ theme \}: \{ theme: ThemeId \}\)/g, 'function GardenTree({ theme })');
  s = s.replace(/function GardenScene\(\{ theme \}: \{ theme: ThemeId \}\)/g, 'function GardenScene({ theme })');
  s = s.replace(
    /function ThemeSelectorCard\(\{ active, onSelect \}: \{ active: ThemeId; onSelect: \(t: ThemeId\) => void \}\)/g,
    'function ThemeSelectorCard({ active, onSelect })',
  );

  s = s.replace(/: ThemeId\b/g, '');
  s = s.replace(/: Record<[^>]+>/g, '');
  s = s.replace(/\(i: number\)/g, '(i)');
  s = s.replace(/\(id: number\)/g, '(id)');

  s = s.replace(/    type FF = \{[\s\S]*?\};\r?\n/gm, '');
  s = s.replace(/    type Pt = \{[\s\S]*?\};\r?\n/gm, '');
  s = s.replace(/    type Mp = \{[\s\S]*?\};\r?\n/gm, '');
  s = s.replace(/    type Lf = \{[\s\S]*?\};\r?\n/gm, '');
  s = s.replace(/    const ff: FF\[\] =/g, '    const ff =');
  s = s.replace(/    const pts: Pt\[\] =/g, '    const pts =');
  s = s.replace(/    const mist: Mp\[\] =/g, '    const mist =');
  s = s.replace(/    const canvasLeaves: Lf\[\] =/g, '    const canvasLeaves =');

  const hooks = collectHooks(s);
  if (hooks.size) {
    s = `import { ${[...hooks].join(', ')} } from 'react';\n` + s;
  }

  return s;
}

function portDashboard(content) {
  let s = portBase(content);

  s = s.replace(
    'function CompanionHero() {',
    'function CompanionHero({ userName, petName, level, bondPct }) {',
  );
  s = s.replace(
    'function LunasLetter() {',
    'function LunasLetter({ userName, petName }) {',
  );

  s = s.replace(
    /<span className="text-white font-bold tracking-tight" style=\{\{ fontSize: "1.15rem" \}\}>Luna<\/span>/,
    '<span className="text-white font-bold tracking-tight" style={{ fontSize: "1.15rem" }}>{petName}</span>',
  );
  s = s.replace(
    /Lv\.12/,
    'Lv.{level}',
  );
  s = s.replace(
    /<span className="text-xs text-muted-foreground tracking-widest uppercase">A message from Luna<\/span>/,
    '<span className="text-xs text-muted-foreground tracking-widest uppercase">A message from {petName}</span>',
  );
  s = s.replace(
    /Alex\.\.\. I've been sitting/,
    '{userName}... I\'ve been sitting',
  );
  s = s.replace(
    /<span className="font-medium" style=\{\{ color: "#67e8f9" \}\}>82%<\/span>/,
    '<span className="font-medium" style={{ color: "#67e8f9" }}>{bondPct}%</span>',
  );
  s = s.replace(
    /animate=\{\{ width: "82%" \}\}/,
    'animate={{ width: `${bondPct}%` }}',
  );
  s = s.replace(
    /<span className="text-sm font-semibold text-white">Dear Alex,<\/span>/,
    '<span className="text-sm font-semibold text-white">Dear {userName},</span>',
  );
  s = s.replace(
    /Always yours, <span className="text-cyan-300 font-medium">Luna 🐱<\/span>/,
    'Always yours, <span className="text-cyan-300 font-medium">{petName} 🐱</span>',
  );

  s = s.replace(
    'export function DashboardView() {\n  return (\n    <div className="flex flex-col gap-6 pb-16 max-w-[1400px] mx-auto">\n      <CompanionHero />',
    `export function DashboardView({ userName = 'Alex', petName = 'Luna', level = 12, bondPct = 82, insight }) {
  return (
    <div className="flex flex-col gap-6 pb-16 max-w-[1400px] mx-auto">
      <CompanionHero userName={userName} petName={petName} level={level} bondPct={bondPct} insight={insight} />`,
  );
  s = s.replace('      <LunasLetter />', '      <LunasLetter userName={userName} petName={petName} />');

  return s;
}

const jobs = [
  {
    in: 'DashboardView.tsx',
    out: 'dashboard/DashboardView.jsx',
    transform: portDashboard,
  },
  {
    in: 'CompanionPage.tsx',
    out: 'companion/FigmaCompanionView.jsx',
    transform: (c) => portBase(c).replace('export function CompanionPage()', 'export function FigmaCompanionView()'),
  },
  {
    in: 'GrowthGardenPage.tsx',
    out: 'garden/FigmaGrowthGardenView.jsx',
    transform: (c) => portBase(c).replace('export function GrowthGardenPage()', 'export function FigmaGrowthGardenView()'),
  },
];

for (const job of jobs) {
  const input = fs.readFileSync(path.join(srcDir, job.in), 'utf8');
  const output = job.transform(input);
  const outPath = path.join(root, job.out);
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, output, 'utf8');
  console.log('Wrote', job.out, `(${output.length} chars)`);
}
