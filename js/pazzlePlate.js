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
  //setImage
  imageArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  //9x9のパズル
  /**@param {Phaser.Scene} scene  */
  constructor(scene, x, y) {
    super(scene, x, y);
    //そろえるパズルの画像９枚
    this.image1 = scene.add.image(-50, -50, '1');
    this.image2 = scene.add.image(0, -50, '2');
    this.image3 = scene.add.image(50, -50, '3');
    this.image4 = scene.add.image(-50, 0, '4');
    this.image5 = scene.add.image(0, 0, '5');
    this.image6 = scene.add.image(50, 0, '6');
    this.image7 = scene.add.image(-50, 50, '7');
    this.image8 = scene.add.image(0, 50, '8');
    this.image9 = scene.add.image(50, 50, '9');
    //resize
    this.image1.setScale(0.75);
    this.image2.setScale(0.75);
    this.image3.setScale(0.75);
    this.image4.setScale(0.75);
    this.image5.setScale(0.75);
    this.image6.setScale(0.75);
    this.image7.setScale(0.75);
    this.image8.setScale(0.75);
    this.image9.setScale(0.75);
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
  shuffleAndSetImage(count) {
    if (this.imageArray.length) {
      //配列の中に値が存在するならcount回抽選
      for (let i = 0; i < count; i++) {
        let indexPazzle = 0; //抽選した番号
        this.shuffleArray(); //抽選
        indexPazzle = this.imageArray.pop();
        this.setImage(indexPazzle);
      }
    }
  }
  shuffleArray() {
    //配列の中身をシャッフル
    this.imageArray = this.imageArray.slice().sort(() => Math.random() - Math.random());
  }
  setImage(numPazzle) {
    //指定された番号のパズルを表示
    switch (numPazzle) {
      case 1:
        this.image1.setVisible(true);
        break;
      case 2:
        this.image2.setVisible(true);
        break;
      case 3:
        this.image3.setVisible(true);
        break;
      case 4:
        this.image4.setVisible(true);
        break;
      case 5:
        this.image5.setVisible(true);
        break;
      case 6:
        this.image6.setVisible(true);
        break;
      case 7:
        this.image7.setVisible(true);
        break;
      case 8:
        this.image8.setVisible(true);
        break;
      case 9:
        this.image9.setVisible(true);
        break;
      default:
        // デフォルトの処理
        break;
    }
  }
}
export default PazzlePlate;
