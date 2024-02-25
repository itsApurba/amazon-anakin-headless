# Amazon.in - Anakin (Assignment)

This is a web scraper to extract the product data from [Amazon.in](https://amazon.in). The scrapping is done using [PlaywrightCrawler](https://crawlee.dev/api/playwright-crawler/class/PlaywrightCrawler). The Proxy provider is [Bright Data](https://docs.brightdata.com/proxy-networks/data-center/introduction).

### Approach and methodology

- Here it's using a javascript library known as [Crawlee](https://crawlee.dev/). Crawlee handles the javascript-rendered web pages. Using headless browser ([Playwright](https://playwright.dev) or [Puppeteer](https://pptr.dev/)) and [Cheerio](https://www.npmjs.com/package/cheerio) for scraping from html. Playwright is very similar to Selenium.
- Crawlee handles the user-agent and browser fingerprint rotation internally but it can be customized further, It has logger and error handlers as well.
- This scrapper is highly scalable and can be deployed as an individual actor on [Apify](https://apify.com).
- For proxy provider, [Bright Data](https://docs.brightdata.com/proxy-networks/data-center/introduction) is used. Apify also provides [proxy](https://apify.com/proxy) for free but it has some limitations.

### Challenges
- Error(503) when accessing the website using Cheerio with proxy.
- Not getting the MRP and Discounts of some products when using Cheerio (standalone).
- There are multiple prices available for the same product.

###  Improvements or Optimizations
- Exclude the unnecessary data or blank data from the output.
- Use the same site session for all requests.

### Quality Control Checklist
- **Environment Variables**: Ensure that `.env` file exists and contains `PROXY_USERNAME`, `PROXY_HOST`, and `PROXY_PASSWORD`.
- **Cookie Management**: Ensure that `auth` file exists and contains the a real user's cookie. Extract the cookie from the browser using [EditThisCookie](https://www.editthiscookie.com/) extension.
- **Session Management**: Confirm that session management (cookie setting) is correctly implemented and tested, especially considering potential sameSite attribute removals.
- **Viewport Configuration**: Setting the viewport size in `preNavigationHooks` to ensure it's suitable for all pages you intend to crawl.
- **Headless Mode**: The `headless: false` setting is useful for debugging but should be set to `true` in production to save resources.
- **Error Handling**: Add try-catch blocks or error-handling callbacks to manage exceptions gracefully, especially around file operations and network requests.
- **Efficiency and Scalability**: Assess the creation of 200 proxy URLs for potential performance impacts, and ensure the proxy service can handle this scale.
- **Selector Accuracy and Stability**: Ensure that CSS selectors used for `enqueueLinks` and data extraction are stable and accurately reflect the structure of the target website.
- **Data Extraction Logic**: Verify the logic for extracting product details, especially when dealing with potentially unavailable items. Ensure fallbacks are in place for missing data.
- **Error Handling**: Implement robust error handling for all network requests, DOM interactions, and data parsing operations to prevent the crawler from crashing on unexpected page structures or missing elements.
- **Data Integrity and Validation**: Check that the data extracted, especially when parsing with Cheerio, is correctly sanitized and validated before being used or stored.
- **Asynchronous Operations**: Ensure that all asynchronous operations, such as page navigation or data extraction, are properly awaited to avoid race conditions or incomplete data collection.
