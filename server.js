const express = require('express');
const Sequelize = require('sequelize');
const sequelize = require('./models');
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
   let data;
   Post.findAll()
            .then(users => {
               data = JSON.parse(JSON.stringify(users, null, 4));
               console.log(data)
               res.render('index', {data})
         })
   
})
app.get('/update',(req,res)=>{
    res.render('update')
 })

 app.get('/post', (req,res)=>{

    res.render('post')
 })

 app.post('/post', upload.single('image'),(req,res)=>{
    let {title,body} = req.body;
      Post.create({
        title, body, image:req.image
      })
   //  res.render('index')
   res.render('index')
 })
app.listen(3000,()=>console.log('port open at 3000'))