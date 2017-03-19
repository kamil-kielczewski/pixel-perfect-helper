/**
 * 	Klasa zawiera różnego rodzaju drobne narzędzia przyatne w pracy
 */
export class Storage {

    public static set(key: string, value: any) {
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    public static get(key: string) {
        if (Storage.has(key)) { return JSON.parse(window.localStorage[key]); }
        return null;
    }

    public static has(key: string) {
        return !!window.localStorage[ key ];
    }

    public static remove(key: string) {
        // only for IE11 (problems with sessionStorage.removeItem)
        Storage.set(key, JSON.stringify(null));
        window.localStorage.removeItem(key);
    }

    public static getKeys(prefix = null) {
        let result = [];
        for (let key in window.localStorage) {

            if (prefix === null || key.lastIndexOf(prefix, 0) === 0) {
                result.push(key);
            }

        }
        return result;
    }

}
