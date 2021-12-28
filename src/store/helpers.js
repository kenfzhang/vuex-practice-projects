const winningConfigs = [
  [0, 0, 0, 1, 0, 2],
  [1, 0, 1, 1, 1, 2],
  [2, 0, 2, 1, 2, 2],
  [0, 0, 1, 0, 2, 0],
  [0, 1, 1, 1, 2, 1],
  [0, 2, 1, 2, 2, 2],
  [0, 0, 1, 1, 2, 2],
  [0, 2, 1, 1, 2, 0],
];

export function checkWin(board) {
  for (var i = 0; i < winningConfigs.length; i++) {
    var w = winningConfigs[i];

    if (
      board[w[0]][w[1]] !== "_" &&
      board[w[2]][w[3]] !== "_" &&
      board[w[4]][w[5]] !== "_"
    ) {
      // console.log(board)
      if (
        board[w[0]][w[1]] == board[w[2]][w[3]] &&
        board[w[2]][w[3]] == board[w[4]][w[5]]
      ) {
        return false;
      }
    }
  }
  return true;
}

// check to see if connect 4 game is over
export function checkC4Win(c4board, i, j) {
  const s = c4board[i][j];
  var curr_length = 0;

  var i_t = i;
  var j_t = j;
  // horizontal check

  // left
  while (j_t >= 0 && j_t < 7 && c4board[i_t][j_t] === s) {
    console.log(curr_length);
    curr_length++;
    j_t--;
    if (curr_length >= 4) {
      return false;
    }
  }
  j_t = j + 1;
  while (j_t >= 0 && j_t < 7 && c4board[i_t][j_t] === s) {
    curr_length++;
    j_t++;
    if (curr_length >= 4) {
      return false;
    }
  }

  j_t = j;

  // vertical check
  curr_length = 0;

  while (i_t >= 0 && i_t < 6 && c4board[i_t][j_t] === s) {
    console.log(curr_length);
    curr_length++;
    i_t--;
    if (curr_length >= 4) {
      return false;
    }
  }
  i_t = i + 1;
  while (i_t >= 0 && i_t < 6 && c4board[i_t][j_t] === s) {
    curr_length++;
    i_t++;
    if (curr_length >= 4) {
      return false;
    }
  }

  i_t = i;
  // first diagonal check
  curr_length = 0;

  while (
    i_t >= 0 &&
    i_t < 6 &&
    j_t >= 0 &&
    j_t < 7 &&
    c4board[i_t][j_t] === s
  ) {
    console.log(curr_length);
    curr_length++;
    i_t--;
    j_t--;
    if (curr_length >= 4) {
      return false;
    }
  }
  i_t = i + 1;
  j_t = j + 1;
  while (
    i_t >= 0 &&
    i_t < 6 &&
    j_t >= 0 &&
    j_t < 7 &&
    c4board[i_t][j_t] === s
  ) {
    curr_length++;
    i_t++;
    j_t++;
    if (curr_length >= 4) {
      return false;
    }
  }

  // second diagonal check
  curr_length = 0;

  i_t = i;
  j_t = j;

  while (
    i_t >= 0 &&
    i_t < 6 &&
    j_t >= 0 &&
    j_t < 7 &&
    c4board[i_t][j_t] === s
  ) {
    console.log(curr_length);
    curr_length++;
    i_t++;
    j_t--;
    if (curr_length >= 4) {
      return false;
    }
  }
  i_t = i - 1;
  j_t = j + 1;
  while (
    i_t >= 0 &&
    i_t < 6 &&
    j_t >= 0 &&
    j_t < 7 &&
    c4board[i_t][j_t] === s
  ) {
    curr_length++;
    i_t--;
    j_t++;
    if (curr_length >= 4) {
      return false;
    }
  }

  return true;
}

// for C4
// given an index, determine lowest unocc. space in that column
export function determineUnoccupied(c4board, index) {
  var retval = -1;
  for (var i = 5; i >= 0; i--) {
    if (c4board[i][index] === "_") {
      retval = i;
      break;
    }
  }
  return retval;
}
