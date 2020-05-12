//including modules
const express=require('express')
const path=require('path')
const mongoose=require('mongoose')
const bodyParser=require('body-parser')
const dotenv=require('dotenv')
const cp=require('cookie-parser')
const app=express()
const urlmodule=require('url')
const image2base64 = require('image-to-base64');
const fetch=require('node-fetch');
const pug=require('pug');

//Routes
const auth=require('./routes/auth')
const check=require('./routes/tokenverify')
const getlinks=require('./routes/getlinks')
const dashboard=require('./routes/dashboard')
const User=require('./model/user')


//Config
dotenv.config();



//connecting  to db
mongoose.connect(process.env.DB_CONNECT,{useNewUrlParser: true},(err)=>{
if(err) console.log(err);
else console.log('connected to db')
})
//middlewares

//  app.use('/',express.static(path.join(__dirname, '/public')));
app.use('/dashboard',express.static(path.join(__dirname, '/public')));
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}));

app.set('views', 'views');
app.set('view engine', 'pug');

app.use(cp());

app.use('/',auth);

// //userpage

app.get('/',async(req,res)=>{

 check(req).then((val)=>{
   if(val=='false'){ 
    res.render('landingpage',{data:""}); 
  }
   else {
     res.redirect('https://inyourpocket.glitch.me/dashboard')
   }
 })

})
app.get('/about',(req,res)=>{
   app.use(express.static(path.join(__dirname, '/about')));
   res.sendFile(path.join(__dirname+'/about/index.html'))
})
app.get('/dashboard',async(req,res)=>{
   
    check(req).then((val)=>{
      if(val=='false'){
        res.redirect('https://inyourpocket.glitch.me/')
      }
      else{
      res.sendFile(path.join(__dirname+'/public/dashboard.html'))   
      }
    })
    
})


app.use('/dashboard',dashboard)


app.listen(3000)