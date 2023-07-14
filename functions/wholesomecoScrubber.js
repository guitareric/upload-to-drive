const json2csv = require('json2csv').parse
const fs = require('fs')
const puppeteer = require('puppeteer')
const { resultObjMaker } = require('../utils/resultObjMaker')
const XRegExp = require('xregexp')

async function wholesomecoScrubber() {
  try {
    const browser = await puppeteer.launch({ headless: 'new' })
    const page = await browser.newPage()
    const storeInformation = [
      {
        storeName: 'WholesomeCo',
        storeLocation: 'Bountiful',
        url: 'https://www.wholesome.co/shop',
      },
    ]
    storeInformation.forEach(async (el, i) => {
      const storeInfo = storeInformation[i]
      await page.goto(el.url)
      await page.waitForTimeout(3000)

      // let result = {}
      // let parsedResults = []

      let children = await page.$eval('.productList', e => {
        const data = []
        for (const child of e.children) {
          data.push({ tagName: child.tagName, innerText: child.innerText })
        }
        return data
      })
      await browser.close()
      const parsedResults = parseResults(children, storeInfo)
      const csv = json2csv(parsedResults)
      fs.appendFile('Cannabis Inventory.csv', csv, 'utf8', function (err) {})
    })
  } catch (err) {
    console.log(err)
  }
  // await browser.close()
}

function parseResults(children, storeInfo) {
  let results = []

  for (const child of children) {
    let splitResults = child.innerText
    splitResults = splitResults.split('\n')
    results.push(splitResults)
  }
  let parsedResults = []

  results.forEach(el => {
    let result = resultObjMaker()
    el.forEach((el, i) => {
      if (i === 1) {
        result.name = el
        result.category = 'Accessories'

        if (
          result.name.includes('Cubes') ||
          result.name.includes('Capsules') ||
          result.name.includes('Gumm') ||
          result.name.includes('Spray') ||
          result.name.includes('Chew') ||
          result.name.includes('bite') ||
          result.name.includes('Bite') ||
          result.name.includes('-pack')
        ) {
          result.category = 'Edibles'
          result.name = result.name.replace('Gummies', '(Gummies)')
          result.name = result.name.replace('Gummy', '(Gummies)')
        }
        if (result.name.includes('Topical') || result.name.includes('Tablet') || result.name.includes('Balm') || result.name.includes('Transdermal')) {
          result.category = 'Topicals'
        }
        if (result.name.includes('Badder') || result.name.includes('Budder') || result.name.includes('Wax') || result.name.includes('Sugar') || result.name.includes('Distillate')) {
          result.category = 'Concentrates'
        }
        if (result.name.includes('Flower') || result.name.includes('Pre-Ground')) {
          result.category = 'Flower'
        }
        if (result.name.includes('Tincture')) {
          result.category = 'Tinctures'
          result.name = result.name.replace(' Tincture', '')
        }
        if (result.name.includes('Vape') || result.name.includes('Disposable') || result.name.includes('Pod') || result.name.includes('Cart')) {
          result.category = 'Vaporizers'
        }
        if (
          result.name.includes('Battery') ||
          result.name.includes('Hydrology9') ||
          result.name.includes('ArcPods') ||
          result.name.includes('Batteries') ||
          result.name.includes('Starship') ||
          result.name.includes('Flower Mill') ||
          result.name.includes('PS1')
        ) {
          result.category = 'Accessories'
        }
      }
      if (el.includes('$')) {
        result.price = el.replace('$', '')
        result.price = Number(result.price).toFixed(0)
      }
      if (i === 0) {
        result.brand = el
      }
      if (el.length === 1) {
        result.strainType = el
        if (result.strainType === 'S') {
          result.strainType = 'Sativa'
        }
        if (result.strainType === 'I') {
          result.strainType = 'Indica'
        }
        if (result.strainType === 'H') {
          result.strainType = 'Hybrid'
        }
      }
      if (el.includes('% THC')) {
        result.thc = el
        result.thc = result.thc.replace('% THC', '')
        result.thc = Number(result.thc).toFixed(0)
        result.thc += '%'
      }
      if (el.includes(' MG THC')) {
        result.thc = el
        result.thc = result.thc.replace('MG THC', '')
        result.thc = Number(result.thc).toFixed(0)
        result.thc += 'mg'
      }

      result.storeName = storeInfo.storeName
      result.storeLocation = storeInfo.storeLocation
      if (i === 1 && result.category !== 'Accessories' && result.category !== 'Topicals' && result.category !== 'Tinctures' && result.category !== 'Edibles') {
        const parsedResults = wholesomeNameParser(el)
        result.name = parsedResults[0].name
        if (parsedResults[0].size) {
          result.size = parsedResults[0].size
        }
      }
      if (result.size.includes('-pack')) {
        let packSize = result.size.replace('-pack', '')
        packSize = Number(packSize)
        let strength = result.thc.replace('mg', '')
        strength = Number(strength).toFixed(0)
        result.thc = strength
        result.thc += 'mg'
      }
    })
    result.name = result.name.trim()
    parsedResults.push(result)
  })

  return parsedResults
}

function wholesomeNameParser(name) {
  const regex1 = XRegExp('[0-9]?[.]?[0-9]?[ ][g]')
  const regex2 = XRegExp('[0-9]?[0-9]?[0-9]?[ ][m][L]')
  let results = []
  if (name !== null) {
    const [itemName, itemType] = name.split(' – ')
    let result = resultObjMaker()
    const rawName = itemName
    if (itemType) {
      result.name = addSubName(rawName, itemType)

      if (itemType.includes('-pack') || itemType.includes('-pc')) {
        result.size = itemType.replace(' Live Resin Gummy', '')
      }
      if (itemType.includes(' gr')) {
        result.size = XRegExp.exec(itemType, regex1)
        result.size = result.size[0].replace(' ', '')
      }
      if (itemType.includes(' mL')) {
        result.size = XRegExp.exec(itemType, regex2)
        result.size = result.size[0]
      }
    }
    results.push(result)
  }
  return results
}

function addSubName(name, itemType) {
  let fullName = name
  let searchItems = [
    { item: 'Pre-Ground' },
    { item: 'Popcorn' },
    { item: 'Live Resin' },
    { item: 'Badder' },
    { item: 'Dart Pod' },
    { item: 'Cliq Pod' },
    { item: 'Sugar Wax' },
    { item: 'Cured Resin' },
    { item: 'Greenhouse' },
    { item: 'X Bites' },
    { item: 'Indoor' },
    { item: 'Smalls' },
    { item: 'Shatter' },
    { item: 'Novaa Pod' },
  ]
  searchItems.forEach(el => {
    if (itemType.includes(el.item)) {
      fullName += ` (${el.item})`
    }
  })
  return fullName
}

module.exports = { wholesomecoScrubber: wholesomecoScrubber }
