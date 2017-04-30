// var Polyglot = require('../../../../node_modules/node-polyglot/build/polyglot.min.js');
import Polyglot from '../../../../node_modules/node-polyglot/build/polyglot.min.js';

import { en } from './en';
import { pl } from './pl';

export class Lang {

    public static t(key: string, values?: any) {
        let self = Lang.getInstance();
        let langKey = Lang.getCurrentLang() + '.' + key;
        // self.polyglot.locale('en');
        if (self.polyglot.has(langKey)) { return self.polyglot.t(langKey, values); }

        return self.polyglot.t(Lang.emergencyLang + '.' + key, values);
    }

    public static switchLang(lang = null) {
        if (!lang) {
            Lang.getInstance().currentLang = Lang.getUserLang();
        } else {
            Lang.getInstance().currentLang = lang;
        }
    }

    public static getUserLang() {
        return navigator.language || navigator.userLanguage;
    }

    public static getCurrentLang() {

        if (!Lang.getInstance().currentLang) {
            Lang.switchLang();
        }

        return Lang.instance.currentLang;
    }

    private static instance = null;
    private static emergencyLang = 'en';
    private static currentLang = null;

    private static getInstance() {
        if (Lang.instance == null) { Lang.instance = new Lang(); }
        return Lang.instance;
    }

    public polyglot: any;

    constructor() {
        this.polyglot = new Polyglot({ locale: 'en' });
        this.polyglot.extend({
            en,  // https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes
            pl,
        });
        if (Lang.instance) { return; }
        Lang.instance = this;
        // default lang - if commented out then browser language is set as default
        // Lang.switchLang('pl');
    }
}
