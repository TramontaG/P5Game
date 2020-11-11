export function drawArrow(base, vec, myColor, scale, arrowSize = 7) {
    push();
    stroke(myColor);
    strokeWeight(3);
    fill(myColor);
    translate(base.x, base.y);
    line(0, 0, vec.x * scale, vec.y * scale);
    rotate(vec.heading());
    translate(vec.mag() * scale - arrowSize, 0);
    triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
    pop();
}