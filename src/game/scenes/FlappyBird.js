import { Scene } from "phaser";
import Phaser from "phaser";

export class FlappyBird extends Scene {
    constructor() {
        super("FlappyBird");
    }
    // Load tài nguyên trước khi bắt đầu game
    preload() {
        this.load.image("player", "assets/player.png");
        this.load.image("pipe", "assets/pipe.png");
    }
    create() {
        // Sprite
        this.player = this.physics.add
            .sprite(100, 300, "player")
            .setGravityY(-400);
        this.pipes = this.physics.add.group();
        this.player.setDisplaySize(50, 50);
        // Tạo cột ống
        this.time.addEvent({
            delay: 1500,
            callback: this.createPipe,
            callbackScope: this,
            loop: true,
        });
    }
    update() {
        // Kiểm tra va chạm giữa player và ống
        this.physics.overlap(
            this.player,
            this.pipes,
            this.changeScene,
            null,
            this
        );

        // Nếu người chơi vượt qua ống thì tăng điểm
        this.pipes.getChildren().forEach((pipe) => {
            if (
                pipe.getBounds().right < this.player.getBounds().left &&
                !pipe.passed
            ) {
                pipe.passed = true;
            }
        });
        const config = this.sys.game.config;
        // Kiểm tra nếu player chạm đất hoặc màn hình
        if (this.player.y > config.height || this.player.y < 0) {
            this.changeScene();
        }
    }
    shutdown() {
        console.log("destroy scene");
        this.player.destroy();
        this.pipes.destroy();
    }
    createPipe() {
        const config = this.sys.game.config;
        const pipe = this.pipes.create(
            config.width,
            Phaser.Math.Between(100, 400),
            "pipe"
        );
        pipe.setVelocityX(-200);
    }
    changeScene() {
        this.scene.start("GameOver");
    }
}
