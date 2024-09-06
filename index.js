const express = require("express");
const  cors = require("cors");
const axios = require("axios");
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
app.use(bodyParser.json());


const WHATSAPP_PHONE_NUMBER_ID = '354266431113065';
const ENDPOINT = `https://graph.facebook.com/v20.0/${WHATSAPP_PHONE_NUMBER_ID}/messages`;
const TEMP_ACCESS_TOKEN = 'EAAWEh2d9r1IBOZBScO8NHlQpdUjeSlzmX9rYuEYWG7GjnKJyeW5ism0Cl4Ix8NSNGVPvNxxe4I5dLYLxTdKq9et5hd17xZAhi0vWYVtxnkQguJJY91kLNdQFvbJeqx7kxXD5jZAf9Aki8ZANwVxAr3HpRhFGg1QMB4jOwUlMqMF2c8ZCb0WZByxZAqldeIYYRzYoOJqd5ecq5sZBklVH7BeF4odro0cZD';
const ACCESS_TOKEN = 'EAAWEh2d9r1IBO797zYZCdE4B7Je7WY70TCkhe18i0O8LFGDF7hLSps1ysRbEZCb6doXAf5MJg8CfhSdNqaaDaHVORAMPuyZC2ZBzOfR42nYOFC99nZB6C0wmw3qOUiZB5fdC4x1ph35JhkeW80YUBXfn0FCzAlZBdzf9Ro3jjaaM7pzuwAA1NXGRvJDckpI3tPjS3ciyZCHds0f7jvNgaRYOCZBJz8JB9DYpVnaUMh78ZD';
const MESSAGE_TEXT = `This is sample message text`

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/getMessage", (req,res)=>{
    res.send({message:'Sucess'});
})

app.post("/postMessage", async (req,res)=>{
    console.log(req.body);
    let message = req?.body?.message===undefined?MESSAGE_TEXT:req?.body?.message;
    let phoneNumberList = req?.body?.phoneNumberList;
    let messageType = req?.body?.messageType;

    if (phoneNumberList===undefined) res.send({status:400,data:'Please send a valid phone number list'})
    else if(messageType!=='text' && messageType!=='template') res.send({status:404,data:'For now allowed message type can only be text or template'})
    else if(phoneNumberList===undefined || phoneNumberList.length<1) res.send({status:200,statusList:[]});
    else{
        let response = await sendMessage(message,messageType,phoneNumberList);    
        if(response==='error') res.send({status:400,statusList:[]});
        else res.send({status:200,statusList:response});
    }
});


let sendMessage = async (message,messageType,phoneNumberList)=>{
    let response=[];

    console.log('in send message');

    await Promise.all(phoneNumberList.map(async(number)=>{
        let response2 = await sendMessageUtil(number,message,messageType,);
        response.push(response2);
    }))
    .then(res=>{
        // console.log('res in promise all '+res);
    });
    

    return response;
}
    

let sendMessageUtil = async (to,message,messageType,)=>{
    // console.log('in send message');
    let status;
    
    let headers = {
        'Content-Type':'application/json',
        'Authorization':`Bearer ${ACCESS_TOKEN}`
    };

    let data = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": to,
        "type": messageType,
    }

    if(messageType==='text') data['text'] = {"preview_url": true, "body": message}
    else if(messageType==='template') data['template'] = {"name": "hello_world", "language": { "code": "en_US" } } 


    console.log(data);


    await axios.post(ENDPOINT, data, {
        headers: headers
    })
    .then((response) => {
        status = response.status;
        // console.log(response.status);
    })
    .catch((error) => {
        status = error.status
        console.log('in errrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrror');
        // console.log(error);
    });

    return status;
}



app.listen(5000, () => {
  console.log("Running on port 5000.");
});



// Export the Express API
module.exports = app;
