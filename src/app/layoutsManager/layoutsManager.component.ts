import { Component, OnInit } from '@angular/core';
import { Storage, Url } from '../common';
import { Router } from '@angular/router';
import { LayoutService } from "./layout.service";

@Component({
    selector: 'layouts-manager',
    templateUrl: './layoutsManager.html',
    providers: [ LayoutService ],
})
export class LayoutsManagerComponent implements OnInit {
    public meta = {
        editItemNameMode: null,
        selectedImage: null,
        pictureUrl : null,
        editItem: null,
        list: [],
    };

    constructor(private _router: Router, private _layoutService: LayoutService) {}

    public ngOnInit() {
        this.dataReload();
        this._layoutService.getTest(9,8).subscribe( (d) => { console.log('d:',d) });
        this._layoutService.getTest(1,2).subscribe( (d) => { console.log('d:',d) });
    }

    public dataReload() {
        this._layoutService.getImagesIdList().subscribe( (ids) => {
            this.meta.list = [];
            this._layoutService.loadPictures(ids).subscribe( (data) => {
                this.meta.list = data;
            });
        });
    }

    public downloadFile(url) {
        //this.loadImgAsBase64(url);

    }

    public loadImgAsBase64(url) {

        let canvas: any = document.createElement('CANVAS');
        let img = document.createElement('img');
        img.setAttribute('crossorigin', 'anonymous');
        //img.src = 'https://crossorigin.me/' + url;
        img.src = url;

        img.onload = () => {
            setTimeout( () => {
                canvas.height = img.height;
                canvas.width = img.width;
                let context = canvas.getContext('2d');
                context.drawImage(img, 0, 0);

                let dataURL = canvas.toDataURL('image/png');
                console.log({img});
                canvas = null;
                this.savePicToStorage('url', dataURL, img.width, img.height);
            }, 2000);
        };
    }

    public onImport(event) {
        let file: File = event.srcElement.files[ 0 ];
        let myReader: FileReader = new FileReader();
        let body = myReader.result;

        myReader.onload = (e: any) => {
            let i = new Image();
            i.onload = () => {
                this.savePicToStorage(file.name, e.target.result, i.width, i.height);
            };
            i.src = e.target.result;
        };

        myReader.readAsDataURL(file);
    }

    public savePicToStorage(name, image, width, height) {
        // let image = e.target.result;
        this._layoutService.savePictureFile(name, image, width, height).subscribe( () => {
            this.dataReload();
        });

    }

    // public savePicToStorage(name, image, width, height) {
    //     // let image = e.target.result;
    //     let index =  this.meta.list.length;
    //     let counter = Storage.get('layoutsManager.imageCounter');
    //     counter = (counter ? counter : 0) + 1;
    //     console.log(counter);
    //     Storage.set('layoutsManager.imageCounter', counter);
    //     let key = 'layoutsManager.image.' + counter;
    //
    //     Storage.set(key , {
    //         id : counter,
    //         key,
    //         image,
    //         width,
    //         height,
    //         name,
    //     });
    //     this.dataReload();
    // }

    public remove(item) {
        this.meta.selectedImage = null;
        Storage.remove(item.key);
        this.dataReload();
    }

    public show(item) {
        this._router.navigateByUrl(Url.to('layoutsViewer', {id: item.id}));
    }

    public select(item) {
        this.meta.selectedImage = item;
    }

    public editItem(item) {
        this.meta.editItem = item;
        this.meta.editItemNameMode = true;
    }

    public saveItem(item) {
        this.meta.editItem = null;
        Storage.set(item.key, item);
        this.dataReload();
    }

    public cancelSaveItem(item) {
        this.meta.editItem = null;
    }
}
