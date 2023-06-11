class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.visible = false;
    this.active = false;
  }

  moveUp() {
    this.y = this.y - 12;
    this.visible = true;
    if (this.y <= 0) {
      this.kill();
    }
  }

  start(x, y) {
    this.visible = true;
    // Added this line to set the active property to true
    this.active = true;
    this.x = x;
    this.y = y;
  }

  kill() {
    this.visible = false;
    this.active = false;
  }
}
