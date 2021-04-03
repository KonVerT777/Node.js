const express = require('express')
const request = require('request')
const cheerio = require('cheerio')
const delfi = require('./delfi')
const tvnet = require('./tvnet')
const cookies = require('cookie-parser')

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookies())

const templating = require('consolidate')
const handlebars = require('handlebars')
const { response } = require('express')
templating.requires.handlebars = handlebars

app.engine('hbs', templating.handlebars)

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

app.get('/', (req, res) => {
    res.render('index', {
        reqSource: req.cookies ? req.cookies.source || '' : ''
    })

})

app.post('/news/', (req, res) => {
    if (req.body.source == 'delfi') {
        res.render('news', {
            categories: delfi.categories,
            link: 'delfi'
        })
        console.log('Cookies: ', req.cookies)
        if (!req.cookies || !req.cookies.source || req.body.source !== req.cookies.source) {
            res.cookie('source', req.body.source, {
                maxAge: 360000,
                httpOnly: true
            })
        }
    } else if (req.body.source == 'tvnet') {
        res.render('news', {
            categories: tvnet.categories,
            link: 'tvnet'
        })
        console.log('Cookies: ', req.cookies)
        if (!req.cookies || !req.cookies.source || req.body.source !== req.cookies.source) {
            res.cookie('source', req.body.source, {
                maxAge: 360000,
                httpOnly: true
            })
        }
    } else {
        res.status('500').send('Что-то пошло не так!')
    }
})
app.post('/category/', (req, res) => {
    var categories = []
    if (req.body.source == 'delfi') {
        request(req.body.title, (error, response, html) => {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html)
                $('div#ajax-headlines').each(function (i, element) {
                    var attr = {}
                    attr.title = $(element).find('h1.text-size-22.text-size-md-30.d-inline').text().trim()
                    attr.text = $(element).find('p.font-weight-bold').text().trim()

                    categories.push(attr)
                    console.log(categories)
                })
                res.render('category', {
                    news: categories
                })
            }
        })
    } else if (req.body.source == 'tvnet') {
        request(req.body.title, (error, response, html => {
            if (!error && response.statusCode == 200) {
                var $ = cheerio.load(html)
                $('article.list-article').each(function (i, element) {
                    var attr = {}
                    attr.title = $(element).find('span.list-article__headline').text().trim().
                    attr.text = $(element).find('.article-body__item.article-body__item--htmlElement.article-body__item--lead > p').text()

                    categories.push(attr)
                    console.log(categories)
                })
                res.render('category', {
                    news: categories
                })
            }
        }))
    } else {
        res.status('500').send('Что-то пошло не так!')
    }
})


app.listen(3030, () => console.log(`Listening at port 3030 ....`))