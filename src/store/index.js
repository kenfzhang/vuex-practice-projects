import { createStore } from 'vuex'
// import { checkWin } from './helpers.js'

const winningConfigs = [
  [0,0,0,1,0,2],
  [1,0,1,1,1,2],
  [2,0,2,1,2,2],
  [0,0,1,0,2,0],
  [0,1,1,1,2,1],
  [0,2,1,2,2,2],
  [0,0,1,1,2,2],
  [0,2,1,1,2,0]
]

function checkWin(board) {
  for (var i = 0; i < winningConfigs.length; i++ ) {
    var w = winningConfigs[i]

    if(board[w[0]][w[1]] !== '_' && board[w[2]][w[3]] !== '_' && board[w[4]][w[5]] !== '_') {
      console.log(board)
      if(board[w[0]][w[1]] == board[w[2]][w[3]] && board[w[2]][w[3]] == board[w[4]][w[5]]) {
        return false;
      }
    }
  }
  return true;
}

const pineapple = createStore({
  state() {
    return {
      count: 0,
      board: [
        ["_","_","_"],
        ["_","_","_"],
        ["_","_","_"]
      ],
      turn: true,
      gameOngoing: true
    }
  },
  mutations: {
    increment (state) {
      state.count++
    },
    makeMove(state, {i,j,k}) {
      if ( state.gameOngoing && state.board[i][j] == "_") {
        state.board[i][j] = k ? "X" : "O"
        state.turn = !state.turn
        state.gameOngoing = checkWin(state.board)
      }
    }
  }
})

export default pineapple;