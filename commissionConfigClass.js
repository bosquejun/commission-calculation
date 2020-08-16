const request = require("request");
const appConfig = require("./appConfig.json");
const { USER_TYPE, ITEM_TYPE } = require("./enum");

//Class Configuration
function CommissionConfig() {
  //property declartion for singleton instance value
  this._cashInConfig = null;
  this._cashOutConfigNatural = null;
  this._cashOutConfigLegal = null;

  //public function to fetch data from API
  //options: object - url and method
  //return: Promise<Object> - JSON Object API Response
  this.fetchAPI = async (options) => {
    return new Promise((resolve, reject) => {
      request(options, (err, response, body) => {
        if (err) reject(err);
        else {
          try {
            let jsonData = JSON.parse(body);
            resolve(jsonData);
          } catch (e) {
            reject("Cannot connect to the network.");
          }
        }
      });
    });
  };

  //public function to get specific config based on operation type
  //type: string | "cash_in" | "cash_out"
  //return Promise<Object> - operation configuration
  this.getConfig = async ({ type, user_type }) => {
    switch (type) {
      case ITEM_TYPE.CASH_IN:
        //one time request for cash in configuration from API.
        if (this._cashInConfig === null)
          this._cashInConfig = await this.fetchAPI({
            url: `${appConfig.API_URL_CONFIG}/cash-in`,
            method: "GET",
          });
        return this._cashInConfig;
      case ITEM_TYPE.CASH_OUT:
        let _config = "No Config";
        //one time request for cash out configuration from API
        switch (user_type) {
          case USER_TYPE.NATURAL:
            if (this._cashOutConfigNatural === null)
              this._cashOutConfigNatural = await this.fetchAPI({
                url: `${appConfig.API_URL_CONFIG}/cash-out/natural`,
                method: "GET",
              });
            _config = this._cashOutConfigNatural;
            break;
          case USER_TYPE.JURIDICAL:
            if (this._cashOutConfigLegal === null)
              this._cashOutConfigLegal = await this.fetchAPI({
                url: `${appConfig.API_URL_CONFIG}/cash-out/juridical`,
                method: "GET",
              });
            _config = this._cashOutConfigLegal;
            break;
        }
        return _config;
      default:
        return "No Config";
    }
  };
}

module.exports = CommissionConfig;
