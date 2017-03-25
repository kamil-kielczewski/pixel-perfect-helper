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
        pictureUrl : null,
        editItem: null,
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

    public downloadFile(url) {
        this.loadImgAsBase64(url);
    }

    loadImgAsBase64(url)
    {
        let canvas: any = document.createElement('CANVAS');
        let img = document.createElement('img');
        img.setAttribute('crossorigin', 'anonymous');
        img.src = 'https://crossorigin.me/'+url;

        img.onload = () =>
        {
            setTimeout(()=>{
                canvas.height = img.height;
                canvas.width = img.width;
                let context = canvas.getContext('2d');
                context.drawImage(img,0,0);

                var dataURL = canvas.toDataURL('image/png');
                console.log({img});
                canvas = null;
                this.savePicToStorage('url',dataURL, img.width, img.height)
            },2000);
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
        //let image = e.target.result;
        let index =  this.meta.list.length;
        let counter = Storage.get('layoutsManager.imageCounter');
        let counter = (counter ? counter : 0) + 1;
        console.log(counter);
        Storage.set('layoutsManager.imageCounter', counter);
        let key = 'layoutsManager.image.' + counter;

        Storage.set(key , {
            id : counter,
            key,
            image,
            width,
            height,
            name: name,
        });
        this.dataReload();
    }

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

