class Pixel{
    constructor(state, color){
        this.color = color;
        this.state = state;
        this.circle;
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
    getCircle(){
        return this.circle;
    }
    setCircle(circle){
        this.circle = circle;
    }
}