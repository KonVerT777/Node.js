const request = require('request')
const cheerio = require('cheerio')

const categories = []

request('https://rus.delfi.lv/news/novosti/', function(error, response, html) {
    if(!error && response.statusCode == 200) {
        var $ = cheerio.load(html)
        $('nav.nav.nav-sub.horizontal-scroll.px-sm-0').each(function(i, element) {
            var attr = {}
            attr.category = $(element).find('span').text().trim()
            attr.href = $(element).find('a').attr('href')
            categories.push(attr)
            console.log(categories)
        })
    } else {
        console.log(error, response.statusCode)
    }
})

module.exports = {categories}