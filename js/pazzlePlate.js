class PazzlePlate extends Phaser.GameObjects.Container {
  /**@type {Phaser.GameObjects.Image} */
  image1;
  /**@type {Phaser.GameObjects.Image} */
  image2;
  /**@type {Phaser.GameObjects.Image} */
  image3;
  /**@type {Phaser.GameObjects.Image} */
  image4;
  /**@type {Phaser.GameObjects.Image} */
  image5;
  /**@type {Phaser.GameObjects.Image} */
  image6;
  /**@type {Phaser.GameObjects.Image} */
  image7;
  /**@type {Phaser.GameObjects.Image} */
  image8;
  /**@type {Phaser.GameObjects.Image} */
  image9;

  //9x9のパズル
  /**@param {Phaser.Scene} scene  */
  constructor(scene, x, y) {
    super(scene, x, y);
    //そろえるパズルの画像９枚
    this.image1 = scene.add.image(-50, -50, 'a');
    this.image2 = scene.add.image(0, -50, 'a');
    this.image3 = scene.add.image(50, -50, 'a');
    this.image4 = scene.add.image(-50, 0, 'a');
    this.image5 = scene.add.image(0, 0, 'a');
    this.image6 = scene.add.image(50, 0, 'a');
    this.image7 = scene.add.image(-50, 50, 'a');
    this.image8 = scene.add.image(0, 50, 'a');
    this.image9 = scene.add.image(50, 50, 'a');
    //コンテナへオブジェクトを追加
    this.add([this.image1, this.image2, this.image3, this.image4, this.image5, this.image6, this.image7, this.image8, this.image9]);
    //全て見えなくする
    this.image1.setVisible(false);
    this.image2.setVisible(false);
    this.image3.setVisible(false);
    this.image4.setVisible(false);
    this.image5.setVisible(false);
    this.image6.setVisible(false);
    this.image7.setVisible(false);
    this.image8.setVisible(false);
    this.image9.setVisible(false);
    //パズルのプレートを表示
    scene.add.existing(this);
  }
}
export default PazzlePlate;
