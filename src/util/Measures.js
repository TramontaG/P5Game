export default {
    Window: {
        center:     () => new p5.Vector(windowWidth / 2, windowHeight / 2),
        topRight:   () => new p5.Vector(windowWidth, windowHeight),
        topLeft:    () => new p5.Vector(0, 0),
        bottomRight:() => new p5.Vector(windowWidth, windowHeight),
        bottomLeft: () => new p5.Vector(0, windowHeight),
    }
} 