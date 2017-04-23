import { Component, OnInit } from '@angular/core';
import { Storage, Url } from '../common';
import { Router } from '@angular/router';
import { LayoutService } from './layout.service';
import { Lang } from "../common/lang/lang";

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
                this.meta.notification.msg = this.tr('layoutManager.err.linkProblem', { url });
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
            this.meta.notification.msg = this.tr('layoutManager.err.noFreeSpace');
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

    public tr(key, values = null) {
        return Lang.t(key, values);
    }

    public currentLang() {
        return Lang.getCurrentLang();
    }

    public switchLang(lang) {
        Lang.switchLang(lang)
    }
}
