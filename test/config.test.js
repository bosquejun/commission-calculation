const assert = require("assert");
const ConfigClass = require("../commissionConfigClass");
const config = new ConfigClass();

describe("CASH-IN Operation Testing", () => {
  let cashInConfig = null;

  it("Percent is 0.03%", async () => {
    cashInConfig = await config.getConfig({
      type: "cash_in",
    });
    assert.equal(cashInConfig.percents, 0.03);
  });

  it("Max commission fee is 5 EURO", () => {
    assert.equal(cashInConfig.max.amount, 5);
  });
});

describe("CASH-OUT Operation Testing", () => {
  let cashOutConfig = null;

  describe("Natural Person Testing", () => {
    it("Percent is 0.3%", async () => {
      cashOutConfig = await config.getConfig({
        type: "cash_out",
        user_type: "natural",
      });
      assert.equal(cashOutConfig.percents, 0.3);
    });

    it("Weekly limit amount is 1000 EURO", async () => {
      assert.equal(cashOutConfig.week_limit.amount, 1000);
    });
  });
  describe("Legal Person Testing", () => {
    it("Percent is 0.3%", async () => {
      cashOutConfig = await config.getConfig({
        type: "cash_out",
        user_type: "juridical",
      });
      assert.equal(cashOutConfig.percents, 0.3);
    });

    it("Min commission fee is 0.5 cents", async () => {
      assert.equal(cashOutConfig.min.amount, 0.5);
    });
  });
});
