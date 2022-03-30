const games = require(__dirname + "/game.js");

exports.Ob_game = class {

    constructor(board_size, start_position) {

        //n groop of plares
        this.player1 = new games.Player("black", start_position);
        this.player2 = new games.Player("white", start_position);
        this.turn = this.player2;
        this.Other_turn = this.player1;
        //
        this.board = new games.Board(board_size, this);
        this.board.add_player_Piece(this.player1.playr_Pieces);
        this.board.add_player_Piece(this.player2.playr_Pieces);
        this.board.fill_the_rest(board_size);
        //this.bord.print_bord();

    }

    move(Piece_from = [0, 0], Piece_to = [0, 0]) {
        this.Change_turn()
        let picec_from = [Piece_from[0], Piece_from[2]]
        let picec_to = [Piece_to[0], Piece_to[2]]
        this.remove_Piece_from_Player(picec_to);
        this.remove_Piece_from_Player(picec_from);
        this.board.move_be_position(picec_from, picec_to);
        this.add_Piece_to_Player(picec_to);

    }
    move_without_Change_turn(Piece_from = [0, 0], Piece_to = [0, 0]) {
        this.remove_Piece_from_Player(Piece_to);
        this.remove_Piece_from_Player(Piece_from);
        this.board.move_be_position(Piece_from, Piece_to);
        this.add_Piece_to_Player(Piece_to);
    }
    Strategy() {
        //console.log(this.turn.color, this.turn.total_score, this.Other_turn.color, this.Other_turn.total_score);
        let tree = new games.Game_tree(this.turn, this.board, this, this.turn.total_score - this.Other_turn.total_score);
        let to_ret = [tree.root.min_max_node.position_form, tree.root.min_max_node.position_to]
        this.Change_turn();
        this.move_without_Change_turn(to_ret[0], to_ret[1])
        return to_ret;

    }
  

        // let start = S1[0];
        // let profit = player_turn.total_score
        // for (let i = 1; i < S1.length; i++) {
        //     this.move_without_Change_turn(S1[i - 1], S1[i]);
        // }
        // console.log(profit, total_score)
        // return profit - player_turn.total_score;

    add_Piece(Piece) {
        this.board.add_player_Piece([Piece]);
        this.add_Piece_to_Player(Piece.position);
    }
    remove_Piece_from_Player(position) {
        const Piece = this.board.get_Piece_from_position(position);

        if (Piece.im_black()) {
            this.player1.remove_Piece(Piece)
        }
        if (Piece.im_white()) {
            this.player2.remove_Piece(Piece)
        }
    }
    add_Piece_to_Player(position) {
        const Piece = this.board.get_Piece_from_position(position);
        if (Piece.im_black()) {
            this.player1.add_Piece(Piece)
        }
        if (Piece.im_white()) {
            this.player2.add_Piece(Piece)
        }
    }
    Change_turn() {
        if (this.turn == this.player1) {
            this.turn = this.player2;
            this.Other_turn = this.player1;
        } else {
            this.turn = this.player1;
            this.Other_turn = this.player2;
        }
    }
    copy_Piece_from_position(position) {
        const Piece = this.board.get_Piece_from_position(position);
        let Piece_ret = new games.Piece(Piece.tipey, Piece.position, Piece.color, Piece.move);
        
        return Piece_ret;
    }

}
exports.Game_tree = class {

    constructor(player_turn, board, Ob_game, profit = null, parent = null, state = null, Childrens = []) {
        this.Number_of_layers = 6;
        this.Ob_game = Ob_game;
        this.board = board;
        this.root = new games.Node(this.Ob_game, player_turn, null, null, 1, parent, 0, state, Childrens);
        this.add_layer(this.root, 2, this.Number_of_layers);
        //this.min_max_move(this.root);
        this.print_path(this.root);
        
        console.log("--------------finise")
    }
    add_layer(node, layer, num) {

        if (layer == num) {
            return
        }

        let Children;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (node.player_turn.color == this.board.the_board[i][j].color) {

                    let moves = this.board.Where_can_go(this.board.the_board[i][j]);
                    let tipey = this.board.the_board[i][j].tipey;
                    let number_of_moves = this.number_of_moves(moves, tipey);
                    node.number_of_moves += number_of_moves;

                    if (moves != undefined && moves.length > 0) {

                        for (let m = 0; m < moves.length; m++) {

                            if (tipey == "King" && (moves[m][0] - j == 2 || moves[m][0] - j == -2)) {
                                Children = new games.Node(this.Ob_game, this.Ob_game.Other_turn, [i, j], moves[m], layer, node, 1);

                            } else {
                                Children = new games.Node(this.Ob_game, this.Ob_game.Other_turn, [i, j], moves[m], layer, node, 0);
                            }
                            
                            this.Ob_game.Change_turn();
                            if (!(Children.Number_of_layer % 2 == 0) || node.Number_of_layer == 1) {
                                Children.state = this.Ob_game.board.chess_or_mate(this.Ob_game.turn);
                            } else {
                                Children.state = this.Ob_game.board.chess_or_mate(this.Ob_game.Other_turn);
                            }
                            
                            if (node.min_max_node==0 || Children.Number_of_layer+1==this.Number_of_layers) {                                                    
                                this.add_layer(Children, layer + 1, num);     
                                 
                                                     
                            }else{
                                if(Children.min_max_node==0){                         
                                    this.add_layer(Children, layer + 1, num);
                                    
                                    
                                }else{
                                    if(this.need_to_add_layer(node,Children,"black")){
                                        this.add_layer(Children, layer + 1, num);
                                    }
                                
                                }
                            }    
                            this.utility(node,Children,"black");                       
                            //node.Childrens.push(Children);
                            this.Ob_game.Change_turn();
                            Children.move_backwards();
                        }
                    }
                }
            }
        }

    }
    number_of_moves(moves, tipey) {
        return moves.length;        
    }
    need_to_add_layer(parent, Children , max_collor){
        if(Children.state=="chess maty") return false;
        if(parent.player_turn.color==max_collor){        
            if (parent.max <= Children.max) {              
            return true        
            }
        } else {
            if (parent.max >= Children.max) {      
             return true   
            }
        }
        return false;
    }
    utility(parent, Children, max_collor) {

        if(Children.max==null){
            Children.max=Children.profit
        }      
        if(parent.player_turn.color==max_collor){        
            if (parent.max <= Children.max|| parent.max == null ) {
                
                if (parent.max < Children.max || parent.max == null ||(parent.min_max_node.number_of_moves > Children.number_of_moves && parent.max == Children.max && Children.Number_of_layer+1!=this.Number_of_layers) ){
                    //if (Children.state != "chess maty"){// {(parent.min_max_node.number_of_moves <= Children.number_of_moves && parent.max == Children.max)
                        parent.max = Children.max;
                        parent.min_max_node = Children;
                        
                        return 
                    //}
                }
            }
        } else {
            if (parent.max >= Children.max|| parent.max == null) {
            
                if ((parent.max > Children.max || parent.max == null ||(parent.min_max_node.number_of_moves > Children.number_of_moves && parent.max == Children.max&&Children.Number_of_layer+1!=this.Number_of_layers))) {
                    //if (Children.state != "chess maty") {
                        parent.max = Children.max;
                        parent.min_max_node = Children;
                        
                        return 
                    //}
                }
            }
        }
        return        
    }
    min_max_move(node) {
        //console.log(node.Childrens)
        if (node.Childrens.length == 0) {

            node.max = node.profit;
            return node
        }

        let temp_node;

        for (let i = 0; i < node.Childrens.length; i++) {
            temp_node = this.min_max_move(node.Childrens[i])
            if (node.player_turn == this.Ob_game.turn) {

                if (node.max <= temp_node.max || node.max == null || temp_node.state == "chess maty") {
                    if (node.max < temp_node.max || node.max == null || node.min_max_node.number_of_moves <= node.number_of_moves || temp_node.state == "chess maty") {
                        if (node.min_max_node.state != "chess maty") {
                            node.max = temp_node.max;
                            node.min_max_node = temp_node;
                        }
                    }
                }
            } else {

                if (node.max >= temp_node.max || node.max == null || temp_node.state == "chess maty") {
                    if (node.max > temp_node.max || node.max == null || node.min_max_node.number_of_moves <= node.number_of_moves || temp_node.state == "chess maty") {
                        if (node.min_max_node.state != "chess maty") {
                            node.max = temp_node.max;
                            node.min_max_node = temp_node;
                        }
                    }
                }
            }
        }
        return node;
    }
    print_path(node) {

        if (node.min_max_node == 0) {
            console.log(node.position_form, node.position_to, node.player_turn.color, node.profit, node.max, node.Number_of_layer, node.number_of_moves, node.state);
            return;
        }

        console.log(node.position_form, node.position_to, node.player_turn.color, node.profit, node.max, node.Number_of_layer, node.number_of_moves, node.state);
        this.print_path(node.min_max_node)
    }
}

exports.Node = class {

    constructor(Ob_game, player_turn, position_form, position_to, Number_of_layer, parent = null, Castling = 0, state = null, Childrens = []) {

        this.number_of_moves = 0;
        this.Number_of_layer = Number_of_layer
        this.Ob_game = Ob_game;
        this.position_form = position_form;
        this.position_to = position_to;
        this.player_turn = player_turn;
        this.parent = parent;
        this.state = state;
        this.Childrens = Childrens;
        this.Castling = Castling;
        this.min = 0;
        this.min_node;
        this.max = null;
        this.min_max_node = 0;

        if (!(this.Number_of_layer % 2 == 0) || this.Number_of_layer == 1) {

            this.state = this.Ob_game.board.chess_or_mate(this.Ob_game.turn);
        } else {

            this.state = this.Ob_game.board.chess_or_mate(this.Ob_game.Other_turn);
        }

        if (this.position_to != null) {

            if (this.Castling == 1) {
                if(this.position_to==[0,1]) this.Piece_to_rook = this.Ob_game.copy_Piece_from_position([0,2]);
                if(this.position_to==[0,5]) this.Piece_to_rook = this.Ob_game.copy_Piece_from_position([0,4]);
                if(this.position_to==[7,1]) this.Piece_to_rook = this.Ob_game.copy_Piece_from_position([7,2]);
                if(this.position_to==[7,5]) this.Piece_to_rook = this.Ob_game.copy_Piece_from_position([7,4]);
            } 

            this.Piece_to = this.Ob_game.copy_Piece_from_position(this.position_to);
            this.move_forward();

        }


        if (this.Number_of_layer % 2 == 0 || this.Number_of_layer == 1) {
            this.profit = this.Ob_game.turn.total_score - this.Ob_game.Other_turn.total_score;

        } else {
            this.profit = this.Ob_game.Other_turn.total_score - this.Ob_game.turn.total_score;

        }
    }
    move_forward() {

        if (this.Castling == 1) {
            if (this.position_to == [0, 1]) this.Ob_game.move_without_Change_turn([0, 0], [0, 2]);
            if (this.position_to == [0, 5]) this.Ob_game.move_without_Change_turn([0, 7], [0, 4]);
            if (this.position_to == [7, 1]) this.Ob_game.move_without_Change_turn([7, 0], [7, 2]);
            if (this.position_to == [7, 5]) this.Ob_game.move_without_Change_turn([7, 7], [7, 4]);
        }
        this.Ob_game.move_without_Change_turn(this.position_form, this.position_to);


    }
    move_backwards() {

        if (this.Castling == 1) {
            if (this.position_to == [0, 1]) this.Ob_game.move_without_Change_turn([0, 2], [0, 0]);
            if (this.position_to == [0, 5]) this.Ob_game.move_without_Change_turn([0, 4], [0, 7]);
            if (this.position_to == [7, 1]) this.Ob_game.move_without_Change_turn([7, 2], [7, 0]);
            if (this.position_to == [7, 5]) this.Ob_game.move_without_Change_turn([7, 4], [7, 7]);
        }
        this.Ob_game.move_without_Change_turn(this.position_to, this.position_form);
        this.Ob_game.add_Piece(this.Piece_to);


    }
    print_cilsren(node) {
        for (let i = 0; i < node.Childrens.length; i++) {
            let Piece_from = this.Ob_game.board.get_Piece_from_position(node.Childrens[i].position_form);
            if (node.Childrens[i].Number_of_layers == 3 || node.Childrens[i].Number_of_layers == 2) {
                console.log(Piece_from.tipey, node.Childrens[i].position_form, node.Childrens[i].Piece_to.tipey, node.Childrens[i].position_to,
                    node.Childrens[i].profit, node.Childrens[i].Number_of_layers, node.Childrens[i].min_max);
            }
            if (node.Childrens[i] != null) {
                this.print_cilsren(node.Childrens[i]);
            }
        }
    }
}
exports.Player = class {

    constructor(color, start_position) {
        this.color = color;
        this.total_score = 40;
        this.playr_Pieces = [];

        if (start_position == "clasic") {
            if (this.im_black()) {
                for (var i = 0; i < 8; i++) {
                    this.playr_Pieces.push(new games.Piece("Pawn", [1, i], "black"));
                }

                this.playr_Pieces.push(new games.Piece("Rook", [0, 0], "black"));
                this.playr_Pieces.push(new games.Piece("Knight", [0, 1], "black"));
                this.playr_Pieces.push(new games.Piece("Bishop", [0, 2], "black"));
                this.playr_Pieces.push(new games.Piece("King", [0, 3], "black"));
                this.playr_Pieces.push(new games.Piece("Queen", [0, 4], "black"));
                this.playr_Pieces.push(new games.Piece("Bishop", [0, 5], "black"));
                this.playr_Pieces.push(new games.Piece("Knight", [0, 6], "black"));
                this.playr_Pieces.push(new games.Piece("Rook", [0, 7], "black"));
            }

            if (this.im_white()) {
                for (var i = 0; i < 8; i++) {
                    this.playr_Pieces.push(new games.Piece("Pawn", [6, i], "white"));
                }

                this.playr_Pieces.push(new games.Piece("Rook", [7, 0], "white"));
                this.playr_Pieces.push(new games.Piece("Knight", [7, 1], "white"));
                this.playr_Pieces.push(new games.Piece("Bishop", [7, 2], "white"));
                this.playr_Pieces.push(new games.Piece("King", [7, 3], "white"));
                this.playr_Pieces.push(new games.Piece("Queen", [7, 4], "white"));
                this.playr_Pieces.push(new games.Piece("Bishop", [7, 5], "white"));
                this.playr_Pieces.push(new games.Piece("Knight", [7, 6], "white"));
                this.playr_Pieces.push(new games.Piece("Rook", [7, 7], "white"));
            }
        }
    }
    im_black() {
        return this.color == "black";
    }
    im_white() {
        return this.color == "white";
    }
    print_playr_picec() {
        this.playr_Pieces.forEach(Pieces => console.log(Pieces));
    }
    get_king() {

        for (var i = 0; i < this.playr_Pieces.length; i++) {
            if (this.playr_Pieces[i].tipey == "King") {
                return this.playr_Pieces[i];
            }

        }

    }
    remove_Piece(Piece) {
        for (var i = 0; i < this.playr_Pieces.length; i++) {
            if (this.playr_Pieces[i] == Piece) {
                this.total_score = this.total_score - this.playr_Pieces[i].score;
                this.playr_Pieces.splice(i, 1);
            }
        }
    }
    add_Piece(Piece) {
        this.total_score = this.total_score + Piece.score;
        this.playr_Pieces.push(Piece);
    }
}
exports.Piece = class {

    constructor(tipey, position, color, move = "not_move_yet") {
        this.tipey = tipey;
        this.color = color;
        this.position = position;
        this.move = move;
        switch (tipey) {
            case "Pawn":
                this.score = 1;
                break;
            case "Bishop":
                this.score = 3;
                break;
            case "Knight":
                this.score = 3;
                break;
            case "Rook":
                this.score = 5;
                break;
            case "Queen":
                this.score = 10;
                break;
            case "King":
                this.score = 40;
                break;
            case "empty":
                this.score = 0;
                break;

            default:
                this.score = 0;
                break;
        }
    }
    im_black() {
        return this.color === "black";
    }
    im_white() {
        return this.color === "white";
    }
    im_empty() {
        return this.tipey === "empty"
    }
}
exports.Board = class {

    constructor(board_size, Ob_game) {
        this.Ob_game = Ob_game;
        this.the_board = new Array(board_size);

        for (var i = 0; i < board_size; i++) {
            var row = new Array(board_size);
            for (var j = 0; j < board_size; j++) {
                row[j] = null;
            }
            this.the_board[i] = row;
        }
    }
    add_player_Piece(playr_Pieces) {

        playr_Pieces.forEach(Piece => {
            this.the_board[Piece.position[0]][Piece.position[1]] = Piece;
        });

    }
    fill_the_rest(bord_size) {

        for (var i = 0; i < bord_size; i++) {

            for (var j = 0; j < bord_size; j++) {
                if (this.the_board[i][j] == null) {
                    this.the_board[i][j] = new games.Piece("empty", [i, j], "none");
                }
            }

        }
    }
    print_board() {

        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                console.log(this.the_board[i][j])
            }

        }
    }
    get_Piece_from_position(position) {
        return this.the_board[position[0]][position[1]];
    }
    move_be_position(position_from, position_to) {

        let from = this.get_Piece_from_position(position_from);
        let to = this.get_Piece_from_position(position_to);
        if(from.tipey=="Pawn"){
            
            if((to.position[0]==0 && from.im_white()) || (to.position[0]==7 && from.im_black())){
                to.tipey="Queen";
                to.score=10;
                to.color = from.color;
                from.tipey = "empty";
                from.color = "none";
                from.score = 0;
                return;
            }
        }
        to.tipey = from.tipey;
        to.color = from.color;
        to.score = from.score;
        from.tipey = "empty";
        from.color = "none";
        from.score = 0;
    }
    /// return a positions posibol movig spasific bee the function
    Where_can_go(picecs) {
        let moves, moves_ret = [];
        switch (picecs.tipey) {
            case "Pawn":
                return this.Where_can_Pawn_go(picecs);
            case "Bishop":
                moves = this.Where_can_Bishop_go(picecs);
                break;
            case "Knight":
                return this.Where_can_Knight_go(picecs);
            case "Rook":
                moves = this.Where_can_Rook_go(picecs);
                break;
            case "Queen":
                moves = this.Where_can_Queen_go(picecs);
                break;
            case "King":
                return this.Where_can_King_go(picecs);

        }
        for (let m_1 = 0; m_1 < moves.length; m_1++) {
            for (let m_2 = 0; m_2 < moves[m_1].length; m_2++) {
                moves_ret.push(moves[m_1][m_2]);

            }
        }

        return moves_ret;
    }
    Where_can_Pawn_go(picecs) {

        let position = picecs.position;
        let possible_position = [];
        if (picecs.im_white()) {

            let next_pos = [0, 0];
            next_pos[0] = position[0] - 1;
            next_pos[1] = position[1];

            let next_pos1 = [0, 0];
            next_pos1[0] = position[0] - 1;
            next_pos1[1] = position[1] - 1;

            let next_pos2 = [0, 0];
            next_pos2[0] = position[0] - 1;
            next_pos2[1] = position[1] + 1;

            if (this.check_position(next_pos1, position)) {
                let next_Piece = this.get_Piece_from_position(next_pos1);
                if (!next_Piece.im_empty()) {
                    possible_position.push(next_Piece.position);
                }
            }
            if (this.check_position(next_pos2, position)) {
                let next_Piece = this.get_Piece_from_position(next_pos2);
                if (!next_Piece.im_empty()) {
                    possible_position.push(next_Piece.position);
                }
            }


            if (this.check_position(next_pos, position)) {
                let next_Piece = this.get_Piece_from_position(next_pos);
                if (next_Piece.im_empty()) {
                    possible_position.push(next_Piece.position);



                    if (position[0] == 6) {
                        let next_Piece = this.get_Piece_from_position(next_pos);
                        if (next_Piece.im_empty) {
                            next_pos[0] = position[0] - 2;
                            next_pos[1] = position[1];
                            let next_Piece = this.get_Piece_from_position(next_pos);
                            if (next_Piece.im_empty() && this.check_position(next_pos, position)) {
                                possible_position.push(next_Piece.position);
                            }
                        }
                    }
                }
            }
        }

        if (picecs.im_black()) {


            let next_pos = [0, 0];
            next_pos[0] = position[0] + 1;
            next_pos[1] = position[1];

            let next_pos1 = [0, 0];
            next_pos1[0] = position[0] + 1;
            next_pos1[1] = position[1] - 1;

            let next_pos2 = [0, 0];
            next_pos2[0] = position[0] + 1;
            next_pos2[1] = position[1] + 1;

            if (this.check_position(next_pos1, position)) {
                let next_Piece = this.get_Piece_from_position(next_pos1);
                if (!next_Piece.im_empty()) {
                    possible_position.push(next_Piece.position);
                }
            }
            if (this.check_position(next_pos2, position)) {
                let next_Piece = this.get_Piece_from_position(next_pos2);
                if (!next_Piece.im_empty()) {
                    possible_position.push(next_Piece.position);
                }
            }


            if (this.check_position(next_pos, position)) {
                let next_Piece = this.get_Piece_from_position(next_pos);
                if (next_Piece.im_empty()) {
                    possible_position.push(next_Piece.position);



                    if (position[0] == 1) {
                        let next_Piece = this.get_Piece_from_position(next_pos);
                        if (next_Piece.im_empty) {
                            next_pos[0] = position[0] + 2;
                            next_pos[1] = position[1];
                            let next_Piece = this.get_Piece_from_position(next_pos);
                            if (next_Piece.im_empty() && this.check_position(next_pos, position)) {
                                possible_position.push(next_Piece.position);
                            }
                        }
                    }
                }
            }
        }//
        return possible_position;
    }
    Where_can_Bishop_go(picecs) {

        let position = picecs.position;
        let possible_position = [];
        possible_position.push(this.Diagonal_move(position, -1, 1));
        possible_position.push(this.Diagonal_move(position, 1, -1));
        possible_position.push(this.Diagonal_move(position, -1, -1));
        possible_position.push(this.Diagonal_move(position, 1, 1));
        return possible_position;
    }
    Where_can_Knight_go(picecs) {

        let position = picecs.position;
        let possible_position = [];
        let next_pos = Knight_move(position);
        for (let i = 0; i < 8; i++) {
            if (this.check_position(next_pos[i], position)) {
                let Piece = this.get_Piece_from_position(next_pos[i]);

                possible_position.push(Piece.position);
            }
        }
        return possible_position;
    }
    Where_can_Rook_go(picecs) {
        let position = picecs.position;
        let possible_position = [];
        possible_position.push(this.Diagonal_move(position, 1, 0));
        possible_position.push(this.Diagonal_move(position, -1, 0));
        possible_position.push(this.Diagonal_move(position, 0, -1));
        possible_position.push(this.Diagonal_move(position, 0, 1));


        return possible_position;
    }
    Where_can_King_go(picec) {

        let position = picec.position;
        let possible_position = [];
        let next_pos = King_move(position)

        for (let i = 0; i < 8; i++) {
            if (this.check_position(next_pos[i], position)) {
                let Piece_m = this.get_Piece_from_position(next_pos[i]);

                possible_position.push(Piece_m.position);
            }
        }
        if (picec.move == "not_move_yet") {
            if (picec.im_white()) {
                let right_rook = this.get_Piece_from_position([7, 7])
                let left_rook = this.get_Piece_from_position([7, 0])

                if (right_rook.tipey == "Rook" && right_rook.move == "not_move_yet") {
                    let picec_7_6 = this.get_Piece_from_position([7, 6])
                    let picec_7_5 = this.get_Piece_from_position([7, 5])
                    let picec_7_4 = this.get_Piece_from_position([7, 4])

                    if (picec_7_4.im_empty() && picec_7_5.im_empty() && picec_7_6.im_empty()) {
                        if (this.check_position([7, 4], position) && this.check_position([7, 5], position) && this.check_position([7, 6], position)) {
                            possible_position.push(picec_7_5.position);

                        }

                    }
                }
                if (left_rook.tipey == "Rook" && left_rook.move == ("not_move_yet")) {
                    let picec_7_2 = this.get_Piece_from_position([7, 2])
                    let picec_7_1 = this.get_Piece_from_position([7, 1])

                    if (picec_7_1.im_empty() && picec_7_2.im_empty()) {
                        if (this.check_position([7, 1], position) && this.check_position([7, 2], position)) {
                            possible_position.push(picec_7_1.position);

                        }

                    }
                }
            }
            if (picec.im_black()) {
                let right_rook = this.get_Piece_from_position([0, 7])
                let left_rook = this.get_Piece_from_position([0, 0])

                if (right_rook.tipey == "Rook" && right_rook.move == "not_move_yet") {
                    let picec_7_6 = this.get_Piece_from_position([0, 6])
                    let picec_7_5 = this.get_Piece_from_position([0, 5])
                    let picec_7_4 = this.get_Piece_from_position([0, 4])

                    if (picec_7_4.im_empty() && picec_7_5.im_empty() && picec_7_6.im_empty()) {
                        if (this.check_position([0, 4], position) && this.check_position([0, 5], position) && this.check_position([0, 6], position)) {
                            possible_position.push(picec_7_5.position);

                        }
                    }
                }
                if (left_rook.tipey == "Rook" && left_rook.move == "not_move_yet") {
                    let picec_7_2 = this.get_Piece_from_position([0, 2])
                    let picec_7_1 = this.get_Piece_from_position([0, 1])

                    if (picec_7_1.im_empty() && picec_7_2.im_empty()) {
                        if (this.check_position([0, 1], position) && this.check_position([0, 2], position)) {
                            possible_position.push(picec_7_1.position);
                        }
                    }
                }
            }
        }

        return possible_position;
    }
    Where_can_Queen_go(picecs) {

        let position = picecs.position;
        let possible_position = [];
        possible_position.push(this.Diagonal_move(position, 1, 1));
        possible_position.push(this.Diagonal_move(position, -1, 1));
        possible_position.push(this.Diagonal_move(position, 1, -1));
        possible_position.push(this.Diagonal_move(position, -1, -1));
        possible_position.push(this.Diagonal_move(position, -1, 0));
        possible_position.push(this.Diagonal_move(position, 1, 0));
        possible_position.push(this.Diagonal_move(position, 0, 1));
        possible_position.push(this.Diagonal_move(position, 0, -1));

        return possible_position;
    }
    //------------------------------------
    Diagonal_move(position, up_down, left_Right) {

        let position_to_go = [0, 0];
        let possible_position = []
        for (let i = 1; i < 8; i++) {
            position_to_go[0] = position[0] + up_down * i;
            position_to_go[1] = position[1] + left_Right * i;

            if (this.check_position(position_to_go, position)) {

                let Piece = this.get_Piece_from_position(position_to_go);

                possible_position.push(Piece.position)

                if (!Piece.im_empty()) {

                    return possible_position
                }
            } else {
                if (in_the_bord(position_to_go)) {
                    let Piece = this.get_Piece_from_position(position_to_go);
                    if (!Piece.im_empty()) {
                        return possible_position
                    }
                } else {
                    return possible_position
                }
            }
        }

        return possible_position
    }
    chess_or_mate(player_cheking, chess = 0) {
        let turn, Other_turn;
        if (this.Ob_game.turn == player_cheking) {
            Other_turn = this.Ob_game.Other_turn;
        } else {
            Other_turn = this.Ob_game.turn;
        }


        let King = player_cheking.get_king();
        let kimg_pos = King.position;

        if (this.Diagonal_chess(kimg_pos, 1, 1, player_cheking) &&
            this.Diagonal_chess(kimg_pos, -1, 1, player_cheking) &&
            this.Diagonal_chess(kimg_pos, 1, -1, player_cheking) &&
            this.Diagonal_chess(kimg_pos, -1, -1, player_cheking) &&
            this.Diagonal_chess(kimg_pos, -1, 0, player_cheking) &&
            this.Diagonal_chess(kimg_pos, 1, 0, player_cheking) &&
            this.Diagonal_chess(kimg_pos, 0, 1, player_cheking) &&
            this.Diagonal_chess(kimg_pos, 0, -1, player_cheking) &&
            this.Knight_chess(kimg_pos, player_cheking)
        ) {

            return "not chess";
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (player_cheking.color == this.the_board[i][j].color) {
                    let moves = this.Where_can_go(this.the_board[i][j]);
                    if (moves != undefined && moves.length > 0) {
                        for (let m = 0; m < moves.length; m++) {
                            let Piece_to_go = this.get_Piece_from_position(moves[m])
                            let Piece_from = this.get_Piece_from_position([i, j])

                            if (this.chess(Piece_to_go, Piece_from, player_cheking)) {
                                return "chess";
                            }
                        }

                    }
                }
            }
        }
        return "chess maty";

    }
    chess(Piece_to_go, Piece_from, player = null) {
        let turn;
        if (player == null) {
            turn = this.Ob_game.turn;
        } else {
            turn = player;
            //console.log(turn.color)
        }
        let temp_Piece_to_go = new games.Piece(Piece_to_go.tipey, Piece_to_go.position, Piece_to_go.color, Piece_to_go.move);

        this.Ob_game.move_without_Change_turn(Piece_from.position, Piece_to_go.position);

        let King = turn.get_king();

        let kimg_pos = King.position;

        if (this.Diagonal_chess(kimg_pos, 1, 1, player) &&
            this.Diagonal_chess(kimg_pos, -1, 1, player) &&
            this.Diagonal_chess(kimg_pos, 1, -1, player) &&
            this.Diagonal_chess(kimg_pos, -1, -1, player) &&
            this.Diagonal_chess(kimg_pos, -1, 0, player) &&
            this.Diagonal_chess(kimg_pos, 1, 0, player) &&
            this.Diagonal_chess(kimg_pos, 0, 1, player) &&
            this.Diagonal_chess(kimg_pos, 0, -1, player) &&
            this.Knight_chess(kimg_pos, player)
        ) {
            this.Ob_game.move_without_Change_turn(Piece_to_go.position, Piece_from.position);
            this.Ob_game.add_Piece(temp_Piece_to_go);
            return true;
        }
        this.Ob_game.move_without_Change_turn(Piece_to_go.position, Piece_from.position);
        this.Ob_game.add_Piece(temp_Piece_to_go);
        return false;

    }
    Diagonal_chess(position, up_down, left_Right, turn = null) {

        if (turn == null) {
            turn = this.Ob_game.turn;
        }
        let position_to_go = [0, 0];

        for (let i = 1; i < 8; i++) {
            position_to_go[0] = position[0] + up_down * i;
            position_to_go[1] = position[1] + left_Right * i;
            if (in_the_bord(position_to_go)) {
                if (turn.im_black()) {

                    let Piece = this.get_Piece_from_position(position_to_go);

                    if (!Piece.im_empty()) {
                        if (Piece.im_white()) {
                            if (Piece.tipey == "Pawn" && up_down == 1 && (left_Right == 1 || left_Right == -1) && i == 1) {
                                return false
                            }
                            if (Piece.tipey == "Rook" && (((up_down == 1 || up_down == -1) && left_Right == 0) || (up_down == 0 && (left_Right == -1 || left_Right == 1)))) {
                                return false
                            }
                            if (Piece.tipey == "Bishop" && ((up_down == 1 || up_down == -1) && (left_Right == -1 || left_Right == 1))) {
                                return false
                            }
                            if (Piece.tipey == "Queen") {
                                return false
                            }
                            if (Piece.tipey == "King" && i == 1) {
                                return false
                            }
                            return true
                        }
                        return true
                    }

                }
                if (turn.im_white()) {
                    let Piece = this.get_Piece_from_position(position_to_go);

                    if (!Piece.im_empty()) {
                        if (Piece.im_black()) {
                            if (Piece.tipey == "Pawn" && up_down == -1 && (left_Right == 1 || left_Right == -1) && i == 1) {
                                return false
                            }
                            if (Piece.tipey == "Rook" && (((up_down == 1 || up_down == -1) && left_Right == 0) || (up_down == 0 && (left_Right == -1 || left_Right == 1)))) {
                                return false
                            }
                            if (Piece.tipey == "Bishop" && ((up_down == 1 || up_down == -1) && (left_Right == -1 || left_Right == 1))) {
                                return false
                            }
                            if (Piece.tipey == "Queen") {
                                return false
                            }
                            if (Piece.tipey == "King" && i == 1) {
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
    check_position(position_to_go, position_from) {
        //var Piece = this.get_Piece_from_position(position);
        var turn = this.Ob_game.turn;
        if (in_the_bord(position_to_go)) {
            let Piece_to_go = this.get_Piece_from_position(position_to_go);
            let Piece_from = this.get_Piece_from_position(position_from);
            if (turn.im_black()) {
                if (Piece_to_go.im_white() || Piece_to_go.im_empty()) {

                    if (this.chess(Piece_to_go, Piece_from)) {
                        return true;
                    }

                }
            } else {
                if (turn.im_white()) {
                    if (Piece_to_go.im_black() || Piece_to_go.im_empty()) {

                        if (this.chess(Piece_to_go, Piece_from)) {
                            return true;
                        }

                    }
                }
            }
        }
        return false;
    }
    Knight_chess(position, turn = null) {

        if (turn == null) {
            turn = this.Ob_game.turn;
        }

        let pos = Knight_move(position);

        for (let i = 0; i < 8; i++) {
            if (in_the_bord(pos[i])) {
                if (turn.im_black()) {
                    let Piece = this.get_Piece_from_position(pos[i]);
                    if (!Piece.im_empty() && Piece.tipey == "Knight") {
                        if (Piece.im_white()) {
                            return false;
                        }
                    }
                }
                if (turn.im_white()) {
                    let Piece = this.get_Piece_from_position(pos[i]);

                    if (!Piece.im_empty() && Piece.tipey == "Knight") {
                        if (Piece.im_black()) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;

    }
}

function in_the_bord(position) {
    if (position[0] < 0 || position[0] > 7 || position[1] < 0 || position[1] > 7) {
        return false;
    }
    return true;
}
function King_move(position) {

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

    return [next_pos1, next_pos2, next_pos3, next_pos4, next_pos5, next_pos6, next_pos7, next_pos8]
}
function Knight_move(position) {

    let next_pos1 = [0, 0];
    next_pos1[0] = Number(position[0]) - 2;
    next_pos1[1] = Number(position[1]) - 1;

    let next_pos2 = [0, 0];
    next_pos2[0] = Number(position[0]) + 2;
    next_pos2[1] = Number(position[1]) - 1;

    let next_pos3 = [0, 0];
    next_pos3[0] = Number(position[0]) + 2;
    next_pos3[1] = Number(position[1]) + 1;

    let next_pos4 = [0, 0];
    next_pos4[0] = Number(position[0]) - 2;
    next_pos4[1] = Number(position[1]) + 1;

    let next_pos5 = [0, 0];
    next_pos5[0] = Number(position[0]) - 1;
    next_pos5[1] = Number(position[1]) - 2;

    let next_pos6 = [0, 0];
    next_pos6[0] = Number(position[0]) + 1;
    next_pos6[1] = Number(position[1]) - 2;

    let next_pos7 = [0, 0];
    next_pos7[0] = Number(position[0]) + 1;
    next_pos7[1] = Number(position[1]) + 2;

    let next_pos8 = [0, 0];
    next_pos8[0] = Number(position[0]) - 1;
    next_pos8[1] = Number(position[1]) + 2;

    let next_pos = [next_pos1, next_pos2, next_pos3, next_pos4, next_pos5, next_pos6, next_pos7, next_pos8]

    return next_pos
}