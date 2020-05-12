const mongoose=require('mongoose');
const Useschema=  new mongoose.Schema({
    username :{
        type: String,
        required: true
    },
    password :{
            type:String,
            required: true,
            min:8,
            max:16
    },
    date :{
        type: Date,
        default : Date.now()
    },
    usertoken :[
        {
            type:String
        }
    ],
    userlinks: [
        {
            url:{
                type:String
            },
            urlid:{
                  type:Number,
                  default:Date.now()   
            }
        }
    ]
})


module.exports=mongoose.model('User',Useschema)
