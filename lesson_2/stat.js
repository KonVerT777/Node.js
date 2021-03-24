var fs = require('fs')

fs.readFile('log.txt', 'utf8', function (err, data) {
    if (err) {
        console.log('Ещё не было игр!')
        return
    }
    let arr = data.split('\n')
    let games = arr.length - 1

    let win = 0, loss = 0, maxWin = 0, maxLoss = 0, i = 0, j = 0

    for (let key in arr) {
        if (arr[key] === 'Победа') {
            win++
            i++
        } else {
            if (i >= maxWin) {
                maxWin = i
                i = 0
            }
            i = 0
        }
        if (arr[key] === 'Проигрыш') {
            loss++
            j++
        } else {
            if (j >= maxLoss) {
                maxLoss = j
                j = 0
            }
            j = 0
        }
    }

    console.log('Сыграно партий ' + games)
    console.log('Выигранных партий ' + win)
    console.log('Проигранных партий ' + loss)
    console.log('Соотношение партий: ' + win + ':' + loss)
    console.log("Максимальне число побед подряд = " + maxWin)
    console.log("Максимальне число проигрышей подряд = " + maxLoss)
})