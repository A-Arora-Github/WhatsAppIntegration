const express = require("express");
const  cors = require("cors");
const axios = require("axios");

const app = express();

app.use(cors());

app.get("/", (req, res) => {
  res.send("Express on Vercel");
});

app.get("/getMessage", (req,res)=>{
    res.send({message:'Sucess'});
})

app.post("/postMessage", (req,res)=>{
    res.send({message:'post message success'});
})

app.listen(5000, () => {
  console.log("Running on port 5000.");
});



// Export the Express API
module.exports = app;
