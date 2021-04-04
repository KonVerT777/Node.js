const mysql2 = require('mysql2')
const config = require('./config.js')
const express = require('express')

const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())

const templating = require('consolidate')
const handlebars = require('handlebars')
templating.requires.handlebars = handlebars

app.engine('hbs', templating.handlebars)

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

const connection = mysql2.createPool(config)

connection.getConnection((err) => {
    if (err) {
        res.send('Что-то пошло не так')
    } else {
        console.log('Port: ', config['port'])
    }  
})

app.get('/', (req, res) => {
	todoList.list((err, tasks) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.render('index',{
                tasks: tasks
             })
        }
	})
})

app.post('/add', (req, res) => {
	todoList.add(req.body.title, (err) => {
		if (err) {
    		res.send('Что-то пошло не так')
        } else {
            res.redirect('/')
        }
	})
})


app.get('/delete/:id', function(req, res){
	todoList.delete(req.params.id, (err) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.redirect('/')
        }
	})
})

app.get('/edit/:id', function(req, res){
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

app.post('/edit/:id', function(req, res){
	todoList.change(req.params.id,  req.body, (err, task, callback) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.redirect('/')
        }
	})
})

app.get('/completed/:id', function(req, res){
	todoList.complete(req.params.id, (err, callback) => {
		if (err) {
            res.send('Что-то пошло не так')
        } else {
            res.redirect('/')
        }
	})
})


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

todoList.list()
app.listen(3030, () => console.log(`Listening at port 3030 ....`))