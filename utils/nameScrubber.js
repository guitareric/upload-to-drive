const { resultObjMaker } = require('../utils/resultObjMaker')
const XRegExp = require('xregexp')

function nameScrubber(name) {
  let result = resultObjMaker()
  result.name = name
  let sizeRegexArr = []
  sizeRegexArr.push(XRegExp('[0-9][.]?[0-9]?[g]'))
  sizeRegexArr.push(XRegExp('\\d+oz'))
  sizeRegexArr.push(XRegExp('\\d+mL'))
  sizeRegexArr.push(XRegExp('\\d+ml'))
  sizeRegexArr.forEach(el => {
    const sizeResults = XRegExp.exec(result.name, el)
    if (sizeResults && sizeResults[0] !== '') {
      result.size = sizeResults[0]
      result.size = result.size.replace(sizeResults[0], '')
      result.size = result.size.replace('ml', '')
    }
  })
  const mgResults = XRegExp.exec(result.name.toLowerCase(), XRegExp('[0-9]?[0-9]?[0-9]?[0-9]?[.]?[0-9]?[0-9]?[m][g]'))

  if (mgResults) {
    result.thc = mgResults[0]
    result.name = result.name.replace(mgResults, '')
    result.name = result.name.replace('()', '')
    result.name = result.name.replace('[]', '')
    result.name = result.name.replace(mgResults, '')
    result.name = result.name.replace('()', '')
    result.name = result.name.replace('[]', '')
  }

  let packRegexArr = []
  packRegexArr.push(XRegExp('\\d+ct'))
  packRegexArr.push(XRegExp('\\d+ count'))
  packRegexArr.push(XRegExp('\\d+pack'))
  packRegexArr.push(XRegExp('\\d+pk'))
  packRegexArr.push(XRegExp('\\d+Pack'))

  packRegexArr.forEach(el => {
    const packResults = XRegExp.exec(result.name, el)

    if (packResults) {
      result.size = packResults[0]

      result.name = result.name.replace(result.size, '')
      result.name = result.name.replace('()', '')
      result.name = result.name.replace('[]', '')
    }
  })

  result.name = result.name.replace('CBD', '')
  result.name = result.name.replace('(', '')
  result.name = result.name.replace(')', '')
  result.name = result.name.replace('[', '')
  result.name = result.name.replace(']', '')
  result.name = result.name.replace('/spray', '')
  result.name = result.name.trim()

  let nameRegexArr = []
  let subNameSearch = [
    { subName: 'dart pod' },
    { subName: 'dart pod' },
    { subName: 'x bites' },
    { subName: 'disposable' },
    { subName: 'popcorn' },
    { subName: 'indoor' },
    { subName: 'smalls' },
    { subName: 'greenhouse' },
    { subName: 'live resin' },
    { subName: 'zombie resin' },
    { subName: 'badder' },
    { subName: 'budder' },
    { subName: 'shake' },
    { subName: 'pre-ground' },
    { subName: 'shatter' },
    { subName: 'novaa pod' },
    { subName: 'cube' },
    { subName: 'dart pod' },
  ]

  subNameSearch.forEach(el => {
    nameRegexArr.push(XRegExp(el.subName))
  })

  //   nameRegexArr.forEach(el => {
  //     let subName
  //     subName = XRegExp.exec(result.name.toLowerCase(), el)
  //     if (subName) {
  //       subName = subName[0]
  //       result.name.replace(subName, '')
  //       result.name += ` (${subName})`
  //     }
  //   })
  return result
}
module.exports = { nameScrubber: nameScrubber }
