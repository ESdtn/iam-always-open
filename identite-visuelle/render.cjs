// Rend les images de référence en PNG 1920x1080.
// Usage : node identite-visuelle/render.cjs
const path = require('path');
const { chromium } = require('playwright');

const frames = ['titre', 'terrain-clair', 'terrain-ardoise', 'reflexe'];
const dossier = path.join(__dirname, 'reference');

(async () => {
  const navigateur = await chromium.launch();
  for (const [i, nom] of frames.entries()) {
    const page = await navigateur.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    await page.goto(`file://${dossier}/index.html#${nom}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(300);
    const sortie = path.join(dossier, `${String(i + 1).padStart(2, '0')}-${nom}.png`);
    await page.screenshot({ path: sortie });
    console.log(sortie);
    await page.close();
  }
  await navigateur.close();
})();
