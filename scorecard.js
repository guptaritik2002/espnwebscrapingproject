const request = require("request");
const cheerio = require("cheerio");
const fs=require("fs");
const path=require("path");
const xlsx=require("xlsx");
// const url ="https://www.espncricinfo.com/series/ipl-2020-21-1210595/rajasthan-royals-vs-kolkata-knight-riders-12th-match-1216504/full-scorecard";
function getscorecardurl(url) {
  request(url, cb);
}

function cb(error, responce, html) {
  if (error) {
    console.log("error2");
  } else {
    // console.log('i am here please see me ');
    extractMatchdetails(html);
  }
}

function extractMatchdetails(html) {
  let $ = cheerio.load(html);
  //ipl
  //team
  //player
  //all statistics of all match he played ,opponenent

  //for both teams venue ,date and result are common     -------------done .
  //venue and date ->".header-info .description"//already able to scrape this data.
  // result-> ".event .status-text"//able to scrape this data also .
  let descElem = $(".header-info .description");
  let result = $(".event .status-text");
  let stringArr = descElem.text().split(",");
  let venue = stringArr[1].trim();
  let date = stringArr[2].trim();
  result = result.text().trim();
  //  console.log(result);
  let innings = $(".match-scorecard-page .Collapsible");
  // let htmlstring = "";
  for (let i = 0; i < innings.length; i++) {
    // htmlstring+=$(innings[i]).html();//able to take out the html of the smaller area so that i can work on specific area without any clutter  .
    let teamname = $(innings[i])
      .find(".header-title.label")
      .text()
      .split("INNINGS")[0]
      .trim();
    let opponentindex = i == 0 ? 1 : 0;
    let opponentName = $(innings[opponentindex])
      .find(".header-title.label")
      .text()
      .split("INNINGS")[0]
      .trim();
    console.log(`\n ${date} | ${venue} | ${teamname} vs ${opponentName} | ${result}\n `);
    let cInning = $(innings[i]);
    let allrows = cInning.find(".table.batsman tbody tr"); //all rows of the innings .
    for (let j = 0; j < allrows.length; j++) {
      let allcols = $(allrows[j]).find("td"); //all cols of the row in form of the array .
      let isworthy = $(allcols[0]).hasClass("batsman-cell"); //returns boolean value .if the 0 the colmn has class batsman-cell then only we can go inside the if block
      if (isworthy) {
        let name = $(allcols[0]).text().trim();
        let runs = $(allcols[2]).text().trim();
        let balls = $(allcols[3]).text().trim();
        let fours = $(allcols[5]).text().trim();
        let sixes = $(allcols[6]).text().trim();
        let StrikeRate = $(allcols[7]).text().trim();
        console.log(`name: ${name}------->runs: ${runs} | balls: ${balls} | fours: ${fours} | sixes: ${sixes} | strikerate: ${StrikeRate}` );
        processPlayer(teamname, name, runs, balls, fours, sixes, StrikeRate, opponentName, venue, date, result);
      }
    }
  }
}



function processPlayer(teamname, name, runs, balls, fours, sixes, StrikeRate, opponentName, venue, date, result)
{
let teampath=path.join(__dirname,"ipl",teamname);
dircreater(teampath);
let filePath=path.join(teampath,name+".xlsx");
excelReader(filePath, name);
let content = excelReader(filePath, name);
let playerObj = {
   "Runs scored":runs,
    "Balls":balls,
    "Fours":fours,
    "Sixes":sixes,
    "Strike rate":StrikeRate,
    "Opponent name":opponentName,
    "Venue":venue,
    "Date":date,
    "Result":result
}
content.push(playerObj);
excelWriter(filePath, content, name);

}
function dircreater(filepath)
{
  if(fs.existsSync(filepath)==false)
  {
    fs.mkdirSync(filepath);
  }
}
function excelWriter(filePath, json, sheetName) {
  let newWB = xlsx.utils.book_new();
  let newWS = xlsx.utils.json_to_sheet(json);
  xlsx.utils.book_append_sheet(newWB, newWS, sheetName);
  xlsx.writeFile(newWB, filePath);
}
function excelReader(filePath, sheetName) {
  if (fs.existsSync(filePath) == false) {
      return [];
  }
  let wb = xlsx.readFile(filePath);
  let excelData = wb.Sheets[sheetName];
  let ans = xlsx.utils.sheet_to_json(excelData);
  return ans;
}

module.exports = {
  gs: getscorecardurl,
};
