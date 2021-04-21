const mysql2 = require('mysql2')

const connection = mysql2.createPool({
    host: 'localhost',
    database: 'todos',
    user: 'root',
    password: '12345',
    port: 3306,
})

connection.getConnection((err) => {
    if (err) {
        res.send('Что-то пошло не так')
    } else {
        console.log('Connected!!!')
    }  
})

module.exports = connection