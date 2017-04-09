import { Component, OnInit } from '@angular/core';
import { Storage, Url } from '../common';
import { Router } from '@angular/router';
import { LayoutService } from './layout.service';

@Component({
    selector: 'layouts-manager',
    templateUrl: './layoutsManager.html',
    providers: [ LayoutService ],
})
export class LayoutsManagerComponent implements OnInit {
    public meta = {
        loading: false,
        editItemNameMode: null,
        selectedImage: null,
        pictureUrl : null,
        editItem: null,
        list: [],
        freeSpace: 0,

        notification: {
            show: false,
            msg: '',
        }
    };

    constructor(private _router: Router, private _layoutService: LayoutService) {}

    public ngOnInit() {
        this.dataReload();
    }

    public formatedFreeSpace() {
        return Math.ceil(this.meta.freeSpace / 1024) + ' KB';
    }

    public dataReload() {
        this._layoutService.getImagesIdList().subscribe( (ids) => {
            this.meta.list = [];
            this._layoutService.loadPictures(ids).subscribe( (data) => {
                this.meta.list = data.sort( (a, b) => { return b.id - a.id; });
            });

            this._layoutService.getFreeSpace().subscribe( (amount) => {
                this.meta.freeSpace = amount;
            } );
        });
    }

    public downloadFile(url) {
        let name = url;
        try {
            // extract filename rom url (last part without parameters)
            name = /.*\/([^?]+)/.exec(url)[ 1 ];
        } catch (e) { ; }

        this._layoutService.savePictureLink(name, url).subscribe(
            () => { this.dataReload(); },
            (err) => {
                this.meta.notification.show = true;
                this.meta.notification.msg = 'The image url is broken or the server don\'t give' +
                    ' access to cors origin reference. Try download image and upload it here' +
                    ' from local file. You can also provide alternative link to this image by' +
                    ' upload image to different server which allow cors origin e.g' +
                    ' http://imgur.com/ . You can also use some proxy which allow cors origin' +
                    ' - e.g. try this link: https://cors-anywhere.herokuapp.com/' + url ;
        });
    }

    public closeNotofication() {
        this.meta.notification.show = false;
    }

    public loadImgAsBase64(item) {
        this.meta.loading = true;
        this._layoutService.loadImgAsBase64(item.url).subscribe( (image) => {
            item.imgDataURI = image.imgDataURI;
            this.meta.loading = false;
        });
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

        this._layoutService.savePictureFile(name, image, width, height).subscribe( (x) => {
            this.dataReload();
        }, (err) => {
            this.meta.notification.show = true;
            this.meta.notification.msg = 'Problem with upload file: you have not free space in' +
                ' your browser local storage! Remove some old images (without link) to get more' +
                ' space (max 5MB).' ;
        });

    }

    public remove(item) {
        this.meta.selectedImage = null;
        this._layoutService.delPicture(item.id).subscribe( () => {
            this.dataReload();
        });
    }

    public show(item) {
        this._router.navigateByUrl(Url.to('layoutsViewer', {id: item.id}));
    }

    public select(item) {
        if (!item.imgDataURI) {
            this.loadImgAsBase64(item);
        }
        this.meta.selectedImage = item;
    }

    public editItem(item) {
        this.meta.editItem = item;
        this.meta.editItemNameMode = true;
    }

    public saveItem(item) {
        this.meta.editItem = null;
        this._layoutService.updatePicture(item).subscribe( () => { this.dataReload(); });
    }

    public cancelSaveItem(item) {
        this.meta.editItem = null;
    }
}
