/**
 * tools/generate-icons.mjs
 * Generates PWA app icons (192x192 and 512x512) using pure Node.js (no dependencies).
 * Draws a stylized bomb icon with body, fuse, and spark.
 */
import { mkdirSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { deflateSync } from 'zlib';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(__dirname, '..', 'assets', 'icons');

const SIZES = [192, 512];

// ---- PNG encoder (no external deps) ----

function crc32(buf) {
  let crc = 0xFFFFFFFF;
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }
  for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
  return (crc ^ 0xFFFFFFFF) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcInput = Buffer.concat([typeBytes, data]);
  const crcVal = Buffer.alloc(4);
  crcVal.writeUInt32BE(crc32(crcInput), 0);
  return Buffer.concat([len, typeBytes, data, crcVal]);
}

function encodePNG(width, height, rgba) {
  // PNG signature
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type: RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  // IDAT: raw pixel data with filter byte (0) per row, then deflate
  const rawRows = [];
  for (let y = 0; y < height; y++) {
    rawRows.push(0); // filter: none
    const rowStart = y * width * 4;
    for (let x = 0; x < width; x++) {
      const i = rowStart + x * 4;
      rawRows.push(rgba[i], rgba[i + 1], rgba[i + 2], rgba[i + 3]);
    }
  }
  const raw = Buffer.from(rawRows);
  const compressed = deflateSync(raw);

  // IEND
  return Buffer.concat([
    sig,
    chunk('IHDR', ihdr),
    chunk('IDAT', compressed),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---- Drawing helpers ----

function setPixel(rgba, width, x, y, r, g, b, a) {
  if (x < 0 || x >= width || y < 0 || y >= width) return;
  const i = (y * width + x) * 4;
  // Alpha blend
  const srcA = a / 255;
  const dstA = rgba[i + 3] / 255;
  const outA = srcA + dstA * (1 - srcA);
  if (outA === 0) {
    rgba[i] = rgba[i + 1] = rgba[i + 2] = rgba[i + 3] = 0;
    return;
  }
  rgba[i]     = Math.round((r * srcA + rgba[i]     * dstA * (1 - srcA)) / outA);
  rgba[i + 1] = Math.round((g * srcA + rgba[i + 1] * dstA * (1 - srcA)) / outA);
  rgba[i + 2] = Math.round((b * srcA + rgba[i + 2] * dstA * (1 - srcA)) / outA);
  rgba[i + 3] = Math.round(outA * 255);
}

function drawCircle(rgba, width, cx, cy, r, red, green, blue, alpha) {
  const rr = Math.ceil(r);
  for (let dy = -rr; dy <= rr; dy++) {
    for (let dx = -rr; dx <= rr; dx++) {
      if (dx * dx + dy * dy <= r * r) {
        const px = Math.round(cx + dx);
        const py = Math.round(cy + dy);
        // Soft edge anti-aliasing
        const dist = Math.sqrt(dx * dx + dy * dy);
        let edgeAlpha = alpha;
        if (dist > r - 1 && dist <= r) {
          edgeAlpha = alpha * (r - dist);
        } else if (dist > r) {
          continue;
        }
        setPixel(rgba, width, px, py, red, green, blue, Math.round(edgeAlpha));
      }
    }
  }
}

function drawLine(rgba, width, x0, y0, x1, y1, thickness, red, green, blue, alpha) {
  // Draw a thick line by drawing circles at each step
  const dist = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
  const steps = Math.ceil(dist);
  for (let i = 0; i <= steps; i++) {
    const t = steps === 0 ? 0 : i / steps;
    const px = x0 + (x1 - x0) * t;
    const py = y0 + (y1 - y0) * t;
    drawCircle(rgba, width, px, py, thickness / 2, red, green, blue, alpha);
  }
}

// ---- Bomb icon rendering ----

function renderBomb(size) {
  const rgba = new Uint8Array(size * size * 4); // initialized to 0 (transparent)

  const cx = size / 2;
  const cy = size / 2;
  const scale = size / 512;

  const bodyRadius = 170 * scale;
  const bodyY = cy + 30 * scale;

  // Bomb body - dark grey radial gradient simulated with layered circles
  const layers = [
    { r: bodyRadius, color: [10, 10, 10, 255] },
    { r: bodyRadius * 0.85, color: [20, 20, 20, 255] },
    { r: bodyRadius * 0.65, color: [35, 35, 35, 255] },
    { r: bodyRadius * 0.4, color: [55, 55, 55, 255] },
    { r: bodyRadius * 0.2, color: [80, 80, 80, 255] },
  ];
  for (const layer of layers) {
    drawCircle(rgba, size, cx, bodyY, layer.r, ...layer.color);
  }

  // Shine highlight
  drawCircle(rgba, size, cx - 40 * scale, bodyY - 50 * scale, 55 * scale, 255, 255, 255, 100);
  drawCircle(rgba, size, cx - 25 * scale, bodyY - 30 * scale, 25 * scale, 255, 255, 255, 60);

  // Fuse stem
  const fuseStartX = cx;
  const fuseStartY = bodyY - bodyRadius;
  const fuseMidX = cx + 55 * scale;
  const fuseMidY = fuseStartY - 60 * scale;
  const fuseEndX = cx + 35 * scale;
  const fuseEndY = fuseStartY - 110 * scale;

  // Draw fuse as connected line segments (approximate quadratic curve)
  const segs = 20;
  for (let i = 0; i < segs; i++) {
    const t0 = i / segs;
    const t1 = (i + 1) / segs;
    // Quadratic Bezier: B(t) = (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
    const bx0 = (1 - t0) ** 2 * fuseStartX + 2 * (1 - t0) * t0 * fuseMidX + t0 ** 2 * fuseEndX;
    const by0 = (1 - t0) ** 2 * fuseStartY + 2 * (1 - t0) * t0 * fuseMidY + t0 ** 2 * fuseEndY;
    const bx1 = (1 - t1) ** 2 * fuseStartX + 2 * (1 - t1) * t1 * fuseMidX + t1 ** 2 * fuseEndX;
    const by1 = (1 - t1) ** 2 * fuseStartY + 2 * (1 - t1) * t1 * fuseMidY + t1 ** 2 * fuseEndY;
    drawLine(rgba, size, bx0, by0, bx1, by1, 10 * scale, 139, 94, 60, 255);
  }

  // Spark glow layers
  const sparkX = fuseEndX;
  const sparkY = fuseEndY;
  const sparkLayers = [
    { r: 35 * scale, color: [255, 140, 0, 80] },
    { r: 22 * scale, color: [255, 165, 0, 140] },
    { r: 14 * scale, color: [255, 215, 0, 200] },
    { r: 7 * scale, color: [255, 255, 255, 255] },
  ];
  for (const sl of sparkLayers) {
    drawCircle(rgba, size, sparkX, sparkY, sl.r, ...sl.color);
  }

  // Spark particles
  const particles = [
    [sparkX + 20 * scale, sparkY - 10 * scale, 4.5 * scale],
    [sparkX - 15 * scale, sparkY - 18 * scale, 3.5 * scale],
    [sparkX + 8 * scale, sparkY + 22 * scale, 4 * scale],
    [sparkX + 25 * scale, sparkY + 8 * scale, 3 * scale],
  ];
  for (const [px, py, pr] of particles) {
    drawCircle(rgba, size, px, py, pr, 255, 215, 0, 220);
    drawCircle(rgba, size, px, py, pr * 0.4, 255, 255, 255, 200);
  }

  return rgba;
}

// ---- Main ----

function generateIcons() {
  mkdirSync(OUT_DIR, { recursive: true });

  for (const size of SIZES) {
    const rgba = renderBomb(size);
    const png = encodePNG(size, size, rgba);
    const outPath = resolve(OUT_DIR, `icon-${size}.png`);
    writeFileSync(outPath, png);
    console.log(`Wrote ${outPath} (${png.length} bytes)`);
  }

  console.log('Icon generation complete.');
}

generateIcons();
