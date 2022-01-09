require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const http = require("http");
const XLSX = require("xlsx");
// const makePriceProductionReady = require("./xls");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  // login

  await page.goto(`${process.env.WEBSITE}/admin/import/convert_tyres`);
  await page.type("input[id=AdministratorUsername]", process.env.LOGIN, {
    delay: 0,
  });
  await page.screenshot({ path: "screenshots/1.png" });
  await page.type("input[id=AdministratorPassword]", process.env.PASSWORD, {
    delay: 0,
  });
  await page.screenshot({ path: "screenshots/2.png" });
  console.log("login and pass entered");
  await page.click("input[class=authorization]", {
    delay: 0,
  });
  await page.screenshot({ path: "screenshots/3.png" });
  console.log("button is clicked");

  // get the selector input type=file (for upload file)

  await page.waitForSelector("input[id=ImportFile]", {
    timeout: 3000000,
  });

  const elementHandle = await page.$("input[id=ImportFile]");
  await elementHandle.uploadFile("prices/vershina.xls");
  await page.click("input[value=Загрузить]", {
    delay: 0,
  });

  // wait before file uploaded

  await page.waitForSelector("a[class=no-loader]", {
    timeout: 3000000,
  });

  const getLink = await page.$("p > a[class=no-loader]", {
    timeout: 3000000,
  });

  // get modified file link

  const modifiedFileLink = await page.evaluate(
    (anchor) => anchor.getAttribute("href"),
    getLink
  );

  // download file

  const file = fs.createWriteStream("prices__2/vershina.xls");
  const request = () =>
    http.get(`${process.env.WEBSITE}/${modifiedFileLink}`, function (response) {
      response.pipe(file);
    });
  request();
  // makePriceProductionReady();
  await page.screenshot({ path: "screenshots/4.png" });
  await browser.close();
})();
