import { Scene } from 'phaser';

class PazzleSetter extends Phaser.Physics.Arcade.Sprite {
  player; //当たったプレイヤーを検知
  lastCollision = 0; //
  /**@param {Phaser.Scene} scene  */
  constructor(scene, x, y, texture, collisionPlayer) {
    //初期化
    super(scene, x, y, texture);
    this.player = collisionPlayer;
    this.setPosition(x, y);
    this.setScale(0.5);

    //シーンへオブジェクトを追加
    scene.add.existing(this);
    scene.physics.world.enable(this);
  }
  preUpdate(time, delta) {
    super.preUpdate(time, delta);
    if (this.scene.physics.overlap(this.player, this) && time > this.lastCollision) {
      console.log('SetPazzle');
      this.lastCollision = time + 5000;
    }
  }
}
export default PazzleSetter;
