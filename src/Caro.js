import React from 'react';
import ReactDOM from 'react-dom';
import './Caro.css';

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      width: 20,
      height: 20
    };
  }

  renderSquare(i) {
    return (
      <Square
        key={i.toString()}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  
  renderSquaresInline(index, w) {
    const items = []
    for (let i = index * w; i < index * w + w; i++) {
      items.push(this.renderSquare(i))
    }
    return items.map(item => item);
  }

  renderTable(w, h) {
    const table = [];
    for (let i = 0; i < h; i++) {
      console.log(this.renderSquaresInline(i, w));
      table.push(
        <div className="board-row">
          {this.renderSquaresInline(i, w)}
        </div>
      )
    }
    return table;
  }

  render() {
    return (
      <div>
        {this.renderTable(this.state.width, this.state.height)}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          // squares: [...Array(400).keys()]
          squares: Array(400).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      width: 20,
      height: 20
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, this.state.width, this.state.height) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
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
    const winner = calculateWinner(current.squares, this.state.width, this.state.height);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
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

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares, w, h) {
  const lines = [];
  for (let i = 0; i < w * h; i++) {
    let left  = [i, i - 1, i - 2, i - 3, i - 4];
    let right = [i, i + 1, i + 2, i + 3, i + 4];
    let top   = [i, i - w, i - 2*w, i - 3*w, i - 4*w];
    let bottom = [i, i + w, i + 2*w, i + 3*w, i + 4*w];
    let top_left = [i, i - (w + 1), i - (w + 1)*2, i - (w + 1)*3, i - (w + 1)*4];
    let top_right = [i, i - (w - 1), i - (w - 1)*2, i - (w - 1)*3, i - (w - 1)*4];
    let bottom_left = [i, i + (w - 1), i + (w - 1)*2, i + (w - 1)*3, i + (w - 1)*4];
    let bottom_right = [i, i + (w + 1), i + (w + 1)*2, i + (w + 1)*3, i + (w + 1)*4];
    
    if (!left.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(left)
    }
    if (!right.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(right)
    }
    if (!top.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(top)
    }
    if (!bottom.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(bottom)
    }
    if (!top_left.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(top_left)
    }
    if (!top_right.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(top_right)
    }
    if (!bottom_left.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(bottom_left)
    }
    if (!bottom_right.some(value => value < 0 || value > (w * h - 1))) {
      lines.push(bottom_right)
    }
    
  }

console.log(lines)
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c, d, e] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
