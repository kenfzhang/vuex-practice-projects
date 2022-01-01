import { createStore } from "vuex";
import { determineMoves } from "./chesshelpers.js";
import { checkWin } from "./helpers.js";
import { checkC4Win } from "./helpers.js";
import { determineUnoccupied } from "./helpers.js";
import { isInCheck } from "./chesshelpers.js";
import { isInMate } from "./chesshelpers.js";
import { getOpposingTeam } from "./chesshelpers.js";

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
      // index 0 is white, index 1 is black
      chessKingLocations: {
        b: [0, 4],
        w: [7, 4],
      },
      // chess endgame: none, check-w, checkmate-w, stalemate-w
      // stalemate-b, check-b, checkmate-b
      chessEndgame: "none",
      chessTurn: "w",
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
      // given index, determine lowest unoccupied space
      if (state.c4gameOngoing) {
        const unocc = determineUnoccupied(state.c4board, index);
        // put a token there depending on whose turn
        state.c4board[unocc][index] = state.c4turn ? "X" : "O";
        state.c4turn = !state.c4turn;

        state.c4gameOngoing = checkC4Win(state.c4board, unocc, index);
      }
    },
    selectPiece(state, { piecename, x, y }) {
      // console.log("DOES THIS HAPPEN FIRST?");
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
      // console.log("DOES THIS HAPPEN SECOND?");

      if (state.chessState === "selected") {
        const temp =
          state.chessboard[state.selectedPiece[0]][state.selectedPiece[1]];
        state.chessboard[state.selectedPiece[0]][state.selectedPiece[1]] = "";
        state.chessboard[x][y] = temp;
      }
      // if opponent-occupied, replace dest. with piece
      // then clear origin
    },
    squareClicked(state, { piecename, x, y, validity }) {
      // piece unselected
      if (state.chessState === "unselected") {
        // if clicked on a piece while unselected

        // does clicked piece match whose turn it is?

        if (piecename) {
          if (piecename[piecename.length - 1] === state.chessTurn) {
            const moves = determineMoves(
              piecename,
              x,
              y,
              state.chessKingLocations[state.chessTurn][0],
              state.chessKingLocations[state.chessTurn][1],
              state.chessboard
            );
            if (moves.length > 0) {
              state.chessState = "selected";
              state.chessMoveSquares = moves;
              state.chessSelectedPiece = [x, y];
              for (const m of moves) {
                state.chessMoves[m[0]][m[1]] = "selectable";
              }
            }
          }
        }
      } else {
        if (validity) {
          // moving to an unocc. space
          if (!state.chessboard[x][y]) {
            const temp =
              state.chessboard[state.chessSelectedPiece[0]][
                state.chessSelectedPiece[1]
              ];
            state.chessboard[state.chessSelectedPiece[0]][
              state.chessSelectedPiece[1]
            ] = "";
            state.chessboard[x][y] = temp;
          } else {
            state.chessboard[x][y] =
              state.chessboard[state.chessSelectedPiece[0]][
                state.chessSelectedPiece[1]
              ];
            state.chessboard[state.chessSelectedPiece[0]][
              state.chessSelectedPiece[1]
            ] = "";
          }

          if (state.chessboard[x][y] === "king-b") {
            state.chessKingLocations["b"] = [x, y];
          } else if (state.chessboard[x][y] === "king-w") {
            state.chessKingLocations["w"] = [x, y];
          }

          if (state.chessboard[x][y] === "pawn-b") {
            state.chessboard[x][y] = "pawn-moved-b";
          } else if (state.chessboard[x][y] === "pawn-w") {
            state.chessboard[x][y] = "pawn-moved-w";
          }

          state.chessState = "unselected";
          for (const m of state.chessMoveSquares) {
            state.chessMoves[m[0]][m[1]] = "";
          }
          state.chessMoveSquares = [];
          state.chessSelectedPiece = [];
          state.chessTurn = state.chessTurn === "w" ? "b" : "w";

          // check for check/mate/etc.
          // state.chessTurn
          const k_x = state.chessKingLocations[state.chessTurn][0];
          const k_y = state.chessKingLocations[state.chessTurn][1];
          if (state.chessEndgame === "none") {
            if (isInCheck(k_x, k_y, k_x, k_y, state.chessboard)) {
              state.chessEndgame =
                "check-" + getOpposingTeam(state.chessboard[k_x][k_y]);
            }

            if (isInMate(k_x, k_y, state.chessboard)) {
              if (state.chessEndgame == "check") {
                state.chessEndgame =
                  "checkmate-" + getOpposingTeam(state.chessboard[k_x][k_y]);
                console.log("A WINNER IS YOU!!!! POGGEERS");
              } else if (state.chessEndgame == "none") {
                state.chessEndgame =
                  "stalemate-" + getOpposingTeam(state.chessboard[k_x][k_y]);
              }
            }
          }
        }
      }
    },
  },
});

export default pineapple;
