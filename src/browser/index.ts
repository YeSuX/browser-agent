import puppeteer from "puppeteer";

export const puppeteerTest = async () => {
  console.log("puppeteer2");
  console.log("puppeteer5");
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  // Type into search box using accessible input name.
  await page.locator("aria/Search").fill("automate beyond recorder");

  // Wait and click on first result.
  await page.locator(".devsite-result-item-link").click();

  // Locate the full title with a unique string.
  const textSelector = await page
    .locator("text/Customize and automate")
    .waitHandle();
  const fullTitle = await textSelector?.evaluate((el: any) => el.textContent);

  // Print the full title.
  console.log('The title of this blog post is "%s".', fullTitle);

  await browser.close();
};
