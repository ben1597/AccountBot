const bigNumber = require('bignumber.js')
const pinyin = require('pinyin')
const desensitizedGameName = require('../config/desensitizedGameName')

exports.randomKey = function (len) {
  const buf = []
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const charlen = chars.length

  for (let i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)])
  }

  return buf.join('')
}

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

// 去除空白
exports.Trim = function (v) {
  return v.replace(/^\s+|\s+$/g, '')
}

// 拼音转字串
exports.pinyinToString = function (value) {
  let pinyinStr = ''
  for (let i = 0; i < value.length; i++) {
    pinyinStr += value[i][0].toUpperCase()
  }
  return pinyinStr
}

// 取得游戏音译, 先从config档取没有再用PinYin转
exports.getGameNamePinYin = function (gameName) {
  const desGameName = desensitizedGameName[gameName]
  if (desGameName) return desGameName
  return this.pinyinToString(pinyin(gameName || '', { style: pinyin.STYLE_FIRST_LETTER }))
}

// excel转字串补小数点
exports.excelNumberFixed = function (value = 0, number = 1) {
  return value === 0 ? `0.${'0'.repeat(number)}` : value.toFixed(number)
}

exports.getCharacterLength = (source) => {
  // eslint-disable-next-line no-control-regex
  return source.replace(/[^\x00-\xff]/g, 'OO').length
}

// array reduce 加总
exports.arraySum = function (array, column) {
  return array.reduce(function (accumulator, a) {
    return accumulator + (isNaN(a[column]) ? 0 : parseFloat(a[column]))
  }, 0)
}

exports.divide = function (first, second) {
  if (isNaN(first) || isNaN(second)) return 0
  return parseFloat(second) === 0 ? 0 : bigNumber(parseFloat(first) / parseFloat(second))
}

exports.arraySort = function (array, column) {
  return array.sort(function (a, b) {
    return a[column] - b[column]
  })
}

exports.arraySortDesc = function (array, column) {
  return array.sort(function (a, b) {
    return b[column] - a[column]
  })
}
