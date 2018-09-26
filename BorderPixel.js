class BorderPixel{
    constructor(x, y, state, color){
        this.color = color;
        this.state = state;
        this.x = x;
        this.y = y;
    }
    getState(){
        return this.state
    }
    setState(state){
        this.state = state;
    }
    getColor(){
        return this.color;
    }
    setColor(color){
        this.color = color;
    }
    getY(){
        return y;
    }
    getX(){
        return x;
    }
}