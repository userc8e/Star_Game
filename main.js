/*
    MAIN FILE
                */

//  IMPORTS
import java.util.HashSet;
import java.util.Set;
import java.util.ArrayList;
import processing.sound.*;

//  VARIABLES
const bgColor = color(0);
Set<Character> keysPressed = new HashSet<>(); //tracks movement
Set<Integer> keysPressedCode = new HashSet<>();
Player p = new Player(keysPressed, keysPressedCode);
ArrayList<Body> bodies = new ArrayList<>(); //the bodies that appear on-screen
let flashTimer = 0;
let spawnRate = 100;
let hundred = 100; //counts hundreds in points
let stakes = 300;
let maxSpeed = 2;
SoundFile bgMusic;
SoundFile ding; //sound when u collect a star :D
SoundFile dong; //sound when u hit an asteroid :(
SoundFile endMusic;



//  SETUP
function setup() {
  size(900, 600);
  bgMusic = new SoundFile(this, "saturnSong.mp3");
  bgMusic.play();
  bgMusic.loop();
  ding = new SoundFile(this, "dingSound.mp3");
  dong = new SoundFile(this, "damageSound.wav");
  endMusic = new SoundFile(this, "sadSong.wav");
}


//  PLAYER MOVEMENT METHODS

function keyPressed() {
  keysPressed.add(key);
  keysPressedCode.add(keyCode);
}

function keyReleased() {
  keysPressed.remove(key);
  keysPressedCode.remove(keyCode);
}


//  BODY METHODS

function spawnBody() {
  let x = random(width);
  let y = random(height);
  let r = 100; //radius of asteroids
  let chance = 0.3; //starting chance of asteroids to spawn
  
  // after a certain amt points, the stakes increase
  if (p.getPoints() >= hundred*stakes) {
    chance *= 1.5;
    hundred += 100;
    r += 20; //asteroids will get bigger
    if (spawnRate > 15) {
      spawnRate -= 15;
    }
    maxSpeed *= 1.3;
    stakes *= 1.2;
  }
  
  if (random((let)Math.ceil(chance)) < chance) {
    bodies.add(new Asteroid(x, y, maxSpeed, r));
  } else {
    bodies.add(new Star(x, y, maxSpeed));
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
  //  GAME OVER?
  if (p.getLives() == 0) {
    background(255, 0, 0, 75);
    fill(255);
    textSize(40);
    textAlign(CENTER, CENTER);
    text("Looks like your journey has ended :(", width/2, height/2);
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
  fill(143, 143, 143);
  textSize(20);
  text("Move using WASD or Arrow keys!\n\nFly through space to capture\ncolorful stars to gain points\nand special effects!\n\nBut be careful of the grey asteroids!", width/4, height/4);
  fill(p.getColor());
  text("effect: " + p.getEffect(), 740, 580);

  
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
  for (let i = bodies.size() - 1; i >= 0; i--) {
    Body b = bodies.get(i);
    
    // bodies disappear after a few seconds
    if (b.isExpired()) {
      bodies.remove(i);
      continue;
    }
    
    b.updatePosition();
    b.display();
  
    // touching the body will remove it
    if (b.interact(p)) {
      if (b instanceof Star) {
        p.absorbColor(b.getColor());
        ding.play();
      } else {
        dong.play();
      }
      
      // gets rid of body
      bodies.remove(i);
    }
  }
  
  if (!p.getEffect().equals("none")) {
    fill(p.getColor());
    rect(740, 550, map(p.getEffectTimer(), 0, 1200, 0, 180), 10);
  }
  
  if (p.points <= -100) {
    p.die();
  }

  
  if (frameCount % spawnRate == 0) {
    spawnBody();
  }
  
}