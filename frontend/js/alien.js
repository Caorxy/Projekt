class Alien {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.width = 40; // Add this
      this.height = 35; // Add this
      this.alive = true;
    }
  
    kill() {
      this.alive = false;
    }

    move(direction) {
        if (direction === 'right') {
          this.x += 4;
        } else if (direction === 'left') {
          this.x -= 4;
        } else if (direction === 'down') {
          this.y += 30;
        }
      }
  }
  