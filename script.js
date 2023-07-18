const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");

let frames = 0;
let SPEED = 3;
let index = 0;
const DEGREE = Math.PI/180;

const sprite = new Image();
sprite.src = "https://raw.githubusercontent.com/CodeExplainedRepo/Original-Flappy-bird-JavaScript/master/img/sprite.png";

const SOUNDS = {
  MAIN: new Audio("audio/peritune-noway3.mp3"),
  FLAP: new Audio("audio/bird-flying-up.mp3"),
  HIT: new Audio("audio/oy.mp3"),
  SWOOSHING: new Audio("opa-kogo-to-hlopnuli.mp3"),
  DIE: new Audio("audio/opa-kogo-to-hlopnuli.mp3"),
};

const state = {
    current: 0,
    getReady: 0,
    game: 1,
    over: 2
}

const startBtn = {
    x: 430,
    y: 263,
    w: 83,
    h: 29
}

class getReady {
  constructor() {
    this.img = {
      sX: 0,
      sY: 228,
      w: 173,
      h: 152,
      x: 355,
      y: 80,
    }
   };
    
    draw() { if(state.current === state.getReady) {
            context.drawImage(sprite, this.img.sX, this.img.sY, this.img.w, this.img.h, this.img.x, this.img.y, this.img.w, this.img.h);
        }
    }  
}
const gReady = new getReady()

class gameOver {
  img = {
    sX: 175,
    sY: 228,
    w: 225,
    h: 202,
    x: 355,
    y: 90
  };
  
  medal = {
    golden: { sX: 310, sY: 158 },
    silver: { sX: 358, sY: 113 },
    source: { sW: 45, sH: 45, x: 375, y: 177 }
  };
   
  drawGameOver() { if (state.current !== state.over) return;
                  
    context.drawImage(sprite, this.img.sX, this.img.sY, this.img.w, this.img.h, this.img.x, this.img.y, this.img.w, this.img.h);
    
    const { golden, silver, source } = this.medal;                  

    const medalToDraw = (score.currentScore >= score.hightScore) ? golden : silver;
    context.drawImage(sprite, medalToDraw.sX, medalToDraw.sY, source.sW, source.sH, source.x, source.y, source.sW, source.sH);
  }
}

const gOver = new gameOver();

class Background {
  constructor() {
    this.bg = {
      sX: 0,
      sY: 0,
      sW: 275,
      sH: 226,
    }
  };

  draw() {
      index += 0.3;
      const bgX = -((index * SPEED) % canvas.width);

      let bgPart1 = {
        x: bgX + canvas.width,
        y: 240,
        w: canvas.width,
      };

      let bgPart2 = {
        x: bgX,
        y: 240,
        w: canvas.width,
      };
    
    if (state.current === state.game) {
      context.drawImage(sprite, this.bg.sX, this.bg.sY, this.bg.sW, this.bg.sH, bgPart1.x, bgPart1.y, bgPart1.w, this.bg.sH);
      context.drawImage(sprite, this.bg.sX, this.bg.sY, this.bg.sW, this.bg.sH, bgPart2.x, bgPart2.y, bgPart2.w, this.bg.sH);
      
    } else { 
      context.drawImage(sprite, this.bg.sX, this.bg.sY, this.bg.sW, this.bg.sH, 0, 240, canvas.width, this.bg.sH);
    }
  };
}

const bg = new Background();

class Foreground {
  constructor(sprite) {
  this.fg = {
      sX: 276,
      sY: 0,
      sW: 224,
      sH: 112,
      x: 0,
      y: 368,
      w: canvas.width,
   }
}

  draw() {
    context.drawImage(sprite, this.fg.sX, this.fg.sY, this.fg.sW, this.fg.sH, this.fg.x, this.fg.y, this.fg.w, this.fg.sH);
  }
}

const fg = new Foreground();

class Bird {
  constructor () {}

  animation = [
    { sX: 276, sY: 112 },
    { sX: 276, sY: 139 },
    { sX: 276, sY: 164 }
  ];
  size = [34, 26]
  x = 445;
  y = 150;
  radius = 12;
  
  frame = 0;
  direction = 1;
  
  gravity = 0.25;
  speed = 3;
  jump = 0;
  
  rotation = 0;
  period = 0;

  draw () {
    const bird = this.animation[this.frame];

    context.save();
    
    context.translate(this.x, this.y);
    context.rotate(this.rotation);
    context.drawImage(sprite,
      bird.sX, bird.sY, this.size[0], this.size[1],
      -this.size[0] / 2, -this.size[1] / 2, this.size[0], this.size[1]
    );

    context.restore();
  };

  flap() {
    this.jump = -this.speed;
  };

   fall() {
  this.jump += this.gravity;
  this.y += this.jump;

  if (this.y + this.size[1] / 2 >= canvas.height - fg.fg.sH) {
    this.y = canvas.height - fg.fg.sH - this.size[1] / 2;
    if (state.current === state.game) {
      state.current = state.over;
      SOUNDS.DIE.play();
    }
  }
}

  update() {
  this.period = state.current == state.getReady ? 10 : 5;
  this.frame += this.direction * (frames % this.period == 0 ? 1 : 0);
  if (this.frame >= this.animation.length - 1 && this.direction == 1) {
    this.direction = -1;
  } else if (this.frame <= 0 && this.direction == -1) {
    this.direction = 1;
  }

  if (state.current == state.getReady) {
    this.y = 150; 
    this.rotation = 0 * DEGREE;
  } else {
    this.fall();
    if (this.jump >= this.speed) {
      this.rotation = 90 * DEGREE;
      this.frame = 1;
    } else {
      this.rotation = -25 * DEGREE;
    }
  }
}
 

  speedReset() {
    this.jump = 0;
  };
}

const bird = new Bird();

class Pipes {
  pipesArray = [];
  top = {sX: 553, sY: 0};
  bottom = {sX: 502, sY: 0};
  w = 53;
  h = 400;
  gap = 85;
  maxYPos = -150;
  distance = this.w * 3.5; 
  isCounted = false;

  draw() {
    this.pipesArray.forEach(pos => {
      const topYPos = pos.y;
      const bottomYPos = pos.y + this.h + this.gap;
      context.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, pos.x, topYPos, this.w, this.h);
      context.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, pos.x, bottomYPos, this.w, this.h);
    });
  };

  checkCollision() {
    this.pipesArray.forEach(pos => {
      const bottomPipeYPos = pos.y + this.h + this.gap;
      if (
        (bird.x + bird.radius > pos.x && bird.x - bird.radius < pos.x + this.w && bird.y + bird.radius > pos.y && bird.y - bird.radius < pos.y + this.h) ||
        (bird.x + bird.radius > pos.x && bird.x - bird.radius < pos.x + this.w && bird.y + bird.radius > bottomPipeYPos && bird.y - bird.radius < bottomPipeYPos + this.h)
      ) {
        state.current = state.over;
        SOUNDS.HIT.play();
      }
    });
  }

  checkPassed(pipe) {
    const middleOfGap = pipe.x + this.w / 2;
    if (middleOfGap < bird.x && !pipe.isCounted) {
      if (pipe.x < -this.w) {
        this.pipesArray.shift();
      }
      score.currentScore += 1;
      pipe.isCounted = true;
      score.highScore = Math.max(score.currentScore, score.highScore);
      localStorage.setItem("highScore", score.highScore);
      if (score.currentScore % 10 === 0) {
        SPEED += 0.25;
      }
    }
  }

  update() {
    if (state.current !== state.game) return;
    if (this.pipesArray.length === 0 || canvas.width - this.pipesArray[this.pipesArray.length - 1].x >= this.distance) {
      this.pipesArray.push({
        x: canvas.width,
        y: this.maxYPos * (Math.random() + 1),
        isCounted: false
      });
    }
    this.checkCollision(bird);
    this.pipesArray.forEach(pos => {
      const bottomPipeYPos = pos.y + this.h + this.gap;
      pos.x -= SPEED;
      this.checkPassed(pos);
    });
  }

  reset() {
    this.pipesArray = [];
    SPEED = 2;
  };
}

const pipes = new Pipes()


class Score {
    constructor() {
      this.hightScore = parseInt(localStorage.getItem("hightScore")) || 0;
      this.currentScore = 0;
    }

    draw() {
        if (state.current == state.game) {
            context.lineWidth = 2;
            context.font = "30px 'Press Start 2P', cursive";
            context.strokeStyle = "#e10b25";
            context.strokeText(this.currentScore, 150, 50);
        } else if (state.current == state.over) {
           context.font = "20px 'Press Start 2P', cursive";
           context.strokeText(this.currentScore, 530, 188);
        
           context.strokeText(this.hightScore, 530, 230);
        }
    }

    reset() {
        this.currentScore = 0;
    }
}

const score = new Score();


canvas.addEventListener('click', (event) => {
  if (!canvas || !bird || !SOUNDS || !pipes || !score || !startBtn) {
    console.error('One or more required variables are not defined.');
    return;
  }
  
  const {left, top} = canvas.getBoundingClientRect();
  const clickX = event.clientX - left;
  const clickY = event.clientY - top;

  if (state.current === state.getReady) {
    state.current = state.game;
    SOUNDS.SWOOSHING.play();
  } else if (state.current === state.game) {
      event.preventDefault();
      handleFlap();
    
  } else if (state.current === state.over && isClickOnStartBtn(clickX, clickY)) {
    resetGame();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    handleFlap();
  }
});

function handleFlap() {
  if (bird.y - bird.radius > 0) {
    bird.flap();
    SOUNDS.FLAP.play();
  }
}

function isClickOnStartBtn(clickX, clickY) {
  const { x, y, w, h } = startBtn;
  return clickX > x && clickX < x + w && clickY > y && clickY < y + h;
}

function draw() {
    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
   
    bg.draw();
    pipes.draw();
    fg.draw();
    bird.draw();
    gReady.draw();
    gOver.drawGameOver();
    score.draw();
}

function resetGame() {
  pipes.reset();
  bird.speedReset();
  score.reset();
  bg.draw(); 
  state.current = state.getReady;
}

let frameRate = 60;
let frameDelay = 1000 / frameRate;

function loop(){
    let currentTime = performance.now();
    let elapsed = currentTime - lastFrameTime;
    if (elapsed < frameDelay) {
      setTimeout(loop, frameDelay - elapsed);
      return;
    }

    lastFrameTime = currentTime;
  
    pipes.update();
    bird.update();
    draw();
    SOUNDS.MAIN.play();
    frames++;

    requestAnimationFrame(loop);
}

let lastFrameTime = performance.now();
loop();