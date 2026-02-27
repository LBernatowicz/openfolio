const path = require('path');
const { pathToFileURL } = require('url');
const puppeteer = require('puppeteer');

const CV_VERSIONS = [
    { html: 'cv.html', pdf: 'Lukasz_Bernatowicz_CV.pdf' },
    { html: 'cv-en.html', pdf: 'Lukasz_Bernatowicz_CV_EN.pdf' }
];

(async () => {
    const browser = await puppeteer.launch();

    for (const { html, pdf } of CV_VERSIONS) {
        const page = await browser.newPage();

        const cvHtmlPath = path.resolve(__dirname, html);
        const cvFileUrl = pathToFileURL(cvHtmlPath).href;

        await page.goto(cvFileUrl, { waitUntil: 'networkidle0' });
        await page.emulateMediaType('screen');

        const scrollHeight = await page.evaluate(() => document.documentElement.scrollHeight);
        const pxPerMm = 96 / 25.4;
        const heightMm = scrollHeight / pxPerMm + 10;

        const outputPath = path.resolve(__dirname, pdf);

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

        console.log('✅ PDF generated:', outputPath);
        await page.close();
    }

    await browser.close();
    console.log(`\n✅ Done. Generated ${CV_VERSIONS.length} PDF(s).`);
})();
