import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '../common';
import { LayoutService } from '../layoutsManager/layout.service';

// TODO color picker http://stackoverflow.com/...
//   .../questions/8751020/how-to-get-a-pixels-x-y-coordinate-color-from-an-image

@Component({
    selector: 'layouts-viewer',
    templateUrl: './layoutsViewer.html',
    providers: [ LayoutService ],
})
export class LayoutsViewerComponent implements OnInit {
    public imgItem = null;

    public meta = {
        boxEditor: null,
        hintBox: null,

        top: 0,
        left: 0,
        windowHeight: 0,
        windowWidth: 0,
        pixelScroll: false,
        verticalScroll: false,
        pristineVertical: true,
        mouseX: 0,
        mouseY: 0,
        canvas: null,
    };

    constructor(private _route: ActivatedRoute, private _layoutService: LayoutService) {}

    public ngOnInit() {
        this._layoutService.loadLayoutViewerSettings().subscribe( () => {
            //TODO Zapis + odczyt ustawień
        });

        this._route.params.subscribe( (params) => {
            this._layoutService.loadPicture(params['id']).subscribe( (imgItem) => {
                this.imgItem = imgItem;
                if (!this.imgItem.imgDataURI) {
                    this._layoutService.loadImgAsBase64(this.imgItem.url).subscribe( (image) => {
                        this.imgItem.imgDataURI = image.imgDataURI;
                        this.resizeWindow(null);
                        setTimeout( () => { this.initCanvas(); }, 1);
                    });
                } else {
                    this.resizeWindow(null);
                    setTimeout( () => { this.initCanvas(); }, 1);
                }
            } );
        });

    }

    public bindBox(boxEditor) { this.meta.boxEditor = boxEditor; }
    public bindHintBox(hintBox) { this.meta.hintBox = hintBox; }

    public cutBoxAndDownload() {

        if (!this.meta.boxEditor.getBox().isVisible) { return; }

        let canvas: any = document.createElement('canvas');
        let sizeX = this.meta.boxEditor.getBox().right - this.meta.boxEditor.getBox().left;
        let sizeY = this.meta.boxEditor.getBox().bottom - this.meta.boxEditor.getBox().top;
        canvas.width = sizeX;
        canvas.height = sizeY;

        let pixelData = this.meta.canvas.getContext('2d').getImageData(
            this.meta.boxEditor.getBox().left - this.meta.left,
            this.meta.boxEditor.getBox().top - this.meta.top,
            sizeX,
            sizeY
        );

        // copy 1:1 pixels under mouse to canvas
        canvas.getContext('2d').putImageData(pixelData, 0, 0);

        this._layoutService.getAndIncLayoutViewerCropFileCounter(this.imgItem.id).
            subscribe( (counter) => {
                let filename = this.imgItem.name + '_' + counter + '.png';
                let imgDataUrl = canvas.toDataURL('image/png').replace(/^data:image\/[^;]/,
                    'data:application/octet-stream'
                );

                this.meta.hintBox.saveImg(filename, imgDataUrl);
            } );
    }

    public showHintBox() {
        this.meta.hintBox.open();
    }

    public initCanvas() {
        let img: any = document.getElementById('layoutImage');
        let canvas: any = document.createElement('canvas');

        canvas.width = img.width;
        canvas.height = img.height;

        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        this.meta.canvas = canvas;
    }

    public updateMousePosition(event) {
        this.meta.mouseX = event.pageX;
        this.meta.mouseY = event.pageY;
        this.zoomPixel(event.pageX, event.pageY);
        this.meta.hintBox.moveHint(event);
    }

    public zoomPixel(x, y) {
        this.meta.hintBox.zoomPixel(x, y);
    }

    @HostListener('document:keydown', ['$event'])
    @HostListener('document:keyup', ['$event'])
    public handleKeyboardEvents(event: KeyboardEvent) {

        if (event.key === 'Alt') {
            this.meta.pixelScroll = event.type === 'keydown';
            event.preventDefault();
        }

        if (event.key === 'Shift') {
            this.meta.verticalScroll = event.type === 'keydown';
            event.preventDefault();
        }

        if (event.type === 'keyup') {
            if (event.key === 'ArrowRight') {
                this.arrowsManipulate(1, 0);
                event.preventDefault();
            }

            if (event.key === 'ArrowLeft') {
                this.arrowsManipulate(-1, 0);
                event.preventDefault();
            }

            if (event.key === 'ArrowUp') {
                this.arrowsManipulate(0, -1);
                event.preventDefault();
            }

            if (event.key === 'ArrowDown') {
                this.arrowsManipulate(0, 1);
                event.preventDefault();
            }

            if (event.key === ' ') { // space
                this.selectColor();
                event.preventDefault();
            }

            if (event.key === 's' || event.key === 'S') {
                if (!this.meta.boxEditor.getBox().isVisible) { return; }
                this.meta.hintBox.saveImg();
                event.preventDefault();
            }

            if (event.key === 'i' || event.key === 'I') {
                this.meta.hintBox.toggleOpen();
            }
        }
    }

    public selectColor(event = null) {
        if (event) { this.updateMousePosition(event); }
        this.meta.hintBox.selectColor();
    }

    public handleMouseScrollEvents(event: WheelEvent) {
        if (this.meta.verticalScroll) {

            this.meta.pristineVertical = false;
            this.meta.left -= this.meta.pixelScroll
                ? this.sign(event.deltaX) : Math.round(event.deltaX);
            if (this.meta.left < -this.imgItem.width) { this.meta.left = -this.imgItem.width; }
            if (this.meta.left > this.meta.windowWidth) { this.meta.left = this.meta.windowWidth; }

        } else {

            this.meta.top -= this.meta.pixelScroll
                ? this.sign(event.deltaY) : Math.round(event.deltaY);
            let sub = this.imgItem.height - this.meta.windowHeight;

            if (sub > 0) {
                if (this.meta.top > 0) { this.meta.top = 0; }
                if (this.meta.top < -sub) { this.meta.top = -sub; }
            } else {
                if (this.meta.top < 0) { this.meta.top = 0; }
                if (this.meta.top > -sub) { this.meta.top = -sub; }
            }
        }
    }

    public centerPicture() {
        this.meta.left = Math.floor((this.meta.windowWidth - this.imgItem.width) / 2);
        if (this.imgItem.height < this.meta.windowHeight) {
            this.meta.top = Math.floor((this.meta.windowHeight - this.imgItem.height) / 2);
        }
    }

    public resizeWindow(event) {
        this.meta.windowHeight = window.innerHeight;
        this.meta.windowWidth = window.innerWidth;

        if (this.meta.pristineVertical) {
            this.centerPicture();
        }
    }

    public sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    // ---------- box -----------------

    public arrowsManipulate(x, y) {
        this.meta.boxEditor.arrowsManipulate(x, y);
        this.meta.hintBox.arrowsColorMove(x, y);
    }
}
