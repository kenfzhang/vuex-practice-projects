import { createStore } from "vuex";
import { determineMoves } from "./chesshelpers.js";
import { checkWin } from "./helpers.js";
import { checkC4Win } from "./helpers.js";
import { determineUnoccupied } from "./helpers.js";

const pineapple = createStore({
  state() {
    return {
      count: 0,
      board: [
        ["_", "_", "_"],
        ["_", "_", "_"],
        ["_", "_", "_"],
      ],
      turn: true,
      c4turn: true,
      gameOngoing: true,
      c4gameOngoing: true,

      c4board: [
        ["_", "_", "_", "_", "_", "_", "_"],
        ["_", "_", "_", "_", "_", "_", "_"],
        ["_", "_", "_", "_", "_", "_", "_"],
        ["_", "_", "_", "_", "_", "_", "_"],
        ["_", "_", "_", "_", "_", "_", "_"],
        ["_", "_", "_", "_", "_", "_", "_"],
      ],

      // chess state: unselected, selected
      chessState: "unselected",
      chessTurn: false,
      chessMoves: [
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
      ],
      chessSelectedPiece: [],
      chessMoveSquares: [],
      chessboard: [
        [
          "rook-b",
          "knight-b",
          "bishop-b",
          "queen-b",
          "king-b",
          "bishop-b",
          "knight-b",
          "rook-b",
        ],
        [
          "pawn-b",
          "pawn-b",
          "pawn-b",
          "pawn-b",
          "pawn-b",
          "pawn-b",
          "pawn-b",
          "pawn-b",
        ],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", ""],
        [
          "pawn-w",
          "pawn-w",
          "pawn-w",
          "pawn-w",
          "pawn-w",
          "pawn-w",
          "pawn-w",
          "pawn-w",
        ],
        [
          "rook-w",
          "knight-w",
          "bishop-w",
          "queen-w",
          "king-w",
          "bishop-w",
          "knight-w",
          "rook-w",
        ],
      ],
    };
  },
  mutations: {
    increment(state) {
      state.count++;
    },
    makeMove(state, { i, j, k }) {
      if (state.gameOngoing && state.board[i][j] == "_") {
        state.board[i][j] = k ? "X" : "O";
        state.turn = !state.turn;
        state.gameOngoing = checkWin(state.board);
      }
    },
    makeC4Move(state, index) {
      // TODO: update w/ keeping track of height
      // given index, determine lowest unoccupied space
      console.log(state.c4gameOngoing);
      if (state.c4gameOngoing) {
        const unocc = determineUnoccupied(state.c4board, index);
        // put a token there depending on whose turn
        state.c4board[unocc][index] = state.c4turn ? "X" : "O";
        state.c4turn = !state.c4turn;

        state.c4gameOngoing = checkC4Win(state.c4board, unocc, index);
        // console.log(state,index)
      }
    },
    selectPiece(state, { piecename, x, y }) {
      console.log("DOES THIS HAPPEN FIRST?");
      const moves = determineMoves(piecename, x, y, state.chessboard);
      if (moves.length > 0) {
        state.chessState = "selected";
        state.chessMoveSquares = moves;
        state.chessSelectedPiece = [x, y];
        for (const m of moves) {
          state.chessMoves[m[0]][m[1]] = "selectable";
        }
      }
    },
    unselectPiece(state) {
      state.chessState = "unselected";
      for (const m of state.chessMoveSquares) {
        state.chessMoves[m[0]][m[1]] = "";
      }
      state.chessMoveSquares = [];
      state.chessSelectedPiece = [];
    },
    movePiece(state, { x, y }) {
      // x,y are destination
      // if empty, just swap contents
      console.log("DOES THIS HAPPEN SECOND?");

      if (state.chessState === "selected") {
        const temp =
          state.chessboard[state.selectedPiece[0]][state.selectedPiece[1]];
        state.chessboard[state.selectedPiece[0]][state.selectedPiece[1]] = "";
        state.chessboard[x][y] = temp;
      }
      // if opponent-occupied, replace dest. with piece
      // then clear origin
    },
    squareClicked(state, { piecename, x, y }) {
      console.log(state, piecename, x, y);
    },
  },
});

export default pineapple;
