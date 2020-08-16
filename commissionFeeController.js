//imports
const moment = require("moment");
const ConfigClass = require("./commissionConfigClass");
const compute = require("./compute");
const { USER_TYPE } = require("./enum");

(function () {
  let tempCashOutObj = {};
  let config = new ConfigClass();

  //update moment locale to change start day from sunday to monday
  moment.updateLocale("en", {
    week: {
      dow: 1,
    },
  });

  //function to round numbers to euro cents.
  //value: number
  //return: string
  const roundValueToCents = (value) => {
    return Number(Math.round(value + "e2") + "e-2").toFixed(2);
  };

  //function to process calculation of commission fee for cash in operation type
  //operation: object
  //type: string | "cash_in" | "cash_out"
  //return Promise<Number> : Calculated commission fee, rounded.
  const GetCashInValue = ({ operation, type }) => {
    return new Promise(async (resolve, reject) => {
      try {
        let cashInConfig = await config.getConfig({ type });
        let commFee = compute.getCashInFee(
          operation.amount,
          cashInConfig.percents,
          cashInConfig.max.amount
        );
        resolve(roundValueToCents(commFee));
      } catch (e) {
        reject(e);
      }
    });
  };

  //function to process calculation of commission fee for cash out operation type
  //data: object
  //return Promise<Number> : Calculated commission fee, rounded.
  const GetCashOutValue = (data) => {
    return new Promise(async (resolve, reject) => {
      const { operation, user_type, date, user_id } = data;
      const { amount } = operation;
      let cashOutConfig = await config.getConfig(data);
      try {
        let commFee = 0;
        if (user_type === USER_TYPE.JURIDICAL) {
          commFee = compute.getCashOutFeeForLegal(
            amount,
            cashOutConfig.percents,
            cashOutConfig.min.amount
          );
        } else {
          let week_id = moment(date).week();

          // temporary grouping of transactions per user_id by week
          tempCashOutObj[user_id] = tempCashOutObj[user_id] || {
            user_id,
            week: {},
          };
          tempCashOutObj[user_id].week[week_id] = tempCashOutObj[user_id].week[
            week_id
          ] || {
            hasFreeCharge: true,
            week_id,
          };
          //end of grouping

          commFee = compute.getCashOutFeeForNatural(
            amount,
            cashOutConfig.percents,
            cashOutConfig.week_limit.amount,
            tempCashOutObj[user_id].week[week_id].hasFreeCharge
          );

          //identifier if has free of charge or actual deduction.
          tempCashOutObj[user_id].week[week_id].hasFreeCharge = false;
        }
        resolve(roundValueToCents(commFee));
      } catch (e) {
        reject(e);
      }
    });
  };

  //exports reusable methods
  module.exports = {
    GetCashInValue,
    GetCashOutValue,
    roundValueToCents,
  };
})();
