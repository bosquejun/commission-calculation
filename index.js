//imports
const fs = require("fs");
const commissionCalculator = require("./commissionFeeController");
const { ITEM_TYPE } = require("./enum");
const path = require("path");

(function () {
  //Function to check if parameter is filename and has .json extension.
  //returns true if argument is .json file and false if not.
  //filePath: string
  function argIsJsonFile(filePath) {
    if (filePath === undefined) {
      console.log("Please provide input data file path. e.g ./input.json");
      return false;
    }
    return path.basename(filePath).split(".")[1] === "json";
  }

  //function to check if file is existing and read if so. Throws an error if file is not existing.
  // filePath: string
  const getDataFromFile = (filePath) => {
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    } else throw new Error(`${filePath} is not existing.`);
  };

  //function to parse json string to json object
  //_param: json string
  const getJsonData = (_param) => {
    try {
      let fileData = getDataFromFile(_param);
      return JSON.parse(fileData);
    } catch (e) {
      throw new Error("Invalid Json File Content. Please check the data.");
    }
  };

  //function for iteration of json array.
  const processData = async (data) => {
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      let commissionFee = 0;
      if (item.type === ITEM_TYPE.CASH_IN)
        commissionFee = await commissionCalculator.GetCashInValue(item);
      else if (item.type === ITEM_TYPE.CASH_OUT)
        commissionFee = await commissionCalculator.GetCashOutValue(item);
      else {
        console.log("type is invalid");
        continue;
      }
      console.log(commissionFee);
    }
  };

  let param = process.argv.slice(2)[0];

  //start process of commission fee calculation from the input data
  if (argIsJsonFile(param)) {
    let inputJson = getJsonData(param);
    processData(inputJson);
  }

  //exports reusable methods
  module.exports = {
    getDataFromFile,
    getJsonData,
    argIsJsonFile,
  };
})();
