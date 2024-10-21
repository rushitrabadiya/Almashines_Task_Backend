const { timeout } = require("puppeteer");
const puppeteer = require("puppeteer");

async function scrapeProduct(url) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  const decodedUrl = decodeURIComponent(url);

  await page.goto(decodedUrl, { waitUntil: "domcontentloaded" });

  try {
    await page.waitForSelector(".VU-ZEz", { timeout: 15000 });
    await page.waitForSelector(".Nx9bqj.CxhGGd", { timeout: 15000 });
    await page.waitForSelector(".XQDdHH", { timeout: 15000 });

    const title = await page.$eval(".VU-ZEz", (el) => el.innerText);
    const description = await page.$eval(".GNDEQ-", (el) => el.innerText);
    const price = await page.$eval(".Nx9bqj.CxhGGd", (el) =>
      el.innerText.replace("₹", "").replace(",", "")
    );
    const imgUrl = await page.$eval(".DByuf4.IZexXJ.jLEJ7H", (el) =>
      el.getAttribute("src")
    );

    // console.log(imgUrl);

    const rating = await page.$eval(".XQDdHH", (el) => el.innerText);

    return {
      title,
      description,
      price: parseFloat(price),
      rating,
      url,
      imgUrl,
    };
  } catch (error) {
    console.error("Error scraping Flipkart:", error);
    throw new Error("Failed to scrape the Flipkart page: " + error.message);
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeProduct };
