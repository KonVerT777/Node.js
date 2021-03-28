// 1) Создать программу для получения информации о последних
// новостей с выбранного вами сайта в структурированном виде.

var request = require('request')
var cheerio = require('cheerio')

request('https://rus.delfi.lv/', function(error, response, html) {
    if(!error && response.statusCode == 200) {
        // console.log(html)
        var $ = cheerio.load(html)
        $('h1.text-size-22.mb-0.mt-2.headline__title').each(function(i, element) {
            console.log($(this).text())
        })
    } else {
        console.log(error, response.statusCode)
    }
})


