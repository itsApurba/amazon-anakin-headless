import { Dataset, createPlaywrightRouter } from "crawlee";
import { cleanHtml } from "./utils.js";

export const router = createPlaywrightRouter();

router.addDefaultHandler(async ({ enqueueLinks, proxyInfo }) => {
  await enqueueLinks({
    selector: "a.s-pagination-next",
    label: "list",
  });
  await enqueueLinks({
    selector: ".puisg-row h2 a",
    label: "detail",
  });
});

router.addHandler("detail", async ({ request, page, parseWithCheerio }) => {
  const url = request.loadedUrl;

  const $ = await parseWithCheerio();
  const skuID = request.loadedUrl.split("dp/")[1].split("/")[0];
  const productTitle = await page.locator("#productTitle").first().innerText();
  const productName = productTitle.split(",")[0] || null;
  const description = cleanHtml($("#feature-bullets>ul").html());
  const category = cleanHtml($("#wayfinding-breadcrumbs_feature_div").text()) || "Laptops";

  const available = !$("#availability_feature_div").text().includes("Currently unavailable.");
  //   console.log(available)
  let mrp = available ? $(".basisPrice .a-price .a-offscreen").text().trim() : "Currently Unavailable";
  let sellingPrice = available ? $(".priceToPay>span").first().text().trim() : "Currently Unavailable";
  let discount = available ? $(".savingsPercentage").text().trim() : "Currently Unavailable";

  const rating = $(".a-popover-trigger.a-declarative>span").first().text().trim() || null;
  const image = $("#video-outer-container img").first().attr("src") || $('[data-action="main-image-click"] img').first().attr("src") || null;

  const productDetailsSection = $("tr");
  const prodDetails = {};
  productDetailsSection.each((i, el) => {
    const key = $(el).find(">").first().text().trim();
    const value = cleanHtml($(el).find(">").last().text().trim()).toString();
    prodDetails[key] = value;
  });
  if (mrp.length === 0) {
    await page
      .locator("#buybox-see-all-buying-choices")
      .click()
      .catch((e) => console.log("Price Button Not Found"));
    mrp = await page
      .locator(".centralizedApexBasisPriceCSS span.a-offscreen")
      .first()
      .innerText()
      .catch((e) => null);
    sellingPrice = await page
      .locator(".centralizedApexPricePriceToPayMargin>span")
      .first()
      .innerText()
      .catch((e) => null);
    discount = await page
      .locator("span.centralizedApexPriceSavingsOverrides")
      .first()
      .innerText()
      .catch((e) => null);
  }

  await Dataset.pushData({ url, skuID, productTitle, productName, description, category, mrp, sellingPrice, discount, rating, image, ...prodDetails });
  await Dataset.exportToJSON("data");
});
