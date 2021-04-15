const express = require('express')
const connection = require('../db')
const router = express.Router()

let todoList = {
    list: function (res) {
      connection.getConnection((err, connection) => {
        if (err) {
          res.send('Что-то пошло не так')
        } else {
          connection.query('SELECT * FROM todo_list;', (err, res))
          connection.release()  
          console.log('List successful')
        }
      })
    },
  
    findTask: function (id, res) {
        connection.getConnection((err, connection) => {
        if (err) {
          res.send('Что-то пошло не так')
        } else {
          connection.query('SELECT * FROM todo_list WHERE id="' + id + '";', (err, res))
          connection.release()  
        }
      })
    },
  
    add: function (title, res) {
      connection.getConnection((err, connection) => {
        if (err) {
          res.send('Что-то пошло не так')
        } else {
          connection.query('INSERT INTO todo_list (title) VALUES ("' + title + '")', (err, res))
          connection.release()
          console.log('Добавлено')  
        }
      })
    },
  
    change: function (id, newData, res) {
         connection.getConnection((err, connection) => {
          if (err) {
              res.send('Что-то пошло не так')
          } else {
              connection.query('UPDATE todo_list SET title=("' + newData.title + '") WHERE id="' + id + '"', (err, res))
              connection.release()
              console.log('Изменено')  
          }
        })
    },
  
    complete: function (id, res) {
      connection.getConnection((err, connection) => {
          if (err) {
              res.send('Что-то пошло не так')
          } else {
              connection.query('UPDATE todo_list SET completed="true" WHERE id="' + id + '"', (err, res))
              connection.release()  
          }
        })
    },
  
    delete: function (id, res) {
      connection.getConnection((err, connection) => {
        if (err) {
          res.send('Что-то пошло не так')
        } else {
          connection.query('DELETE FROM todo_list WHERE id="' + id + '"', (err, res))
          connection.release()
          console.log('Удалено')
        }
        })
    },
  }

router.get('/', (req, res) => {
	todoList.list((err, tasks) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.render('tasks',{
                tasks: tasks
             })
        }
	})
})

router.post('/add', (req, res) => {
	todoList.add(req.body.title, (err) => {
		if (err) {
    		res.send('Что-то пошло не так')
        } else {
            res.redirect('/tasks/')
        }
	})
})

router.post('/edit/:id', function(req, res){
	todoList.change(req.params.id,  req.body, (err, task, callback) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.redirect('/tasks/')
        }
	})
})

router.post('/completed/:id', function(req, res){
	todoList.complete(req.params.id, (err, callback) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.redirect('/tasks/')
        }
	})
})

router.post('/edit/:id', function(req, res){
	todoList.findTask(req.params.id, (err, task) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.render('edit', {
                task: task
        })

		}
	})
})

router.get('/delete/:id', function(req, res){
	todoList.delete(req.params.id, (err) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.redirect('/tasks/')
        }
	})
})

module.exports = router