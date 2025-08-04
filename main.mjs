import express from 'express';
import  puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
const app = express();
const port = 3000;

app.get('/screenshot', async (req, res) => {
  const { url } = req.query;
  if (!url) {
    return res.status(400).send('Missing URL');
  }

  try {
    // const browser = await puppeteer.launch({
    //   args: ['--no-sandbox', '--disable-setuid-sandbox'] // Useful for running in many environments
    // });
    // const page = await browser.newPage();
    // await page.goto(url, { waitUntil: 'networkidle2' });
    // const screenshot = await page.screenshot({ fullPage: true });
    // await browser.close();
 
    
    // Optional: If you'd like to disable webgl, true is the default.
    chromium.setGraphicsMode = false;
    
    // Optional: Load any fonts you need.
    await chromium.font(
      "https://raw.githack.com/googlei18n/noto-emoji/master/fonts/NotoColorEmoji.ttf"
    );
    
    // test("Check the page title of example.com", async (t) => {
    //   const viewport = {
    //     deviceScaleFactor: 1,
    //     hasTouch: false,
    //     height: 1080,
    //     isLandscape: true,
    //     isMobile: false,
    //     width: 1920,
    //   };
      const browser = await puppeteer.launch({
        args: puppeteer.defaultArgs({ args: chromium.args, headless: false }),
        executablePath: await chromium.executablePath(),
        headless: false,
      });
    
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    // });
    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (err) {
    console.log(err);
    res.status(500).send('Error capturing screenshot');
  }
});

app.listen(port, () => {
  console.log(`Screenshot API listening at http://localhost:${port}`);
});
