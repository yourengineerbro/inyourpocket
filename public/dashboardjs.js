var i=document.getElementById('urlinput')
i.focus();
document.getElementById('urlsubmit').addEventListener('click',posturl)
let elem=document.getElementsByClassName('deletebutton');

var count=1;
var flag=true;

function checkit(){
   if(document.getElementById('urldiv').innerHTML.trim().length == 0){
        document.getElementById('emptymsg').style.display = 'block';
    }
    else{
        document.getElementById('emptymsg').style.display = 'none';
    }
}

function msg(data){
    document.getElementById('msgdiv').innerHTML='<font color="red">'+data+'</font>';
    setTimeout(function() {document.getElementById('msgdiv').innerHTML='<font color="red">'+""+'</font>';}, 3000);
}



function deleteurl(e){
    //console.log("Element with ID: "+urlid +"clicked");
    //console.log(e);
    let data=e.target.id.split(",");
    console.log("data: ");
    console.log(data);
    let xhrdel=new XMLHttpRequest();
    xhrdel.open('POST','/dashboard/delurl',true);
    xhrdel.setRequestHeader('content-type','application/json');
    xhrdel.onload=function(){
        if(this.status==200){
            if(JSON.parse(this.responseText)=='del') {
                // console.log("IN delete")
                msg("URL Deleted");
                checkit();
                //document.getElementById('del'+urlid).style.display=none;
                    // let delurl=document.getElementById(data[0]+","+data[1]);
                    //  delurl.parentNode.removeChild(delurl);
                     document.getElementById(data[0]).remove();
            }
            else{
                msg("Some ERROR Occured");
            }
        }
        else{
            msg("Some ERROR Occured");
        }
    }

    xhrdel.send(JSON.stringify({
        delurlid:data[0],
        url:data[1]
    }))

}

function createurlhtml(URL){
    document.getElementById('urldiv').innerHTML=`<div id="${URL.urlid}" class="savedurl">
    <img class="URLicon" src="data:image/png;base64,${URL.urlicon}"></img>
    <a href="${URL.url}" target="_blank"><span class="URLtitle">${URL.urltitle}</span></a>
    <img class="deletebutton" id="${URL.urlid},${URL.url}" src="rem.png"></img>
    <span class="URLdomain">${URL.urldomain}</span>
    </div>`
    +document.getElementById('urldiv').innerHTML; 
}


// function deleteelement(urlid){
// //    document.getElementById('del'+urlid).style.display=none;

// }


 function posturl(e){
     e.preventDefault();
   let val=document.getElementById('urlinput').value;
   if(val==''){
        msg("Please Enter URL first");
   }
   else{
  let xhr= new XMLHttpRequest();
  xhr.open('POST','/dashboard/posturl',true);
  xhr.setRequestHeader('content-type','application/json');
  xhr.onload= function(){
      if(this.status==200){
            let URL=JSON.parse(this.responseText);
            if(URL!='INVALID'){
              
             createurlhtml(URL);  
               
             document.getElementById('urlinput').value="";
            //  setTimeout(() => {}, 500);
             document.getElementById(URL.urlid+","+URL.url).addEventListener('click',deleteurl);
             checkit();
            }
            else msg("Some ERROR Occured");
    }
      else{
            msg("Some ERROR Occured");
      }
  }

  xhr.send(JSON.stringify({
        url: val   
  }))

}
}

// function geturl(xhrload,count){

// }

function loadurl(){

    if(flag==false)return;

    let xhrload=new XMLHttpRequest();
    xhrload.open('POST','/dashboard/geturls',true);
    xhrload.setRequestHeader('content-type','application/json');
   
    xhrload.onload=function(){
        if(this.status==200){
            let urlarray= JSON.parse(this.responseText);
            if(urlarray=='INVALID')msg('INVALID');
            else{
            if(urlarray.length==0)flag=false;
            if(urlarray!==undefined&&urlarray.length!=0){
            count++;   
           // console.log(urlarray);
            
            for(let ele=0;ele<urlarray.length;++ele){
                createurlhtml(urlarray[ele]);
            }
            // setTimeout(() => {

            // }, 500);
            for (const URL of urlarray) {
                document.getElementById(URL.urlid+","+URL.url).addEventListener('click',deleteurl);
            }
            checkit();
            loadurl();
          }
      
    }

    }
        else{
            let msg=document.createTextNode("Some ERROR Occured");
            document.getElementById('urldiv').appendChild(msg);
        }
    }

    xhrload.send(JSON.stringify(
        {
           count:count 
        })); 


    if(count==1&&flag==false){
     if(document.getElementById('urldiv').innerHTML=='')document.getElementById('urldiv').innerHTML=`<span class="nourlmsg">
            No URL in your pocket
     </span>`
    }
}

// async function loadurlcontainer(){
//     try{
//         await loadurl();
    
//     if(document.getElementById('urldiv').innerHTML.trim().length > 0){
//         document.getElementById('emptymsg').style.display = none;
//     }
//         }catch(err){
//            msg("Some error Occured");
//         }
// }

   
loadurl();

// loadurlcontainer();


