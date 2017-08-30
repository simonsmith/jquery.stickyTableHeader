const puppeteer = require('puppeteer');

let browser, page;

beforeEach(async () => {
  browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.setViewport({
    width: 1650,
    height: 800,
  });
  await page.goto('http://localhost:3002/test');
});

afterEach(() => {
  browser.close();
});

test('table container has position relative', async () => {
  const style = await page.evaluate(() => {
    return $('.table-container').eq(0).css('position');
  });
  expect(style).toEqual('relative');
});

test('sticky header is present and hidden from screenreaders', async () => {
  const attr = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).attr('aria-hidden');
  });
  expect(attr).toBe('true');
});

test('active class is applied to the table', async () => {
  const hasClass = await page.evaluate(() => {
    return $('.table').eq(1).hasClass('is-stickyTableHeaderActive');
  });
  expect(hasClass).toBe(true);
});

test('existing class names are copied to the sticky header', async () => {
  const hasClass = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).hasClass('table');
  });
  expect(hasClass).toBe(true);
});

test('table cells have correct widths set', async () => {
  const widths = await page.evaluate(() => {
    return $.makeArray($('.StickyTableHeader').eq(0).find('tr:first-child th').map(function() {
      return $(this).width();
    }));
  });
  expect(widths).toEqual([267, 304, 342]);
});

test('sticky header is positioned at the top of the table initially', async () => {
  const css = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).css([
      'position',
      'top',
      'left',
      'box-sizing',
      'width',
    ]);
  });
  expect(css).toEqual({
    position: 'absolute',
    top: '0px',
    left: '0px',
    'box-sizing': 'border-box',
    width: '980px',
  });
});

test('sticky header is set to fixed when scrolling', async () => {
  await page.evaluate(() => {
    $(window).scrollTop(300);
  });
  await page.waitFor(100);
  const css = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).css([
      'position',
      'width',
    ]);
  });
  const hasClass = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).hasClass('is-scrolling');
  });
  expect(css).toEqual({
    position: 'fixed',
    width: '980px',
  });
  expect(hasClass).toBe(true);
});

test('sticky header is fixed to the bottom of the table when scroll reaches bottom', async () => {
  await page.evaluate(() => {
    $(window).scrollTop(1627);
  });
  await page.waitFor(100);
  const css = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).css([
      'position',
      'width',
      'bottom',
      'top',
    ]);
  });
  const hasClass = await page.evaluate(() => {
    return $('.StickyTableHeader').eq(0).hasClass('is-scrolling');
  });
  expect(css).toEqual({
    position: 'absolute',
    width: '980px',
    bottom: '1521px',
    top: '0px',
  });
  expect(hasClass).toBe(false);
});
