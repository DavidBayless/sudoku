function Guess(board, row, column, number, previousAttemptIndex) {
  this.previousState = board.map(function(stuff) {return stuff.map(function(smallStuff){return smallStuff})});
  this.row = row;
  this.column = column;
  this.number = number;
  this.previous = previousAttemptIndex;
}

module.exports = Guess;
