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


app.get('/',   (req,res)=>{
   let data;
   Post.findAll({
      order: [
         ["updatedAt", 'DESC'],
         ['id', 'DESC']
     ]
   }).then(users => {
     data = JSON.parse(JSON.stringify(users, null, 4));
     res.render('index', {data})
    });
      
})

function getSingleData(req,res,next){
   let {id} = req.params
   var data
      Post.findAll({
         where: {
           id
         }
       }).then(users => {
            
            data = JSON.parse(JSON.stringify(users, null, 4));
           
            req.data = data
           
         if(data.length<1){
            res.send('opps you serach incorrectly')
         }
         next()
   
        });
        
   }


app.get('/updatePost/:id', getSingleData, (req,res)=>{

   let data = req.data
   
     res.render('update', {data})
     console.log('data',data)
 })


 app.get('/create-post', (req,res)=>{

    res.render('post')
 })

 app.get('/delete/:id', (req,res)=>{

   Post.destroy({
      where: {
        id: req.params.id
      }
    });

   res.redirect('/')
 })

 app.post('/updatePost/:id', upload.single('image'), (req,res)=>{
    let {title, body } = req.body

    if(!req.image){

       Post.update({
          title, body
         }, {
            where: {
               id: req.params.id
            }
         });
      } else{
         Post.update({
            title, body, image:req.image
           }, {
              where: {
                 id: req.params.id
              }
           });
      }
  
      res.redirect('/')
  
})

 app.post('/create-post', upload.single('image'),(req,res)=>{
    let {title,body} = req.body;
      Post.create({
        title, body, image:req.image
      })
      let data;
      Post.findAll({
         order: [
            ["updatedAt", 'DESC'],
            ['id', 'DESC']
        ]
      }).then(users => {
        data = JSON.parse(JSON.stringify(users, null, 4));
        res.redirect('/')
       });
       
 })
app.listen(3000,()=>console.log('port open at 3000'))