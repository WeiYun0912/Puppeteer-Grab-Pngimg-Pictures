const puppeteer = require("puppeteer");
const fs = require("fs");
const https = require("https");

const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve(true));
        });
      })
      .on("error", (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });

(async () => {
  console.time("Test Grab Image Time");
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  await page.setDefaultNavigationTimeout(0);

  await page.goto("http://pngimg.com/images/cars/camaro");
  //   await page.screenshot({ path: "web.png" });
  //   page.on("console", (consoleObj) => console.log(consoleObj.text()));
  const grabImages = await page.evaluate(() => {
    const albums = document.querySelectorAll(
      ".small-block-grid-2 li .png_png a img"
    );
    const imgTags = [];
    albums.forEach((tag) => {
      imgTags.push("https://pngimg.com" + tag.getAttribute("src"));
    });
    return imgTags;
  });

  const downloadImage = (imgs) => {
    imgs.forEach((img, i) => {
      console.log(`下載圖片中 ${i + 1} / ${imgs.length}`);
      download(img, `./img/${i}.png`);
    });
  };
  const imgs = grabImages;

  downloadImage(imgs);
  await browser.close();
  console.timeEnd("Test Grab Image Time");
})();
