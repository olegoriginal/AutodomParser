require("dotenv").config();
const puppeteer = require("puppeteer");
const fs = require("fs");
const http = require("http");
const XLSX = require("xlsx");
const makePriceProductionReady = require("./xls");

makePriceProductionReady();
