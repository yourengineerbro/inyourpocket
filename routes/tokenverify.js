const express=require('express');
const User=require('../model/user')
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

module.exports= async function check(req){
    console.log("Wait Trying to check you")
    
    if(req.cookies!=undefined){
             try{
                   var cookiedata=req.cookies.token
                   if(cookiedata){
                       
                    
                       let userforverifying=jwt.verify(cookiedata,process.env.TOKEN_SECRET)
                       console.log(userforverifying);
                       if(userforverifying){
                               
                        try{
                            var user=await User.findOne({
                              _id:userforverifying._id
                            })
                            
                            if(user) {
                                var arr=user.usertoken
                               // console.log(arr)
                               var index=arr.indexOf(cookiedata)
                               if(index>-1)return userforverifying._id

                                return 'false';
                            } 
                            else {
                              console.log("Redirecting you to homepage")
                              return 'false'
                            
                             }                              
                         
                            }catch(err){
                                console.log("Redirecting you to homepage")
                                return 'false'            
                            }

                       }
                       else return 'false';
                   }
                   else {
                    console.log("Redirecting you to homepage")
                    return 'false'//res.redirect('http://localhost:3000/')
                   }
             }catch(err){
                console.log("Redirecting you to homepage")
                return 'false'//res.redirect('http://localhost:3000/')
             }
    }
    else{
        console.log("Redirecting you to homepage")
        return 'false'//res.redirect('http://localhost:3000/')
    }
    // console.log('1')
    // if(act){
    //     //const actt=act.split(' ')[1];
    //      var vall=jwt.verify(act,process.env.TOKEN_SECRET)
    //     console.log('2')
    //     if(vall){
    //         console.log('3')
    //             try{
    //                 console.log('4')
    //                 var possibleuser= User.findOne({user_id:vall.id});  
    //                 console.log(possibleuser)
    //             var arrayoftoken=possibleuser.usertoken
    //             var val2= arrayoftoken.includes(act)
               
    //             if(val2)return true;
    //             }
    //             catch(err){
    //                 console.log(err)
    //                 return false
    //             }
    //     }
    //     return  false;
    // }   
    // return false; 

}

