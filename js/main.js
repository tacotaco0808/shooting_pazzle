import '../style.css';
import MainScene from './mainScene';
import GameClear from './GameClear';
const gameCanvas = document.createElement('canvas');
const app = document.querySelector('#app');
gameCanvas.id = 'gameCanvas';
app.appendChild(gameCanvas);

const config = {
  width: 820,
  height: 600,
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: [MainScene, GameClear],
};

const game = new Phaser.Game(config);
