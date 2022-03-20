
const express = require("express");
const bodyParser = require("body-parser");
const path = require('path');
const games = require(__dirname + "/game.js")
const app = express();
// const mengoose = require("mongoose");

// const moveSchema = new mengoose.Schema({
//     from: {
//       type: String,
//       required: true
//     },
//     to: {
//         type: String,
//         required: true
//       }
//   });
  
// const Move = mengoose.model("Move", moveSchema);

// mengoose.connect("mongodb+srv://admin-boaz:123232344@cluster0.pkyoh.mongodb.net/moves");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set('view engine', 'ejs');


const game1 = new games.Ob_game(8, "clasic");


app.get("/", (req, res) => {

    res.render("list", { Board: game1.board.the_board, turn: "White", cls: "black_box" });   

});

app.post("/", (req, res) => {
    console.log(req.body.Piece_from,req.body.Piece_to,req.body.chig_turn);
    const ret=[req.body.Piece_from,req.body.Piece_to];
    if(req.body.chig_turn!=0){
   
        let picec_from = [req.body.Piece_from[0], req.body.Piece_from[2]]
        let picec_to = [req.body.Piece_to[0], req.body.Piece_to[2]]
        console.log(picec_from,picec_to)
        game1.move_without_Change_turn(picec_from,picec_to);
        return
    }
    game1.move(req.body.Piece_from,req.body.Piece_to);
    let next_move=game1.Strategy();  
     console.log(next_move);
    res.send(next_move);

 
  });


app.listen(process.env.PORT , () => {
    console.log("Server started on ");
});

