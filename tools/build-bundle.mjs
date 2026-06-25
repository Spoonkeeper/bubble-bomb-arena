import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const srcRoot = path.join(root, "src");
const outFile = path.join(srcRoot, "game.bundle.js");

const orderedFiles = [
  "config.js",
  "uiText.js",
  "ui/TechVisualKit.js",
  "assets/AssetFactory.js",
  "multiplayer/MatchConfig.js",
  "multiplayer/KeyboardInputRouter.js",
  "multiplayer/CombatantRegistry.js",
  "systems/CombatSystem.js",
  "systems/MapSystem.js",
  "systems/ItemSystem.js",
  "systems/BombSystem.js",
  "systems/ExplosionSystem.js",
  "systems/PlayerSystem.js",
  "systems/AISystem.js",
  "systems/HeroAbilitySystem.js",
  "systems/MeteorSystem.js",
  "systems/PortalSystem.js",
  "scenes/SceneFlow.js",
  "systems/UISystem.js",
  "scenes/StartScene.js",
  "scenes/MatchSetupScene.js",
  "scenes/MapSelectScene.js",
  "scenes/GameScene.js",
  "scenes/ResultScene.js",
  "main.js",
];

const replacements = [
  ['createItem(scene, "item-shield", 0x9a7cff, "鐩?);', 'createItem(scene, "item-shield", 0x9a7cff, "盾");'],
  ['ctx.fillText("灏廠POON", 117, 190);', 'ctx.fillText("小SPOON", 117, 190);'],
];

function extractImports(source) {
  const imports = [];
  const matcher = /import\s*\{([\s\S]*?)\}\s*from\s*["'][^"']+["'];?/gm;
  let match = matcher.exec(source);
  while (match) {
    match[1]
      .split(",")
      .map((name) => name.trim())
      .filter(Boolean)
      .forEach((name) => imports.push(name));
    match = matcher.exec(source);
  }
  return imports;
}

function extractExports(source) {
  const exports = [];
  const matcher = /export\s+(?:const|class|function)\s+([A-Za-z0-9_]+)/g;
  let match = matcher.exec(source);
  while (match) {
    exports.push(match[1]);
    match = matcher.exec(source);
  }
  return exports;
}

function normalizeSource(source) {
  let next = source.replace(/^\uFEFF/, "");
  for (const [from, to] of replacements) {
    next = next.split(from).join(to);
  }
  next = next.replace(/^import[\s\S]*?from\s+["'][^"']+["'];\r?\n?/gm, "");
  next = next.replace(/^import\s+["'][^"']+["'];\r?\n?/gm, "");
  next = next.replace(/^export\s+(class|const|function)\s+/gm, "$1 ");
  next = next.replace(/^export\s*\{[^}]+\};?\r?\n?/gm, "");
  next = next.replace(/^export\s+default\s+/gm, "");
  return next.trim();
}

const pieces = orderedFiles.map((relativePath) => {
  const fullPath = path.join(srcRoot, relativePath);
  const source = fs.readFileSync(fullPath, "utf8");
  const imports = extractImports(source);
  const exports = extractExports(source);
  let body = normalizeSource(source);
  if (body.includes("const keyOf =")) {
    const safeKeyName = `${relativePath.replace(/[^A-Za-z0-9]+/g, "_")}_keyOf`;
    body = body.replace(/\bkeyOf\b/g, safeKeyName);
  }
  const importLine = imports.length ? `const { ${imports.join(", ")} } = __bundle;\n` : "";
  const exportLine = exports.length ? `\nObject.assign(__bundle, { ${exports.join(", ")} });` : "";
  return `// ${relativePath}\n{\n${importLine}${body}${exportLine}\n}`;
});

const bundle = `(() => {\nconst __bundle = {};\n${pieces.join("\n\n")}\n})();\n`;
fs.writeFileSync(outFile, bundle, "utf8");
console.log(`Bundled ${orderedFiles.length} files to ${outFile}`);
