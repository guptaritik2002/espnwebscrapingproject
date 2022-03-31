const request = require("request");
const cheerio = require("cheerio");
const fs=require("fs");
const path=require("path");

const iplpath=path.join(__dirname,"ipl");
dircreater(iplpath);

const viewallpageObj = require("./viewallpage");
const url = "https://www.espncricinfo.com/series/ipl-2020-21-1210595";
request(url, cb);
function cb(error, responce, html) {
  if (error) {
    console.log("error ");
  } else {
    extracthtml(html);
  }
}

function extracthtml(html) {
  let $ = cheerio.load(html);
  let anchorelem = $("a[data-hover='View All Results']");
  let link = $(anchorelem).attr("href");
  let fulllink = "https://www.espncricinfo.com" + link;
  // console.log(fulllink);
  viewallpageObj.allviewpage(fulllink);
}

function dircreater(filepath)
{
  if(fs.existsSync(filepath)==false)
  {
    fs.mkdirSync(filepath);
  }
}
