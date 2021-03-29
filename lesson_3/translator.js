// 2) Создать переводчик слов с английского на русский, который будет
// обрабатывать входящие GET запросы и возвращать ответы,
// полученные через API Яндекс.Переводчика.

const express = require('express')
const axios = require('axios')
const { FOLDER, IAM_TOKEN } = require ('./auth')

const app = express()

app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


app.get('/', (req, res) => {
    response.sendFile('/index.html')
})

app.post('/', (req, res, next) => {
    console.log('The response will be sent by the next function ...')
     next()
    }, function(req, resp) {
        axios.post('https://translate.api.cloud.yandex.net/translate/v2/translate/', {
                'folder_id': FOLDER,
                'texts': [req.body.text],
                'targetLanguageCode': 'ru'
            }, {
                headers: {
                    'Content-type': 'application/json',
                    'Authorization': 'Bearer ' + IAM_TOKEN
                }
            })
            .then((res) => {
                console.log(res.data)
                resp.send('Ловите перевод: ' + res.data.translations[0].text)
            }).catch((err) => {
                console.log(err)
                res.status('500').send('Что-то пошло не так!')
            })
    }
)

app.listen(3000, () => console.log(`Listening at port 3000 ....`))