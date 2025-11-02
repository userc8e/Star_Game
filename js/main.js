/*
    MAIN FILE
                */


//  VARIABLES
let gameStarted = false;
let bgColor;
let keysPressed = new Set(); // tracks movement
let keysPressedCode = new Set();
let bodies = []; // the bodies that appear on-screen
let p;
let flashTimer = 0;
let spawnRate = 100;
let hundred = 100; //counts hundreds in points
let stakes = 300;
let maxSpeed = 2;
let bgMusic;
let ding; //sound when u collect a star :D
let dong; //sound when u hit an asteroid :(
let zap; //sound when asteroid is destroyed
let endMusic;

//  PRELOAD (for music)
function preload() {
  bgMusic = loadSound('./assets/saturnSong.mp3');
  ding = loadSound('./assets/dingSound.mp3');
  dong = loadSound('./assets/damageSound.wav');
  endMusic = loadSound('./assets/sadSong.wav');
  zap = loadSound('./assets/zap.wav');
}


//  SETUP

function startGame() {
  document.getElementById('gameContainer').style.display = 'block';
  document.getElementById('gameContainer').scrollIntoView({ behavior: 'smooth' });
  bgColor = color(0);
  bgMusic.setLoop(true);
  bgMusic.play();
  p = new Player(keysPressed, keysPressedCode);
  gameStarted = true;
  loop(); //starts draw loop
}

window.addEventListener('DOMContentLoaded', () => {
  document.getElementById('playButton').addEventListener('click', () => {
    if (getAudioContext().state !== 'running') {
      getAudioContext().resume();
    }

    document.getElementById('startScreen').style.display = 'none';
    startGame();
  });
});

function setup() {
  let canvas = createCanvas(windowWidth * 0.9, windowHeight);
  canvas.parent('gameContainer');
  noLoop(); //prevent draw from running until Play is clicked
}


//  PLAYER MOVEMENT METHODS

function keyPressed() {
  keysPressed.add(key);
  keysPressedCode.add(keyCode);
}

function keyReleased() {
  keysPressed.delete(key);
  keysPressedCode.delete(keyCode);
}


//  AUDIO

function mousePressed() {
  if (getAudioContext().state !== 'running') {
    getAudioContext().resume();
  }
}


//  BODY METHODS

function spawnBody() {
  let x = random(width);
  let y = random(height);

  let progress = p.getPoints();
  let difficultyFactor = 1 + progress / 800; // scales slowly over time

  let chance = 0.3 * difficultyFactor;
  let r = 100 + progress / 40; // asteroid radius increases gradually
  let speed = maxSpeed * difficultyFactor;

  if (random(1) < chance) {
    bodies.push(new Asteroid(x, y, maxSpeed, r));
  } else {
    bodies.push(new Star(x, y, maxSpeed));
  }
}


//  VISUAL METHODS

function drawHeart(x, y, alive) {
  noStroke();
  if (alive) {
    fill(255, 0, 0);
  } else {
    noFill();
  }
  
  let r = 15;
  ellipse(x-r/2, y-r/2, r, r);
  ellipse(x+r/2, y-r/2, r, r);
  
  beginShape();
  vertex(x-r, y-r/4);
  vertex(x, y+r);
  vertex(x+r, y-r/4);
  endShape(CLOSE);
}


//  DRAW

function draw() {
  // game doesn't start until hit play
  if (!gameStarted) {
    return;
  }

  //  GAME OVER?
  if (p.getLives() == 0) {
    background(255, 0, 0, 75);
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Looks like your journey has ended :<", width/2, height/2);
    textSize(20);
    text("Score: " + p.getPoints(), width/2, height/2 + 60);
    bgMusic.pause();
    endMusic.play();
    noLoop();
    return;
  }
  
  //  BACKGROUND VISUAL SETUP
  background(bgColor);
  fill(255);
  textSize(25);
  text("Points: " + p.getPoints(), 20, 40);
  fill(p.getColor());
  text("effect: " + p.getEffect(), width-200, height-10);

  
  //  HEART LIVES
  for (let i = 0; i < 3; i++) {
    let alive = i < p.getLives();
    drawHeart(32 + i*35, 70, alive);
  }
  
  //  PLAYER MOVEMENT
  p.display();
  p.move();
  p.timeEffect();
  
  // SPAWNING BODIES
  for (let i = bodies.length - 1; i >= 0; i--) {
    let b = bodies[i];

    if (b.isExpired()) {
      bodies.splice(i, 1);
      continue;
    }

    b.updatePosition();
    b.display();

    if (b.interact(p)) {
      if (b instanceof Star) {
        p.absorbColor(b.getColor());
        ding.play();
      } else if (b instanceof Asteroid) {
        if (p.invincible == true) {
          zap.play();
        } else {
          dong.play();
        }
      }
      bodies.splice(i, 1);
    }
  }
  
  if (p.getEffect() != ("none")) {
    fill(p.getColor());
    rect(width-200, height-45, map(p.getEffectTimer(), 0, 1200, 0, 180), 10);
  }
  
  if (p.points <= -100) {
    p.die();
  }

  
  if (frameCount % spawnRate == 0) {
    spawnBody();
  }
  
}