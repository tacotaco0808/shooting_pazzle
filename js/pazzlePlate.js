class PazzlePlate extends Phaser.GameObjects.Container {
  //9x9のパズル
  /**@param {Phaser.Scene} scene  */
  constructor(scene, x, y) {
    super(scene, x, y);
    //そろえるパズルの画像９枚
    const image1 = scene.add.image(-50, -50, 'a');
    const image5 = scene.add.image(0, 0, 'a');
    const image9 = scene.add.image(50, 50, 'a');
    this.add([image1, image5, image9]);
    scene.add.existing(this);
  }
}
export default PazzlePlate;
