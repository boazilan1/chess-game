const express =require("express");
const bodyParser = require("body-parser");

const app =express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const boaz="boaz";
app.get("/", function (req, res) {

    //const day = date.getDate();
    res.render("list", { boaz: boaz });
  
  });



app.listen(process.env.PORT || 3000, function () {
    console.log("Server started on ");
  });
  