import { PlaywrightCrawler, ProxyConfiguration } from "crawlee";
import { router } from "./routes.js";
import * as dotenv from "dotenv";
import fs from "fs";

dotenv.config();

let isAuth = fs.existsSync("./auth");
let session = [];
if (isAuth) {
  session = JSON.parse(fs.readFileSync("./auth")).map((e) => {
    // console.log(e);
    const { sameSite, ...rest } = e;
    return rest;
  });
}

const port = 22225;
const session_id = (1000000 * Math.random()) | 0;
const username = process.env.PROXY_USERNAME;
const host = process.env.PROXY_HOST;
const password = process.env.PROXY_PASSWORD;
const proxyUrls = [];

for (let i = 0; i < 200; i++) {
  proxyUrls.push(`http://${username}-session-${session_id}${i}:${password}@${host}:${port}`);
}

const proxy = new ProxyConfiguration({
  proxyUrls,
});

const startUrls = ["https://www.amazon.in/s?k=laptop&i=computers&s=review-rank"];

const crawler = new PlaywrightCrawler({
  //   proxyConfiguration: proxy,
  sessionPoolOptions: {
    sessionOptions: {
      //   maxUsageCount: 5,
      maxErrorScore: 1,
    },
  },
  preNavigationHooks: [
    async ({ page, browserController }) => {
      await browserController.setCookies(page, session);
      page.setViewportSize({ width: 1024, height: 500 });
    },
  ],
  headless: false,
  requestHandler: router,
  // Comment this option to scrape the full website.
  maxRequestsPerCrawl: 500,
});

await crawler.run(startUrls);
