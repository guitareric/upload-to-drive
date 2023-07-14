const json2csv = require('json2csv').parse
const fs = require('fs')
const XRegExp = require('xregexp')
const { resultObjMaker } = require('../utils/resultObjMaker')

async function dragonflyScrubber() {
  const storeInformation = [
    {
      storeName: 'Dragonfly Wellness',
      storeLocation: 'SLC',
      url: 'https://6gdqkyi2wbh2zbxwgy6j5wo5ja.appsync-api.us-west-2.amazonaws.com/graphql',
    },
    // {
    //   storeName: 'Dragonfly Wellness',
    //   storeLocation: 'Price',
    //   url: 'https://zywowa2refffhmcafkqk3zixfe.appsync-api.us-west-2.amazonaws.com/graphql',
    // },
  ]

  storeInformation.forEach(async el => {
    const dataObj = await fetch('https://6gdqkyi2wbh2zbxwgy6j5wo5ja.appsync-api.us-west-2.amazonaws.com/graphql', {
      headers: {
        accept: 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/json; charset=UTF-8',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-amz-user-agent': 'aws-amplify/4.7.14 js',
        'x-api-key': 'da2-qgoaimwf65gitibeajemba4hgq',
        Referer: 'https://dragonflywellness.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: '{"query":"query ListProducts($filter: ModelProductFilterInput, $limit: Int, $nextToken: String) {\\n  listProducts(filter: $filter, limit: $limit, nextToken: $nextToken) {\\n    items {\\n      id\\n      externalID\\n      name\\n      itemNumber\\n      category\\n      categoryID\\n      subcategory\\n      subcategoryID\\n      quantity\\n      price\\n      discount\\n      description\\n      imageURL\\n      availableOnline\\n      VIP\\n      limit\\n      categoryLimitID\\n      CategoryLimit {\\n        id\\n        categoryID\\n        subcategoryID\\n        limit\\n        createdAt\\n        updatedAt\\n      }\\n      potency {\\n        nextToken\\n      }\\n      terpenes {\\n        nextToken\\n      }\\n      reviews {\\n        nextToken\\n      }\\n      effects\\n      potencyStrings\\n      rating\\n      tags {\\n        nextToken\\n      }\\n      brandName\\n      strain\\n      chemoType\\n      dominance\\n      weight\\n      thcEquivilency\\n      createdAt\\n      updatedAt\\n      backupImages\\n      activeReviews\\n      totalReviews\\n    }\\n    nextToken\\n  }\\n}\\n","variables":{"limit":1000,"nextToken":null,"filter":{"quantity":{"gt":0},"price":{"gt":0},"availableOnline":{"eq":true}}}}',
      method: 'POST',
    })
      .then(response => {
        return response.json().then(data => {
          return data
        })
      })
      .catch(function (err) {
        console.log('Unable to fetch -', err)
      })

    const results = dataObj.data.listProducts.items
    const storeInfo = { storeName: el.storeName, storeLocation: el.storeLocation }
    let parsedResults = []
    results.forEach(el => {
      const result = resultObjMaker()
      result.storeName = storeInfo.storeName
      result.storeLocation = storeInfo.storeLocation

      result.name = el.name

      let sizeRegexArr = []
      sizeRegexArr.push(XRegExp('[0-9][.]?[0-9]?[g][m]'))
      sizeRegexArr.push(XRegExp('\\d+oz'))
      sizeRegexArr.push(XRegExp('[0-9]?[0-9]?[0-9]?[0-9]?[m][L]'))
      sizeRegexArr.push(XRegExp('\\d+[m][l]'))

      sizeRegexArr.forEach(el => {
        const sizeResults = XRegExp.exec(result.name, el)
        if (sizeResults) {
          result.size = sizeResults[0].replace('gm', 'g')
        }
      })

      const mgResults = XRegExp.exec(result.name, XRegExp('\\d+mg'))

      if (mgResults) {
        result.thc = mgResults[0]
        if (result.name.includes('Vape')) {
          result.size = mgResults[0].replace('mg', '')
          result.size = Number(result.size) / 1000
          result.size = `${result.size}g`
        }
      }

      let packRegexArr = []
      packRegexArr.push(XRegExp('\\d+ct'))
      packRegexArr.push(XRegExp('\\d+ count'))
      packRegexArr.push(XRegExp('\\d+pack'))
      packRegexArr.push(XRegExp('\\d+-pk'))
      packRegexArr.push(XRegExp('\\d+Pack'))

      packRegexArr.forEach(el => {
        const packResults = XRegExp.exec(result.name, el)

        if (packResults) {
          result.size = packResults[0]
          result.size = result.size.replace(' count', 'pk')
          result.size = result.size.replace('ct', 'pk')
        }
      })

      // Betty POD 1gm SOUR APPLE
      // WholesomeCo Vape 1gm GUAVA PIE
      // WholesomeCo Conc. Live Badder 1gm STRAWBERRY COUGHY CAKE
      // DF POD 500mg ALL GAS OG
      // Complete MiniNail Kit w/ Gold Controller - Quartz Hyrid Nail Gold / Space Needle Gold
      // Pure Plan Flower 7gm KING'S KUSH
      // WholesomeCo Gummy 100mgTHC PURPLE PUNCH (10ct)
      // Elude Vape 1gm CANNALOUPE HAZE
      // DaVinci IQ2 - GREY
      // Hilight Straw Plastic Grinder
      // Moxie Vape 1gm ANGEL SHUSH Live Resin
      // Pure Plan Flower 1gm KING'S KUSH
      // Boundless VEXIL Dry Herb Vaporizer - TEAL
      // Dip Devices Little Dipper Replacement Tips
      // Puffco Heated Loading Tool Green
      // High Variety Flower 14gm GELLO
      // Snowbird Strains Vape 1gm LEMON CHERRY GELATO
      // G Pen Hyer 10mm Glass Adapter
      // Standard Wellness Gummies 100mgTHC PINEAPPLE BASIL ENERGY BLEND
      // Standard Wellness Flower 28gm SUNSET SHERBERT
      // Wholesome Co Flower 3.5gm CARAMEL CREAM
      // Boojum Vape 1gm SENSI STAR
      // Snowbird Strain Vape 1gm ICY MINT
      // Standard Wellness Flower 7gm SUNSET SHERBERT
      // Pure Plan Vape 1gm HAWAIIAN HAZE Pure Harmony
      // MiniNail Quartz Terp Sphere 3-Pack - LARGE

      // Betty Flower 7gm EMERALD FIRE OG
      // Hilight Gummies 750mgTHC CLEMENTINE CITRUS (10ct)
      result.name = result.name.replace('DF', '')
      result.name = result.name.replace('FB', '')
      result.name = result.name.replace('HYGGE', '')

      let nameRegexArr = []
      nameRegexArr.push(XRegExp('Pod'))
      nameRegexArr.push(XRegExp('Cliq Pod'))
      nameRegexArr.push(XRegExp('X Bites'))
      nameRegexArr.push(XRegExp('Disposable'))
      nameRegexArr.push(XRegExp('Popcorn'))
      nameRegexArr.push(XRegExp('Indoor'))
      nameRegexArr.push(XRegExp('Smalls'))
      nameRegexArr.push(XRegExp('Greenhouse'))
      nameRegexArr.push(XRegExp('Indoor Popcorn'))
      nameRegexArr.push(XRegExp('Live Resin'))
      nameRegexArr.push(XRegExp('Zombie Resin'))
      nameRegexArr.push(XRegExp('Badder'))
      nameRegexArr.push(XRegExp('Budder'))
      nameRegexArr.push(XRegExp('Sugar Wax'))
      nameRegexArr.push(XRegExp('Shake'))
      nameRegexArr.push(XRegExp('Pre-Ground'))
      nameRegexArr.push(XRegExp('Shatter'))
      nameRegexArr.push(XRegExp('NOVAA Pod'))
      nameRegexArr.push(XRegExp('Capsules'))
      nameRegexArr.push(XRegExp('Cube'))
      nameRegexArr.push(XRegExp('Gummy'))
      nameRegexArr.push(XRegExp('Gummies'))
      let subNameArr = []
      nameRegexArr.forEach(el => {
        let subName
        subName = XRegExp.exec(result.name, el)
        if (subName) {
          subName = subName[0]
          subNameArr.push(subName)
        }
      })

      result.category = el.category
      if (result.category === 'Infused Edible') {
        const subCategory = el.subcategory
        result.category = 'Edibles'
        if (subCategory === 'Tincture') {
          result.category = 'Tinctures'
        }
      }
      if (result.category === 'Unmedicated') {
        result.category = 'Accessories'
      }
      if (result.category === 'Infused Non-edible') {
        const subCategory = el.subcategory
        result.category = 'Topicals'
        if (subCategory === 'Tincture') {
          result.category = 'Tinctures'
        }
      }
      if (result.category === 'Cartpens') {
        result.category = 'Vaporizers'
      }

      if (result.category !== 'Accessories' && result.category !== 'Topicals') {
        result.name = dfNameParser(result.name)
        result.name.forEach((el, i) => {
          if (el.name) {
            if (i === 0) {
              result.name = el.name
            } else {
              result.name += el.name
            }
          }
        })
      }
      if (typeof result.name === 'object') {
        result.name = result.name[0]
      }

      result.price = el.price.toFixed(0)
      result.brand = el.brandName
      if (el.strain !== null) {
        result.strainType = el.dominance

        if (el.dominance === 'SATIVA - HYBRID' || el.dominance === 'INDICA - HYBRID' || el.dominance === 'HYBRID') {
          result.strainType = 'Hybrid'
        }
        if (el.dominance === 'INDICA') {
          result.strainType = capitalizeFirstLetter(el.dominance)
        }
        if (el.dominance === 'SATIVA') {
          result.strainType = capitalizeFirstLetter(el.dominance)
        }
      }
      const THC = el.potencyStrings[0]
      if (result.category !== 'Accessories' && result.category !== 'Topicals' && THC) {
        if (!result.size) {
          if (el.weight) {
            result.size = el.weight
          }
        }
        if (THC.includes('%')) {
          result.thc = el.potencyStrings[0]
          result.thc = result.thc.replace('Total THC*: ', '')
          result.thc = result.thc.replace('%', '')

          result.thc = Number(result.thc).toFixed(0)
          result.thc += '%'
        }

        // result['CBD(%)'] = ''
        // result['CBD(mg)'] = ''
      }

      result.storeName = storeInfo.storeName
      result.storeLocation = storeInfo.storeLocation
      // result['Image'] = el.imageURL
      // console.log(result.name)
      parsedResults.push(result)
    })
    const csv = json2csv(parsedResults)
    fs.appendFile('Cannabis Inventory.csv', csv, 'utf8', function (err) {})
  })
}

function dfNameParser(name, subNameArr) {
  let results = []
  let splitName = name.split(' ')

  splitName.forEach((el, i) => {
    let result = {}
    if (isUpperCase(el)) {
      result.name = capitalizeFirstLetter(el)
    }

    if (result.name) {
      result.name = result.name.trim()
      results.push(result)
    }
  })

  return results
}

function isUpperCase(str) {
  return str === str.toUpperCase()
}

function capitalizeFirstLetter(string) {
  if (string) {
    let newString = string.toLowerCase()
    const strArr = newString.split('')
    const newFirstLetter = strArr[0]
    newString = newFirstLetter.toUpperCase() + newString.slice(1) + ' '
    return newString
  }
}

module.exports = { dragonflyScrubber: dragonflyScrubber }
