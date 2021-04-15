const express = require('express')
const mysql2 = require('mysql2')
const passport = require('passport')
const cookies = require('cookie-parser')
const GitHubStrategy = require('passport-github2').Strategy
const db = require('./db.js')


const app = express()

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cookies())


const session = require('express-session')
const sessionStore = new (require('express-mysql-session')(session))
const sessionMiddleware = session({
  store: sessionStore,
  secret: "keyboard cat",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 600000 }
})

app.use(sessionMiddleware)


const logSession = (req, res, next) => {
  console.log('Session:', req.session)
    next()
}

app.use(logSession)

const templating = require('consolidate')
const handlebars = require('handlebars')
templating.requires.handlebars = handlebars

app.engine('hbs', templating.handlebars)

app.set('view engine', 'hbs')
app.set('views', __dirname + '/views')

const GITHUB_CLIENT_ID = "748e1eb6e404a3a0dd81"
const GITHUB_CLIENT_SECRET = "539a1b6300d77f2fd6ba9d64d4efbcd536ae098d"

passport.serializeUser(function(user, done) {
  done(null, user)
})

passport.deserializeUser(function(obj, done) {
  done(null, obj)
})

passport.use(new GitHubStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
  callbackURL: "http://localhost:3030/auth/github/callback"
},
function(accessToken, refreshToken, profile, done) {
  process.nextTick(function () {
    console.log('profile:', profile)
    return done(null, profile)
  })
}
))

app.use(passport.initialize())
app.use(passport.session())

app.get('/profile', ensureAuthenticated, function(req, res){
  res.render('profile', { user: req.user })
})

app.get('/auth/github',
  passport.authenticate('github', { scope: [ 'user:email' ] }),
  function(req, res){
  })

app.get('/auth/github/callback', 
  passport.authenticate('github', { successRedirect: '', failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/')
})

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login')
  }

const router = require('./routers')

app.use(router)


app.listen(3030, () => console.log(`Listening at port 3030 ....`))