require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const http = require("http");
const XLSX = require("xlsx");

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(`${process.env.WEBSITE}/admin/import/convert_tyres`);
  await page.type("input[id=AdministratorUsername]", process.env.LOGIN, {
    delay: 0,
  });
  await page.screenshot({ path: "1.png" });
  await page.type("input[id=AdministratorPassword]", process.env.PASSWORD, {
    delay: 0,
  });
  await page.screenshot({ path: "2.png" });
  console.log("login and pass entered");
  await page.click("input[class=authorization]", {
    delay: 0,
  });
  await page.screenshot({ path: "3.png" });
  console.log("button is clicked");

  // get the selector input type=file (for upload file)
  await page.waitForSelector("input[id=ImportFile]", {
    timeout: 3000000,
  });
  //   await page.waitFor(1000);

  const elementHandle = await page.$("input[id=ImportFile]");
  await elementHandle.uploadFile("prices/vershina.xls");
  await page.click("input[value=Загрузить]", {
    delay: 0,
  });

  await page.waitForSelector("a[class=no-loader]", {
    timeout: 3000000,
  });
  //   await page.click("a[class=no-loader]", {
  //     delay: 0,
  //   });

  const getLink = await page.$("p > a[class=no-loader]", {
    timeout: 3000000,
  });
  const myHref = await page.evaluate(
    (anchor) => anchor.getAttribute("href"),
    getLink
  );

  const file = fs.createWriteStream("prices__ready/vershina.xls");
  const request = () =>
    http.get(`http://kerchshina.com${myHref}`, function (response) {
      response.pipe(file);
    });
  request();
  let workbook = XLSX.readFile("prices__ready/vershina.xls");
  console.log(
    XLSX.utils.sheet_to_json(workbook.Sheets["TDSheet"], {
      raw: true,
      defval: null,
    })
  );
  await page.screenshot({ path: "example.png" });
  await browser.close();
})();
