import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  let className = props.highlighted ? 'square highlighted' : 'square';
    return (
      <button
              className={className}
              onClick={props.onClick}
      >
          {props.value}
      </button>
    );
}

class Board extends React.Component {
  renderSquare(i) {
    let highlighted = this.props.winnerLine.includes(i) ? true : false;
    return (
      <Square key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        highlighted={highlighted}
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

class MovesHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      descOrder: false
    }
  }

  changeOrder() {
    this.setState({ descOrder: !this.state.descOrder })
  }

  render() {
    let moves = this.props.history.map((step, move) => {
      let description;
      if (!move) {
        description = 'Go to game start';
      } else if (move === this.props.stepNumber) {
        description = <b>Go to move # {move} ->{this.props.history[move].location}</b>;
      } else {
        description = `Go to move # ${move} ->${this.props.history[move].location}`
      }

      return (
        <li key={move}>
          <button onClick={() => this.props.jumpTo(move)} >{description}</button>
        </li>
      );
    });
    if (this.state.descOrder) {
      let descOrderMoves = moves.reverse();
      moves = descOrderMoves;
    }

    let sortButtonText = this.state.descOrder? 'sort ASC' : 'sort DESC';

    return(
      <div>
        <button onClick={() => this.changeOrder() } >{sortButtonText}</button>
        <ol>{moves}</ol>
      </div>
    )
  }
}

class Status extends React.Component {
  render() {
    let winner = calculateWinner(this.props.currentSquares)
    let status;
    if (winner) {
      status = 'Winner ' + winner.name;
    } else {
      status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
    }

    return <div>{status}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        location: '(null, null)',
        winnerLine: []
      }],
      xIsNext: true,
      stepNumber: 0,
    };
    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length -1];
    const squares = current.squares.slice();
      if (calculateWinner(squares)  || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';
      let winnerLine = calculateWinner(squares) ? calculateWinner(squares).line : [];
      this.setState({
        history: history.concat([{
          squares: squares,
          location: this.findLocation(i),
          winnerLine: winnerLine
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

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winnerLine= {current.winnerLine}
          />
        </div>
        <div className="game-info">
          <Status
            currentSquares={current.squares}
            xIsNext={this.state.xIsNext}/>
          <MovesHistory
            history={history}
            stepNumber={this.state.stepNumber}
            jumpTo={this.jumpTo} />
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
      return {
        name: squares[a],
        line: lines[i]
      };
    }
  }
  return null;
}
