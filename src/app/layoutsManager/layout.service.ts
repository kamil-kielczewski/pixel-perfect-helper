/**
 * Created by Kamil on 27.03.2017.
 */
import { Injectable } from '@angular/core';
import { Storage, Url } from '../common';
import { Observable } from "rxjs";


//declare var moment: any;

@Injectable()
export class LayoutService {

    constructor() {}

    private keyPrefix = 'Airavana.HtmlCuttingHelper.v1.';

    savePicture(url) {
        // TODO
    }

    savePictureFile(name, imgDataURI, width, height) {
        return this.genObservable( [name, imgDataURI, width, height], (name, imgDataURI, width, height) => {
            let keyCounter = this.imgCounterKey();
            let counter = Storage.get(keyCounter);
            counter = (counter ? counter : 0) + 1;

            Storage.set(keyCounter, counter);
            let key = this.imgKey() + counter;

            Storage.set(key , {
                id : counter,
                key,
                url: null,
                imgDataURI,
                width,
                height,
                name,
            });
        });
    }

    savePictureLink(name, url, width, height) {
        return this.genObservable( [name, url, width, height], (name, url, width, height) => {
            let keyCounter = this.imgCounterKey();
            let counter = Storage.get(keyCounter);
            counter = (counter ? counter : 0) + 1;

            Storage.set(keyCounter, counter);
            let key = this.imgKey() + counter;

            Storage.set(key , {
                id : counter,
                key,
                url: null,
                imgDataURI: null,
                width,
                height,
                name,
            });
        });
    }

    loadPictures(ids) {
        console.log({ids});
        return this.genObservable( [ids], (ids) => {
            if(!ids) return [];
            let key = this.imgKey();
            let result = [];
            for(let id of ids) {
                result.push(Storage.get(key + id));
            }
            return result;
        });
    }

    imgKey() {
        return this.keyPrefix + 'layoutsManager.image.';
    }

    imgCounterKey() {
        return this.keyPrefix + 'layoutsManager.imageCounter';
    }

    loadPicture(imgId) {
        return this.genObservable( [imgId], (imgId) => {
            return Storage.get(this.imgKey() + imgId);
        });
    }

    getImagesIdList() {
        return this.genObservable( [], () => {
            let result = [];
            let keyCounter = this.imgCounterKey();
            for (let key of Storage.getKeys(this.imgKey())) {
                result.push(+/\.(\d+)/g.exec(key)[1]);
                //Storage.get(key);
            }

            return result;
        });
    }

    public getAndIncLayoutViewerCropFileCounter(imgId) {
        return this.genObservable( [imgId], (imgId) => {
            let counterKey = this.keyPrefix + 'layoutsViewer.crop_file_counter.' + imgId ;
            let counter = Storage.get(counterKey);
            if (!counter) { counter = 0; }
            counter++;
            Storage.set(counterKey, counter);
            return counter;
        });
    }

    public saveLayoutViewerSettings(settings) {
        return this.genObservable( [settings], (settings) => {
            let counterKey = this.keyPrefix + 'layoutsViewer.hint.settings';
            Storage.set(counterKey, settings);
        });
    }

    public loadLayoutViewerSettings() {
        return this.genObservable( [], () => {
            let counterKey = this.keyPrefix + 'layoutsViewer.hint.settings';
            return Storage.get(counterKey);
        });
    }


    getTest(y, z) {
        return this.genObservable( [y,z],(y,z) => {
            return y*z;
        });
    }

    genObservable(params, func) {
        return Observable.create((observer) => {
            observer.next(func(...params));
            observer.complete();
            return function () {  } // you can put coda that will execute after subscription
        });
    }

    // getEmployeesPresentNumber() {
    //     return this.http.get(Url.api('employees/presentNumber'))
    //         .map(res => res.json())
    //         .map(data => {
    //             return new PresentNumber(data['number'], data.date);
    //         });
    // }

}
