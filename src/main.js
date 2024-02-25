// For more information, see https://crawlee.dev/
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

// const startUrls = [
//   "https://www.amazon.in/HP-GeForce-Graphics-Response-16-n0123AX/dp/B0C2D1P9F8/ref=sr_1_7?dib=eyJ2IjoiMSJ9.BrFYdChW9lViVqO6MULhFOgj_xmzTSAN60T8btP0RzzbaVXDhe5nTzZGLAYvA0J78oQhFc5q45uqF8Z9DFlsMr5B_hlBr7V5OJMbEJp-yQ0C0J_ogZpyX2AKJWin81RHkyorUMCsbSB07es9OUejpRvz2BEp9HPRlq3Im0uE4uu4bCnk2qfo-S6zfP8L6PoTzHSlskRqmSurYoYE9fq8TSNGHcX5sBjGJP5wyT3y-N4.0vE6jH7RQLtLoNWOeW1hIbSGsvT8fHi6OLj750C48sw&dib_tag=se&keywords=laptop&qid=1708722814&refinements=p_72%3A1318476031&sr=8-7",
// ];
// const startUrls = [
//   "https://www.amazon.in/Pavilion-x360-Multitouch-Enabled-Convertible-14-dy0186TU/dp/B09P1PHBXB/ref=sr_1_16?dib=eyJ2IjoiMSJ9.PyLzzueDnTz5hiVQ5C1zeN2SWA4_h53gSwr483bxDObjSdMp4rKTST8PyeMIVBE3JafxC8oQ9IXlskepXIgz6lTWOckYA-j7DCsU_uSjk1fcg2jzllnWT5m1u4iiUU7JU7KjyCeAacZmQxA1s17MFzjOJ4o8WdQNvUJ-rrvNJqpvLVudDkJYrgyW9VxO0Qr4bcLp4bqSefwyJbH_emcywjzMg4DXFkyY5DCPtgYB0w0d9L9keUjmjpkUpWSYjw9eUKtZso0lAyLY2NMSWSJPoX3UoEzDKORCjLUl8bDluUM.bvQZzdNqyYLT57y6PCnUCkemYqb4ayiY4IVPZO53nTg&dib_tag=se&keywords=laptop&qid=1708851762&s=computers&sr=1-16&th=1",
// ];
// const startUrls = [
//   "https://www.amazon.in/2022-Apple-MacBook-Laptop-chip/dp/B0B3C6FBPF/ref=sr_1_2?dib=eyJ2IjoiMSJ9.PyLzzueDnTz5hiVQ5C1zeN2SWA4_h53gSwr483bxDObjSdMp4rKTST8PyeMIVBE3JafxC8oQ9IXlskepXIgz6lTWOckYA-j7DCsU_uSjk1fcg2jzllnWT5m1u4iiUU7JU7KjyCeAacZmQxA1s17MFzjOJ4o8WdQNvUJ-rrvNJqpvLVudDkJYrgyW9VxO0Qr4bcLp4bqSefwyJbH_emcywjzMg4DXFkyY5DCPtgYB0w0d9L9keUjmjpkUpWSYjw9eUKtZso0lAyLY2NMSWSJPoX3UoEzDKORCjLUl8bDluUM.OQfkoBZX20iAWexk1cp0MS8Y063OEXFM4UMyS3jUWTs&dib_tag=se&keywords=laptop&qid=1708853924&s=computers&sr=1-2",
// ];
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
