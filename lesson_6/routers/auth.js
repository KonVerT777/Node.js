const express = require('express')
const connection = require('../db.js')
const bcryptjs = require('bcryptjs')

const router = express.Router()

router.get('/login/', (req, res, next) => {
	if(!req.session.remember) {
		res.render('login', {})
	} else {
		res.redirect('/')
	}
	
})



const login = (req, res) => {
	var username = req.body.username;
	var password = req.body.password;
	connection.query('SELECT * FROM users WHERE username = ?', [username], (error, results, fields) => {
		if (error) {
			res.send({
				"code": 400,
				"failed": "error ocurred"
			})
		} else {
			if (results.length > 0) {
				const comparision = bcryptjs.compare(password, results[0].password)
				if (comparision) {
					res.send("login sucessfull")
					console.log('Successful')
				} else {
					res.send("Username and password does not match")
					console.log('Do not match')
				}
			} else {
				res.send("Username does not exits")
				console.log('Not exist')
			}
		}
	});
}

router.post('/login/', login)



module.exports = router