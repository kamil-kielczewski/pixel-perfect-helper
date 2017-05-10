/**
 * 	Klasa zawiera różnego rodzaju drobne narzędzia przyatne w pracy
 */

declare function unescape(s: string): string;

export class Storage {

    public static set(key: string, value: any) {
        //noinspection TypeScriptUnresolvedFunction
        window.localStorage.setItem(key, JSON.stringify(value));
    }

    public static get(key: string) {
        if (Storage.has(key)) { return JSON.parse(window.localStorage[key]); }
        return null;
    }

    public static getSize() {
        return unescape(encodeURIComponent(JSON.stringify(localStorage))).length;
    }

    public static has(key: string) {
        return !!window.localStorage[ key ];
    }

    public static remove(key: string) {
        // only for IE11 (problems with sessionStorage.removeItem)
        Storage.set(key, JSON.stringify(null));
        //noinspection TypeScriptUnresolvedFunction
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
