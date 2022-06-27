const fs = require("fs/promises");
const puppeteer = require("puppeteer");
// const cron = require("node-cron");

const start = async () => {
  console.time("Test Grab Image Time");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.goto("http://pngimg.com/images/animals/walrus");
  const photos = await page.$$eval(
    ".small-block-grid-2 li .png_png a img",
    (imgs) => {
      return imgs.map((x) => x.src);
    }
  );

  for (const photo of photos) {
    const imagePage = await page.goto(photo);
    console.log(`下載 ${photo.split("/").pop()} 中...`);
    await fs.writeFile(photo.split("/").pop(), await imagePage.buffer());
  }

  await browser.close();
  console.timeEnd("Test Grab Image Time");
};

start();

// cron.schedule("*/5 * * * * *", start);
