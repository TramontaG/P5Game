import hitbox from './../parts/hitbox';
import Hitboxes from './../parts/hitbox';
import Physics from './../util/Physics';

export default class ColisionHandler {
    static checkCollision(source, target){
       for (let sourceHitbox of source.hitboxes){
            for (let targetHitbox of target.hitboxes){
                if (sourceHitbox instanceof Hitboxes.Square || targetHitbox instanceof Hitboxes.Square){
                    const sourceMargins = this.getSquareMargins(source, sourceHitbox);
                    const targetMargins = this.getSquareMargins(target, targetHitbox);
                    if (this.checkSquareCollision(sourceMargins, targetMargins)){
                        const angle = p5.Vector.sub(source.position, target.position).heading();
                        const angleDeg = (angle * 180) / Math.PI;

                        const verticalCollision = Math.floor((angleDeg - 45) / 90) % 2 == 0;
                        if (!source.static) {
                            this.preventSquareClipping(source, sourceHitbox, target, targetHitbox, verticalCollision);
                        }
                        Physics.collideSquareObjects(source, target, verticalCollision);
                    }
                }
                if (sourceHitbox instanceof Hitboxes.Circle && targetHitbox instanceof Hitboxes.Circle){
                    if(this.checkCircularCollision(sourceHitbox, source, targetHitbox, target)){
                        Physics.collideCircularObjects(source, target);
                    }
                }

            }
        }
    }

    static checkCircularCollision(sourceHitbox, source, targetHitbox, target){
        const sourceHitboxPosition = source.position.copy().add(new p5.Vector(sourceHitbox.x, sourceHitbox.y));
        const targetHitboxPosition = target.position.copy().add(new p5.Vector(targetHitbox.x, targetHitbox.y));
        const distance = p5.Vector.sub(sourceHitboxPosition, targetHitboxPosition).mag();
        return (distance <= (sourceHitbox.radius + targetHitbox.radius));
    }


    static getSquareMargins = (gameObject, hitbox) => {
        return {
            rightMargin: 	gameObject.position.x + hitbox.xOffset + hitbox.width / 2 + gameObject.velocity.x,
            leftMargin: 	gameObject.position.x - hitbox.xOffset - hitbox.width / 2 + gameObject.velocity.x,
            bottomMargin:	gameObject.position.y + hitbox.yOffset + hitbox.height / 2 + gameObject.velocity.y,
            topMargin:		gameObject.position.y - hitbox.yOffset - hitbox.height / 2 + + gameObject.velocity.y
        }
    }

    static checkSquareCollision = (hb1, hb2) => {
        return (hb1.rightMargin  >= hb2.leftMargin && hb1.leftMargin <= hb2.rightMargin &&
                hb1.bottomMargin >= hb2.topMargin  && hb1.topMargin  <= hb2.bottomMargin
            )
    }

    static preventSquareClipping(source, sourceHitbox, target, targetHitbox, verticalCollision){
        if (!verticalCollision){
            const overlappingDistance = source.position.x < target.position.x ? (
                (target.position.x - targetHitbox.width / 2) -
                (source.position.x + sourceHitbox.width / 2)  
            ) : (
                (target.position.x + targetHitbox.width / 2) -
                (source.position.x - sourceHitbox.width / 2)                 
            )
            source.position.x += overlappingDistance / 2;
        } else {
            const overlappingDistance = source.position.y < target.position.y ? (
                (target.position.y - targetHitbox.height / 2) -
                (source.position.y + sourceHitbox.height / 2)  
            ) : (
                (target.position.y + targetHitbox.height / 2) -
                (source.position.y - sourceHitbox.height / 2)                 
            )
            if (source.position.y < target.position.y){
                source.position.y += overlappingDistance * 1.2;
                if (source.velocity.y < 0.35 && target.velocity.y < 0.35){
                    source.velocity.y = 0;
                    target.velocity.y = 0;
                } else {
                    if (source.collisionHandler.hasOwnProperty(target.tag)) source.collisionHandler[target.tag](target);
                    if (source.collisionHandler.hasOwnProperty('any'))      source.collisionHandler.any(target);
                }
            }
        }
    }
}