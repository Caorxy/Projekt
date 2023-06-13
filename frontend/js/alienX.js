class AlienX extends Alien {
    constructor(x, y){
        super(x, y);
        this.shotInterval = 200;
        this.lastShotTimeX = Date.now();
    }
}