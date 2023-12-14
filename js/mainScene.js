import Phaser from 'phaser';
import Pazzle from './pazzle';
import Bullet from './Bullet';
import EnemyBullet from './EnemyBullet';
import PazzleSetter from './PazzleSetter';

class mainScene extends Phaser.Scene {
  /**@type {Phaser.Physics.Arcade.Sprite}*/ //TSの型宣言みたいなやつ
  player;
  playerStun = false;
  playerHoldPazzle = 0;
  AllPlayerHoldPazzle = 0;
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
  /**@type {PazzleSetter} */
  pazzleSetter; //パズルを持っていくところ(コインのとこ)
  constructor() {
    super('mainGame');
  }
  preload() {
    this.load.image('background', 'background/planet.png');
    this.load.image('player', 'character/player1_1.png');
    this.load.image('playerStun', 'character/player1_2.png');
    this.load.image('playerShot', 'character/player1_shot.png');
    this.load.image('player2', 'character/player2.png');
    this.load.image('player2Stun', 'character/player2_2.png');
    this.load.image('pazzle', 'item/item.png');
    this.load.image('bullet', 'character/bullet.png');
    this.load.image('pazzleSetter', 'assets/Items/gold_1.png');
    //表示される分割パズル
    this.load.image('1', 'pazzle_split/1.png');
    this.load.image('2', 'pazzle_split/2.png');
    this.load.image('3', 'pazzle_split/3.png');
    this.load.image('4', 'pazzle_split/4.png');
    this.load.image('5', 'pazzle_split/5.png');
    this.load.image('6', 'pazzle_split/6.png');
    this.load.image('7', 'pazzle_split/7.png');
    this.load.image('8', 'pazzle_split/8.png');
    this.load.image('9', 'pazzle_split/9.png');
    //キー登録
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys('W,A,S,D,E,SPACE'); //keyboardPluginであるaddkeysメソッドを使ってthis.input.keyboard.Keyを追加
  }
  create() {
    //background
    const background = this.add.image(400, 350, 'background').setScale(0.25);
    //player
    this.player = this.physics.add.sprite(360, 500, 'player').setScale(0.7);
    this.player2 = this.physics.add.sprite(360, 0, 'player2').setScale(0.3);
    //pazzle
    this.pazzles = this.physics.add.group({ classType: Pazzle });
    for (let i = 0; i < this.pazzleNum; i++) {
      const x = Phaser.Math.Between(0, 820); //x:0~400の間にrandomで生成
      const y = Phaser.Math.Between(150, 600); //高さもランダム
      /** @type {Phaser.Physics.Arcade.Sprite} */
      const pazzle = this.pazzles.create(x, y, 'pazzle');
      pazzle.scale = 0.5;
      /** @type {Phaser.Physics.Arcade.StaticBody} */
      const body = pazzle.body;
      body.updateFromGameObject();
    }
    //bullet
    //add.groupで弾のプール作成
    this.bullets = this.physics.add.group({ classType: Bullet, maxSize: this.maxBullets, runChildUpdate: true }); //runChildupdateはグループが更新される際、子要素のupdateも呼び出される
    this.enemyBullets = this.physics.add.group({ classType: EnemyBullet, maxSize: this.maxBullets, runChildUpdate: true });

    //countText
    const countText = { color: 'white', fontSize: 24 };
    //setOriginはオブジェクトの中心をきめる
    this.playerHoldPazzleText = this.add.text(this.sys.canvas.width, this.sys.canvas.height, 'Pazzle: 0', countText).setScrollFactor(0).setOrigin(1, 1);
    this.playerHoldPazzleText.setStyle({ color: '#4169e1' });
    //pazzleSetter

    this.pazzleSetter = new PazzleSetter(this, 720, 250, 'pazzleSetter', this.player);

    //collision evt
    this.physics.add.overlap(this.player, this.pazzles, this.handleCollisionPazzle, undefined, this);
    this.physics.add.overlap(this.player2, this.bullets, this.handleCollisionBullet, undefined, this);
    this.physics.add.overlap(this.player, this.enemyBullets, this.handleCollisionEnemyBullet, undefined, this);
    this.physics.add.overlap(this.player, this.pazzleSetter, this.handleCollisionPazzleSetter, undefined, this);
  }
  update(time, delta) {
    if (this.playerStun !== true) {
      //デフォルトの状態(動ける)
      if (this.cursors.left.isDown) {
        this.player.setVelocityX(-200);
      } else if (this.cursors.right.isDown) {
        this.player.setVelocityX(200);
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
        //撃つときのモーション
        this.player.setTexture('playerShot');

        //プールの中に利用可能な弾があれば使う
        bullet.fire(this.player.x, this.player.y);
        this.playerLastFired = time + 100; //一つ目の弾発射時+Xms秒後に２つ目発射
      }
    } else if (this.player.texture.key === 'playerShot' && time > this.playerLastFired) {
      //撃つモーションから通常モーションへ
      this.player.setTexture('player');
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
      this.playerHoldPazzleText.setStyle({ color: '#4169e1' });
      //ピース合計
      this.AllPlayerHoldPazzle++;
    } else if (this.playerHoldPazzle == 3) {
      this.pazzles.killAndHide(pazzle);
      this.physics.world.disableBody(pazzle.body);
      this.playerHoldPazzle++;
      const value = `Pazzle: ${this.playerHoldPazzle}`;
      this.playerHoldPazzleText.text = value;
      this.playerHoldPazzleText.setStyle({ color: '#FF0000' }); //red
      //ピース合計
      this.AllPlayerHoldPazzle++;
    }
  }
  handleCollisionBullet(player2, bullet) {
    //相手に弾が当たった時
    this.time.delayedCall(2000, this.player2StunFalse, [], this);
    this.player2Stun = true;
    this.player2.setTexture('player2Stun');
    this.player2.setVelocity(0);
  }
  handleCollisionEnemyBullet(player, enemyBullet) {
    //自分に弾が当たった時
    this.time.delayedCall(2000, this.playerStunFalse, [], this);
    this.playerStun = true;
    this.player.setTexture('playerStun');
    this.player.setVelocity(0);
  }
  playerStunFalse() {
    this.playerStun = false;
    this.player.setTexture('player');
  }
  player2StunFalse() {
    this.player2Stun = false;
    this.player2.setTexture('player2');
  }
  handleCollisionPazzleSetter(player, pazzleSetter) {
    if (this.AllPlayerHoldPazzle === 9) {
      //9つ集めたらクリア
      this.time.delayedCall(
        3000,
        () => {
          this.scene.start('GameClear');
        },
        [],
        this
      );
    } else {
      this.pazzleSetter.setHoldPazzleNum(this.playerHoldPazzle);
      this.playerHoldPazzle = 0; //この処理らをpazzleSetterとの衝突判定で書く
      const value = `Pazzle: ${this.playerHoldPazzle}`;
      this.playerHoldPazzleText.text = value;
    }
  }
}
export default mainScene;
