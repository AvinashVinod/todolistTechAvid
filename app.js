const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");

var app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));

let items = ["Buy food","Cook food","Eat food"];
let workItems = [];

app.set('view engine','ejs');


app.get("/",function(req,res){

  let day = date.getDate();
  res.render("list",{listTitle:day,newItems:items});


});

app.post("/",(req,res)=>{


  let item = req.body.content;

  // var btn = req.body.button;

  // console.log(btn);

  if(req.body.button === "Work"){
    workItems.push(item);

    res.redirect("/work");
  }
  else{
    items.push(item);

    res.redirect("/");
  }


});

app.get("/work",(req,res)=>{

   res.render("list",{listTitle:"Work List",newItems:workItems});

});

app.post("/work",(req,res)=>{

   let workItem = req.body.content;
   
   workItems.push(workItem);

   res.redirect("/work");

});

app.get("/about",function(req,res){

   res.render("about");

});


app.listen(4000,()=>{
   console.log("Your server has been started at localhost:4000");
});