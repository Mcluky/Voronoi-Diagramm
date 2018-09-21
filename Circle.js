class Circle{
    constructor(centerX, centerY, radius, color){
        this.centerX = centerX;
        this.centerY = centerY;
        this.radius = radius;
        this.color = color;
        this.surrounded = false;
    }
    getCenterX(){
        return this.centerX;
    }
    getCenterY(){
        return this.centerY;
    }
    getSurrounded(){
        return this.surrounded;
    }
    setSurrounded(surrounded){
        this.surrounded = surrounded;
    }
    getColor(){
        return this.color;
    }
    getRadius(){
        return this.radius;
    }
    setRadius(radius){
        this.radius = radius;
    }
}