const bgAudio = document.getElementById('bg');
const vivoAudio = document.getElementById('vivo');
const muertoAudio = document.getElementById('muerto');

const bg = new Image()
bg.src = './fondo.png'
const p = new Image()
p.src = './p.png'
const z = new Image()
z.src = './z.png'
const g = new Image()
g.src = './conejo.png'

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = 400;//window.innerWidth;
const height = canvas.height = 480;//window.innerHeight;

/*
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
*/
let zombie = null;
let person = null;
let gun = { x: width / 2, y: height - 50 };

let score = 0;
let lives = 3;
let time = 30;
let playing = false;

function init() {
  spawnZombie();
  spawnPerson();
  playing = true;

  bgAudio.play();
  vivoAudio.currentTime = 0;
  vivoAudio.play();
}

function stop() {
  score = 0;
  lives = 3;
  time = 30;
  zombie = null;
  person = null;
  playing = false;
  bgAudio.pause();
  vivoAudio.pause();
  muertoAudio.pause();
  bgAudio.currentTime = 0;
  vivoAudio.currentTime = 0;
  muertoAudio.currentTime = 0;
}

function loop() {
  ctx.drawImage(bg, 0, 0, width, height);
  zombie.update();
  if(zombie.position.y >= height) {
    lives--;
    zombie = null;
    spawnZombie();
  }
  person.update();
  if(person.position.y >= height) {
    person = null;
    spawnPerson();
  }
  ctx.drawImage(g, gun.x, gun.y-10, 100, 100)
  //ctx.fillStyle = 'white';
  //ctx.fillRect(0, 0, 200, 200)
  if(lives <= 0) {
    playing = false;
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.fillText('Game Over', width / 2 - 70, height / 2);
  }
  draw();
}

function draw() {
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);
  ctx.fillText(`Lives: ${lives}`, 10, 60);
  ctx.fillText(`Time: ${time}`, 10, 90);
}

function spawnZombie() {
  zombie = new Zombie(Math.random() * width, 0);
}

function spawnPerson() {
  person = new Person(Math.random() * width, 0);
}

window.setInterval(() => {
  if(playing) loop();
}, 1000 / 60);

window.setInterval(() => {
  if(playing) {
    zombie.imageStart = zombie.imageStart === 0 ? 30 : 0;
    person.imageStart = person.imageStart === 0 ? 30 : 0;
  }
}, 1000 / 2)

window.setInterval(() => {
  if(playing) time--;
  if(time < 0) stop();
}, 1000);

window.setInterval(() => {
  if(playing) {
    vivoAudio.currentTime = 0;
    vivoAudio.play();
  }
}, 10000);

canvas.addEventListener('click', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if(playing) {
    if(Math.abs(zombie.position.x - x) < zombie.size && Math.abs(zombie.position.y - y) < zombie.size) {
      zombie.die();
      spawnZombie();
    }
  }
});

document.addEventListener('contextmenu', (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  if(playing) {
    if(Math.abs(person.position.x - x) < person.size && Math.abs(person.position.y - y) < person.size) {
      person = null;
      spawnPerson();
      score++;
    }
  }
  e.preventDefault();
}, false);

canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  gun.x = e.clientX - rect.left;
});

class Character {
  position = { x: 0, y: 0 };
  speed = 1;
  size = 50;
  image = p;
  imageStart = 0;

  constructor(x, y) {
    this.position.x = x;
    this.position.y = y;
  }

  draw() {
    ctx.drawImage(this.image, 0, this.imageStart, 30, 30, this.position.x - this.size/2, this.position.y - this.size/2, this.size, this.size);
  }

  move() {
    this.position.y += this.speed;
  }

  update() {
    this.move();
    this.draw();
  }
}

class Zombie extends Character {
  image = z;

  die() {
    zombie = null;
    score++;
    muertoAudio.currentTime = 2.5;
    vivoAudio.pause();
    muertoAudio.play();
    window.setTimeout(() => {
      muertoAudio.pause();
    }, 1000);
  }
}

class Person extends Character {
  image = p;
}