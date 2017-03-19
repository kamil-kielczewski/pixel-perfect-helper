import { Component, OnInit } from '@angular/core';
import { Storage, Url } from '../common';
import { Router } from '@angular/router';

@Component({
    selector: 'layouts-manager',
    templateUrl: './layoutsManager.html'
})
export class LayoutsManagerComponent implements OnInit {
    public meta = {
        selectedImage: null,
        list: []
    };

    constructor(private _router: Router) {}

    public ngOnInit() {
        this.dataReload();
        console.log(this.meta.list);
    }

    public dataReload() {
        this.meta.list = [];
        for (let key of Storage.getKeys('layoutsManager.image.')) {
            this.meta.list.push(Storage.get(key));
        }
    }

    public onImport(event) {
        let file: File = event.srcElement.files[ 0 ];
        let myReader: FileReader = new FileReader();
        let body = myReader.result;

        myReader.onload = (e: any) => {
            let image = e.target.result;
            let index =  this.meta.list.length;
            let key = 'layoutsManager.image.' + index;

            // detect image width and height
            let i = new Image();
            i.onload = () => {
                Storage.set(key , {
                    key,
                    image,
                    width: i.width,
                    height: i.height,
                    name: file.name
                });
                this.dataReload();
            };
            i.src = image;
        };

        myReader.readAsDataURL(file);
    }

    public remove(item) {
        this.meta.selectedImage = null;
        Storage.remove(item.key);
        this.dataReload();
    }

    public show(item) {
        this._router.navigateByUrl(Url.to('layoutsViewer', {key: item.key}));
    }

    public select(item) {
        this.meta.selectedImage = item;
    }
}
