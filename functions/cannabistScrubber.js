const json2csv = require('json2csv').parse
const fs = require('fs')
const XRegExp = require('xregexp')
const { resultObjMaker } = require('./../utils/resultObjMaker')
const { nameScrubber } = require('../utils/nameScrubber')

async function cannabistScrubber() {
  const storeInformation = [
    {
      storeName: 'Cannabist',
      storeLocation: 'Springville',
      url: 'https://vfm4x0n23a-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(4.14.2)%3B%20Browser%3B%20JS%20Helper%20(3.11.1)%3B%20react%20(18.2.0)%3B%20react-instantsearch%20(6.36.0)',
    },
  ]

  storeInformation.forEach(async el => {
    const dataObj = await fetch(el.url, {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'content-type': 'application/x-www-form-urlencoded',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'cross-site',
        'x-algolia-api-key': 'b499e29eb7542dc373ec0254e007205d',
        'x-algolia-application-id': 'VFM4X0N23A',
        Referer: 'https://www.iheartjane.com/',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: '{"requests":[{"indexName":"menu-products-production","params":"facets=%5B%5D&filters=store_id%20%3D%203196%20&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&highlightPreTag=%3Cais-highlight-0000000000%3E&hitsPerPage=1000&page=0&tagFilters=&userToken=VUuRviwuPuaxU9LIgDsp-"}]}',
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

    const results = dataObj.results[0].hits
    const storeInfo = { storeName: el.storeName, storeLocation: el.storeLocation }
    let parsedResults = []
    results.forEach(el => {
      const result = resultObjMaker()

      result.name = el.name.replace('Hygge ', '')
      result.name = result.name.replace('Jilu ', '')
      result.name = result.name.replace('Zion', '')
      result.name = result.name.replace('Boojum ', '')
      result.name = result.name.replace('CBD ', '')
      result.name = result.name.replace('THC:', '')
      result.name = result.name.replace('THCA:', '')
      result.name = result.name.replace(' CBG', '')
      result.name = result.name.replace(' CBD:CBG', '')
      result.name = result.name.replace('1 THC', '1')
      result.name = result.name.replace(':2:Cit', ':2 Cit')

      result.name = result.name.replace('CBN ', '')
      result.name = result.name.replace(':THC ', '')
      result.name = result.name.replace(' : ', '')
      result.name = result.name.replace(' Tincture', '')
      result.name = result.name.replace(':Tincture', '')
      result.name = result.name.replace(':1 CBDW', ':1 W')

      const scrubbedName = nameScrubber(result.name)
      for (var key in scrubbedName) {
        if (key === 'name') {
          result.name = scrubbedName.name
        }
        if (key === 'size') {
          result.size = scrubbedName.size
        }
        if (key === 'thc') {
          result.thc = scrubbedName.thc
        }
      }

      result.category = el.kind
      if (result.category === 'vape') {
        result.category = 'Vaporizers'
      }
      if (result.category === 'gear') {
        result.category = 'Accessories'
      }
      if (result.category === 'flower') {
        result.category = 'Flower'
      }
      if (result.category === 'edible') {
        result.category = 'Edibles'
      }
      if (result.category === 'topical') {
        result.category = 'Topicals'
      }
      if (result.category === 'tincture') {
        result.category = 'Tinctures'
      }
      if (result.category === 'extract') {
        result.category = 'Concentrates'
      }

      result.price = el.bucket_price.toFixed(0)
      // result['Price/mg'] = ''
      result.brand = el.brand
      if (el.category) {
        result.strainType = el.category
        if (result.strainType === 'cbd') {
          result.strainType = 'High CBD'
        }
        if (el.category === 'hybrid') {
          result.strainType = 'Hybrid'
        }
        if (el.category === 'indica') {
          result.strainType = 'Indica'
        }
        if (el.category === 'sativa') {
          result.strainType = 'Sativa'
        }
      }
      if (result.size === '') {
        if (el.net_weight_grams) {
          result.size = el.net_weight_grams
        }
      }
      if (result.thc === '') {
        if (el.percent_thca !== null) {
          result.thc = el.percent_thca.toFixed(0)
          result.thc += '%'
        }
      }

      result.storeName = storeInfo.storeName
      result.storeLocation = storeInfo.storeLocation
      // if (el.image_photos !== null) {
      //   result['Image'] = el.image_photos[0].id
      // }

      parsedResults.push(result)
    })
    const csv = json2csv(parsedResults)
    fs.appendFile('Cannabis Inventory.csv', csv, 'utf8', function (err) {})
  })
}
module.exports = { cannabistScrubber: cannabistScrubber }
