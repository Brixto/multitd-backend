class Vector2 {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    static moveTowards(current, destination, speed, pointPrecision = 2) {
        let dx = (destination.x - current.x);
        let dy = (destination.y - current.y);

        let angle = Math.atan2(dy, dx);
        let velX = Math.cos(angle) * speed;
        let velY = Math.sin(angle) * speed;

        // check if overshooting target
        if (dx * dx + dy * dy < speed * speed) {
            velX = dx;
            velY = dy;
        }
        current.x = parseFloat((current.x + velX).toFixed(pointPrecision))
        current.y = parseFloat((current.y + velY).toFixed(pointPrecision))
    }
}

module.exports = Vector2;

// function lerp(start, end, amt) {
//     return (1 - amt) * start + amt * end
// }
