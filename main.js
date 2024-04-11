const { argv } = require('node:process');
const { crawlPage } = require('./crawl.js');
const { printReport } = require('./report.js');

async function main() {
  try {
    checkArgs();
    const baseUrl = argv[2];
    console.log(`Now scraping website at ${baseUrl}`);
    const pages = await crawlPage(baseUrl);
    console.log('returned from scraping website');
    printReport(pages);
  } catch (err) {
    console.log(`Error: ${err.message}`);
  }
}

function checkArgs() {
  if (argv.length != 3) {
    throw new Error('must have only 1 argument');
  }
}

main();
