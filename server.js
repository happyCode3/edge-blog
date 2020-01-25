const express = require('express');
const Sequelize = require('sequelize');
const Post = require('./models').Post;
const {config, engine} = require('express-edge')
const bodyParser = require('body-parser')
const app = express();

var multer  = require('multer')

var storage = multer.diskStorage({
   destination: function (req, file, cb) {
     cb(null, `${__dirname}/public/img`)
   },
   filename: function (req, file, cb) {
      let imgName = file.fieldname + '-' + Date.now()+'.jpg'
      req.image = imgName
     cb(null, imgName)
   }
 })
  
 var upload = multer({ storage: storage })

config({cache: process.env.NODE_ENV === "production"})

app.use(engine)
app.set('views', `${__dirname}/views`)

app.use(express.static('public'))



app.use(bodyParser.urlencoded({
   extended: true
 }))
 app.use(bodyParser.json())



app.get('/',(req,res)=>{
   res.render('index')
})
app.get('/update',(req,res)=>{
    res.render('update')
 })

 app.get('/post', (req,res)=>{

    res.render('post')
 })

 app.post('/post', upload.single('image'),(req,res)=>{
    console.log(req.image, req.body.title)
   //  res.render('index')
   res.render('post')
 })
app.listen(3000,()=>console.log('hoorrey'))