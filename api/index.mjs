import express from 'express';
import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';

const app = express();
const port = 3000;

// সার্ভার কোথায় চলছে সেটা চেক করা হচ্ছে
const isServerless = !!process.env.AWS_REGION || !!process.env.VERCEL;

// Puppeteer module নেয়া হচ্ছে (local vs serverless)
async function getPuppeteer() {
  if (isServerless) {
    return puppeteerCore;
  } else {
    const puppeteer = await import('puppeteer');
    return puppeteer.default;
  }
}

// Chrome/Chromium এর path নেয়া হচ্ছে
async function getChromePath() {
  if (isServerless) {
    return await chromium.executablePath();
  } else {
    const puppeteer = await import('puppeteer');
    return puppeteer.default.executablePath();
  }
}

app.get('/screenshot', async (req, res) => {
  const { url } = req.query;

  if (!url) {
    return res.status(400).send('Missing URL');
  }

  try {
    const puppeteer = await getPuppeteer();
    const executablePath = await getChromePath();

    const browser = await puppeteer.launch({
      args: isServerless ? chromium.args : ['--no-sandbox'],
      executablePath,
      headless: false, // headless false দিলে UI খোলে, true দিলে চুপচাপ চলে
    });

    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2' });

    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();

    res.setHeader('Content-Type', 'image/png');
    res.send(screenshot);
  } catch (error) {
    console.error('Screenshot error:', error);
    res.status(500).send('Error capturing screenshot');
  }
});

app.listen(port, () => {
  console.log(`✅ Screenshot API ready at http://localhost:${port}`);
});
