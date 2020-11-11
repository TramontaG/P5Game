export default class Physics {
    static collideSquareObjects(source, target, verticalCollision){
        if (source.velocity.mag() < 0.1 && source.velocity.mag() < 0.1) return;
        const sourceVelocity = this.getCollisionVelocity(source, target, verticalCollision);
        const targetVelocity = this.getCollisionVelocity(target, source, verticalCollision);

        source.velocity = (!source.static && sourceVelocity.mag() > 0) ? 
            sourceVelocity : 
            new p5.Vector(0,0);
        target.velocity = (!target.static && targetVelocity.mag() > 0) ? 
            targetVelocity : 
            new p5.Vector(0,0);
    }

    static getCollisionVelocity(source, target, verticalCollision){
        const sumOfMasses = source.mass + target.mass

		const sourceFirstFactor = (source.mass - target.mass) / sumOfMasses;
        const sourceSecondFactor = (2 * target.mass) / sumOfMasses;

        if (verticalCollision) {
			return new p5.Vector(
                source.velocity.x,
                source.velocity.y * sourceFirstFactor + target.velocity.y * sourceSecondFactor * source.bounceCoeficient,
            );
		}
		else {
			return new p5.Vector(
                source.velocity.x * sourceFirstFactor + target.velocity.x * sourceSecondFactor * source.bounceCoeficient,
                source.velocity.y
            );
		}
    }

    static collideCircularObjects(source, target){
        
    }
    
}