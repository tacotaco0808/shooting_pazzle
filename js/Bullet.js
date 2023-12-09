class Bullet extends Phaser.Physics.Arcade.Image {
  speed;
  /**@type {Phaser.Physics.Arcade.Sprite} */
  player;
  /**@param {Phaser.Scene} scene */
  constructor(scene) {
    super(scene, 0, 0, 'bullet');
    this.speed = Phaser.Math.GetSpeed(300, 1);
    this.scale = 0.5;
  }
  fire(x, y) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);
  }

  update(time, delta) {
    this.y -= this.speed * delta;
  }
}
export default Bullet;
