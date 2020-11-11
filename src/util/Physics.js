export default class Physics {
    static collideSquareObjects(source, target, verticalCollision){
        if (source.velocity.mag() < 0.1 && source.velocity.mag() < 0.1) return;
        const sourceVelocity = this.getCollisionVelocity(source, target, verticalCollision);
        const targetVelocity = this.getCollisionVelocity(target, source, verticalCollision);
        source.velocity = sourceVelocity;
        target.velocity = targetVelocity;
    }

    static getCollisionVelocity(source, target, verticalCollision){
        const sumOfMasses = source.mass + target.mass

		const sourceFirstFactor = (source.mass - target.mass) / sumOfMasses;
        const sourceSecondFactor = (2 * target.mass) / sumOfMasses;

        if (verticalCollision) {
			return new p5.Vector(
                source.velocity.x,
                source.velocity.y * sourceFirstFactor + target.velocity.y * sourceSecondFactor,
            );
		}
		else {
			return new p5.Vector(
                source.velocity.x * sourceFirstFactor + target.velocity.x * sourceSecondFactor,
                source.velocity.y
            );
		}
    }

    static collideCircularObjects(source, target){
        
    }
    
}