//function to calculate Commission Fee for Cash in transaction
//amount: string | number
//rate: string | number
//maxFee: string | number
//return: number
function getCashInFee(amount, rate, maxFee) {
  let fee = Number(amount) * (Number(rate) / 100);
  return fee >= maxFee ? maxFee : fee;
}

//function to calculate Commission Fee for Cash out transaction of Legal Persons
//amount: string | number
//rate: string | number
//minFee: string | number
//return: number;
function getCashOutFeeForLegal(amount, rate, minFee) {
  let fee = Number(amount) * (Number(rate) / 100);
  return fee <= minFee ? minFee : fee;
}

//function to calculate Commission Fee for Cash out transaction of Natural Persons
//amount: string | number
//rate: string | number
//minAmount: string | number
//isFreeOfCharge: boolean
//return: number;
function getCashOutFeeForNatural(amount, rate, minAmount, isFreeOfCharge) {
  let amnt = Number(amount);
  let minAmnt = Number(minAmount);
  let fee =
    isFreeOfCharge && amnt <= minAmnt
      ? 0
      : (amnt - (isFreeOfCharge ? minAmnt : 0)) * (Number(rate) / 100);
  return fee;
}

module.exports = {
  getCashInFee,
  getCashOutFeeForLegal,
  getCashOutFeeForNatural,
};
