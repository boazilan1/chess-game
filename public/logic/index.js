
//---------calss picec
// "Pawn":        
// "Bishop":           
// "Knight":             
// "Rook":              
// "Queen":             
// "King":
//---------calss color(player):

let Wants_to_move;
let score = 0;
let this_is_me;
const form = document.getElementById("myForm");


function moving_from_Outside(position_form,position_to){

    let next_pos1 = [0, 0];
    next_pos1[0]=position_form[1]
    next_pos1[1]=position_form[3]
    let next_pos2 = [0, 0];
    next_pos2[0]=position_to[1]
    next_pos2[1]=position_to[3]

    let from= document.getElementById(next_pos1);
    let to= document.getElementById(next_pos2);
   
    move_Piece_to_here(from, to);
    turn.classList.toggle("White");
    turn.classList.toggle("Black");
    if (check_chass()) {
        const chess = document.getElementById("chess");
        chess.textContent = "chess";
        if (!check_Matte()) {
            chess.textContent = "chess Matte";
        }
    } else {
        const chess = document.getElementById("chess");
        chess.textContent = "";
    }
}
function place_togo() {

    var turn = document.getElementById("turn");
    this_is_me = this;
    if (this.classList.contains("can_go")) {
        move_Piece_to_here(Wants_to_move, this);
        turn.classList.toggle("White");
        turn.classList.toggle("Black");
        if (check_chass()) {
            const chess = document.getElementById("chess");
            chess.textContent = "chess";
            if (!check_Matte()) {
                chess.textContent = "chess Matte";
            }
        } else {
            const chess = document.getElementById("chess");
            chess.textContent = "";
        }
        clear_all();
        ////-----------------------form
        //const form = document.getElementById( "myForm" );
        sendData(Wants_to_move, this_is_me);
        ///------------------------form
        return
    }
    clear_all();

    if ((white_turn(turn) && im_white(this)) || (black_turn(turn) && im_black(this))) {
        Possible_places_to_move(this);
    }
    Wants_to_move = this;
}
function Which_Piece_im(Piece) {

    if (Piece.classList.contains("Pawn")) {
        return "Pawn";
    } else {
        if (Piece.classList.contains("Bishop")) {
            return "Bishop";
        } else {
            if (Piece.classList.contains("Knight")) {
                return "Knight";
            } else {
                if (Piece.classList.contains("Rook")) {
                    return "Rook";
                } else {
                    if (Piece.classList.contains("Queen")) {
                        return "Queen";
                    } else {
                        if (Piece.classList.contains("King")) {
                            return "King";
                        }
                    }
                }
            }
        }
    }
    return "empty";
}
function Which_color_im(Piece) {
    if (Piece.classList.contains("white")) {
        return "white";
    }
    if (Piece.classList.contains("black")) {
        return "black";
    }
    return "empty";
}
function move_Piece_to_here(from, to) {
    let tipey = Which_Piece_im(to);
    let flag=0
    if(from.classList.contains("King") && from.classList.contains("not_move_yet")){
        flag=1;      
    }
    
    switch (tipey) {
        case "Pawn":
            score = 1;
            to.classList.remove("Pawn");

            break;
        case "Bishop":
            to.classList.remove("Bishop");
            score = 3;
            break;
        case "Knight":
            to.classList.remove("Knight");
            score = 3;
            break;
        case "Rook":
            to.classList.remove("Rook");
            score = 5;
            break;
        case "Queen":
            to.classList.remove("Queen");
            score = 9;
            break;
        case "King":
            score = 0;
            break;
        case "empty":
            score = 0;
            break;
        default:
            break;
    }
    from.classList.remove("not_move_yet")
    coronation_possible(from, to);
    to.classList.add(Which_Piece_im(from));
    to.classList.remove(Which_color_im(to));
    to.classList.add(Which_color_im(from));
    to.classList.remove("not_move_yet")
    from.classList.remove(Which_color_im(from));
    from.classList.remove(Which_Piece_im(from));
    from.classList.remove("not_move_yet");
    from.classList.add("empty");
    if(flag){
      
        let position=position_from_Piece(to)
        console.log(position);
        if(position[0]==7 && position[1]==1){
            
            var rook=document.getElementById([7,0]);
            var rook_move=document.getElementById([7,2]);
            move_Piece_to_here(rook, rook_move);
            sendData(rook, rook_move,1);
        }
        if(position[0]==7&& position[1]==5){
            
            var rook=document.getElementById([7,7]);
            var rook_move=document.getElementById([7,4]);
            move_Piece_to_here(rook, rook_move);
            sendData(rook, rook_move,1);
        }
        if(position[0]==0 && position[1]==1){
            
            var rook=document.getElementById([0,0]);
            var rook_move=document.getElementById([0,2]);
            move_Piece_to_here(rook, rook_move);
            sendData(rook, rook_move,1);
        }
        if(position[0]==0&& position[1]==5){
            
            var rook=document.getElementById([0,7]);
            var rook_move=document.getElementById([0,4]);
            move_Piece_to_here(rook, rook_move);
            sendData(rook, rook_move,1);
        }        
    }

} 
//need to add a chise alse from queen
function coronation_possible(from, to) {

    if (from.classList.contains("Pawn") && (im_white(from) && position_from_Piece(to)[0] == 0)) {
        from.classList.remove(Which_Piece_im(from));
        from.classList.add("Queen");
    }
    if (from.classList.contains("Pawn") && (im_black(from) && position_from_Piece(to)[0] == 7)) {
        from.classList.remove(Which_Piece_im(from));
        from.classList.add("Queen");
    }
}
function Possible_places_to_move(Piece) {

    if (Piece.classList.contains("Pawn")) {
        Possible_places_to_move_Pawn(Piece);
    } else {
        if (Piece.classList.contains("Bishop")) {
            Possible_places_to_move_Bishop(Piece);
        } else {
            if (Piece.classList.contains("Knight")) {
                Possible_places_to_move_Knight(Piece);
            } else {
                if (Piece.classList.contains("Rook")) {
                    Possible_places_to_move_Rook(Piece);
                } else {
                    if (Piece.classList.contains("Queen")) {
                        Possible_places_to_move_Queen(Piece);
                    } else {
                        if (Piece.classList.contains("King")) {
                            Possible_places_to_move_King(Piece);
                        }
                    }
                }
            }
        }
    }

}
function Possible_places_to_move_tf(Piece) {

    if (Piece.classList.contains("Pawn")) {
        return Possible_places_to_move_Pawn_tf(Piece);
    } else {
        if (Piece.classList.contains("Bishop")) {
            return Possible_places_to_move_Bishop_tf(Piece);
        } else {
            if (Piece.classList.contains("Knight")) {
                return Possible_places_to_move_Knight_tf(Piece);
            } else {
                if (Piece.classList.contains("Rook")) {
                    return Possible_places_to_move_Rook_tf(Piece);
                } else {
                    if (Piece.classList.contains("Queen")) {
                        return Possible_places_to_move_Queen_tf(Piece);
                    } else {
                        if (Piece.classList.contains("King")) {
                            return Possible_places_to_move_King_tf(Piece);
                        }
                    }
                }
            }
        }
    }

}
function im_black(Piece) {

    if (Piece.classList.contains("black")) {
        return true;
    }
    return false;
}
function im_white(Piece) {

    if (Piece.classList.contains("white")) {
        return true;
    }
    return false;
}
function im_empty(Piece) {

    if (Piece.classList.contains("empty")) {
        return true;
    }
    return false;
}
function white_turn(turn) {
    return turn.classList.contains("White");
}
function black_turn(turn) {
    return turn.classList.contains("Black");
}
function check_position(position) {
    var Piece = document.getElementById(position);
    var turn = document.getElementById("turn");
    if (in_the_bord(position)) {
        if (black_turn(turn)) {
            if (im_white(Piece) || im_empty(Piece)) {
                if (chess(Piece)) {
                    return true;
                }
            }
        } else {
            if (white_turn(turn)) {
                if (im_black(Piece) || im_empty(Piece)) {
                    if (chess(Piece)) {
                        return true;
                    }
                }
            }
        }
    }
    return false;
}
function Diagonal_chess(position, up_down, left_Right) {

    var turn = document.getElementById("turn");
    let position_to_go = [0, 0];

    for (let i = 1; i < 8; i++) {
        position_to_go[0] = position[0] + up_down * i;
        position_to_go[1] = position[1] + left_Right * i;
        if (in_the_bord(position_to_go)) {
            if (black_turn(turn)) {
                Piece = document.getElementById(position_to_go);

                if (!im_empty(Piece)) {
                    if (im_white(Piece)) {
                        if (up_down == 1 && (left_Right == 1 || left_Right == -1) && i == 1 && Piece.classList.contains("Pawn")) {
                            return false
                        }
                        if (Piece.classList.contains("Rook") && (((up_down == 1 || up_down == -1) && left_Right == 0) || (up_down == 0 && (left_Right == -1 || left_Right == 1)))) {
                            return false
                        }
                        if (Piece.classList.contains("Bishop") && ((up_down == 1 || up_down == -1) && (left_Right == -1 || left_Right == 1))) {
                            return false
                        }
                        if (Piece.classList.contains("Queen")) {
                            return false
                        }
                        if (Piece.classList.contains("King") && i == 1) {
                            return false
                        }
                        return true
                    }
                    return true
                }

            }
            if (white_turn(turn)) {
                Piece = document.getElementById(position_to_go);

                if (!im_empty(Piece)) {
                    if (im_black(Piece)) {
                        if (up_down == -1 && (left_Right == 1 || left_Right == -1) && i == 1 && Piece.classList.contains("Pawn")) {
                            return false
                        }
                        if (Piece.classList.contains("Rook") && (((up_down == 1 || up_down == -1) && left_Right == 0) || (up_down == 0 && (left_Right == -1 || left_Right == 1)))) {
                            return false
                        }
                        if (Piece.classList.contains("Bishop") && ((up_down == 1 || up_down == -1) && (left_Right == -1 || left_Right == 1))) {
                            return false
                        }
                        if (Piece.classList.contains("Queen")) {
                            return false
                        }
                        if (Piece.classList.contains("King") && i == 1) {
                            return false
                        }
                        return true
                    }
                    return true
                }
            }
        }

    }
    return true
}
function Knight_chess(position) {

    var turn = document.getElementById("turn");
    let position_to_go = [position[0], 0, position[1]];

    let pos = Knight_move(position_to_go);
    for (let i = 0; i < 8; i++) {
        if (in_the_bord(pos[i])) {
            if (black_turn(turn)) {
                Piece = document.getElementById(pos[i]);

                if (!im_empty(Piece) && Piece.classList.contains("Knight")) {
                    if (im_white(Piece)) {
                        return false;
                    }
                }
            }
            if (white_turn(turn)) {
                Piece = document.getElementById(pos[i]);

                if (!im_empty(Piece)&& Piece.classList.contains("Knight")) {
                    if (im_black(Piece)) {
                        return false;
                    }
                }
            }
        }
    }
    return true;

}
function Temporary_sliding() {

}
function check_chass() {
    var turn = document.getElementById("turn");
    let King;
    if (white_turn(turn)) {
        King = document.getElementsByClassName('King white');
    } else {
        King = document.getElementsByClassName('King black');
    }
    let king_pos = position_from_Piece(King[0]);

    if (Diagonal_chess(king_pos, 1, 1) &&
        Diagonal_chess(king_pos, -1, 1) &&
        Diagonal_chess(king_pos, 1, -1) &&
        Diagonal_chess(king_pos, -1, -1) &&
        Diagonal_chess(king_pos, -1, 0) &&
        Diagonal_chess(king_pos, 1, 0) &&
        Diagonal_chess(king_pos, 0, 1) &&
        Diagonal_chess(king_pos, 0, -1) &&
        Knight_chess(king_pos)
    ) {

        return false;
    }
    return true;
}
function check_Matte() {
    var turn = document.getElementById("turn");

    let palyr_Piece;
    if (white_turn(turn)) {
        palyr_Piece = document.getElementsByClassName('white');
    } else {
        palyr_Piece = document.getElementsByClassName('black');
    }
    let temp = this_is_me;
    for (var i = 0; i < palyr_Piece.length; i++) {
        this_is_me = palyr_Piece[i];
        if (Possible_places_to_move_tf(palyr_Piece[i])) {  
            this_is_me = temp;
            return true;
        }
    }
    this_is_me = temp;
    return false;
}
function chess(Piece) {

    var turn = document.getElementById("turn");
    let from = this_is_me;


    let temp_from = [];
    let temp_to = [];

    // 1.1 save the to boxes
    temp_to = [Which_Piece_im(Piece), Which_color_im(Piece)];
    temp_from = [Which_Piece_im(from), Which_color_im(from)];

    //1.2 remvoe from the  box the picec wont to move ther
    Piece.classList.remove(Which_Piece_im(Piece));
    Piece.classList.remove(Which_color_im(Piece));
    //2.1 adding the picec to thet place
    temp_from.forEach(cls => Piece.classList.add(cls))
   
    //2.2 remove from the place the picec wnt to move from
    from.classList.remove(Which_Piece_im(from));
    from.classList.remove(Which_color_im(from));
    from.classList.add("empty");


    let King;
    if (white_turn(turn)) {
        King = document.getElementsByClassName('King white');
    } else {
        King = document.getElementsByClassName('King black');
    }
    let king_pos = position_from_Piece(King[0]);
   
   
    if (Diagonal_chess(king_pos, 1, 1) &&
        Diagonal_chess(king_pos, -1, 1) &&
        Diagonal_chess(king_pos, 1, -1) &&
        Diagonal_chess(king_pos, -1, -1) &&
        Diagonal_chess(king_pos, -1, 0) &&
        Diagonal_chess(king_pos, 1, 0) &&
        Diagonal_chess(king_pos, 0, 1) &&
        Diagonal_chess(king_pos, 0, -1) &&
        Knight_chess(king_pos)
    ) {

        //4.1
        from.classList.remove("empty");
        temp_from.forEach(cls => from.classList.add(cls));
        //4.2.1
        Piece.classList.remove(Which_Piece_im(Piece));
        Piece.classList.remove(Which_color_im(Piece));
        temp_to.forEach(cls => Piece.classList.add(cls));

       
        return true;
    }
    //4.1
    from.classList.remove("empty");
    temp_from.forEach(cls => from.classList.add(cls));
    //4.2.1
    Piece.classList.remove(Which_Piece_im(Piece));
    Piece.classList.remove(Which_color_im(Piece));
    temp_to.forEach(cls => Piece.classList.add(cls));
   

    return false;

}
function in_the_bord(position) {
    if (position[0] < 0 || position[0] > 7 || position[1] < 0 || position[1] > 7) {
        return false;
    }
    return true;
}
function Possible_places_to_move_Pawn(Piece) {

    let position = position_from_Piece(Piece);
    if (Piece.classList.contains("white")) {

        let next_pos = [0, 0];
        next_pos[0] = position[0] - 1;
        next_pos[1] = position[1];

        let next_pos1 = [0, 0];
        next_pos1[0] = position[0] - 1;
        next_pos1[1] = position[1] - 1;

        let next_pos2 = [0, 0];
        next_pos2[0] = position[0] - 1;
        next_pos2[1] = position[1] + 1;

        if (check_position(next_pos1)) {
            var next_Piece = document.getElementById(next_pos1);
            if (!im_empty(next_Piece)) {
                next_Piece.classList.add("can_go");
            }
        }
        if (check_position(next_pos2)) {
            var next_Piece = document.getElementById(next_pos2);
            if (!im_empty(next_Piece)) {
                next_Piece.classList.add("can_go");
            }
        }


        if (check_position(next_pos)) {
            var next_Piece = document.getElementById(next_pos);
            if (im_empty(next_Piece)) {

                next_Piece.classList.add("can_go");

            }
        }
        if (position[0] == 6) {
            var next_Piece = document.getElementById(next_pos);
            if (im_empty(next_Piece)) {
                next_pos[0] = position[0] - 2;
                next_pos[1] = position[1];
                next_Piece = document.getElementById(next_pos);
                if (im_empty(next_Piece) && check_position(next_pos)) {
                    next_Piece.classList.add("can_go");
                }
            }
        }
    }

    if (Piece.classList.contains("black")) {


        let next_pos = [0, 0];
        next_pos[0] = position[0] + 1;
        next_pos[1] = position[1];

        let next_pos1 = [0, 0];
        next_pos1[0] = position[0] + 1;
        next_pos1[1] = position[1] - 1;

        let next_pos2 = [0, 0];
        next_pos2[0] = position[0] + 1;
        next_pos2[1] = position[1] + 1;

        if (check_position(next_pos1)) {
            var next_Piece = document.getElementById(next_pos1);
            if (!im_empty(next_Piece)) {
                next_Piece.classList.add("can_go");
            }
        }
        if (check_position(next_pos2)) {
            var next_Piece = document.getElementById(next_pos2);
            if (!im_empty(next_Piece)) {
                next_Piece.classList.add("can_go");
            }
        }


        if (check_position(next_pos)) {
            var next_Piece = document.getElementById(next_pos);
            if (im_empty(next_Piece)) {

                next_Piece.classList.add("can_go");
                // if (position[0] == 1) {
                //     next_pos[0] = position[0] + 2;
                //     next_pos[1] = position[1];
                //     next_Piece = document.getElementById(next_pos);
                //     if (im_empty(next_Piece) && check_position(next_pos)) {
                //         next_Piece.classList.add("can_go");
                //     }
                // }
            }
        }
        if (position[0] == 1) {
            var next_Piece = document.getElementById(next_pos);
            if (im_empty(next_Piece)) {
                next_pos[0] = position[0] + 2;
                next_pos[1] = position[1];
                next_Piece = document.getElementById(next_pos);
                if (im_empty(next_Piece) && check_position(next_pos)) {
                    next_Piece.classList.add("can_go");
                }
            }
        }
    }
}
function Possible_places_to_move_Pawn_tf(Piece) {

    let position = position_from_Piece(Piece);
    if (Piece.classList.contains("white")) {

        console.log("1");
        let next_pos = [0, 0];
        next_pos[0] = position[0] - 1;
        next_pos[1] = position[1];

        let next_pos1 = [0, 0];
        next_pos1[0] = position[0] - 1;
        next_pos1[1] = position[1] - 1;

        let next_pos2 = [0, 0];
        next_pos2[0] = position[0] - 1;
        next_pos2[1] = position[1] + 1;

        if (check_position(next_pos1)) {
            var next_Piece = document.getElementById(next_pos1);
            if (!im_empty(next_Piece)) {
                console.log("2");
                return true
            }
        }
        if (check_position(next_pos2)) {
            var next_Piece = document.getElementById(next_pos2);
            if (!im_empty(next_Piece)) {
                console.log("3");
                return true
            }
        }


        if (check_position(next_pos)) {
            var next_Piece = document.getElementById(next_pos);
            if (im_empty(next_Piece)) {
                console.log("4");
                return true
                if (position[0] == 6) {
                    next_pos[0] = position[0] - 2;
                    next_pos[1] = position[1];
                    next_Piece = document.getElementById(next_pos);
                    if (im_empty(next_Piece)) {
                        next_Piece.classList.add("can_go");
                    }
                }
            }
        }
    }

    if (Piece.classList.contains("black")) {


        let next_pos = [0, 0];
        next_pos[0] = position[0] + 1;
        next_pos[1] = position[1];

        let next_pos1 = [0, 0];
        next_pos1[0] = position[0] + 1;
        next_pos1[1] = position[1] - 1;

        let next_pos2 = [0, 0];
        next_pos2[0] = position[0] + 1;
        next_pos2[1] = position[1] + 1;

        if (check_position(next_pos1)) {
            var next_Piece = document.getElementById(next_pos1);
            if (!im_empty(next_Piece)) {
                console.log("5");
                return true
            }
        }
        if (check_position(next_pos2)) {
            var next_Piece = document.getElementById(next_pos2);
            if (!im_empty(next_Piece)) {
                console.log("6");
                return true
            }
        }


        if (check_position(next_pos)) {

            var next_Piece = document.getElementById(next_pos);
            if (im_empty(next_Piece)) {
                console.log("7");
                return true
                if (position[0] == 1) {
                    next_pos[0] = position[0] + 2;
                    next_pos[1] = position[1];
                    next_Piece = document.getElementById(next_pos);
                    if (im_empty(next_Piece)) {
                        return true
                    }
                }
            }
        }
    }
    return false

}
function Possible_places_to_move_Bishop(Piece) {

    let position = position_from_Piece(Piece);

    Diagonal_move(position, 1, 1);
    Diagonal_move(position, -1, 1);
    Diagonal_move(position, 1, -1);
    Diagonal_move(position, -1, -1);
}
function Possible_places_to_move_Bishop_tf(Piece) {

    let position = position_from_Piece(Piece);
    if (
        Diagonal_move_tf(position, 1, 1) ||
        Diagonal_move_tf(position, -1, 1) ||
        Diagonal_move_tf(position, 1, -1) ||
        Diagonal_move_tf(position, -1, -1)
    ) {
        return true;
    }
    return false
}
function Diagonal_move_tf(position, up_down, left_Right) {

    let position_to_go = [0, 0];
    for (let i = 1; i < 8; i++) {
        position_to_go[0] = position[0] + up_down * i;
        position_to_go[1] = position[1] + left_Right * i;

        if (check_position(position_to_go)) {

            Piece = document.getElementById(position_to_go);
            
            return true
            if (!im_empty(Piece)) {
                return
            }
        } else {
            return false
        }
    }
}
function Diagonal_move(position, up_down, left_Right) {

    let position_to_go = [0, 0];
    for (let i = 1; i < 8; i++) {
        position_to_go[0] = position[0] + up_down * i;
        position_to_go[1] = position[1] + left_Right * i;
        if (check_position(position_to_go)) {

            Piece = document.getElementById(position_to_go);
            Piece.classList.add("can_go");
            if (!im_empty(Piece)) {
                return
            }
        } else {
            if (in_the_bord(position_to_go)) {
                Piece = document.getElementById(position_to_go);
                if (!im_empty(Piece)) return;
            } else {
                return
            }
        }
    }
}
function position_from_Piece(Piece) {

    let position = Piece.id;
    return [Number(position[0]), Number(position[2])]
}
function Possible_places_to_move_Knight(Piece) {

    let position = Piece.id;
    let next_pos = Knight_move(position);
    for (let i = 0; i < 8; i++) {

        if (check_position(next_pos[i])) {
            var Piece = document.getElementById(next_pos[i]);
            Piece.classList.add("can_go");
        }
    }


}
function Knight_move(position) {

    let next_pos1 = [0, 0];
    next_pos1[0] = Number(position[0]) - 2;
    next_pos1[1] = Number(position[2]) - 1;

    let next_pos2 = [0, 0];
    next_pos2[0] = Number(position[0]) + 2;
    next_pos2[1] = Number(position[2]) - 1;

    let next_pos3 = [0, 0];
    next_pos3[0] = Number(position[0]) + 2;
    next_pos3[1] = Number(position[2]) + 1;

    let next_pos4 = [0, 0];
    next_pos4[0] = Number(position[0]) - 2;
    next_pos4[1] = Number(position[2]) + 1;

    let next_pos5 = [0, 0];
    next_pos5[0] = Number(position[0]) - 1;
    next_pos5[1] = Number(position[2]) - 2;

    let next_pos6 = [0, 0];
    next_pos6[0] = Number(position[0]) + 1;
    next_pos6[1] = Number(position[2]) - 2;

    let next_pos7 = [0, 0];
    next_pos7[0] = Number(position[0]) + 1;
    next_pos7[1] = Number(position[2]) + 2;

    let next_pos8 = [0, 0];
    next_pos8[0] = Number(position[0]) - 1;
    next_pos8[1] = Number(position[2]) + 2;

    let next_pos = [next_pos1, next_pos2, next_pos3, next_pos4, next_pos5, next_pos6, next_pos7, next_pos8]
    return next_pos
}
function Possible_places_to_move_Knight_tf(Piece) {

    let position = Piece.id;

    let next_pos1 = [0, 0];
    next_pos1[0] = Number(position[0]) - 2;
    next_pos1[1] = Number(position[2]) - 1;

    let next_pos2 = [0, 0];
    next_pos2[0] = Number(position[0]) + 2;
    next_pos2[1] = Number(position[2]) - 1;

    let next_pos3 = [0, 0];
    next_pos3[0] = Number(position[0]) + 2;
    next_pos3[1] = Number(position[2]) + 1;

    let next_pos4 = [0, 0];
    next_pos4[0] = Number(position[0]) - 2;
    next_pos4[1] = Number(position[2]) + 1;

    let next_pos5 = [0, 0];
    next_pos5[0] = Number(position[0]) - 1;
    next_pos5[1] = Number(position[2]) - 2;

    let next_pos6 = [0, 0];
    next_pos6[0] = Number(position[0]) + 1;
    next_pos6[1] = Number(position[2]) - 2;

    let next_pos7 = [0, 0];
    next_pos7[0] = Number(position[0]) + 1;
    next_pos7[1] = Number(position[2]) + 2;

    let next_pos8 = [0, 0];
    next_pos8[0] = Number(position[0]) - 1;
    next_pos8[1] = Number(position[2]) + 2;

    let next_pos = [next_pos1, next_pos2, next_pos3, next_pos4, next_pos5, next_pos6, next_pos7, next_pos8]
    for (let i = 0; i < 8; i++) {
       
        if (check_position(next_pos[i])) {
            
            return true;
        }
    }
    return false;

}
function Possible_places_to_move_Rook(Piece) {

    let position = position_from_Piece(Piece);
    Diagonal_move(position, -1, 0);
    Diagonal_move(position, 1, 0);
    Diagonal_move(position, 0, 1);
    Diagonal_move(position, 0, -1);
}
function Possible_places_to_move_Rook_tf(Piece) {

    let position = position_from_Piece(Piece);
    if (Diagonal_move_tf(position, -1, 0) ||
        Diagonal_move_tf(position, 1, 0) ||
        Diagonal_move_tf(position, 0, 1) ||
        Diagonal_move_tf(position, 0, -1)) {
        return true
    }
    return false
}
function Possible_places_to_move_Queen(Piece) {

    let position = position_from_Piece(Piece);
    Diagonal_move(position, 1, 1);
    Diagonal_move(position, -1, 1);
    Diagonal_move(position, 1, -1);
    Diagonal_move(position, -1, -1);
    Diagonal_move(position, -1, 0);
    Diagonal_move(position, 1, 0);
    Diagonal_move(position, 0, 1);
    Diagonal_move(position, 0, -1);
}
function Possible_places_to_move_Queen_tf(Piece) {

    let position = position_from_Piece(Piece);
    if (Diagonal_move_tf(position, 1, 1) ||
        Diagonal_move_tf(position, -1, 1) ||
        Diagonal_move_tf(position, 1, -1) ||
        Diagonal_move_tf(position, -1, -1) ||
        Diagonal_move_tf(position, -1, 0) ||
        Diagonal_move_tf(position, 1, 0) ||
        Diagonal_move_tf(position, 0, 1) ||
        Diagonal_move_tf(position, 0, -1)) {
        return true
    }
    return false
}
function Possible_places_to_move_King(Piece) {

    let position = position_from_Piece(Piece);

    let next_pos1 = [0, 0];
    next_pos1[0] = position[0] - 1;
    next_pos1[1] = position[1] - 1;

    let next_pos2 = [0, 0];
    next_pos2[0] = position[0] + 1;
    next_pos2[1] = position[1] - 1;

    let next_pos3 = [0, 0];
    next_pos3[0] = position[0] - 1;
    next_pos3[1] = position[1] + 1;

    let next_pos4 = [0, 0];
    next_pos4[0] = position[0] + 1;
    next_pos4[1] = position[1] + 1;

    let next_pos5 = [0, 0];
    next_pos5[0] = position[0] - 0;
    next_pos5[1] = position[1] + 1;

    let next_pos6 = [0, 0];
    next_pos6[0] = position[0] - 0;
    next_pos6[1] = position[1] - 1;

    let next_pos7 = [0, 0];
    next_pos7[0] = position[0] - 1;
    next_pos7[1] = position[1] + 0;

    let next_pos8 = [0, 0];
    next_pos8[0] = position[0] + 1;
    next_pos8[1] = position[1] + 0;

    let next_pos = [next_pos1, next_pos2, next_pos3, next_pos4, next_pos5, next_pos6, next_pos7, next_pos8]
    for (let i = 0; i < 8; i++) {

        if (check_position(next_pos[i])) {
            var Piece_go = document.getElementById(next_pos[i]);
            Piece_go.classList.add("can_go");
        }
    }
    console.log(Piece);
    if(Piece.classList.contains("not_move_yet")){
        if(im_white(Piece)){
            let right_rook= document.getElementById([7,7])
            let left_rook= document.getElementById([7,0])
            console.log(left_rook,right_rook);
            if(right_rook.classList.contains("Rook") &&right_rook.classList.contains("not_move_yet")){
                let picec_7_6= document.getElementById([7, 6])
                let picec_7_5= document.getElementById([7, 5])
                let picec_7_4= document.getElementById([7, 4])
                console.log(picec_7_6,picec_7_5,picec_7_4);
                if(im_empty(picec_7_4)&&im_empty(picec_7_5)&&im_empty(picec_7_6)){
                    if(check_position([7, 4])&&check_position([7, 5])&&check_position([7, 6])){
                        picec_7_5.classList.add("can_go");
                    }
                }
            }
            if(left_rook.classList.contains("Rook") &&left_rook.classList.contains("not_move_yet")){
                let picec_7_2= document.getElementById([7, 2])
                let picec_7_1= document.getElementById([7, 1])
                console.log(picec_7_2,picec_7_1);
                if(im_empty(picec_7_1)&&im_empty(picec_7_2)){
                    if(check_position([7, 1])&&check_position([7, 2])){
                        picec_7_1.classList.add("can_go");
                    }
                }
            }
        }
        if(im_black(Piece)){
            let right_rook= document.getElementById([0,7])
            let left_rook= document.getElementById([0,0])
            console.log(left_rook,right_rook);
            if(right_rook.classList.contains("Rook") &&right_rook.classList.contains("not_move_yet")){
                let picec_7_6= document.getElementById([0, 6])
                let picec_7_5= document.getElementById([0, 5])
                let picec_7_4= document.getElementById([0, 4])
                console.log(picec_7_6,picec_7_5,picec_7_4);
                if(im_empty(picec_7_4)&&im_empty(picec_7_5)&&im_empty(picec_7_6)){
                    if(check_position([0, 4])&&check_position([0, 5])&&check_position([0, 6])){
                        picec_7_5.classList.add("can_go");
                    }
                }
            }
            if(left_rook.classList.contains("Rook") &&left_rook.classList.contains("not_move_yet")){
                let picec_7_2= document.getElementById([0, 2])
                let picec_7_1= document.getElementById([0, 1])
                console.log(picec_7_2,picec_7_1);
                if(im_empty(picec_7_1)&&im_empty(picec_7_2)){
                    if(check_position([0, 1])&&check_position([0, 2])){
                        picec_7_1.classList.add("can_go");
                    }
                }
            }
        }
    }
}
function Possible_places_to_move_King_tf(Piece) {

    let position = position_from_Piece(Piece);

    let next_pos1 = [0, 0];
    next_pos1[0] = position[0] - 1;
    next_pos1[1] = position[1] - 1;

    let next_pos2 = [0, 0];
    next_pos2[0] = position[0] + 1;
    next_pos2[1] = position[1] - 1;

    let next_pos3 = [0, 0];
    next_pos3[0] = position[0] - 1;
    next_pos3[1] = position[1] + 1;

    let next_pos4 = [0, 0];
    next_pos4[0] = position[0] + 1;
    next_pos4[1] = position[1] + 1;

    let next_pos5 = [0, 0];
    next_pos5[0] = position[0] - 0;
    next_pos5[1] = position[1] + 1;

    let next_pos6 = [0, 0];
    next_pos6[0] = position[0] - 0;
    next_pos6[1] = position[1] - 1;

    let next_pos7 = [0, 0];
    next_pos7[0] = position[0] - 1;
    next_pos7[1] = position[1] + 0;

    let next_pos8 = [0, 0];
    next_pos8[0] = position[0] + 1;
    next_pos8[1] = position[1] + 0;

    let next_pos = [next_pos1, next_pos2, next_pos3, next_pos4, next_pos5, next_pos6, next_pos7, next_pos8]
    for (let i = 0; i < 8; i++) {

        if (check_position(next_pos[i])) {
            return true
        }
    }
    return false
}
function clear_all() {
    document.querySelectorAll("td").forEach(element => element.classList.remove("can_go"));
}
document.querySelectorAll("td").forEach(e => e.addEventListener("click", place_togo));

function sendData(Piece_from, Piece_to,chig_turn=0) {
    const XHR = new XMLHttpRequest();

    console.log(chig_turn);
    let urlEncodedData = "",
        urlEncodedDataPairs = [], name;


    // document.querySelectorAll("td").forEach(e =>{
    //     urlEncodedDataPairs.push( encodeURIComponent( e.id ) + '=' + encodeURIComponent(e.classList.value ) );
    //     console.log(e.id,e.classList.value);

    // });
    urlEncodedDataPairs.push(encodeURIComponent("Piece_to") + '=' + encodeURIComponent(Piece_to.id));
    urlEncodedDataPairs.push(encodeURIComponent("Piece_from") + '=' + encodeURIComponent(Piece_from.id));
    urlEncodedDataPairs.push(encodeURIComponent("chig_turn") + '=' + encodeURIComponent(chig_turn));

    urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

    XHR.addEventListener("load", function (event) {
        let move = event.currentTarget.response;
        let from =move.slice(1,6)
        let to =move.slice(7,12)
        console.log(move,from,to);
        moving_from_Outside(from,to);        
       
    });

    // Define what happens in case of error
    XHR.addEventListener('error', function (event) {
        alert('Oops! Something went wrong.');
    });

    // Set up our request
    XHR.open('POST', 'http://localhost:3000/');

    // Add the required HTTP header for form data POST requests
    XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    // Finally, send our data.
    XHR.send(urlEncodedData);

}

// function sendData(Piece_from, Piece_to) {
//     const XHR = new XMLHttpRequest();


//     let urlEncodedData = "",
//         urlEncodedDataPairs = [], name;


//     // document.querySelectorAll("td").forEach(e =>{
//     //     urlEncodedDataPairs.push( encodeURIComponent( e.id ) + '=' + encodeURIComponent(e.classList.value ) );
//     //     console.log(e.id,e.classList.value);

//     // });
//     urlEncodedDataPairs.push(encodeURIComponent("Piece_to") + '=' + encodeURIComponent(Piece_to.id));
//     urlEncodedDataPairs.push(encodeURIComponent("Piece_from") + '=' + encodeURIComponent(Piece_from.id));
//     urlEncodedData = urlEncodedDataPairs.join('&').replace(/%20/g, '+');

//     XHR.addEventListener("load", function (event) {
//         let move = event.currentTarget.response;
//         let from =move.slice(1,6)
//         let to =move.slice(7,12)
//         console.log(move,from,to);
//         moving_from_Outside(from,to);        
//         //event.target.responseText ;
//     });

//     // Define what happens in case of error
//     XHR.addEventListener('error', function (event) {
//         alert('Oops! Something went wrong.');
//     });

//     // Set up our request
//     XHR.open('POST', 'http://localhost:3000/');

//     // Add the required HTTP header for form data POST requests
//     XHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

//     // Finally, send our data.
//     XHR.send(urlEncodedData);

// }
