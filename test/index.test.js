const assert = require("assert");
const indexProcess = require("../index");

describe("Argument Testing", () => {
  it("argument is json file", () => {
    let LAST_PARAM = process.argv[process.argv.length - 1];
    let PARAM_VALUE = LAST_PARAM.split("=")[1];
    let isJsonFile = indexProcess.argIsJsonFile(PARAM_VALUE);

    assert.equal(isJsonFile, true);
  });

  it("input file is json object", () => {
    let LAST_PARAM = process.argv[process.argv.length - 1];
    let PARAM_VALUE = LAST_PARAM.split("=")[1];
    assert.equal(typeof indexProcess.getJsonData(PARAM_VALUE), "object");
  });
});
