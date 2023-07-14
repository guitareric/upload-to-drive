const json2csv = require('json2csv').parse
const fs = require('fs')
const { nameParser } = require('../utils/nameParser')
const { resultObjMaker } = require('../utils/resultObjMaker')

async function cureleafScrubber() {
  const storeInformation = [
    {
      storeName: 'Cureleaf',
      storeLocation: 'Lehi',
      fetchUrl: 'https://graph2.curaleaf.com/api/curaql',
      fetchHeaders: {
        headers: {
          'Content-Type': 'application/json',
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'content-type': 'application/json',
          'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-site',
        },
        referrer: 'https://curaleaf.com/',
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: '{"operationName":"PGP","variables":{"dispensaryUniqueId":"LMR059","menuType":"MEDICAL"},"query":"fragment grid on Product {\\n  brand {\\n    description\\n    id\\n    image {\\n      url\\n      __typename\\n    }\\n    name\\n    slug\\n    __typename\\n  }\\n  cardDescription\\n  category {\\n    displayName\\n    key\\n    __typename\\n  }\\n  description\\n  id\\n  images {\\n    url\\n    __typename\\n  }\\n  labResults {\\n    thc {\\n      formatted\\n      range\\n      __typename\\n    }\\n    __typename\\n  }\\n  name\\n  offers {\\n    id\\n    title\\n    __typename\\n  }\\n  strain {\\n    key\\n    displayName\\n    __typename\\n  }\\n  subcategory {\\n    key\\n    displayName\\n    __typename\\n  }\\n  variants {\\n    id\\n    isSpecial\\n    option\\n    price\\n    quantity\\n    specialPrice\\n    __typename\\n  }\\n  __typename\\n}\\n\\nquery PGP($dispensaryUniqueId: ID!, $menuType: MenuType!) {\\n  dispensaryMenu(dispensaryUniqueId: $dispensaryUniqueId, menuType: $menuType) {\\n    offers {\\n      id\\n      title\\n      __typename\\n    }\\n    products {\\n      ...grid\\n      __typename\\n    }\\n    __typename\\n  }\\n}"}',
        method: 'POST',
        mode: 'cors',
        credentials: 'omit',
      },
    },
  ]
  storeInformation.forEach(async el => {
    try {
      const dataObj = await fetch(el.fetchUrl, el.fetchHeaders).then(async response => {
        const data = await response.json()
        return data
      })
      dataObj.data.dispensaryMenu.products[0].cardDescription
      const results = dataObj.data.dispensaryMenu.products
      const storeInfo = {}
      storeInfo.storeName = el.storeName
      storeInfo.storeLocation = el.storeLocation
      let parsedResults = []
      results.forEach(el => {
        const result = resultObjMaker()

        result.name = el.name
        result.name = result.name.replace('Dosing | ', '')
        result.name = result.name.replace('Effect | Calm | ', '')
        result.name = result.name.replace('Effect | Creative | ', '')
        result.name = result.name.replace('Effect | Energy | ', '')
        result.name = result.name.replace('Effect | Craft | ', '')
        result.name = result.name.replace('Effect | Awake | ', '')
        result.name = result.name.replace('Effect | Rest | ', '')
        result.name = result.name.replace('Craft | ', '')
        result.name = result.name.replace('Awake | ', '')
        result.name = result.name.replace('Rest | ', '')
        result.name = result.name.replace('Energy | ', '')
        result.name = result.name.replace('Creative | ', '')
        result.name = result.name.replace('Calm | ', '')
        const delimiter = '|'
        const parsedName = nameParser(result.name, delimiter)
        result.name = parsedName[0].name

        result.name = result.name.replace('PP ', '')
        result.name = result.name.replace('Tryke ', '')

        result.name = result.name.replace(' Tincture', '')

        result.name = result.name.replace('Gummy ', '')
        result.name = result.name.replace('Gummies', '')
        result.name = result.name.replace(' Cartridge', '')
        result.name = result.name.replace(' Live Resin', '')

        result.name = result.name.replace(' THC:CBG', '')
        result.name = result.name.replace(' CBN:THC', '')
        result.name = result.name.replace(' CBG', '')

        result.name = result.name.replace(' CBG:CBD', '')
        result.name = result.name.replace(' Distillate ', '')
        result.name = result.name.replace(' THC:CBN:CBD ', '')
        result.name = result.name.replace(' THC:CBD:CBN ', '')
        result.name = result.name.replace(' THC:CBD:CBC ', '')
        result.name = result.name.replace(' THC:CBD:CBC ', '')

        result.name = result.name.replace(':CBD', '')

        result.category = el.category.displayName
        if (result.name.includes('Syringe')) {
          result.category = 'Concentrates'
        }

        if (el.variants[0].isSpecial) {
          result.price = el.variants[0].specialPrice.toFixed(0)
        }
        {
          result.price = el.variants[0].price.toFixed(0)
        }

        // avoid null results crashing code.
        try {
          result.brand = el.brand.name
        } catch (err) {}

        if (el.category.displayName !== 'Accessories') {
          result.strainType = el.strain.displayName
        }

        parsedName.forEach(el => {
          if (el.size) {
            result.size = el.size
          }
          if (el.thc) {
            result.thc = el.thc
            result.thc += 'mg'
          }
        })
        if (el.cardDescription) {
          if (el.cardDescription.includes('%')) {
            result.thc = el.cardDescription
            result.thc = result.thc.replace('THC ', '')
            result.thc = result.thc.replace('%', '')
            if (result.thc.includes('CBD')) {
              result.thc = result.thc.substring(0, 2)
            }
            result.thc = Number(result.thc).toFixed(0)
            result.thc += '%'
          }
        }

        result.storeName = storeInfo.storeName
        result.storeLocation = storeInfo.storeLocation
        // result['Image'] = el.images[0].url
        result.name = result.name.trim()
        parsedResults.push(result)
      })
      const csv = json2csv(parsedResults)
      fs.appendFile('Cannabis Inventory.csv', csv, 'utf8', function (err) {})
    } catch (err) {
      // Handle Error Here
      console.log(`Error fetching data from: ${el.storeName} (${el.storeLocation})`)
      console.error(err)
    }
  })
}
module.exports = { cureleafScrubber: cureleafScrubber }
