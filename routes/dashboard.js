const route = require('express').Router();
const path = require('path')
const User = require('../model/user')
const check = require('./tokenverify')
const urlmodule = require('url')
const image2base64 = require('image-to-base64');
const fetch = require('node-fetch');
// const {linkiconutility}=require('./linkutility')
// const {linktitleutility}=require('./linkutility')


route.post('/posturl', (req, res) => {
    check(req).then(val => {
        if (val == false) return res.send('Access Denied')
        else {

            if (req.body.url == undefined) return res.send('INVALID');
            if (req.body.url == '') return res.send('INVALID')
            else {
                let urlidd = Date.now();
                User.updateOne({ _id: val }, { "$push": { userlinks: { url: req.body.url, urlid: urlidd } } }, async function (err, cb) {
                    if (err) return res.send("Cant post the link")
                    else {
                        //  User.findOne({id:val},function(er,u){
                        //     // let length=u.userlinks.length
                        //     // let postedurl={

                        //     //     // urlid: User.findOne({id:val}).userlinks.length-1,
                        //     //      //urlid: u.userlinks.length-1,  
                        //     //     urlid: Math.random()*100,
                        //     //      url:req.body.url,
                        //     //      urltitle:' http://textance.herokuapp.com/title/'+req.body.url,
                        //     //      urldomain:urlmodule.parse(req.body.url).host,
                        //     //      urlicon:'https://s2.googleusercontent.com/s2/favicons?domain_url='+req.body.url
                        //     //  }
                        //     //  res.send(postedurl);
                        //     console.log(u);
                        // })
                        try {
                            let u = await User.findOne({ _id: val });
                            //console.log(u);
                            // let length=u.userlinks.length;
                            let urldata = req.body.url;
                            let [title, icon] = await Promise.all([titleloader(urldata), iconbase64(urldata)]);
                            let postedurl = {
                                urlid: urlidd,
                                url: urldata,
                                urltitle: title,
                                urldomain: urlmodule.parse(req.body.url).host,
                                urlicon: icon
                            }
                            res.json(postedurl);
                        } catch (err) {
                            res.send(err);
                        }
                    }
                })
            }
        }
    })
})

route.post('/geturls', async (req, res) => {
    check(req).then(async function (val) {
        if (val == false) return res.send('INVALID')
        else {
            try {
                if (req.body.count == undefined) return res.send('INVALID');
                let count = req.body.count;
                console.log("count: " + count);
                count--;
                let user = await User.findOne({ _id: val });
                let urlarray=await linkloader(user,count);
                //console.log(urlarray);
                res.json(urlarray);  
                }
                catch (err) {
                    res.send(err);
                }
        }
    
    }).catch (err => res.send(err))
    
})

route.post('/delurl',async (req,res)=>{
    check(req).then(async function(val){
        if(val==false)res.send("INVALID");
        else{
            try{
                console.log("del request received")
                let user=await User.findOne({_id:val});
                let delurlid=req.body.delurlid;
                let urll=req.body.url;
                // let index= user.userlinks.indexOf({
                //     url: urll,
                //     urlid:delurlid
                // })
                let index=user.userlinks.findIndex(x=> x.urlid==delurlid);
                console.log("index of element found: "+index);
                if(index>-1){
                    user.userlinks.splice(index,1);
                }
                console.log(user);
                await user.save();
                res.json('del');
            }catch(err){
                res.json(err);
            }
        }    
    }).catch(err=>res.send(err))
})
async function iconbase64(urldata) {
    return await image2base64(process.env.iconAPI + urldata) // you can also to use url
        .then(
            (response) => {
                return response;
            }
        ).catch(err => {
            return err;
        })
}


async function titleloader(urldata) {

    // https://textance.herokuapp.com/rest/title/[url]
    // where [url] is the exact URL of the page in question. It has to be URL encoded, of course. 
    //Note also, that some URLs may not be recognised as such without the protocol prefix, 
    //i.e., http:// or https:// as the case may be. Be sure to always use the proper prefix for
    // predictable results.
    // Returns: text/plain
    return await fetch(process.env.titleAPI + urldata)
        .then(res => res.text())
        .then(body => {
            return body
        });
}


async function linkloader(user,count){

    //Cache can be Implemented here
    try{
    let userlinks = user.userlinks;
    // for (let o = 0 ; o < userlinks.length; o++) {
    //           console.log(userlinks[o]);
    // }    
    let j = count * 10 + 10;
    let urlarray = new Array();

    for (let i = count * 10; i < j && i < userlinks.length; ++i) {
             let urldata = userlinks[i].url;
        
            let [title, icon] = await Promise.all([titleloader(urldata), iconbase64(urldata)]);
            let loadedurl = {
                urlid: userlinks[i].urlid,
                url: urldata,
                urltitle: title,
                urldomain: urlmodule.parse(urldata).host,
                urlicon: icon
            }
          //  console.log(urlarray);
            urlarray.push(loadedurl);
        }
        return urlarray;

}catch(err){
    return err;
}
}



module.exports = route;