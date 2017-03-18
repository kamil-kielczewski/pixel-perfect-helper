/**
 * 	Klasa zawiera różnego rodzaju drobne narzędzia przyatne w pracy
 */
export class Storage {

    static set(key:string, value:any) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    static get(key:string) {
        if(Storage.has(key)) return JSON.parse(window.localStorage[key]);
        return null;
    }

    static has(key:string) {
        if(window.localStorage[key]) return true;
        return false;
    }

    static remove(key:string) {
        Storage.set(key,JSON.stringify(null)); // only for IE11 (problems with sessionStorage.removeItem)
        window.localStorage.removeItem(key);
    }


    static getKeys(prefix = null) {
        let result = [];
        for (let key:string in window.localStorage){

            if(prefix === null || key.lastIndexOf(prefix,0) === 0) {
                result.push(key);
            }

            console.log(key);
        }
        return result;
    }

}
