class EnemyBullet extends Phaser.Physics.Arcade.Image {
  checkCollision = false;
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
  getPlayer(sprite) {
    this.player = sprite;
  }

  update(time, delta) {
    this.y += this.speed * delta;
    // プレイヤーとの衝突を検知
    const colliedPlayer = this.player; // プレイヤーオブジェクトへの参照を取得
    if (colliedPlayer && Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), colliedPlayer.getBounds())) {
      // プレイヤーとの衝突が発生した場合の処理
      this.destroy();
    }
  }
}
export default EnemyBullet;
