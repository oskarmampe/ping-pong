import React, { Component } from 'react';

class App extends Component {
  constructor(props) {
    super(props);

    this.pingPong = React.createRef();
    this.framesPerSecond = 50;
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
        x: pingPong.width - 10,
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
        speed: 5,
        velocityX: 5,
        velocityY: 5,
        colour: 'white',
      },
    }, () => {
      this.interval = setInterval(() => {
        this.update();
      }, 1000 / this.framesPerSecond);
    });
  }

  componentDidUpdate() {
    const {
      user, comp, ball, canvas,
    } = this.state;

    this.drawRect(0, 0, 600, 400, 'black');
    this.drawRect(user.x, user.y, user.width, user.height, user.colour);
    this.drawRect(comp.x, comp.y, comp.width, comp.height, comp.colour);
    this.drawCircle(ball.x, ball.y, ball.radius, ball.colour);

    // User Score
    this.drawText(1 * canvas.width / 5, 1 * canvas.height / 5, user.score, 'white');
    this.drawText(3.5 * canvas.width / 5, 1 * canvas.height / 5, comp.score, 'white');
    this.drawNet();
  }

  componentWillUnmount() {
    clearInterval(this.interval);
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

  update() {
    const {
      ball, user, comp, canvas,
    } = this.state;

    ball.x += ball.velocityX;
    ball.y += ball.velocityY;

    if (ball.y + ball.radius > canvas.height
       || ball.y - ball.radius < 0) {
      ball.velocityY = -ball.velocityY;
    }

    const player = ball.x < canvas.width / 2 ? user : comp;

    if (this.checkCollision()) {
      // Normalise to 1 and -1
      const collidePoint = (ball.y - (player.y + player.height / 2)) / (player.height / 2);

      // Get the angle of up to 45degrees or pi/4
      // The angle will be 45 if the collision happens at the top or bottom of the paddle
      const angle = (Math.PI / 4) * collidePoint;
      const direction = (ball.x < canvas.width / 2) ? 1 : -1;

      // Using trigonometry, cos(angle) = velocityX / speed therefore cos(angle) * speed = velocityX
      // Direction is used for diverting away from the paddle
      ball.velocityX = direction * ball.speed * Math.cos(angle);
      ball.velocityY = ball.speed * Math.sin(angle);

      ball.speed += 0.5;
    }

    if (ball.x - ball.radius < 0) {
      comp.score += 1;
      this.resetBall();
    } else if (ball.x + ball.radius > canvas.width) {
      user.score += 1;
      this.resetBall();
    }

    this.computerPaddle(ball, comp);


    this.setState({ ball, user, comp });
  }

  checkCollision() {
    const {
      ball, canvas, user, comp
    } = this.state;

    // Get the player, which could be either computer or the player.
    // The player is the computer if the ball is on the left side of the line
    // i.e. the x position of the ball is greater than half the width of the canvas.
    const player = ball.x < canvas.width / 2 ? user : comp;

    // Get the player position
    const playerTop = player.y;
    const playerBottom = player.y + player.height;
    const playerLeft = player.x;
    const playerRight = player.x + player.width;

    // Get the ball position
    const ballTop = ball.y - ball.radius;
    const ballBottom = ball.y + ball.radius;
    const ballRight = ball.x + ball.radius;
    const ballLeft = ball.x - ball.radius;

    return ballRight > playerLeft && ballLeft < playerRight
    && ballBottom > playerTop && ballTop < playerBottom;
  }

  resetBall() {
    const { ball, canvas } = this.state;
    const direction = (ball.x < canvas.width / 2) ? 1 : -1;

    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = direction * 5;
    ball.velocityY = 5;
  }

  movePaddle(evt) {
    const { canvas, user } = this.state;
    const rect = canvas.getBoundingClientRect();
    user.y = evt.clientY - rect.top - (user.height / 2);
  }

  computerPaddle() {
    const { comp, ball } = this.state;

    const computerDiff = 0.1;
    comp.y += (ball.y - (comp.y + comp.height / 2)) * computerDiff;
  }

  render() {
    return (
      <div className="App">
        <canvas id="ping" ref={this.pingPong} width="600" height="400" onMouseMove={(e) => { this.movePaddle(e); }} />
      </div>
    );
  }
}

export default App;
