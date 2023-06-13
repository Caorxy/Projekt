class BulletX extends Bullet {
    constructor(x, y) {
        super(x,y);
    }

    moveDown() {
        this.y = this.y + 8;
        this.visible = true;
        if (this.y >= 800) {
          this.kill();
        }
      }
}