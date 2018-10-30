import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button
              className="square"
              onClick={props.onClick}
      >
          {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    let rows = [];
    let squares = [];
    for (var r = 0; r < 3; r++) {
      for(var i = r*3; i < r*3 + 3; i++) {
        squares.push(this.renderSquare(i));
      }
      rows.push(<div key={r} className="board-row">{squares}</div>);
      squares = [];
    }
    return <div>{rows}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: '(null, null)'
      }],
      xIsNext: true,
      stepNumber: 0
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
      if (calculateWinner(squares)  || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? 'X' : 'O';
      this.setState({
        history: history.concat([{
          squares: squares,
          location: this.findLocation(i)
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length
      });
    }

    findLocation(index) {
      let row;
      let col;
      const squareIndexes = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8]
      ];
      for (let i=0; i<squareIndexes.length; i++) {
        if (squareIndexes[i].includes(index)){
          row = i+1;
          col = squareIndexes[i].indexOf(index) + 1;
          return `(${col}, ${row})`;
        }
      }
    }

    jumpTo(step) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0
      });
    }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      let description;
      if (!move) {
        description = 'Go to game start';
      } else if (move === this.state.stepNumber) {
        description = <b>Go to move # {move} ->{history[move].location}</b>;
      } else {
        description = `Go to move # ${move} ->${history[move].location}`
      }

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)} >{description}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = 'Winner ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i<lines.length; i++) {
    const [a,b,c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
