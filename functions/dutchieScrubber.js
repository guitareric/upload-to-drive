const json2csv = require('json2csv').parse
const fs = require('fs')
const { nameParser } = require('../utils/nameParser')
const XRegExp = require('xregexp')
const { resultObjMaker } = require('./../utils/resultObjMaker')
const { nameScrubber } = require('../utils/nameScrubber')

async function dutchieScrubber() {
  fetch(
    'https://store.blocpharmacy.com/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%226035916f516b4e34776f4dc5%22%2C%22pricingType%22%3A%22med%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3Anull%2C%22isDefaultSort%22%3Atrue%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d0f7374bfb349ec013a572d6e9e8e315c100eb8eb560886ac99fcc3b9e2764e1%22%7D%7D',
    {
      headers: {
        accept: '*/*',
        'accept-language': 'en-US,en;q=0.9',
        'apollographql-client-name': 'Marketplace (production)',
        'content-type': 'application/json',
        'if-none-match': 'W/"281ab-RQU4Uy6MU1MMkoq5z7cKnx+b0MY"',
        'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        url: 'https://store.blocpharmacy.com/stores/bloc-pharmacy-south-jordan/products',
        cookie:
          'useFederation=98; next-i18next=en; __adroll_fpc=005a258ee90eb43c228e6182099beb44-1687658647694; __ssid=ae2d23f41fbd23011b6a4ceef340d4c; ajs_anonymous_id=7106407d-72eb-404f-a612-294c6872086e; hubspotutk=3f1ee59698e8d31ad797d72148c90687; dsid=59ba2fe2-f0ff-4700-9c03-e64a4b13555b; __ar_v4=65OTM34PRZGIFD3IBONXTO%3A20230625%3A3%7C3QH7AL2JWZDSFECY2UYLX2%3A20230625%3A3; _lr_hb_-zg2tcu%2Fdutchie-v2={%22heartbeat%22:1687827990956}; _lr_uf_-zg2tcu=88980919-3eb4-423e-a624-98328320f2b5; _lr_tabs_-zg2tcu%2Fdutchie-v2={%22sessionID%22:0%2C%22recordingID%22:%225-b275da6b-2b0a-41d9-a1a3-3105d0e9123e%22%2C%22webViewID%22:null%2C%22lastActivity%22:1687827991444}; amp_def7c4=Z0Ne1WxYgtGGNYqS1vrp4Q...1h3t663t4.1h3t66l2b.3.0.3; _ga_FZN7LD29Z4=GS1.1.1687827999.1.0.1687827999.0.0.0; _gid=GA1.2.1353796262.1687828000; _gat_UA-101536475-5=1; _ga=GA1.3.745523244.1687828000; _gid=GA1.3.1353796262.1687828000; _gat_UA-206690010-1=1; _ga_80B4PNM6XV=GS1.1.1687828000.3.0.1687828000.0.0.0; _ga=GA1.1.745523244.1687828000; __hstc=38621244.3f1ee59698e8d31ad797d72148c90687.1687658658605.1687658658605.1687828001172.2; __hssrc=1; __hssc=38621244.1.1687828001172; _dd_s=rum=0&expire=1687828948116&logs=0',
        Referer: 'https://store.blocpharmacy.com/stores/bloc-pharmacy-south-jordan/products',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
      },
      body: null,
      method: 'GET',
    }
  )

  const storeInformation = [
    {
      storeName: 'Bloc',
      storeLocation: 'South Jordan',
      url: 'https://store.blocpharmacy.com/stores/bloc-pharmacy-south-jordan/products',
      fetchUrl:
        'https://store.blocpharmacy.com/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%226035916f516b4e34776f4dc5%22%2C%22pricingType%22%3A%22med%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3Anull%2C%22isDefaultSort%22%3Atrue%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d0f7374bfb349ec013a572d6e9e8e315c100eb8eb560886ac99fcc3b9e2764e1%22%7D%7D',
    },
    // {
    //   storeName: 'Bloc',
    //   storeLocation: 'Saint George',
    //   url: '',
    //   fetchUrl:
    //     'https://store.blocpharmacy.com/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%2260359153c590f500e234ba43%22%2C%22pricingType%22%3A%22med%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3Anull%2C%22isDefaultSort%22%3Atrue%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d0f7374bfb349ec013a572d6e9e8e315c100eb8eb560886ac99fcc3b9e2764e1%22%7D%7D',
    // },
    {
      storeName: 'Beehive Farmacy',
      storeLocation: 'Salt Lake City',
      url: '',
      fetchUrl:
        'https://shop.beehivefarmacy.co/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%225ea72292b6c1d3012f5eb694%22%2C%22pricingType%22%3A%22med%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3A%22brand%22%2C%22isDefaultSort%22%3Atrue%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d0f7374bfb349ec013a572d6e9e8e315c100eb8eb560886ac99fcc3b9e2764e1%22%7D%7D',
    },
    {
      storeName: 'Beehive Farmacy',
      storeLocation: 'Brigham City',
      url: '',
      fetchUrl:
        'https://brigham-city.beehivefarmacy.co/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%22603fbfd8751ff0189db9b778%22%2C%22pricingType%22%3A%22med%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3A%22weight%22%2C%22isDefaultSort%22%3Atrue%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d0f7374bfb349ec013a572d6e9e8e315c100eb8eb560886ac99fcc3b9e2764e1%22%7D%7D',
    },
    {
      storeName: 'Deseret Wellness',
      storeLocation: 'Provo',
      url: '',
      fetchUrl:
        'https://dutchie.com/graphql?operationName=FilteredProducts&variables=%7B%22includeEnterpriseSpecials%22%3Afalse%2C%22includeCannabinoids%22%3Atrue%2C%22productsFilter%22%3A%7B%22dispensaryId%22%3A%225fa2f58b1ae27800f35cfd77%22%2C%22pricingType%22%3A%22rec%22%2C%22strainTypes%22%3A%5B%5D%2C%22subcategories%22%3A%5B%5D%2C%22Status%22%3A%22Active%22%2C%22types%22%3A%5B%5D%2C%22useCache%22%3Afalse%2C%22sortDirection%22%3A1%2C%22sortBy%22%3Anull%2C%22isDefaultSort%22%3Atrue%2C%22bypassOnlineThresholds%22%3Afalse%2C%22isKioskMenu%22%3Afalse%2C%22removeProductsBelowOptionThresholds%22%3Atrue%7D%2C%22page%22%3A0%2C%22perPage%22%3A1000%7D&extensions=%7B%22persistedQuery%22%3A%7B%22version%22%3A1%2C%22sha256Hash%22%3A%22d0f7374bfb349ec013a572d6e9e8e315c100eb8eb560886ac99fcc3b9e2764e1%22%7D%7D',
    },
  ]

  storeInformation.forEach(async el => {
    try {
      const dataObj = await fetch(el.fetchUrl, {
        headers: {
          accept: '*/*',
          'accept-language': 'en-US,en;q=0.9',
          'apollographql-client-name': 'Marketplace (production)',
          'content-type': 'application/json',
          'if-none-match': 'W/"281ab-RQU4Uy6MU1MMkoq5z7cKnx+b0MY"',
          'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Microsoft Edge";v="114"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
          'sec-fetch-dest': 'empty',
          'sec-fetch-mode': 'cors',
          'sec-fetch-site': 'same-origin',
          url: el.url,
        },
        referrer: el.url,
        referrerPolicy: 'strict-origin-when-cross-origin',
        body: null,
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      }).then(async response => {
        const data = await response.json()
        return data
      })
      const results = dataObj.data.filteredProducts.products
      const storeInfo = {}
      storeInfo.storeName = el.storeName
      storeInfo.storeLocation = el.storeLocation
      let parsedResults = []

      //   for (let i = 0; i < results.length; i++) {
      results.forEach(el => {
        let result = resultObjMaker()
        result.name = el.Name
        result.name = result.name.replace('Ratio | ', '')
        result.name = result.name.replace('Plus | ', '')
        result.name = result.name.replace('Plus Vision | ', '')
        result.name = result.name.replace('Euphoria | ', '')
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
        result.name = result.name.replace('CBD', '')
        result.name = result.name.replace('CBN', '')
        result.name = result.name.replace('THC', '')
        result.name = result.name.replace('THC:CBG', '')
        result.name = result.name.replace('THC:CBG:THCA', '')
        result.name = result.name.replace('THCA', '')
        result.name = result.name.replace(':CBG', '')
        const scrubbedName = nameScrubber(result.name)

        if (scrubbedName.name !== '') {
          result.name = scrubbedName.name.replace('|', '')
          result.name = scrubbedName.name.replace('|', '')
          result.name = scrubbedName.name.replace('1:1:1', '')
          result.name = scrubbedName.name.replace('1:1:10', '')
          result.name = scrubbedName.name.replace('1:1:4', '')
          result.name = scrubbedName.name.replace('1:2', '')
          result.name = scrubbedName.name.replace('-', '')
          result.name = result.name.trim()
        }
        if (scrubbedName.size) {
          result.size = scrubbedName.size
        }
        if (scrubbedName.thc) {
          result.thc = scrubbedName.thc
        }

        if (result.size === '') {
          if (el.Options) {
            result.size = el.Options[0]
            if (result.size === '1/8oz') {
              result.size = '3.5g'
            }
            if (result.size === '1/4oz') {
              result.size = '7g'
            }
            if (result.size === '1/2oz') {
              result.size = '14g'
            }
            if (result.size === '3/4oz') {
              result.size = '21g'
            }
            if (result.size === '1oz') {
              result.size = '28g'
            }
            if (result.size === 'N/A') {
              result.size = ''
            }
          }
        }
        result.name = result.name.replace('Greenhouse', '')
        const delimiter = '|'
        const parsedName = nameParser(result.name, delimiter)
        result.name = parsedName[0].name
        result.price = el.Prices[0].toFixed(0)
        result.brand = el.brandName
        result.strainType = el.strainType
        result.category = el.type
        result.storeLocation = storeInfo.storeLocation
        result.storeName = storeInfo.storeName

        if (el.type === 'Concentrate') {
          result.category = 'Concentrates'
        }
        if (el.type === 'Edible') {
          result.category = 'Edibles'
        }
        if (el.type === 'Tincture') {
          result.category = 'Tinctures'
        }
        if (el.THCContent && result.category !== 'Accessories') {
          if (el.THCContent.range !== null) {
            if (el.THCContent.unit == 'PERCENTAGE') {
              const length = el.THCContent.range.length
              result.thc = el.THCContent.range[length - 1]
              result.thc = Number(result.thc).toFixed(0)
              if (result.thc >= 100) {
                result.thc = result.thc / 10
                result.thc = Number(result.thc).toFixed(0)
              }
              result.thc = `${result.thc}%`
            }
          }
        }
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
dutchieScrubber()
module.exports = { dutchieScrubber: dutchieScrubber }
