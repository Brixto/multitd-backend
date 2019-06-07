var THREE = require('three');
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

    static moveTowards2(current, destination, speed, pointPrecision = 2) {
        // console.log(current, destination);
        let dx = destination.x - current.x;
        let dy = destination.y - current.y;

        console.log(dx, dy);

        let direction_length = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
        console.log(direction_length);
        let xn = dx / direction_length;
        let yn = dy / direction_length;
        console.log(xn);
        current.x += xn * speed;
        current.y += yn * speed;

        console.log(current.x, current.y);
    }

    static moveTowards3(current, destination, speed) {
        //console.log(new THREE.Vector2(2, 2).multiplyScalar(2));
        // var current = new THREE.Vector2(current.x, current.y);
        // var destination = new THREE.Vector2(destination.x, destination.y);
        var current = new THREE.Vector2(5, 5);
        var destination = new THREE.Vector2(7, 9);

        var directionNormalized = destination.clone().sub(current);

        console.log(current.add(directionNormalized.multiplyScalar(0.01)));
    }
}

module.exports = Vector2;

// function lerp(start, end, amt) {
//     return (1 - amt) * start + amt * end
// }
