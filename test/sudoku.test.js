var Sudoku = require('../sudoku');
var expect = require('chai').expect;
var Guess = require('../guess');
var sudoku;
var example;
var expectation;
var parsed;
var difficultExample;
var anotherExample;
var anotherExpectation;

beforeEach(function() {
  sudoku = new Sudoku();
  example = '003020600\n'+
            '900305001\n'+
            '001806400\n'+
            '008102900\n'+
            '700000008\n'+
            '006708200\n'+
            '002609500\n'+
            '800203009\n'+
            '005010300';

  difficultExample = '300200000\n'+
                     '000107000\n'+
                     '706030500\n'+
                     '070009080\n'+
                     '900020004\n'+
                     '010800050\n'+
                     '009040301\n'+
                     '000702000\n'+
                     '000008006';

  anotherExample = '000003017\n'+
                   '015009008\n'+
                   '060000000\n'+
                   '100007000\n'+
                   '009000200\n'+
                   '000500004\n'+
                   '000000020\n'+
                   '500600340\n'+
                   '340200000';

  parsed = [[0,0,3,0,2,0,6,0,0],
            [9,0,0,3,0,5,0,0,1],
            [0,0,1,8,0,6,4,0,0],
            [0,0,8,1,0,2,9,0,0],
            [7,0,0,0,0,0,0,0,8],
            [0,0,6,7,0,8,2,0,0],
            [0,0,2,6,0,9,5,0,0],
            [8,0,0,2,0,3,0,0,9],
            [0,0,5,0,1,0,3,0,0]];

  expectation = [[4,8,3,9,2,1,6,5,7],
                 [9,6,7,3,4,5,8,2,1],
                 [2,5,1,8,7,6,4,9,3],
                 [5,4,8,1,3,2,9,7,6],
                 [7,2,9,5,6,4,1,3,8],
                 [1,3,6,7,9,8,2,4,5],
                 [3,7,2,6,8,9,5,1,4],
                 [8,1,4,2,5,3,7,6,9],
                 [6,9,5,4,1,7,3,8,2]];

  difficultExpectation = [[3,5,1,2,8,6,4,9,7],
                          [4,9,2,1,5,7,6,3,8],
                          [7,8,6,9,3,4,5,1,2],
                          [2,7,5,4,6,9,1,8,3],
                          [9,3,8,5,2,1,7,6,4],
                          [6,1,4,8,7,3,2,5,9],
                          [8,2,9,6,4,5,3,7,1],
                          [1,6,3,7,9,2,8,4,5],
                          [5,4,7,3,1,8,9,2,6]];

  anotherExpectation = [[2,9,4,8,6,3,5,1,7],
                        [7,1,5,4,2,9,6,3,8],
                        [8,6,3,7,5,1,4,9,2],
                        [1,5,2,9,4,7,8,6,3],
                        [4,7,9,3,8,6,2,5,1],
                        [6,3,8,5,1,2,9,7,4],
                        [9,8,6,1,3,4,7,2,5],
                        [5,2,1,6,7,8,3,4,9],
                        [3,4,7,2,9,5,1,8,6]];
});

describe('Sudoku', function() {
  describe('.parser', function() {
    it('should return an empty array when given an empty string', function() {
      expect(sudoku.parser('')).to.deep.equal([]);
    });
    it('should return an empty array when given an invalid type', function() {
      expect(sudoku.parser(2)).to.deep.equal([]);
    });
    it('should return an array representation of the string', function() {
      expect(sudoku.parser(example)).to.deep.equal(parsed);
    });
  });
  describe('.solve', function() {
    it('should return an empty array when given invalid data', function() {
      expect(sudoku.solve(2)).to.deep.equal([]);
    });
    it('should return an empty array when given invalid data', function() {
      expect(sudoku.solve([])).to.deep.equal([]);
    });
    it('should return an empty array when given invalid data', function() {
      expect(sudoku.solve(undefined)).to.deep.equal([]);
    })
    it('should return a solved sudoku array representation when given valid data that is an easy problem', function() {
      expect(sudoku.solve(example)).to.deep.equal(expectation);
    });
    it('should return a solved sudoku array representation when given valid data that is a difficult problem', function() {
      expect(sudoku.solve(difficultExample)).to.deep.equal(difficultExpectation);
    });
    xit('should return an solved sudoku array representation when given valid data that is a different problem', function() {
      expect(sudoku.solve(anotherExample)).to.deep.equal(difficultExpectation);
    });
  });
  describe('.containsByRow', function() {
    it('should return false when given an array that does not contain the given number', function() {
      expect(sudoku.containsByRow(parsed[0], 1)).to.be.false;
    });
    it('should return true when given an array that does contain the given number', function() {
      expect(sudoku.containsByRow(parsed[0], 3)).to.be.true;
    });
  });
  describe('.containsByColumn', function() {
    it('should return false when given an index of the parsed matrix and a number that does not exist in the given column', function() {
      expect(sudoku.containsByColumn(parsed, 0, 2)).to.be.false;
    });
    it('should return true when given an index of the parsed matrix and anumber that does exist in the column', function() {
      expect(sudoku.containsByColumn(parsed, 0, 8)).to.be.true;
    });
  });
  describe('.containsByGrid', function() {
    it('should return false when given a vector and a number to search for when the square that contains that vector does not have the number', function() {
      expect(sudoku.containsByGrid(parsed, 0, 0, 2)).to.be.false;
    });
    it('should return false when given a vector and a number to search for when the square that contains that vector does not have the number', function() {
      expect(sudoku.containsByGrid(parsed, 5, 1, 2)).to.be.false;
    });
    it('should return false when given a vector and a number to search for when the square that contains that vector does not have the number', function() {
      expect(sudoku.containsByGrid(parsed, 8, 8, 7)).to.be.false;
    });
    it('should return true when given a vector and a number to search for when the square that contains that vector does have the number', function() {
      expect(sudoku.containsByGrid(parsed, 0, 0, 3)).to.be.true;
    });
    it('should return true when given a vector and a number to search for when the square that contains that vector does have the number', function() {
      expect(sudoku.containsByGrid(parsed, 5, 3, 8)).to.be.true;
    });
    it('should return true when given a vector and a number to search for when the square that contains that vector does have the number', function() {
      expect(sudoku.containsByGrid(parsed, 8, 8, 9)).to.be.true;
    });
  });
  describe('.squareMustBe', function() {
    it('should return false when given a vector and a number which will be checked if that space must be that number and it cannot be determined', function() {
      expect(sudoku.squareMustBe(parsed, 0, 5, 3)).to.be.false;
    });
    it('should return false when given a vector and a number which will be checked if that space must be that number and it cannot be determined', function() {
      expect(sudoku.squareMustBe(parsed, 0, 5, 9)).to.be.false;
    });
    it('should return true when given a vector and a number which will be checked if that space must be that number and it must be', function() {
      expect(sudoku.squareMustBe(parsed, 0, 5, 1)).to.be.true;
    })
  });
  describe('.setBounds', function() {
    it('should return an object containing the grid boundaries for a given vector', function() {
      expect(sudoku.setBounds(0,0)).to.deep.equal({upperBound: 0, lowerBound: 2, leftBound: 0, rightBound: 2});
    });
    it('should return an object containing the grid boundaries for a given vector', function() {
      expect(sudoku.setBounds(4, 4)).to.deep.equal({upperBound: 3, lowerBound: 5, leftBound: 3, rightBound: 5});
    });
  });
  describe('.squareMustNotBe', function() {
    it('should return true when a given vector and a number that it cannot be', function() {
      expect(sudoku.squareMustNotBe(parsed, 0, 3, 1)).to.be.true;
    });
    it('should return false when given a vector and a number that it can be', function() {
      expect(sudoku.squareMustNotBe(parsed, 0, 3, 4)).to.be.false;
    });
  });
  describe('.squareMightBe', function() {
    it('should return an array containing all the possible numbers that vector could be', function() {
      expect(sudoku.squareMightBe(parsed, 0, 3)).to.deep.equal([4,9]);
    });
    it('should return an empty array if there are no possibilities for a space', function() {
      expect(sudoku.squareMightBe(expectation, 0, 0)).to.deep.equal([]);
    });
  });
  describe('.boardIsComplete', function() {
    it('should return true if a given board is complete', function() {
      expect(sudoku.boardIsComplete(expectation)).to.be.true;
    });
    it('should return false if a given board is incomplete', function() {
      expect(sudoku.boardIsComplete(parsed)).to.be.false;
    })
  });
  describe('.rowNeeds', function() {
    it('should return an array of all the missing numbers from a row', function() {
      expect(sudoku.rowNeeds(parsed[0])).to.deep.equal([1,4,5,7,8,9]);
    });
    it('should return an array of all the missing numbers from a row', function() {
      expect(sudoku.rowNeeds(parsed[2])).to.deep.equal([2,3,5,7,9]);
    });
    it('should return an empty array if there are no missing numbers in a row', function() {
      expect(sudoku.rowNeeds(expectation[2])).to.deep.equal([]);
    });
  });
  describe('.columnNeeds', function() {
    it('should return an array of all the missing numbers from a column', function() {
      expect(sudoku.columnNeeds(parsed, 0)).to.deep.equal([1,2,3,4,5,6]);
    });
    it('should return an array of all the missing numbers from a column', function() {
      expect(sudoku.columnNeeds(parsed, 2)).to.deep.equal([4,7,9]);
    });
    it('should return an empty array if that column has no missing numbers', function() {
      expect(sudoku.columnNeeds(expectation, 1)).to.deep.equal([]);
    });
  });
  describe('.makeGuess', function() {
    it('should return a new Guess', function() {
      expect(sudoku.makeGuess(parsed, 0, 0, 4, null)).to.deep.equal(new Guess(parsed, 0, 0, 4, null));
    });
    it('should return a new Guess', function() {
      expect(sudoku.makeGuess(parsed, 0, 0, 5, null)).to.deep.equal(new Guess(parsed, 0, 0, 5, null));
    });
  });
  describe('.findGuess', function() {
    it('should mutate the attempted array to include the first possiblity', function() {
      sudoku.findGuess(parsed);
      expect(sudoku.attempted).to.deep.equal([new Guess(parsed, 0, 0, 4, null)]);
    });
    it('should mutate the attempted array to include the first possiblity', function() {
      sudoku.findGuess(parsed);
      sudoku.findGuess(parsed);
      expect(sudoku.attempted).to.deep.equal([new Guess(parsed, 0, 0, 4, null), new Guess(parsed, 0, 0, 5, null)]);
    });
  });
  describe('.guessExists', function() {
    it('should return true if a guess at a given vector and number has been attempted', function() {
      sudoku.findGuess(parsed);
      expect(sudoku.guessExists(0, 0, 4)).to.be.true;
    });
    it('should return false if a guess at a given vector and number has not been attempted', function() {
      expect(sudoku.guessExists(0, 0, 4)).to.be.false;
    });
  });
});
