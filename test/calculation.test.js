const assert = require("assert");
const controller = require("../commissionFeeController");
const compute = require("../compute");

describe("CASH-IN Calculation", () => {
  it("Commission fee is less than maximum amount", () => {
    let fee = compute.getCashInFee(100, 0.03, 5);
    assert.equal(fee <= 5, true);
  });

  it("Commission fee should be 5 EURO", () => {
    let fee = compute.getCashInFee(2000000, 0.03, 5);
    assert.equal(fee, 5);
  });
});

describe("CASH-OUT Calculation", () => {
  describe("Natural Person", () => {
    it("Commission fee should be free of charge since amount is less than 1000 EURO", () => {
      let fee = compute.getCashOutFeeForNatural(999, 0.3, 1000, true);
      assert.equal(fee, 0);
    });

    it("Commission fee is calculated from exceeded amount", () => {
      let expectedFee = 1.5;
      let fee = compute.getCashOutFeeForNatural(1500, 0.3, 1000, true);
      assert.equal(fee, expectedFee);
    });

    it("Commission fee is calculated from the total amount", () => {
      let expectedFee = 4.5;
      let fee = compute.getCashOutFeeForNatural(1500, 0.3, 1000, false);
      assert.equal(fee, expectedFee);
    });
  });

  describe("Legal Person", () => {
    it("Commission fee should not be less than 0.50 EURO", () => {
      let fee = compute.getCashOutFeeForLegal(2, 0.3, 0.5);
      assert.equal(fee >= 0.5, true);
    });
  });
});

describe("Commission fee should be rounded to cents", () => {
  it("0.048 EURO should be 0.05", () => {
    assert.equal(controller.roundValueToCents(0.048), 0.05);
  });

  it("0.071 EURO should be 0.07", () => {
    assert.equal(controller.roundValueToCents(0.071), 0.07);
  });
});
