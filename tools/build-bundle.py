import re
import os

# 获取项目根目录（tools 目录的父目录）
script_dir = os.path.dirname(os.path.abspath(__file__))
root = os.path.dirname(script_dir)
src_root = os.path.join(root, "src")
out_file = os.path.join(src_root, "game.bundle.js")

ordered_files = [
    "config.js",
    "uiText.js",
    "assets/AssetFactory.js",
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
    "systems/UISystem.js",
    "scenes/StartScene.js",
    "scenes/MapSelectScene.js",
    "scenes/GameScene.js",
    "scenes/ResultScene.js",
    "main.js",
]


def extract_imports(source):
    imports = []
    pattern = re.compile(r'import\s*\{([\s\S]*?)\}\s*from\s*["\'][^"\']+["\'];?')
    for match in pattern.finditer(source):
        for name in match.group(1).split(','):
            name = name.strip()
            if name:
                imports.append(name)
    return imports


def extract_exports(source):
    exports = []
    pattern = re.compile(r'export\s+(?:const|class|function)\s+([A-Za-z0-9_]+)')
    for match in pattern.finditer(source):
        exports.append(match.group(1))
    return exports


def normalize_source(source):
    next_source = source
    # Remove BOM
    next_source = re.sub(r'^\uFEFF', '', next_source)
    # Remove import statements
    next_source = re.sub(r'^import[\s\S]*?from\s+["\'][^"\']+["\'];\r?\n?', '', next_source, flags=re.MULTILINE)
    next_source = re.sub(r'^import\s+["\'][^"\']+["\'];\r?\n?', '', next_source, flags=re.MULTILINE)
    # Replace export class/const/function
    next_source = re.sub(r'^export\s+(class|const|function)\s+', r'\1 ', next_source, flags=re.MULTILINE)
    # Remove export { ... };
    next_source = re.sub(r'^export\s*\{[^}]+\};?\r?\n?', '', next_source, flags=re.MULTILINE)
    # Remove export default
    next_source = re.sub(r'^export\s+default\s+', '', next_source, flags=re.MULTILINE)
    return next_source.strip()


pieces = []
for relative_path in ordered_files:
    full_path = os.path.join(src_root, relative_path)
    with open(full_path, 'r', encoding='utf-8') as f:
        source = f.read()
    
    imports = extract_imports(source)
    exports = extract_exports(source)
    body = normalize_source(source)
    
    # Rename keyOf to avoid conflicts
    if 'const keyOf =' in body:
        safe_key_name = relative_path.replace('/', '_').replace('.js', '') + '_keyOf'
        body = re.sub(r'\bkeyOf\b', safe_key_name, body)
    
    import_line = f'const {{ {", ".join(imports)} }} = __bundle;\n' if imports else ''
    export_line = f'\nObject.assign(__bundle, {{ {", ".join(exports)} }});' if exports else ''
    
    piece = f'// {relative_path}\n{{\n{import_line}{body}{export_line}\n}}'
    pieces.append(piece)


bundle = f'(() => {{\nconst __bundle = {{}};\n\n{"\n\n".join(pieces)}\n\n}})();\n'

with open(out_file, 'w', encoding='utf-8') as f:
    f.write(bundle)

print(f'Bundled {len(ordered_files)} files to {out_file}')
