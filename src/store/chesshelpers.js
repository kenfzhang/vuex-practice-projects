export function determineMoves(piecetype, x, y, chessboard) {
  switch (piecetype) {
    case "bishop-b":
    case "bishop-w":
      return diagonalMoves(piecetype, x, y, chessboard);
    case "pawn-b":
    case "pawn-w":
      return pawnMoves(piecetype, x, y, chessboard);
    case "knight-b":
    case "knight-w":
      return knightMoves(piecetype, x, y, chessboard);
    case "rook-b":
    case "rook-w":
      return lateralMoves(piecetype, x, y, chessboard);
    case "queen-b":
    case "queen-w":
      return queenMoves(piecetype, x, y, chessboard);
    case "king-b":
    case "king-w":
      return kingMoves(piecetype, x, y, chessboard);
    default:
      console.log("");
  }
  return;
}

// function checkValid(x, y, chessboard) {

// }

function getTeam(piecetype) {
  return piecetype[piecetype.length - 1];
}

function inBounds(i, j) {
  return i >= 0 && i < 8 && j >= 0 && j < 8;
}

function isOccupiedByOpponent(piecetype, x, y, chessboard) {
  return getTeam(chessboard[x][y]) !== getTeam(piecetype);
}

// function isOccupiedByAlly(piecetype, x, y, chessboard) {
//   return (getTeam(chessboard[x][y]) === getTeam(piecetype))
// }

function knightMoves(piecetype, x, y, chessboard) {
  var validMoves = [];

  const directions = [
    [1, 2],
    [-1, 2],
    [1, -2],
    [-1, -2],
    [2, 1],
    [-2, 1],
    [2, -1],
    [-2, -1],
  ];

  var i = x;
  var j = y;

  for (var d = 0; d < directions.length; d++) {
    // add offsets until invalid move
    const d_i = directions[d][0];
    const d_j = directions[d][1];
    i = x + d_i;
    j = y + d_j;
    if (i >= 0 && i < 8 && j >= 0 && j < 8) {
      const c = chessboard[i][j];
      if (!c) {
        validMoves.push([i, j]);
      } else if (c[c.length - 1] !== piecetype[piecetype.length - 1]) {
        validMoves.push([i, j]);
      }
    }

    i = x;
    j = y;
  }

  return validMoves;
}

// function traverseSquare(chessboard, x, y, i, j ) {

// }

function queenMoves(piecetype, x, y, chessboard) {
  var validMoves = [];
  validMoves = validMoves.concat(diagonalMoves(piecetype, x, y, chessboard));
  validMoves = validMoves.concat(lateralMoves(piecetype, x, y, chessboard));
  return validMoves;
}

function diagonalMoves(piecetype, x, y, chessboard) {
  var validMoves = [];

  // search four directions
  // pseudocode:
  // traverse until either OOB or another piece
  const directions = [
    [-1, -1],
    [-1, 1],
    [1, 1],
    [1, -1],
  ];

  var i = x;
  var j = y;

  for (var d = 0; d < directions.length; d++) {
    // add offsets until invalid move
    const d_i = directions[d][0];
    const d_j = directions[d][1];
    i = x + d_i;
    j = y + d_j;
    while (i >= 0 && i < 8 && j >= 0 && j < 8) {
      console.log(chessboard[i][j]);
      const c = chessboard[i][j];
      if (!c) {
        validMoves.push([i, j]);
        i += d_i;
        j += d_j;
      } else if (c[c.length - 1] !== piecetype[piecetype.length - 1]) {
        validMoves.push([i, j]);
        break;
      } else {
        break;
      }
    }
  }

  return validMoves;
}

function lateralMoves(piecetype, x, y, chessboard) {
  var validMoves = [];

  // search four directions
  // pseudocode:
  // traverse until either OOB or another piece
  const directions = [
    [0, -1],
    [0, 1],
    [1, 0],
    [-1, 0],
  ];

  var i = x;
  var j = y;

  for (var d = 0; d < directions.length; d++) {
    // add offsets until invalid move
    const d_i = directions[d][0];
    const d_j = directions[d][1];
    i = x + d_i;
    j = y + d_j;
    while (i >= 0 && i < 8 && j >= 0 && j < 8) {
      console.log(chessboard[i][j]);
      const c = chessboard[i][j];
      if (!c) {
        validMoves.push([i, j]);
        i += d_i;
        j += d_j;
      } else if (c[c.length - 1] !== piecetype[piecetype.length - 1]) {
        validMoves.push([i, j]);
        break;
      } else {
        break;
      }
    }
  }

  console.log("VALID MOOOOVES");
  console.log(validMoves);
  return validMoves;
}

// TODO: en passant
function pawnMoves(piecetype, x, y, chessboard) {
  var validMoves = [];

  const offsets_b = [
    [1, 0],
    [2, 0],
    [1, 1],
    [1, -1],
  ];

  const offsets_w = [
    [-1, 0],
    [-2, 0],
    [-1, 1],
    [-1, -1],
  ];
  var o = [];

  if (getTeam(piecetype) === "b") {
    o = offsets_b[0];

    // unoccupied
    if (inBounds(x + o[0], y + o[1]) && !chessboard[x + o[0]][y + o[1]]) {
      validMoves.push([x + o[0], y + o[1]]);
      o = offsets_b[1];
      if (
        inBounds(x + o[0], y + o[1]) &&
        !chessboard[x + o[0]][y + o[1]] &&
        piecetype.length <= 6
      ) {
        validMoves.push([x + o[0], y + o[1]]);
      }
    }

    // check if pawn can take pieces
    o = offsets_b[2];
    if (
      inBounds(x + o[0], y + o[1]) &&
      chessboard[x + o[0]][y + o[1]] &&
      getTeam(chessboard[x + o[0]][y + o[1]]) !== getTeam(piecetype)
    ) {
      validMoves.push([x + o[0], y + o[1]]);
    }
    o = offsets_b[3];
    if (
      inBounds(x + o[0], y + o[1]) &&
      chessboard[x + o[0]][y + o[1]] &&
      getTeam(chessboard[x + o[0]][y + o[1]]) !== getTeam(piecetype)
    ) {
      validMoves.push([x + o[0], y + o[1]]);
    }
  } else if (getTeam(piecetype) === "w") {
    o = offsets_w[0];

    // unoccupied
    if (inBounds(x + o[0], y + o[1]) && !chessboard[x + o[0]][y + o[1]]) {
      validMoves.push([x + o[0], y + o[1]]);
      o = offsets_w[1];
      if (
        inBounds(x + o[0], y + o[1]) &&
        !chessboard[x + o[0]][y + o[1]] &&
        piecetype.length <= 6
      ) {
        validMoves.push([x + o[0], y + o[1]]);
      }
    }

    // check if pawn can take pieces
    o = offsets_w[2];
    if (
      inBounds(x + o[0], y + o[1]) &&
      chessboard[x + o[0]][y + o[1]] &&
      getTeam(chessboard[x + o[0]][y + o[1]]) !== getTeam(piecetype)
    ) {
      validMoves.push([x + o[0], y + o[1]]);
    }
    o = offsets_w[3];
    if (
      inBounds(x + o[0], y + o[1]) &&
      chessboard[x + o[0]][y + o[1]] &&
      getTeam(chessboard[x + o[0]][y + o[1]]) !== getTeam(piecetype)
    ) {
      validMoves.push([x + o[0], y + o[1]]);
    }
  }

  // unmoved pawn
  // if (piecetype.length <= 6) {
  //   if (piecetype[5] === "b") {
  //     if (!chessboard[x + 2][y]) {
  //       validMoves.push([x + 2, y]);
  //     }
  //   } else if (piecetype[5] === "w") {
  //     if (!chessboard[x - 2][y]) {
  //       validMoves.push([x - 2, y]);
  //     }
  //   }
  // }

  // if (piecetype[5] === "b") {
  //   if (!chessboard[x + 1][y]) {
  //     validMoves.push([x + 1, y]);
  //   }
  // } else if (piecetype[5] === "w") {
  //   if (!chessboard[x - 1][y]) {
  //     validMoves.push([x - 1, y]);
  //   }
  // }
  console.log(validMoves);
  return validMoves;
}

function kingMoves(piecetype, x, y, chessboard) {
  // check for check
  // ^ do this later OMEGALUL

  var validMoves = [];

  const offsets = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  var i;
  var j;

  for (const o of offsets) {
    i = x + o[0];
    j = y + o[1];
    if (inBounds(i, j)) {
      if (isOccupiedByOpponent(piecetype, i, j, chessboard)) {
        validMoves.push([i, j]);
      } else if (!chessboard[i][j]) {
        validMoves.push([i, j]);
      }
    }
  }

  // ???????
  return validMoves;
}
