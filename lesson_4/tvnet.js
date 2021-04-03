const request = require('request')
const cheerio = require('cheerio')

const categories = []

request('https://rus.tvnet.lv/section/4364', function(error, response, html) {
    if(!error && response.statusCode == 200) {
        var $ = cheerio.load(html)
        $('.menu-items.menu-items--sub.slab').each(function(i, element) {
            var attr = {}
            attr.category = $(element).find('.menu-items > div').text().split(' ')
            attr.href = $(element).find('a.menu-item').attr('href')
            categories.push(attr)
            console.log(categories)
        })
    } else {
        console.log(error, response.statusCode)
    }
})

module.exports = {categories}