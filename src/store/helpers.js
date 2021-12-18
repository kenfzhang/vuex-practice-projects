

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

    if(board[w[0][1]] != "_" && board[w[2][3]] != "_" && board[w[4][5]] != "_") {
      if(board[w[0][1]] == board[w[2][3]] && board[w[2][3]] == board[w[4][5]]) {
        return false;
      }
    }
  }
  return true;
}

export default checkWin;