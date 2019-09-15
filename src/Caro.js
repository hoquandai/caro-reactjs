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
      let l_obs = left[0] - 5;
      let r_obs = left[0] + 1;
      if (l_obs >= 0 && r_obs < w*h) {
        left.push(l_obs, r_obs)
      }

      lines.push(left)
    }
    if (!right.some(value => value < 0 || value > (w * h - 1))) {
      let l_obs = right[0] - 1;
      let r_obs = right[0] + 5;
      if (l_obs >= 0 && r_obs < w*h) {
        right.push(l_obs, r_obs)
      }

      lines.push(right)
    }
    if (!top.some(value => value < 0 || value > (w * h - 1))) {
      let t_obs = top[0] - 5*w;
      let b_obs = top[0] + w;
      if (t_obs >= 0 && b_obs < w*h) {
        top.push(t_obs, b_obs)
      }

      lines.push(top)
    }
    if (!bottom.some(value => value < 0 || value > (w * h - 1))) {
      let t_obs = bottom[0] - w;
      let b_obs = bottom[0] + 5*w;
      if (t_obs >= 0 && b_obs < w*h) {
        bottom.push(t_obs, b_obs)
      }

      lines.push(bottom)
    }
    if (!top_left.some(value => value < 0 || value > (w * h - 1))) {
      let tl_obs = top_left[0] - (w + 1)*5;
      let br_obs = top_left[0] + (w + 1);
      if (tl_obs >= 0 && br_obs < w*h) {
        top_left.push(tl_obs, br_obs)
      }

      lines.push(top_left)
    }
    if (!top_right.some(value => value < 0 || value > (w * h - 1))) {
      let tr_obs = top_right[0] - (w - 1)*5;
      let bl_obs = top_right[0] + (w - 1);
      if (tr_obs >= 0 && bl_obs < w*h) {
        top_right.push(tr_obs, bl_obs)
      }

      lines.push(top_right)
    }
    if (!bottom_left.some(value => value < 0 || value > (w * h - 1))) {
      let tr_obs = bottom_left[0] - (w - 1);
      let bl_obs = bottom_left[0] + (w - 1)*5;
      if (tr_obs >= 0 && bl_obs < w*h) {
        bottom_left.push(tr_obs, bl_obs)
      }

      lines.push(bottom_left)
    }
    if (!bottom_right.some(value => value < 0 || value > (w * h - 1))) {
      let tl_obs = bottom_right[0] - (w + 1);
      let br_obs = bottom_right[0] + (w + 1)*5;
      if (tl_obs >= 0 && br_obs < w*h) {
        bottom_right.push(tl_obs, br_obs)
      }

      lines.push(bottom_right)
    }
  }

console.log(lines)
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].length === 5) {
      const [a, b, c, d, e] = lines[i];
   
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e]) {
        return squares[a];
      }
    } else if (lines[i].length === 7) {
      const [a, b, c, d, e, f, g] = lines[i];
   
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c] && squares[a] === squares[d] && squares[a] === squares[e] && squares[f] !== squares[g]) {
        return squares[a];
      }
    }
  }
  return null;
}

export default Game;
