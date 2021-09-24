const express = require('express')
const app = express()
const port = 3000

const connect = require('./schemas');
connect();

//const postsRouter = require('./routes/post');

const postsRouter = require("./routers/posts");


app.use((req, res, next) => {
    console.log(req);
    next();
});

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'));

//app.use('/post', postsRouter)

app.use("/api", [postsRouter]);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  
  res.render('index');
})

app.get('/detail', (req, res) => {
  
    res.render('detail');
  })

app.get('/write', (req, res) => {
    res.render('write')
})

app.get('/posts/inquire', (req, res) => {
    res.send('게시물 조회 페이지')
})

app.get('/posts/modify', (req, res) => {
    res.send('게시물 수정 페이지')
})

app.listen(port, () => {
    console.log(`listening at http://localhost:${port}`)
})