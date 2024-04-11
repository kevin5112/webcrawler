const { JSDOM } = require('jsdom');

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {
  // ensure the domains match for the current page so we don't iterate
  // the whole internet

  // console.log(`baseURL domain: ${new URL(baseURL).hostname}`);
  if (new URL(currentURL).hostname != new URL(baseURL).hostname) {
    // console.log(
    //   `domains between ${new URL(baseURL).hostname} and ${
    //     new URL(currentURL).hostname
    //   } do not match.. returning`
    // );
    return pages;
  }

  // normalize URL then add to pages if we have not visited,
  // else increment the page count

  const normalizeUrl = normalizeURL(currentURL);
  // console.log(`before: ${JSON.stringify(pages)}`);
  if (pages[normalizeUrl] > 0) {
    // else increment pages and then return.
    pages[normalizeUrl]++;
    // console.log(`returning because visited: ${JSON.stringify(pages)}`);
    return pages;
  }
  // console.log(`after: ${JSON.stringify(pages)}`);
  pages[normalizeUrl] = 1;
  // fetch the current url

  let htmlBody = '';
  try {
    console.log(`Now fetching ${currentURL}`);
    const response = await fetch(currentURL);
    if (response.status > 399) {
      console.log(`Got HTTP error: ${response.status}`);
      return pages;
    }
    const contentType = response.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log(`Got non-html reponse: ${contentType}`);
      return pages;
    }

    // turn response into html string and then search for links
    htmlBody = await response.text();
    // console.log(htmlBody);
  } catch (err) {
    console.log(`${err.message}: ${currentURL}`);
  }

  const listOfLinks = getURLsFromHTML(htmlBody, currentURL);
  for (const nextLink of listOfLinks) {
    pages = await crawlPage(baseURL, nextLink, pages);
  }

  return pages;
}

function normalizeURL(url) {
  const urlObj = new URL(url);
  let fullPath = `${urlObj.host}${urlObj.pathname}`;
  fullPath = fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;
  return fullPath;
}

function getURLsFromHTML(htmlBody, baseURL) {
  const dom = new JSDOM(htmlBody);
  const links = dom.window.document.querySelectorAll('a');
  const newList = [];
  links.forEach((link) => {
    if (link.href.slice(0, 1) === '/') {
      try {
        const newUrl = new URL(link.href, baseURL).href;
        newList.push(newUrl);
        // console.log('successfully added url: ' + newUrl);
      } catch (e) {
        console.log(`${e.message}: ${link.href}`);
      }
    } else {
      try {
        const newUrl = new URL(link.href).href;
        newList.push(newUrl);
        // console.log('successfully added url: ' + newUrl);
      } catch (e) {
        console.log(`${e.message}: ${link.href}`);
      }
    }
  });

  return newList;
}

module.exports = {
  crawlPage,
  normalizeURL,
  getURLsFromHTML,
};
