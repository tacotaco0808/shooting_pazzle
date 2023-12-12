import PazzlePlate from './pazzlePlate';

class PazzleSetter extends Phaser.Physics.Arcade.Sprite {
  player; //当たったプレイヤーを検知
  lastCollision = 0;
  pazzlePlate; //PazzleSetterの生成される場所にPazzlePlateを配置
  holdPazzleNum = 0; //プレイヤーが持っているパズルの数
  /**@param {Phaser.Scene} scene  */
  constructor(scene, x, y, texture, collisionPlayer) {
    //初期化
    super(scene, x, y, texture);
    this.player = collisionPlayer;
    this.setPosition(x, y);
    this.setScale(0.5);
    //pazzleSetterと同じ場所にPazzlePlate生成
    this.pazzlePlate = new PazzlePlate(scene, x, y);
    //シーンへオブジェクトを追加
    scene.add.existing(this);
    scene.physics.world.enable(this); //body追加
  }
  preUpdate(time, delta) {
    //preUpdateをインスタンス作成時に動作させる
    super.preUpdate(time, delta);
    //表示されていなかったら表示する
    if (!this.visible && time > this.lastCollision) {
      this.setVisible(true);
    }

    //衝突判定
    if (this.scene.physics.overlap(this.player, this) && time > this.lastCollision) {
      console.log('SetPazzle');
      this.pazzlePlate.shuffleAndSetImage(this.holdPazzleNum); //自分で作ったクラスのインスタンスメソッド
      this.setVisible(false);
      this.lastCollision = time + 5000;
    }
  }
  setHoldPazzleNum(pazzleNum) {
    this.holdPazzleNum = pazzleNum;
  }
}
export default PazzleSetter;
