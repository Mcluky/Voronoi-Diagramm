class Pixel{
    constructor(state, color){
        this.color = color;
        this.state = state;
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
}