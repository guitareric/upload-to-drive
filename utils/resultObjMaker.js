function resultObjMaker() {
  let result = {}
  result.name = ''
  result.category = ''
  result.price = ''
  // result.pricePerMg = ''
  result.brand = ''
  result.strainType = ''
  result.size = ''
  result.thc = ''
  // result.cbd = ''
  result.storeName = ''
  result.storeLocation = ''

  return result
}

module.exports = { resultObjMaker: resultObjMaker }
