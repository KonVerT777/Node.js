//Орёл или решка

const { resolve } = require('path')
const { Console } = require('console')

var readline = require('readline')
var fs = require('fs')

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
})

let logger = new Console (fs.createWriteStream('log.txt'))

console.log('Давайте сыграем в игру "Орёл и решка".')

const rlq = function(question) {
    return new Promise((resolve, reject) => {
        rl.question(question, answer => {
            resolve(answer)
        })
    })
}

let addMessage = message => {
    fs.appendFile('log.txt', message + '\n', function (err) {
        if (err) {
            throw err
        }
    })
}

const gameStart = async function() {
    let endGame = false
    while (!endGame) {
        let log
        let answer = await rlq('Выберите 1 ("Орёл") или 2 ("Решка"):') 
            if (Math.round(Math.random() * 2) < 2 && answer === '1' || Math.round(Math.random() * 2) > 1 && answer === '2') {
                console.log('Вы победили!!!')
                addMessage(`Победа`)
            } else {
                console.log('К сожалению, Вы проиграли.')
                addMessage('Проигрыш')
            }

        
        

            let continueGame = await rlq('Хотите ли Вы продолжить? [Y(yes)/ N(no)]:') 
                if (continueGame.toLowerCase() === 'n') {
                    endGame = true
                    // addMessage('Игра окончена!')
                    rl.close()
                }
    }
 }

gameStart('./log.txt')
