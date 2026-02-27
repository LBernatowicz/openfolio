const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');

(async () => {
    // 1. Uruchomienie przeglądarki
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 2. Wczytanie lokalnego pliku cv.html z folderu CV
    const cvHtmlPath = path.resolve(__dirname, 'cv.html');
    const cvFileUrl = pathToFileURL(cvHtmlPath).href;

    await page.goto(cvFileUrl, { waitUntil: 'networkidle0' });

    // 3. Ustawienia wyglądu jak w przeglądarce
    await page.emulateMediaType('screen');

    // 4. Wyliczenie wysokości całego dokumentu, żeby mieć jedną długą stronę
    const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
    const pxPerMm = 96 / 25.4; // standardowe DPI w Chrome
    const heightMm = scrollHeight / pxPerMm + 10; // mały zapas na dole

    // 5. Generowanie PDF do tego samego folderu (src/CV) jako jedna długa strona (bez podziału na strony)
    const outputPath = path.resolve(__dirname, 'Lukasz_Bernatowicz_CV.pdf');

    await page.pdf({
        path: outputPath,
        width: '210mm',
        height: `${heightMm}mm`,
        printBackground: true,
        margin: {
            top: '0px',
            right: '0px',
            bottom: '0px',
            left: '0px'
        }
    });

    console.log('✅ PDF wygenerowany pomyślnie:', outputPath);
    await browser.close();
})();