import Phaser from 'phaser';
import Pazzle from './pazzle';
import Bullet from './Bullet';
import EnemyBullet from './EnemyBullet';
class mainScene extends Phaser.Scene {
  /**@type {Phaser.Physics.Arcade.Sprite}*/ //TSの型宣言みたいなやつ
  player;
  playerStun = false;
  playerHoldPazzle = 0;
  playerHoldPazzleText;
  playerLastFired = 0;
  /**@type {Phaser.Physics.Arcade.Sprite}*/ //TSの型宣言みたいなやつ
  player2;
  enemyLastFired = 0;
  /**@type {Phaser.Types.Input.Keyboard.CursorKeys} */
  cursors;
  /**@type {Phaser.Input.Keyboard.Key} */
  keys;
  /**@type {Phaser.Physics.Arcade.Group} */
  pazzles;
  /**@type {Phaser.Physics.Arcade.Image} */
  bullets;
  /**@type {Phaser.Physics.Arcade.Image} */
  enemyBullets;
  constructor() {
    super('mainGame');
  }
  preload() {
    this.load.image('background', 'assets/Background/bg_layer1.png');
    this.load.image('player', 'assets/Enemies/flyMan_fly.png');
    this.load.image('player2', 'assets/Enemies/wingMan1.png');
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
    for (let i = 0; i < 5; i++) {
      const x = Phaser.Math.Between(0, 720); //x:0~400の間にrandomで生成
      const y = 100 * i; //高さもランダム
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const pazzle = this.pazzles.create(x, y, 'pazzle');
      pazzle.scale = 0.8;
      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = pazzle.body;
      body.updateFromGameObject();
    }
    //bullet
    //add.groupで弾のプール作成
    this.bullets = this.physics.add.group({ classType: Bullet, maxSize: 5, runChildUpdate: true }); //runChildupdateはグループが更新される際、子要素のupdateも呼び出される
    this.enemyBullets = this.physics.add.group({ classType: EnemyBullet, maxSize: 5, runChildUpdate: true });
    //collision evt
    this.physics.add.overlap(this.player, this.pazzles, this.handleCollisionPazzle, undefined, this);

    //countText
    const countText = { color: 'white', fontSize: 24 };
    this.playerHoldPazzleText = this.add.text(80, 0, 'Player: 0', countText).setScrollFactor(0).setOrigin(0.5, 0);
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

    //bullet
    if (this.keys.SPACE.isDown && time > this.playerLastFired) {
      const bullet = this.bullets.get(); //弾をプールから取得
      bullet.getPlayer(this.player2); //相手キャラクターをクラスへおくる
      if (bullet) {
        //プールの中に利用可能な弾があれば使う
        bullet.fire(this.player.x, this.player.y);
        this.playerLastFired = time + 1000; //一つ目の弾発射時+Xms秒後に２つ目発射
      }
    }
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

    //enemybullet
    if (this.keys.E.isDown && time > this.enemyLastFired) {
      const bullet = this.enemyBullets.get(); //弾をプールから取得
      bullet.getPlayer(this.player); //相手キャラクターをクラスへおくる
      if (bullet) {
        //プールの中に利用可能な弾があれば使う
        bullet.fire(this.player2.x, this.player2.y);
        this.enemyLastFired = time + 1000; //一つ目の弾発射時+Xms秒後に２つ目発射
      }
    }
  }

  handleCollisionPazzle(player, pazzle) {
    //取得イベント
    if (this.playerHoldPazzle < 4) {
      //持てるピースは4個まで
      this.pazzles.killAndHide(pazzle);
      this.physics.world.disableBody(pazzle.body);
      this.playerHoldPazzle++;
      const value = `Player: ${this.playerHoldPazzle}`;
      this.playerHoldPazzleText.text = value;
      console.log(this.playerHoldPazzle);
    }
  }
}
export default mainScene;
