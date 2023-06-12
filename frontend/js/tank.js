class Tank {
    constructor(x, y, width, height) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
    }
  
    move(direction) {
      if (direction === 'left') {
        this.x -= 10;
      } else if (direction === 'right') {
        this.x += 10;
      }
   }
  }
  