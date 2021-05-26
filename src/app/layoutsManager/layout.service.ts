/**
 * Created by Kamil on 27.03.2017.
 */
import { Injectable } from '@angular/core';
import { Storage } from '../common/storage';

import { Observable } from 'rxjs';

// declare var moment: any;z

@Injectable()
export class LayoutService {
  private keyPrefix = 'Airavana.HtmlCuttingHelper.v1.';

  constructor() {}

  public loadPictures(ids) {
    return this.genObservable(() => {
      if (!ids) {
        return [];
      }
      let key = this.imgKey();
      let result = [];
      for (let id of ids) {
        result.push(Storage.get(key + id));
      }
      return result;
    });
  }

  public getFreeSpace() {
    return this.genObservable(() => {
      return 1024 * 1024 * 5 - Storage.getSize();
    });
  }

  public updatePicture(picture) {
    return this.genObservable(() => {
      let tmp = picture.imgDataURI;

      if (picture.urlOnly) {
        // case when we nat not save picture data
        picture.imgDataURI = null;
      }

      Storage.set(picture.key, picture);

      picture.imgDataURI = tmp;
    });
  }

  public delPicture(imgId) {
    return this.genObservable(() => {
      Storage.remove(this.imgKey() + imgId);
      let counterKey =
        this.keyPrefix + 'layoutsViewer.crop_file_counter.' + imgId;
      Storage.remove(counterKey);
    });
  }

  public imgKey() {
    return this.keyPrefix + 'layoutsManager.image.';
  }

  public imgCounterKey() {
    return this.keyPrefix + 'layoutsManager.imageCounter';
  }

  public loadPicture(imgId) {
    return this.genObservable(() => {
      return Storage.get(this.imgKey() + imgId);
    });
  }

  public getImagesIdList() {
    return this.genObservable(() => {
      let result = [];

      for (let key of Storage.getKeys(this.imgKey())) {
        result.push(+/\.(\d+)/g.exec(key)[1]);
      }

      return result;
    });
  }

  public getAndIncLayoutViewerCropFileCounter(imgId) {
    return this.genObservable(() => {
      let counterKey =
        this.keyPrefix + 'layoutsViewer.crop_file_counter.' + imgId;
      let counter = Storage.get(counterKey);
      if (!counter) {
        counter = 0;
      }
      counter++;
      Storage.set(counterKey, counter);
      return counter;
    });
  }

  public saveLayoutViewerSettings(settings) {
    return this.genObservable(() => {
      let counterKey = this.keyPrefix + 'layoutsViewer.hint.settings';
      Storage.set(counterKey, settings);
    });
  }

  public loadLayoutViewerSettings() {
    return this.genObservable(() => {
      let counterKey = this.keyPrefix + 'layoutsViewer.hint.settings';
      return Storage.get(counterKey);
    });
  }

  public saveLayoutManagerSettings(settings) {
    return this.genObservable(() => {
      let counterKey = this.keyPrefix + 'layoutsManager.settings';
      Storage.set(counterKey, settings);
    });
  }

  public loadLayoutManagerSettings() {
    return this.genObservable(() => {
      let counterKey = this.keyPrefix + 'layoutsManager.settings';
      return Storage.get(counterKey);
    });
  }

  public loadImgAsBase64(link) {
    return Observable.create((observer) => {
      let canvas: any = document.createElement('CANVAS');
      let img = document.createElement('img');
      img.setAttribute('crossorigin', 'anonymous');
      img.src = link;

      img.onload = () => {
        setTimeout(() => {
          let width = img.width;
          let height = img.height;
          canvas.height = height;
          canvas.width = width;
          let context = canvas.getContext('2d');
          context.drawImage(img, 0, 0);

          let imgDataURI = canvas.toDataURL('image/png');
          canvas = null;
          img = null;

          observer.next({ imgDataURI, width, height });
          observer.complete();
        }, 1);
      };

      img.onerror = (err) => {
        observer.error(err);
      };

      return () => {}; // you can put coda that will execute after subscription
    });
  }

  public savePictureLink(name, url) {
    return Observable.create((observer) => {
      this.loadImgAsBase64(url).subscribe(
        (image) => {
          let keyCounter = this.imgCounterKey();
          let counter = Storage.get(keyCounter);
          counter = (counter ? counter : 0) + 1;

          Storage.set(keyCounter, counter);
          let key = this.imgKey() + counter;

          Storage.set(key, {
            id: counter,
            key,
            url,
            imgDataURI: null,
            width: image.width,
            height: image.height,
            name,
            urlOnly: true, // not save imgDataURI
          });

          observer.next();
          observer.complete();
        },
        (err) => {
          observer.error(err);
        }
      );
    });
  }

  public savePictureFile(name, imgDataURI, width, height) {
    return Observable.create((observer) => {
      let keyCounter = this.imgCounterKey();
      let counter = Storage.get(keyCounter);
      counter = (counter ? counter : 0) + 1;

      try {
        Storage.set(keyCounter, counter);
        let key = this.imgKey() + counter;

        Storage.set(key, {
          id: counter,
          key,
          url: null,
          imgDataURI,
          width,
          height,
          name,
          urlOnly: false, // not save imgDataURI
        });
        observer.next();
        observer.complete();
      } catch (err) {
        observer.error(err);
      }
    });
  }

  public genObservable(func) {
    return Observable.create((observer) => {
      observer.next(func());
      observer.complete();
      return () => {}; // you can put coda that will execute after subscription
    });
  }
}
