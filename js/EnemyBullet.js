class EnemyBullet extends Phaser.Physics.Arcade.Image {
  speed;
  /**@type {Phaser.Physics.Arcade.Sprite} */
  player;
  /**@param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene, 0, 0, 'bullet');
    this.speed = Phaser.Math.GetSpeed(300, 1);
    this.scaleY = 2;
    this.scaleX = 0.2;
  }
  fire(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y + 50);
  }

  update(time, delta) {
    this.y += this.speed * delta;
  }
}
export default EnemyBullet;
