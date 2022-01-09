require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const http = require("http");
const XLSX = require("xlsx");

var workbook1 = XLSX.readFile("prices__ready/vershina.xls");
var sheet_name_list = workbook1.SheetNames;
console.log(
  XLSX.utils.sheet_to_json(workbook1.Sheets[sheet_name_list[0]], { raw: true })
);

let workbook = XLSX.readFile("prices__ready/vershina.xls");

const sheetRaw = workbook.Sheets[workbook.SheetNames[0]];

const readyXlsToJson = XLSX.utils.sheet_to_json(sheetRaw, {
  // raw: true,
  defval: null,
  header: [
    "brand",
    "model",
    "full",
    "season",
    "type",
    "size1",
    "size2",
    "size3",
    "index1",
    "index2",
    "empty",
    "ship",
    "empty2",
    "quantity",
    "priceMain",
    "price",
  ],
});
console.log(sheetRaw);
const JsonModified = readyXlsToJson
  .filter((it) => Number(it.size1) > 100 && Number(it.size1) < 350)
  .filter((it) => Number(it.size2) > 20 && Number(it.size2) < 100)
  .filter((it) => !it.size1.includes(",") && !it.size1.includes("."))
  .filter((it) => !it.size2.includes(",") && !it.size2.includes("."))
  .filter((it) => !it.size3.includes(",") && !it.size3.includes("."))
  .reduce((acc, rec) => {
    if (
      rec.size3.toLowerCase().includes("c") ||
      rec.size3.toLowerCase().includes("с")
    ) {
      return [...acc, { ...rec, type: "легкогрузовая" }];
    }
    return [...acc, { ...rec, type: null }];
  }, [])
  .reduce((acc, rec) => {
    return [...acc, { ...rec, priceMain: rec.price }];
  }, []);

const exportToExcel = (arr) => {
  const fileName = "test.xlsx";

  const ws = XLSX.utils.json_to_sheet(arr, { skipHeader: true });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "test");

  XLSX.writeFile(wb, fileName);
};

exportToExcel(JsonModified);

console.log("its modified");
