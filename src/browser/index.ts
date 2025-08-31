import puppeteer from "puppeteer";

export const puppeteerTest = async () => {
  console.log("启动浏览器自动化测试");
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  // 等待登录完成
  await page.goto("https://login.alibaba-inc.com/ssoLogin.htm");
  // console.log("登录完成");

  // await page.goto("https://zebra.alibaba-inc.com/web/next");
  // console.log("进入斑马");

  // 登录完成后执行业务操作
  // await page.locator("#q").fill("大会员-飞猪");
  // await page.keyboard.press("Enter");

  // 点击搭建文本的元素
  // 检查是否存在录制文件
  const fs = require("fs");
  const path = require("path");
  const recordingFile = path.join(
    __dirname,
    "../../recordings/click-sequence.json"
  );

  if (fs.existsSync(recordingFile)) {
    // 读取录制的点击序列
    // const recordings = JSON.parse(fs.readFileSync(recordingFile, 'utf8'));
    // console.log("使用已录制的点击序列");
    // for (const record of recordings) {
    //   if (record.type === 'click') {
    //     await page.click(record.xpath);
    //     console.log(`点击元素: ${record.xpath}`);
    //   } else if (record.type === 'fill') {
    //     await page.locator(record.xpath).fill(record.value);
    //     console.log(`填写内容: ${record.xpath} -> ${record.value}`);
    //   }
    //   await page.waitForTimeout(1000); // 等待1秒
    // }
  } else {
    // 录制模式 - 手动点击并记录xpath
    console.log("录制模式：请手动点击需要的元素，按Ctrl+C结束录制");
    const recordings = [];

    // 监听页面点击事件
    await page.evaluateOnNewDocument(`
(function() {
  if (window.clickSequence) {
    console.warn('点击录制已激活。如需重启，请刷新页面。');
    return;
  }

  window.clickSequence = [];

  const getXPath = (element) => {
    if (!element || element.nodeType !== Node.ELEMENT_NODE) return '';
    if (element.id) {
      return \`//*[@id="\${element.id}"]\`;
    }
    if (element === document.body) {
      return '/html/body';
    }
    const parentNode = element.parentNode;
    if (!parentNode) return '';

    let ix = 0;
    const siblings = parentNode.childNodes;
    for (let i = 0; i < siblings.length; i++) {
      const sibling = siblings[i];
      if (sibling === element) {
        const parentPath = getXPath(parentNode);
        return \`\${parentPath}/\${element.tagName.toLowerCase()}[\${ix + 1}]\`;
      }
      if (sibling.nodeType === Node.ELEMENT_NODE && sibling.tagName === element.tagName) {
        ix++;
      }
    }
    return '';
  };

  document.addEventListener('click', (e) => {
    const xpath = getXPath(e.target);
    if (!xpath) return;

    const action = {
      type: 'click',
      xpath: xpath,
      tag: e.target.tagName.toLowerCase(),
      text: e.target.textContent?.trim().substring(0, 100) || '',
      outerHTML: e.target.outerHTML.substring(0, 150) + '...',
      timestamp: Date.now()
    };

    window.clickSequence.push(action);
    console.log('✅ 记录点击:', action);
  });

  console.log('%c点击录制已启动！点击任意元素，查看记录在 window.clickSequence 中。', 'color: blue; font-weight: bold;');
  console.log('👉 查看所有记录：window.clickSequence');
  console.log('👉 导出为 JSON：copy(window.clickSequence)');
})();
`);

    // 等待用户手动操作，这里可以设置一个较长的超时时间
    try {
      await new Promise((resolve) => setTimeout(resolve, 60000)); // 等待60秒供用户操作
    } catch (error) {
      console.log("录制超时或被中断");
    }

    // 获取录制的点击序列
    const clickSequence = await page.evaluate(`window.clickSequence || []`);

    // 保存录制结果
    const recordingsDir = path.dirname(recordingFile);
    if (!fs.existsSync(recordingsDir)) {
      fs.mkdirSync(recordingsDir, { recursive: true });
    }
    fs.writeFileSync(recordingFile, JSON.stringify(clickSequence, null, 2));
    console.log(`录制完成，保存到: ${recordingFile}`);
  }
  console.log("点击搭建元素完成");

  await browser.close();
};
