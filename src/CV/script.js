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

    // 4. Generowanie PDF do tego samego folderu (src/CV) na standardowych stronach A4
    const outputPath = path.resolve(__dirname, 'Lukasz_Bernatowicz_CV.pdf');

    await page.pdf({
        path: outputPath,
        format: 'A4',
        printBackground: true,     // zachowanie kolorów i tła
        preferCSSPageSize: true,   // użyj rozmiaru z CSS (210mm x 297mm)
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