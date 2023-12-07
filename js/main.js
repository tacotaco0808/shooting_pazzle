import '../style.css';
import MainScene from './mainScene';
const gameCanvas = document.createElement('canvas');
const app = document.querySelector('#app');
gameCanvas.id = 'gameCanvas';
app.appendChild(gameCanvas);

const config = {
  width: 720,
  height: 500,
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: MainScene,
};

const game = new Phaser.Game(config);
