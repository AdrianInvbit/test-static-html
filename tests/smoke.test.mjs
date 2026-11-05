import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const require = createRequire(import.meta.url);
const rootDir = join(dirname(fileURLToPath(import.meta.url)), "..");
const app = require("../js/app.js");

const requiredFiles = [
  "index.html",
  "css/styles.css",
  "js/app.js",
  "app-meta.json",
  "tests/smoke.test.mjs",
  "package.json",
  "README.md",
  ".gitignore"
];

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed += 1;
    console.log(`ok - ${name}`);
  } catch (error) {
    failed += 1;
    console.error(`not ok - ${name}`);
    console.error(`  ${error.message}`);
  }
}

function readProjectFile(relativePath) {
  return readFileSync(join(rootDir, relativePath), "utf8");
}

test("existen los archivos necesarios del proyecto", () => {
  const missing = requiredFiles.filter((relativePath) => !existsSync(join(rootDir, relativePath)));
  assert.deepEqual(missing, [], `Faltan archivos: ${missing.join(", ")}`);
});

test("el HTML incluye la estructura semántica y los datos visibles", () => {
  const html = readProjectFile("index.html");

  assert.match(html, /<!DOCTYPE html>/i);
  assert.match(html, /<html lang="es">/);
  assert.match(html, /<meta charset="UTF-8">/i);
  assert.match(html, /name="viewport"/);
  assert.match(html, /<title>ClonVercel Test Lab<\/title>/);
  assert.match(html, /<h1>ClonVercel Test Lab — Versión 2<\/h1>/);
  assert.match(html, /class="version-badge"[^>]*>V2<\/p>/);
  assert.match(html, /<header[\s>]/);
  assert.match(html, /<main[\s>]/);
  assert.match(html, /<footer[\s>]/);
  assert.match(html, /test-static-html/);
  assert.match(html, /HTML, CSS y JavaScript/);
  assert.match(html, /v0\.1\.0/);
  assert.match(html, /No disponible/);
  assert.match(html, /id="counter-value"/);
  assert.match(html, /id="btn-increment"/);
  assert.match(html, /id="btn-decrement"/);
  assert.match(html, /id="btn-reset"/);
  assert.match(html, /id="js-status"/);
  assert.match(html, /href="css\/styles.css"/);
  assert.match(html, /src="js\/app.js"/);
  assert.doesNotMatch(html, /href="\//);
  assert.doesNotMatch(html, /src="\//);
});

test("la versión y el commit coinciden en los metadatos locales", () => {
  const packageJson = JSON.parse(readProjectFile("package.json"));
  const appMeta = JSON.parse(readProjectFile("app-meta.json"));
  const html = readProjectFile("index.html");

  assert.equal(packageJson.name, "test-static-html");
  assert.equal(packageJson.version, "0.1.0");
  assert.equal(appMeta.id, "test-static-html");
  assert.equal(appMeta.version, "v0.1.0");
  assert.equal(appMeta.commit, "No disponible");
  assert.equal(app.APP_META.version, "v0.1.0");
  assert.equal(app.APP_META.commit, "No disponible");
  assert.match(html, />v0\.1\.0</);
  assert.match(html, />No disponible</);
});

test("el contador incrementa, decrementa y se reinicia a cero", () => {
  const counter = app.createCounter(0);

  assert.equal(counter.getValue(), 0);
  assert.equal(counter.increment(), 1);
  assert.equal(counter.increment(), 2);
  assert.equal(counter.decrement(), 1);
  assert.equal(counter.reset(), 0);
  assert.equal(counter.getValue(), 0);
  assert.equal(counter.decrement(), -1);
  assert.equal(counter.reset(), 0);
});

test("dos contadores mantienen su estado de forma independiente", () => {
  const first = app.createCounter(4);
  const second = app.createCounter(1);

  first.increment();
  second.decrement();

  assert.equal(first.getValue(), 5);
  assert.equal(second.getValue(), 0);
});

console.log("");
console.log(`Resultado: ${passed} pruebas superadas, ${failed} fallidas.`);

if (failed > 0) {
  process.exitCode = 1;
}
