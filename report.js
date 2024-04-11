function sortDecending(pages) {
  let pageArr = Object.entries(pages);

  pageArr.sort((a, b) => {
    return b[1] - a[1];
  });
  console.log(pageArr);
  return pageArr;
}

function printReport(pages) {
  console.log('=========================================');
  console.log('Report is starting...');
  console.log('=========================================');
  let sortedPages = sortDecending(pages);
  for (const page of sortedPages) {
    console.log(`Found ${page[1]} internal links to ${page[0]}`);
  }
}

module.exports = {
  printReport,
  sortDecending,
};
