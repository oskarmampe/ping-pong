import React, { Component } from 'react';
// import logo from '../resources/svg/logo.svg';

class App extends Component {
  constructor(props) {
    super(props);

    this.pingPong = React.createRef();
  }

  componentDidMount() {
    const pingPong = this.pingPong.current;
    this.setState({
      canvas: pingPong,
      context: pingPong.getContext('2d'),
      user: {
        x: 0,
        y: pingPong.height / 2 - 50,
        width: 10,
        height: 100,
        colour: 'white',
        score: 0,
      },
      comp: {
        x: pingPong.width - 15,
        y: pingPong.height / 2 - 50,
        width: 10,
        height: 100,
        colour: 'white',
        score: 0,
      },
      net: {
        x: pingPong.width / 2,
        y: 0,
        width: 2,
        height: 10,
        colour: 'white',
      },
      ball: {
        x: pingPong.width / 2,
        y: pingPong.height / 2,
        radius: 10,
        colour: 'white',
      },
    });
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const {
      user, comp, ball, canvas
    } = this.state;

    this.drawRect(0, 0, 600, 400, 'black');
    this.drawRect(user.x, user.y, user.width, user.height, user.colour);
    this.drawRect(comp.x, comp.y, comp.width, comp.height, comp.colour);
    this.drawCircle(ball.x, ball.y, ball.radius, ball.colour);
    // User Score
    this.drawText(1 * canvas.width / 5, 1 * canvas.height / 5, user.score, 'white');
    this.drawText(3.5 * canvas.width / 5, 1 * canvas.height / 5, user.score, 'white');
    this.drawNet();
  }

  drawRect(x, y, width, height, colour) {
    const { context } = this.state;

    context.fillStyle = colour;
    // From top left, 100 px to the right, 200 px down, 50 width, 75 height
    context.fillRect(x, y, width, height);
  }

  drawCircle(x, y, radius, colour) {
    const { context } = this.state;

    context.fillStyle = colour;
    // Start drawing
    context.beginPath();
    // Xposition, Yposition, radius, startAngle, endAngle, counterclockwise direction
    context.arc(x, y, radius, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
  }

  drawText(x, y, text, colour) {
    const { context } = this.state;
    context.fillStyle = colour;
    context.font = '75px Courier New';
    context.fillText(text, x, y);
  }

  drawNet() {
    const { net, canvas } = this.state;

    for (let i = 0; i <= canvas.height; i += 15) {
      this.drawRect(net.x, net.y + i, net.width, net.height, net.colour);
    }
  }

  render() {
    return (
      <div className="App">
        <canvas id="ping" ref={this.pingPong} width="600" height="400" />
      </div>
    );
  }
}

export default App;
