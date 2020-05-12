const route=require('express').Router();
const Joi=require('@hapi/joi') 
const path=require('path')
const User=require('../model/user')
const bcrypt=require('bcryptjs')
const pug=require('pug');
const jwt=require('jsonwebtoken')
const schema=Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(8).max(255)
})

const signupschema=Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required().min(8).max(255),
    //confirmpassword:Joi.required().any().valid(Joi.ref('password')).options({ language: { any: {allowOnly: 'must match password'}}})
    confirmpassword: Joi.string().required().valid(Joi.ref('password')).messages({'any.only':"Password didn't matched"})
})
function validation(body){
    const check={
        username: body.username,
        password:body.password
    }
    return schema.validate(check) 
}
function signupvalidation(body){
    const check={
        username: body.username,
        password:body.password,
        confirmpassword:body.confirmpassword
    }
    return signupschema.validate(check) 
}



route.post('/signup',async (req,res)=>{
     
    //  console.log(req.body)
     const {error}=signupvalidation(req.body)
     if(error)return res.render('landingpage',{data:error.details[0].message});
     //return res.status(400).send(error.details[0].message)

     

     const ifexist=await User.findOne({username:req.body.username})
     if(ifexist)return res.render('landingpage',{data:"Username Already Exist"});
     //return res.status(400).send("username Already exist") 
 
     const salt=await bcrypt.genSalt(10)
     const hashedpassword= await bcrypt.hash(req.body.password,salt)
     
     const user=new User({
         username:req.body.username,
         password: hashedpassword,
         usertoken:[],
         userlinks:[]
     })
     try{
          const newuser=await user.save()
          res.render('landingpage',{data:"You are Registered Successfully"});
        //   res.send(newuser)
           
        //   res.redirect('http://localhost:3000/dashboard');
     }catch(err){
        res.render('landingpage',{data:err});
        //res.sendFile(pug.renderFile('../public/afterlogin2.pug',{data:err}));
        //  res.status(400).send(err)
     }
})


route.post('/login',async(req,res)=>{
      

    //  console.log("Wait trying to login you")
      const {error}=validation(req.body)
     if(error)return res.render('landingpage',{data:error.details[0].message});
     //return res.status(400).send(error.details[0].message)
    
     const user=await User.findOne({username:req.body.username})
     if(!user)return res.render('landingpage',{data:"Username/Password is wrong"});
     //return res.status(400).send("username/password is wrong")

     const validpass= await bcrypt.compare(req.body.password,user.password)
     if(!validpass)return res.render('landingpage',{data:"Password is wrong"});
     //return res.status(400).send("password is wrong")
     
     
    // const token=jwt.sign({_id:user._id},process.env.ACCESS_TOKEN_SECRET,{expiresIn:'1h'})
     const token=jwt.sign({_id:user._id},process.env.TOKEN_SECRET,{expiresIn:'90d'})
     //user.usertoken.push(token)
     //User.findOneAndUpdate({_id:user._id},{$push:{usertoken:token}})  
     User.updateOne({"_id":user._id},{"$push":{"usertoken":token}},function(err,raw){
        if(err)return res.render('landingpage',{data:err});
        //return res.status(400).send("error code db90")
        
        //console.log(user.usertoken)
        res.cookie('token',token,{
            httpOnly:true
         })
        
        // console.log("login tried")
        res.redirect('/dashboard')
     })
     
})


route.post('/dashboard/logout',async (req,res)=>{
    // console.log("Wait trying to logout")
     if(req.cookies!=undefined){
              try{
                    var cookiedata=req.cookies.token
                    if(cookiedata){
                        var userforlogout=jwt.verify(cookiedata,process.env.TOKEN_SECRET)
                        //console.log(userforlogout);
                        res.clearCookie('token')
                        if(!userforlogout){
                            res.send("Invalid request")
                        }
                        else{
                        User.updateOne({"_id":userforlogout._id},{"$pull":{"usertoken":cookiedata}},function(err,cb){
                            if(err){
                                res.send("Invalid request")
                            }
                            else{
                            // console.log("User successfully logout")
                            res.redirect('/')
                            }
                        })
                    }
                    }
                    else {
                        return res.send("Invalid request : Don't change the cookie name:)")
                    }
              }catch(err){
                    return res.send("Error occured while getting cookies data")
              }
     }
     else{
         return res.status(400).send("Invalid request : No account to logout")
     }

})



module.exports=route;
