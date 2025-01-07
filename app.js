const express = require('express')
const { engine } = require('express-handlebars')
const expressSession = require('express-session')
const fileUpload = require('express-fileupload')
const dotenv = require('dotenv')
const path = require('path')
const dbs = require(path.join(__dirname, 'dbs.js'))

// console.log(crypto.randomBytes(64).toString('hex'))

//DB connect
dbs()

//başlangıç ayarları
dotenv.config()
const app = express()


//değişkenler
const time = 1000 * 60 * 30
const SECRET_VALUE = process.env.SECRET_VALUE || 'myblog'
const PORT = process.env.port || 5000
const API_URL = process.env.API_URL || 'http://127.0.0.1:5000'

//şablon motorunun bulunduğu alan
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'))


//arayazılım
app.use(express.json())
app.use(fileUpload())
app.use(expressSession({
    secret: SECRET_VALUE,
    resave: false,
    saveUninitialized: true,
    cookie: { path: '/', httpOnly: true, secure: false, maxAge: time }

}))
app.use(express.static(path.join(__dirname, 'public')))

//router tanımlama alanı
const indexPage = require(path.join(__dirname, 'router', 'indexPage.js'))
const aboutPage = require(path.join(__dirname, 'router', 'aboutPage.js'))
const addPage = require(path.join(__dirname, 'router', 'addPage.js'))
const loginPage = require(path.join(__dirname, 'router', 'loginPage.js'))
const registerPage = require(path.join(__dirname, 'router', 'registerPage.js'))
const logoutPage = require(path.join(__dirname, 'router', 'logoutPage.js'))
const singlePage = require(path.join(__dirname, 'router', 'singlePage.js'))
const editPage = require(path.join(__dirname, 'router', 'editPage.js'))


app.use('/',(req,res,next)=>{

    const{userID}=req.session
    if(userID){
        res.locals.user=true
    }
    else{
        res.locals.user=false
    }
    next()

})

//router kullanım alanı
app.use('/', indexPage)
app.use('/about', aboutPage)
app.use('/add', addPage)
app.use('/login', loginPage)
app.use('/register', registerPage)
app.use('/logout', logoutPage)
app.use('/single', singlePage)
app.use('/edit', editPage)
app.use('*',(req,res,next)=>{
    res.render('site/error')

})

app.listen(PORT, () => {
    console.log(`server is running ${API_URL}`)
})
