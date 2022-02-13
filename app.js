const express =require("express");
const bodyParser = require("body-parser");
const path = require('path');

const app =express();


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'ejs');
//const boaz="boaz";
app.get("/", function (req, res) {

    //const day = date.getDate();
    res.write("hii");
    res.send();

    //res.render("list", { boaz: boaz });
  
  });



app.listen(process.env.PORT || 3000,  () =>{
    console.log("Server started on ");
  });
  