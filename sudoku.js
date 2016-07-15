var Guess = require('./guess');
var deepEqual = require('deep-equal');

function Sudoku() {
  var gridMap = {
    0: {
      upper: 0,
      lower: 2
    },
    1: {
      upper: 0,
      lower: 2
    },
    2: {
      upper: 0,
      lower: 2
    },
    3: {
      upper: 3,
      lower: 5
    },
    4: {
      upper: 3,
      lower: 5
    },
    5: {
      upper: 3,
      lower: 5
    },
    6: {
      upper: 6,
      lower: 8
    },
    7: {
      upper: 6,
      lower: 8
    },
    8: {
      upper: 6,
      lower: 8
    }
  }

  this.guesses = [];
  this.attempted = [];
  this.changed = false;
  this.attemptIdx = null;
  this.initState;
  this.counter = 0;

  this.getGridMap = function() {
    return gridMap;
  }
}

Sudoku.prototype.parser = function(str) {
  if (str instanceof Array) return str;
  if (typeof str !== 'string' || str.length < 1) return [];
  var rows = str.split('\n');
  var parsed = [];
  rows.forEach(function(row) {
    var splitRow = row.split('');
    var parsedRow = splitRow.map(function(num) {
      return Number(num);
    });
    parsed.push(parsedRow);
  });
  return parsed;
}

Sudoku.prototype.solve = function(unsolved) {
  console.log(this.counter);
  this.counter++;
  var sudoku = this.parser(unsolved);
  // console.log(sudoku);
  var changed = true;
  this.changed = false;
  if (typeof sudoku !== 'object' || sudoku.length < 9 || typeof sudoku === 'undefined') return [];
  while (changed) {
    changed = false;
    for (var i = 0; i < sudoku.length; i++) {
      for (var j = 0; j < sudoku.length; j++) {
        for (var k = 1; k <= sudoku.length; k++) {
          if (sudoku[i][j] === 0) {
            if (this.squareMustBe(sudoku, i, j, k)) {
              sudoku[i][j] = k;
              changed = true;
              this.changed = true;
              break;
            }
          }
        }
      }
    }
  }
  if (this.attempted.length === 0) this.initState = sudoku.map(function(singleRow) {return singleRow.map(function(number) {return number})});
  if (this.boardIsComplete(sudoku)) {
    console.log(sudoku);
    return sudoku;
  } else if (!this.boardIsComplete(sudoku) && (this.changed === true || this.attemptIdx === null)) {
    console.log(sudoku, 'BEFORE');
    this.findGuess(sudoku);
    var attempt = this.attempted[this.attempted.length - 1];
    this.attemptIdx = this.attempted.indexOf(attempt) || null;
    sudoku[attempt.row][attempt.column] = attempt.number;
    console.log(sudoku, 'AFTER');
    return this.solve(sudoku);
  } else if (!this.boardIsComplete(sudoku) && this.changed === false) {
    if (this.attemptIdx === 0) {
      this.attemptIdx = null;
      sudoku = this.initState.map(function(singleRow){return singleRow.map(function(number){return number})});
    } else {
      var attempt = this.attempted[this.attempted[this.attemptIdx].previous] || this.attempted[0];
      this.attemptIdx = this.attempted.indexOf(attempt);
      sudoku = attempt.previousState.map(function(state) {return state.map(function(smallState){return smallState})});
    }
    return this.solve(sudoku);
  }
}

Sudoku.prototype.containsByRow = function(arr, num) {
  return arr.reduce(function(prev, curr) {
    if (prev === true) return prev;
    return curr === num;
  }, false)
}

Sudoku.prototype.containsByColumn = function(arr, idx, num) {
  for (var i = 0; i < arr.length; i++) {
    if (arr[i][idx] === num) return true;
  }
  return false;
}

Sudoku.prototype.containsByGrid = function(sudoku, row, column, number) {
  var bounds = this.setBounds(row, column)
  for (var i = bounds.upperBound; i <= bounds.lowerBound; i++) {
    for (var j = bounds.leftBound; j <= bounds.rightBound; j++) {
      if (sudoku[i][j] === number) return true;
    }
  }
  return false;
}

Sudoku.prototype.squareMustBe = function(sudoku, row, column, number) {
  if (this.containsByGrid(sudoku, row, column, number)) return false;
  var cannotBeVectors = [];
  var zeroVectors = [];
  var bounds = this.setBounds(row, column);
  for (var i = bounds.upperBound; i <= bounds.lowerBound; i++) {
    for (var j = bounds.leftBound; j <= bounds.rightBound; j++) {
      if (sudoku[i][j] === 0) {
        zeroVectors.push(i + '' + j)
        if (this.squareMustNotBe(sudoku, i, j, number)) cannotBeVectors.push(i + '' + j);
      }
    }
  }
  return (zeroVectors.length - cannotBeVectors.length === 1 && cannotBeVectors.indexOf(row + '' + column) === -1);
}

Sudoku.prototype.setBounds = function(row, column) {
  var bounds = {};
  var gridMap = this.getGridMap();
  bounds.upperBound = gridMap[row].upper;
  bounds.lowerBound = gridMap[row].lower;
  bounds.leftBound = gridMap[column].upper;
  bounds.rightBound = gridMap[column].lower;
  return bounds;
}

Sudoku.prototype.squareMustNotBe = function(sudoku, row, column, number) {
  return (this.containsByRow(sudoku[row], number) || this.containsByColumn(sudoku, column, number));
}

Sudoku.prototype.squareMightBe = function(sudoku, row, column) {
  var possibilities = [];
  for (var i = 1; i <= sudoku.length; i++) {
    if (!this.containsByGrid(sudoku, row, column, i) && !this.squareMustNotBe(sudoku, row, column, i)) possibilities.push(i);
  }
  return possibilities;
}

Sudoku.prototype.rowNeeds = function(row) {
  var possibilities = [];
  for (var i = 1; i <= row.length; i++) {
    if (row.indexOf(i) === -1) possibilities.push(i);
  }
  return possibilities;
}

Sudoku.prototype.columnNeeds = function(sudoku, column) {
  var possibilities = [];
  var col = sudoku.reduce(function(prev, curr) {
    prev.push(curr[column]);
    return prev;
  }, []);
  for (var i = 1; i <= sudoku.length; i++) {
    if (col.indexOf(i) === -1) possibilities.push(i);
  }
  return possibilities;
}

Sudoku.prototype.boardIsComplete = function(sudoku) {
  var self = this;
  return sudoku.reduce(function(prev, curr, idx, board) {
    if (!prev) return prev;
    if (self.rowNeeds(board[idx]).length !== 0 && self.columnNeeds(board, idx) !== 0) return false;
    return prev;
  }, true);
}

Sudoku.prototype.makeGuess = function(sudoku, row, column, number, attemptIdx) {
  return new Guess(sudoku, row, column, number, attemptIdx);
};

Sudoku.prototype.findGuess = function(sudoku) {
  var self = this;
  var changes = false;
  for (var i = 0; i < sudoku.length; i++) {
    for (var j = 0; j < sudoku.length; j++) {
      if (sudoku[i][j] === 0) {
        var possibilities = this.squareMightBe(sudoku, i, j);
        for (var k = 0; k < possibilities.length; k++) {
          if (!self.guessExists(i, j, possibilities[k])) {
            self.attempted.push(self.makeGuess(sudoku, i, j, possibilities[k], self.attemptIdx));
            return;
          }
        }
      }
    }
  }
}

Sudoku.prototype.guessExists = function(row, column, number) {
  var exists = false;
  this.attempted.forEach(function(guess) {
    if (guess.row === row && guess.column === column && guess.number === number) exists = true;
  });
  return exists;
}

module.exports = Sudoku;

// var sudoku = new Sudoku();
// example = '003020600\n'+
//           '900305001\n'+
//           '001806400\n'+
//           '008102900\n'+
//           '700000008\n'+
//           '006708200\n'+
//           '002609500\n'+
//           '800203009\n'+
//           '005010300';
//
// var difficultExample = '300200000\n'+
//                        '000107000\n'+
//                        '706030500\n'+
//                        '070009080\n'+
//                        '900020004\n'+
//                        '010800050\n'+
//                        '009040301\n'+
//                        '000702000\n'+
//                        '000008006';
// console.log(sudoku.solve(difficultExample));
