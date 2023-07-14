const { resultObjMaker } = require('../utils/resultObjMaker')

function nameParser(name, delimiter) {
  let results = []
  let splitName = []
  splitName = name.split(delimiter)
  splitName.forEach((el, i) => {
    let result = resultObjMaker()
    if (i === 0) {
      result.name = el
    }
    result.name = result.name.trim()
    results.push(result)
  })
  return results
}
module.exports = { nameParser: nameParser }
