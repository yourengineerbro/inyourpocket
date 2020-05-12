const User=require('../model/user');

module.exports=async function getlinks(val){
    const user=await User.findOne({_id:val})
    return user.userlinks;
}

