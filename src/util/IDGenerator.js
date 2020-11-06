export default class IDGenerator {
    static getUniqueID(digits){
        let id = '';
        for (let i = 0; i < digits; i++){
            id += String.fromCharCode(
                Math.round(
                    Math.random() * 185 ^
                    Math.random() * 263 
                ) % 74 + 44
            ) 
        }
        return id;
    }
}