const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')
authMiddleware = require('./middlewares/auth-middleware')
const Joi = require('joi')

const port = 3000

const connect = require('./models')
connect()

//const postsRouter = require('./routes/post');

const postsRouter = require('./routers/posts')
const posts = require('./models/posts')
const comments = require('./models/comments')

app.use((req, res, next) => {
  console.log(req)
  next()
})

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))

//app.use('/post', postsRouter)

app.use('/api', [postsRouter])

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.render('index')
})

app.get('/detail', (req, res) => {
  res.render('detail')
})

app.get('/search', (req, res) => {
  res.render('search')
})

app.get('/write', (req, res) => {
  res.render('write')
})

app.get('/posts/correction', (req, res) => {
  res.render('correction')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.get('/register', (req, res) => {
    res.render('register')
})

app.listen(port, () => {
  console.log(`listening at http://localhost:${port}`)
})
