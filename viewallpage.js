const request = require("request");
const cheerio = require("cheerio");
const scorecardObj = require("./scorecard.js");

function gotoallviewpage(url) {
  request(url, cb1);
}
function cb1(error, responce, html) {
  if (error) {
    console.log("error1 ");
  } else {
    extractallviewpage(html);
  }
}
function extractallviewpage(html) {
  let $ = cheerio.load(html);
  // console.log('hello i am in next page now ');
  let scorecards = $("a[data-hover='Scorecard']");
  for (let i = 0; i < scorecards.length; i++) {
    let linksofscorecard = $(scorecards[i]).attr("href");
    let fullscorecardlink = "https://www.espncricinfo.com" + linksofscorecard;
    console.log(fullscorecardlink);
    scorecardObj.gs(fullscorecardlink);
  }
}

module.exports = {
  allviewpage: gotoallviewpage,
};
