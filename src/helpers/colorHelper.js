class colorHelper{
	static colorStringWithOpacity(color, opacity){
		const newColor = color.match(/\d\d\d*/g);
		if (newColor.length == 3 || newColor.length == 1) newColor.push(opacity);
		const newColorArgs = newColor.map(colorValue => parseInt(colorValue));
		return color(...newColorArgs);
	}

	static toColorObject(color, opacity){
		console.log('toColorObject = ', color, opacity);
		if (typeof(color) == 'string' && typeof(opacity) == 'number') return this.colorStringWithOpacity(color, opacity);
		else return color(color, opacity);
	}
}

export default colorHelper;