require('dotenv').config();// for .env file
const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const mailchimp=require("@mailchimp/mailchimp_marketing");

const app=express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));//body-parser
//home route
app.get("/", function (req, res) { 
res.sendFile(__dirname+"/newsletter.html")
 });
app.post("/", function (req, res) {
    const firstName=req.body.firstname;
    const lastName=req.body.secondname;
    const eMail=req.body.email;
    console.log(firstName, lastName, eMail);

    mailchimp.setConfig({
      apiKey: process.env.api_Key,
      server: "us19"  
    });
    const listId=process.env.unique_id;

    async function run() { 
try {
    const response=await mailchimp.lists.addListMember(listId,{
email_address: eMail,
status:"subscribed",
merge_fields:{
    FNAME:firstName,
    LNAME:lastName
}
    })
    res.sendFile(__dirname+"/success.html");
    console.log("new user has been added, his email address is"+eMail+"  and he is welcome  ");
} catch (error) {
   res.sendFile(__dirname+"/failure.html");
   
   console.log("something went wrong");
}
     }
     run();

  });
  //failure page route
  app.post("/failure", function(req, res){
    res.redirect("/")
    })
    


 app.listen(3000, function() {
     console.log("server is listening to port 3000")
 })
