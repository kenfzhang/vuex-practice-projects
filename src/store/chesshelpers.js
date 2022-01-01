export function determineMoves(piecetype, x, y, k_x, k_y, chessboard) {
  switch (piecetype) {
    case "bishop-b":
    case "bishop-w":
      return diagonalMoves(piecetype, x, y, k_x, k_y, chessboard);
    case "pawn-b":
    case "pawn-moved-b":
    case "pawn-w":
    case "pawn-moved-w":
      return pawnMoves(piecetype, x, y, k_x, k_y, chessboard);
    case "knight-b":
    case "knight-w":
      return knightMoves(piecetype, x, y, k_x, k_y, chessboard);
    case "rook-b":
    case "rook-w":
      return lateralMoves(piecetype, x, y, k_x, k_y, chessboard);
    case "queen-b":
    case "queen-w":
      return queenMoves(piecetype, x, y, k_x, k_y, chessboard);
    case "king-b":
    case "king-w":
      return kingMoves(piecetype, x, y, k_x, k_y, chessboard);
    default:
      console.log("");
  }
  return;
}

function tryBoard(x_curr, y_curr, x_next, y_next, chessboard) {
  var tempChessboard = [];
  for (var k = 0; k < chessboard.length; k++) {
    tempChessboard.push([]);
  }
  for (var i = 0; i < chessboard.length; i++) {
    for (var j = 0; j < chessboard[i].length; j++) {
      tempChessboard[i].push(chessboard[i][j]);
    }
  }

  if (!tempChessboard[x_next][y_next]) {
    const temp = tempChessboard[x_curr][y_curr];
    tempChessboard[x_curr][y_curr] = "";
    tempChessboard[x_next][y_next] = temp;
  } else {
    tempChessboard[x_next][y_next] = tempChessboard[x_curr][y_curr];
    tempChessboard[x_curr][y_curr] = "";
  }

  return tempChessboard;
}

// test all possible king moves, check if they end in check
// this will be used for checkmate and stalemate
// for(all moves) isInCheck?
export function isInMate(k_x, k_y, chessboard) {
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

  const kingTeam = getTeam(chessboard[k_x][k_y]);

  for (const o of offsets) {
    if (inBounds(k_x + o[0], k_y + o[1])) {
      if (!getTeam(chessboard[k_x + o[0]][k_y + o[1]]) === kingTeam) {
        if (!isInCheck(k_x, k_y, chessboard)) {
          return false;
        }
      }
    }
  }

  return true;
}

// checks if the given board config causes
// the king to be in check
// k_x, k_y is location of your king
// x, y is square to test
export function isInCheck(k_x, k_y, chessboard) {
  // determine what team the king is on
  const piecetype = chessboard[k_x][k_y];
  // loop thru all opposing pieces, check ranges of movement
  // see if king is in it
  var tempChessboard = [];
  for (var k = 0; k < chessboard.length; k++) {
    tempChessboard.push([]);
  }
  for (var i = 0; i < chessboard.length; i++) {
    for (var j = 0; j < chessboard[i].length; j++) {
      tempChessboard[i].push(chessboard[i][j]);
    }
  }
  tempChessboard[k_x][k_y] = "";

  // check lateral squares
  const lateralThreatRange = lateralScan(piecetype, k_x, k_y, tempChessboard);
  for (const r of lateralThreatRange) {
    if (
      chessboard[r[0]][r[1]] === "rook-" + getOpposingTeam(piecetype) ||
      chessboard[r[0]][r[1]] === "queen-" + getOpposingTeam(piecetype)
    ) {
      return true;
    }
  }
  // check diagonal squares
  const diagonalThreatRange = diagonalScan(piecetype, k_x, k_y, tempChessboard);

  for (const r of diagonalThreatRange) {
    if (
      chessboard[r[0]][r[1]] === "bishop-" + getOpposingTeam(piecetype) ||
      chessboard[r[0]][r[1]] === "queen-" + getOpposingTeam(piecetype)
    ) {
      return true;
    }
  }
  // check knight-move squares
  const knightThreatRange = knightScan(piecetype, k_x, k_y, tempChessboard);

  for (const r of knightThreatRange) {
    if (chessboard[r[0]][r[1]] === "knight-" + getOpposingTeam(piecetype)) {
      return true;
    }
  }

  // check pawn squares

  const pawnThreatRange = pawnScan(
    "pawn-" + getTeam(piecetype),
    k_x,
    k_y,
    chessboard
  );

  for (const r of pawnThreatRange) {
    if (chessboard[r[0]][r[1]] === "pawn-" + getOpposingTeam(piecetype)) {
      return true;
    }
  }

  const pawnMovedThreatRange = pawnScan(
    "pawn-moved-" + getTeam(piecetype),
    k_x,
    k_y,
    chessboard
  );

  for (const r of pawnMovedThreatRange) {
    if (chessboard[r[0]][r[1]] === "pawn-moved-" + getOpposingTeam(piecetype)) {
      return true;
    }
  }
  // check opposing king squares

  const kingThreatRange = kingScan(piecetype, k_x, k_y, tempChessboard);

  for (const r of kingThreatRange) {
    if (chessboard[r[0]][r[1]] === "king-" + getOpposingTeam(piecetype)) {
      return true;
    }
  }

  return false;
}

export function getTeam(piecetype) {
  if (!piecetype) {
    return "";
  }
  return piecetype[piecetype.length - 1];
}

export function getOpposingTeam(piecetype) {
  return piecetype[piecetype.length - 1] === "w" ? "b" : "w";
}

function inBounds(i, j) {
  return i >= 0 && i < 8 && j >= 0 && j < 8;
}

function isOccupiedByOpponent(piecetype, x, y, chessboard) {
  if (!chessboard[x][y]) {
    return false;
  }
  return getTeam(chessboard[x][y]) !== getTeam(piecetype);
}

function knightScan(piecetype, x, y, chessboard) {
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

function knightMoves(piecetype, x, y, k_x, k_y, chessboard) {
  var validMoves = [];
  const moves = knightScan(piecetype, x, y, chessboard);
  for (const m of moves) {
    if (!isInCheck(k_x, k_y, tryBoard(x, y, m[0], m[1], chessboard))) {
      validMoves.push(m);
    }
  }

  return validMoves;
}

function queenMoves(piecetype, x, y, k_x, k_y, chessboard) {
  var validMoves = [];
  var moves = [];
  moves = moves.concat(diagonalScan(piecetype, x, y, chessboard));
  moves = moves.concat(lateralScan(piecetype, x, y, chessboard));

  for (const m of moves) {
    if (!isInCheck(k_x, k_y, tryBoard(x, y, m[0], m[1], chessboard))) {
      validMoves.push(m);
    }
  }

  return validMoves;
}

function diagonalScan(piecetype, x, y, chessboard) {
  var validMoves = [];

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

function diagonalMoves(piecetype, x, y, k_x, k_y, chessboard) {
  var validMoves = [];
  const moves = diagonalScan(piecetype, x, y, chessboard);

  for (const m of moves) {
    if (!isInCheck(k_x, k_y, tryBoard(x, y, m[0], m[1], chessboard))) {
      validMoves.push(m);
    }
  }
  return validMoves;
}

function lateralScan(piecetype, x, y, chessboard) {
  var validMoves = [];

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

function lateralMoves(piecetype, x, y, k_x, k_y, chessboard) {
  var validMoves = [];
  const moves = lateralScan(piecetype, x, y, chessboard);

  for (const m of moves) {
    if (!isInCheck(k_x, k_y, tryBoard(x, y, m[0], m[1], chessboard))) {
      validMoves.push(m);
    }
  }
  return validMoves;
}

// TODO: en passant
function pawnScan(piecetype, x, y, chessboard) {
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

  return validMoves;
}

function pawnMoves(piecetype, x, y, k_x, k_y, chessboard) {
  var validMoves = [];
  const moves = pawnScan(piecetype, x, y, chessboard);

  for (const m of moves) {
    if (!isInCheck(k_x, k_y, tryBoard(x, y, m[0], m[1], chessboard))) {
      validMoves.push(m);
    }
  }
  return validMoves;
}

function kingScan(piecetype, x, y, chessboard) {
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
  console.log(chessboard);
  for (const o of offsets) {
    i = x + o[0];
    j = y + o[1];
    if (inBounds(i, j)) {
      if (
        isOccupiedByOpponent(piecetype, i, j, chessboard) ||
        !chessboard[i][j]
      ) {
        validMoves.push([i, j]);
      }
    }
  }

  return validMoves;
}

function kingMoves(piecetype, x, y, k_x, k_y, chessboard) {
  var validMoves = [];
  const moves = kingScan(piecetype, x, y, chessboard);

  for (const m of moves) {
    if (!isInCheck(m[0], m[1], tryBoard(x, y, m[0], m[1], chessboard))) {
      validMoves.push(m);
    }
  }
  return validMoves;
}
