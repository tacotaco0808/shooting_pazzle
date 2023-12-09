import Phaser from 'phaser';
import Pazzle from './pazzle';
import Bullet from './Bullet';
import EnemyBullet from './EnemyBullet';
class mainScene extends Phaser.Scene {
  /**@type {Phaser.Physics.Arcade.Sprite}*/ //TSの型宣言みたいなやつ
  player;
  playerStun = false;
  playerHoldPazzle = 0;
  /**@type {Phaser.GameObjects.Text} */
  playerHoldPazzleText;
  playerLastFired = 0;

  /**@type {Phaser.Physics.Arcade.Sprite}*/ //TSの型宣言みたいなやつ
  player2;
  player2Stun = false;
  enemyLastFired = 0;
  /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;
  /**@type {Phaser.Input.Keyboard.Key} */
  keys;
  /**@type {Phaser.Physics.Arcade.Group} */
  pazzles;
  pazzleNum = 9; //number of pazzle
  /**@type {Phaser.Physics.Arcade.Group} */
  bullets;
  maxBullets = 3;
  /**@type {Phaser.Physics.Arcade.Group} */
  enemyBullets;
  constructor() {
    super('mainGame');
  }
  preload() {
    this.load.image('background', 'assets/Background/bg_layer1.png');
    this.load.image('player', 'assets/Enemies/flyMan_fly.png');
    this.load.image('player2', 'assets/Enemies/wingMan1.png');
    this.load.image('player2Stun', 'assets/Enemies/spikeMan_jump.png');
    this.load.image('pazzle', 'assets/Items/carrot.png');
    this.load.image('bullet', 'assets/Enemies/spikeBall1.png');
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE'); //keyboardPluginであるaddkeysメソッドを使ってthis.input.keyboard.Keyを追加
  }
  create() {
    const background = this.add.image(0, 0, 'background');
    //player
    this.player = this.physics.add.sprite(360, 500, 'player').setScale(0.5);
    this.player2 = this.physics.add.sprite(360, 0, 'player2').setScale(0.5);
    //pazzle
    this.pazzles = this.physics.add.group({ classType: Pazzle });
    for (let i = 0; i < this.pazzleNum; i++) {
      const x = Phaser.Math.Between(0, 720); //x:0~400の間にrandomで生成
      const y = 55 * i; //高さもランダム
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const pazzle = this.pazzles.create(x, y, 'pazzle');
      pazzle.scale = 0.8;
      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = pazzle.body;
      body.updateFromGameObject();
    }
    //bullet
    //add.groupで弾のプール作成
    this.bullets = this.physics.add.group({ classType: Bullet, maxSize: this.maxBullets, runChildUpdate: true }); //runChildupdateはグループが更新される際、子要素のupdateも呼び出される
    this.enemyBullets = this.physics.add.group({ classType: EnemyBullet, maxSize: this.maxBullets, runChildUpdate: true });
    //collision evt
    this.physics.add.overlap(this.player, this.pazzles, this.handleCollisionPazzle, undefined, this);
    this.physics.add.overlap(this.player2, this.bullets, this.handleCollisionBullet, undefined, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.handleCollisionEnemyBullet, undefined, this);
    //countText
    const countText = { color: 'white', fontSize: 24 };
    this.playerHoldPazzleText = this.add.text(80, 0, 'Pazzle: 0', countText).setScrollFactor(0).setOrigin(0.5, 0);
  }
  update(time, delta) {
    if (this.playerStun !== true) {
      //デフォルトの状態(動ける)
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
        this.player.setAngle(90);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
        this.player.setAngle(270);
      } else {
        this.player.setVelocityX(0);
      }
      if (this.cursors.up.isDown) {
        this.player.setVelocityY(-200);
        this.player.setAngle(0);
      } else if (this.cursors.down.isDown) {
        this.player.setVelocityY(200);
        this.player.setAngle(180);
      } else {
        this.player.setVelocityY(0);
      }
    } else {
      //スタン状態(動けない)
    }
    //player2
    if (this.player2Stun !== true) {
      if (this.keys.W.isDown) {
        this.player2.setVelocityY(-200);
      } else if (this.keys.S.isDown) {
        this.player2.setVelocityY(200);
      } else {
        this.player2.setVelocityY(0);
      }
      if (this.keys.A.isDown) {
        this.player2.setVelocityX(-200);
      } else if (this.keys.D.isDown) {
        this.player2.setVelocityX(200);
      } else {
        this.player2.setVelocityX(0);
      }
    }
    //bullet
    if (this.keys.SPACE.isDown && time > this.playerLastFired) {
      /**@type {Bullet} */
      const bullet = this.bullets.get(); //弾を1つプールから取得
      this.bullets.children.iterate((bulletsChild) => {
        this.bullets.world.add(bulletsChild.body); //this.bullets.children.iterate((bullet) =>と同じ
      });

      if (bullet) {
        //プールの中に利用可能な弾があれば使う
        bullet.fire(this.player.x, this.player.y);
        this.playerLastFired = time + 100; //一つ目の弾発射時+Xms秒後に２つ目発射
      }
    }
    this.bullets.children.iterate((bullet) => {
      // colliedPlayer && Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), colliedPlayer.getBounds())
      if (bullet.y < 0 || bullet.y > this.sys.canvas.height + 50 || (this.player2 && Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), this.player2.getBounds()))) {
        this.bullets.world.remove(bullet.body);
        this.bullets.killAndHide(bullet); //bulletを非表示にしてプールへ戻す　||非アクティブにするだけでプールに戻さない場合はsetActive(false)を使用する
      }
    }); //プールから子要素(弾を読み取り)

    //enemybullet
    if (this.keys.E.isDown && time > this.enemyLastFired) {
      const bullet = this.enemyBullets.get(); //弾をプールから取得
      this.enemyBullets.children.iterate((bulletsChild) => {
        this.enemyBullets.world.add(bulletsChild.body); //this.bullets.children.iterate((bullet) =>と同じ
      });
      if (bullet) {
        //プールの中に利用可能な弾があれば使う
        bullet.fire(this.player2.x, this.player2.y);
        this.enemyLastFired = time + 100; //一つ目の弾発射時+Xms秒後に２つ目発射
      }
    }
    this.enemyBullets.children.iterate((bullet) => {
      // colliedPlayer && Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), colliedPlayer.getBounds())
      if (bullet.y < 0 || bullet.y > this.sys.canvas.height + 0 || (this.player && Phaser.Geom.Intersects.RectangleToRectangle(bullet.getBounds(), this.player.getBounds()))) {
        this.enemyBullets.world.remove(bullet.body);
        this.enemyBullets.killAndHide(bullet); //bulletを非表示にしてプールへ戻す　||非アクティブにするだけでプールに戻さない場合はsetActive(false)を使用する
      }
    }); //プールから子要素(弾を読み取り)
  }

  handleCollisionPazzle(player, pazzle) {
    //取得イベント
    if (this.playerHoldPazzle < 3) {
      //持てるピースは4個まで
      this.pazzles.killAndHide(pazzle);
      this.physics.world.disableBody(pazzle.body);
      this.playerHoldPazzle++;
      const value = `Pazzle: ${this.playerHoldPazzle}`;
      this.playerHoldPazzleText.text = value;
      console.log(this.playerHoldPazzle);
    } else if (this.playerHoldPazzle == 3) {
      this.pazzles.killAndHide(pazzle);
      this.physics.world.disableBody(pazzle.body);
      this.playerHoldPazzle++;
      const value = `Pazzle: ${this.playerHoldPazzle}`;
      this.playerHoldPazzleText.text = value;
      this.playerHoldPazzleText.setStyle({ color: '#FF0000' }); //red
      console.log(this.playerHoldPazzle);
    }
  }
  handleCollisionBullet(player2, bullet) {
    this.time.delayedCall(2000, this.playerStunFalse, [], this);
    this.player2Stun = true;
    this.player2.setTexture('player2Stun');
    this.player2.setVelocity(0);
  }
  handleCollisionEnemyBullet(player, enemyBullet) {}
  playerStunFalse() {
    this.player2Stun = false;
    this.player2.setTexture('player2');
  }
}
export default mainScene;
