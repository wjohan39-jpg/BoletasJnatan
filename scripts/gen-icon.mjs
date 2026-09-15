import { deflateSync } from 'zlib';
import { writeFileSync } from 'fs';

// --- CRC32 (standard PNG table-based implementation) ---
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type, 'ascii');
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function encodePNG(width, height, rgb) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 2; // color type: RGB truecolor
  ihdrData[10] = 0;
  ihdrData[11] = 0;
  ihdrData[12] = 0;
  const ihdr = chunk('IHDR', ihdrData);

  const stride = width * 3;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0; // filter type: none
    rgb.copy(raw, y * (stride + 1) + 1, y * stride, y * stride + stride);
  }
  const idat = chunk('IDAT', deflateSync(raw));
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// --- "J" monogram render, supersampled for smooth edges ---
function isJ(u, v) {
  // Vertical stem
  if (u >= 0.56 && u <= 0.72 && v >= 0.14 && v <= 0.6) return true;
  // Foot bar (extends left from the stem's base)
  if (u >= 0.42 && u <= 0.72 && v >= 0.6 && v <= 0.74) return true;
  // Rounded cap at the foot's left end
  const dx = u - 0.42;
  const dy = v - 0.67;
  if (Math.sqrt(dx * dx + dy * dy) <= 0.07) return true;
  return false;
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

function renderIcon(size) {
  const ss = 4; // supersample factor
  const bigSize = size * ss;
  const rgb = Buffer.alloc(size * size * 3);

  // Brand gradient endpoints
  const c1 = [11, 60, 255]; // #0b3cff
  const c2 = [111, 216, 255]; // #6fd8ff

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let rAcc = 0;
      let gAcc = 0;
      let bAcc = 0;
      for (let sy = 0; sy < ss; sy++) {
        for (let sx = 0; sx < ss; sx++) {
          const px = x * ss + sx;
          const py = y * ss + sy;
          const u = (px + 0.5) / bigSize;
          const v = (py + 0.5) / bigSize;
          const t = (u + v) / 2;
          let r = lerp(c1[0], c2[0], t);
          let g = lerp(c1[1], c2[1], t);
          let b = lerp(c1[2], c2[2], t);
          if (isJ(u, v)) {
            r = 255;
            g = 255;
            b = 255;
          }
          rAcc += r;
          gAcc += g;
          bAcc += b;
        }
      }
      const n = ss * ss;
      const idx = (y * size + x) * 3;
      rgb[idx] = Math.round(rAcc / n);
      rgb[idx + 1] = Math.round(gAcc / n);
      rgb[idx + 2] = Math.round(bAcc / n);
    }
  }
  return rgb;
}

function writeIcon(size, path) {
  const rgb = renderIcon(size);
  const png = encodePNG(size, size, rgb);
  writeFileSync(path, png);
  console.log('wrote', path, png.length, 'bytes');
}

writeIcon(64, process.argv[2]);
writeIcon(180, process.argv[3]);
