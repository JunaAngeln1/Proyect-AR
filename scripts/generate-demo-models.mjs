/**
 * Script de generación de modelos 3D de demostración.
 *
 * Escribe archivos .glb (glTF 2.0) de forma nativa en Node, sin depender del
 * GLTFExporter de Three.js (que requiere APIs de navegador como FileReader).
 * Three.js se usa solo para obtener los datos de vértices/índices de las
 * geometrías básicas.
 *
 * Uso: node scripts/generate-demo-models.mjs
 */
import * as THREE from 'three';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

const ROOT = process.cwd();
const OUT_DIR = join(ROOT, 'models', 'demo');
mkdirSync(OUT_DIR, { recursive: true });

const COLORS = {
  cube: [0.22, 0.53, 1.0, 1.0],        // #3987FF
  sphere: [0.55, 0.36, 0.96, 1.0],     // #8B5CF6
  cylinder: [0.13, 0.77, 0.37, 1.0],   // #22C55E
  cone: [0.22, 0.53, 1.0, 1.0],
  pyramid: [0.55, 0.36, 0.96, 1.0],
};

/**
 * Escribe un .glb (glTF 2.0) con una malla de triángulos.
 * @param {string} path
 * @param {Float32Array} positions  (x,y,z) x N vertices
 * @param {Uint16Array|Uint32Array} indices
 * @param {string} name
 * @param {number[]} rgba
 */
function writeGlb(path, positions, indices, name, rgba) {
  const vertexBytes = positions.buffer.slice(0); // copy
  const indexBytes = indices.buffer.slice(0);
  const binLength = vertexBytes.byteLength + indexBytes.byteLength;

  const positionCount = positions.length / 3;
  const indexCount = indices.length;

  // min/max del accessor POSITION
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < positionCount; i++) {
    const x = positions[i * 3], y = positions[i * 3 + 1], z = positions[i * 3 + 2];
    if (x < minX) minX = x; if (x > maxX) maxX = x;
    if (y < minY) minY = y; if (y > maxY) maxY = y;
    if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
  }

  const json = {
    asset: { version: '2.0', generator: '3D Inclusive Studio' },
    scene: 0,
    scenes: [{ nodes: [0], name: 'Escena' }],
    nodes: [{ mesh: 0, name }],
    meshes: [{
      name,
      primitives: [{
        attributes: { POSITION: 0 },
        indices: 1,
        material: 0,
        mode: 4, // TRIANGLES
      }],
    }],
    materials: [{
      name: `${name} material`,
      pbrMetallicRoughness: {
        baseColorFactor: rgba,
        metallicFactor: 0.25,
        roughnessFactor: 0.6,
      },
    }],
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: positionCount,
        type: 'VEC3',
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: indices instanceof Uint32Array ? 5125 : 5123, // UNSIGNED_INT / UNSIGNED_SHORT
        count: indexCount,
        type: 'SCALAR',
      },
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: 0,
        byteLength: vertexBytes.byteLength,
        target: 34962, // ARRAY_BUFFER
      },
      {
        buffer: 0,
        byteOffset: vertexBytes.byteLength,
        byteLength: indexBytes.byteLength,
        target: 34963, // ELEMENT_ARRAY_BUFFER
      },
    ],
    buffers: [{ byteLength: binLength }],
  };

  const jsonBytes = new TextEncoder().encode(JSON.stringify(json));
  const pad = (n, multiple) => Math.ceil(n / multiple) * multiple;
  const jsonPadded = pad(jsonBytes.byteLength, 4);
  const binPadded = pad(binLength, 4);

  // GLB header
  const header = new ArrayBuffer(12);
  const h = new DataView(header);
  h.setUint32(0, 0x46546C67, true); // magic 'glTF'
  h.setUint32(4, 2, true);           // version
  h.setUint32(8, 12 + 8 + jsonPadded + 8 + binPadded, true); // total length

  // Chunk prefixes
  const chunkPrefix = (len, type) => {
    const b = new ArrayBuffer(8);
    const d = new DataView(b);
    d.setUint32(0, len, true);
    d.setUint32(4, type, true);
    return b;
  };

  // El chunk JSON debe rellenarse con espacios (0x20) per la especificación glTF.
  const jsonChunk = new Uint8Array(jsonPadded);
  jsonChunk.set(jsonBytes, 0);
  for (let i = jsonBytes.byteLength; i < jsonPadded; i++) jsonChunk[i] = 0x20;

  const chunks = [];
  chunks.push(header);
  chunks.push(chunkPrefix(jsonPadded, 0x4E4F534A)); // JSON
  chunks.push(jsonChunk);
  chunks.push(chunkPrefix(binPadded, 0x004E4942)); // BIN
  chunks.push(vertexBytes);
  chunks.push(indexBytes);
  if (binPadded > binLength) {
    chunks.push(new Uint8Array(binPadded - binLength));
  }

  const total = chunks.reduce((a, b) => a + b.byteLength, 0);
  const out = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) {
    out.set(new Uint8Array(c), offset);
    offset += c.byteLength;
  }

  writeFileSync(path, Buffer.from(out));
  return { total, jsonBytes: jsonBytes.byteLength, binLength };
}

const geometries = {
  'cube-blue.glb': () => {
    const g = new THREE.BoxGeometry(1, 1, 1);
    return { mesh: g, color: COLORS.cube, name: 'Cubo' };
  },
  'sphere-purple.glb': () => {
    const g = new THREE.SphereGeometry(0.6, 32, 32);
    return { mesh: g, color: COLORS.sphere, name: 'Esfera' };
  },
  'cylinder-green.glb': () => {
    const g = new THREE.CylinderGeometry(0.4, 0.4, 1.2, 32);
    return { mesh: g, color: COLORS.cylinder, name: 'Cilindro' };
  },
  'cone.glb': () => {
    const g = new THREE.ConeGeometry(0.5, 1, 32);
    return { mesh: g, color: COLORS.cone, name: 'Cono' };
  },
  'pyramid.glb': () => {
    const g = new THREE.ConeGeometry(0.5, 1, 4);
    return { mesh: g, color: COLORS.pyramid, name: 'Pirámide' };
  },
};

(async () => {
  console.log('Generando modelos GLB en', OUT_DIR);
  for (const [fileName, build] of Object.entries(geometries)) {
    const { mesh: geometry, color, name } = build();
    const positions = geometry.attributes.position.array;
    const indices = geometry.index ? geometry.index.array : null;
    let indexArray;
    if (indices) {
      indexArray = indices.length > 65535 ? new Uint32Array(indices) : new Uint16Array(indices);
    } else {
      // sin índices: generar 0..N-1
      const n = positions.length / 3;
      indexArray = new Uint16Array(n);
      for (let i = 0; i < n; i++) indexArray[i] = i;
    }
    const info = writeGlb(join(OUT_DIR, fileName), positions, indexArray, name, color);
    console.log(`  OK ${fileName} (${(info.total / 1024).toFixed(1)} KB)`);
  }
  console.log('Listo.');
})();
