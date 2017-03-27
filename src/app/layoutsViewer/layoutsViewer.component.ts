import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '../common';

// TODO color picker http://stackoverflow.com/...
//   .../questions/8751020/how-to-get-a-pixels-x-y-coordinate-color-from-an-image

@Component({
    selector: 'layouts-viewer',
    templateUrl: './layoutsViewer.html',
})
export class LayoutsViewerComponent implements OnInit {
    public imgItem = null;

    public meta = {
        boxEditor: null,
        colorPicker: null,
        colorPickerSmall: null,

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

        lastAction: null,

        hint : {
            compact: false,
            top: 0,
            left: 0,
            show: true,
            move: false,
            moveStartMouseTop: 0,
            moveStartMouseLeft: 0,
        },
    };

    constructor(private _route: ActivatedRoute) {}

    bindBox(boxEditor) { this.meta.boxEditor = boxEditor }
    bindColorPicker(colorPicker) { this.meta.colorPicker = colorPicker }
    bindColorPickerSmall(colorPicker) { this.meta.colorPickerSmall = colorPicker }

    ignoreHintClick(event) {
        console.log({event});
        this.meta.hint.ignoreInfoMove = event;

    }

    cutBoxAndDownload(small) {
        console.log('xx');
        if(!this.meta.boxEditor.getBox().isVisible) return;

        let canvas: any = document.createElement('canvas');
        let sizeX = this.meta.boxEditor.getBox().right - this.meta.boxEditor.getBox().left;
        let sizeY = this.meta.boxEditor.getBox().bottom - this.meta.boxEditor.getBox().top;
        canvas.width = sizeX;
        canvas.height = sizeY;
        console.log('yy', sizeX, sizeY);
        let pixelData = this.meta.canvas.getContext('2d').getImageData(this.meta.boxEditor.getBox().left - this.meta.left, this.meta.boxEditor.getBox().top - this.meta.top, sizeX,sizeY); //.data;
        canvas.getContext('2d').putImageData(pixelData,0,0); // copy 1:1 pixels under mouse to canvas
        let name = this.imgItem.name + '_' + this.getFileCounterNext() + '.png';
        let link: any = document.getElementById( small ? "downloadBoxSelectionSmall" : "downloadBoxSelection" );
        link.download = name;
        link.href = canvas.toDataURL("image/png").replace(/^data:image\/[^;]/, 'data:application/octet-stream');
        canvas=null;
    }

    public getFileCounterNext() {
        let counterKey = 'layoutsViewer.crop_file_counter.' + this.imgItem.key ;
        let counter = Storage.get(counterKey);
        if(!counter) counter = 0;
        counter++;
        Storage.set(counterKey, counter);
        return counter;
    }


    public ngOnInit() {
        this._route.params.subscribe( (params) => {
            let key = 'layoutsManager.image.' + params['id'];
            this.imgItem = Storage.get(key);
            this.loadHintSettings();
        });

        this.resizeWindow(null);
        setTimeout( () => {
            this.initCanvas()
        },1);
    }

    public initCanvas() {
        let img: any = document.getElementById('layoutImage');
        let canvas:any = document.createElement('canvas');

        canvas.width = img.width;
        canvas.height = img.height;

        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        this.meta.canvas = canvas;
    }


    public updateMousePosition(event) {

        this.meta.mouseX = event.pageX;
        this.meta.mouseY = event.pageY;
        this.zoomPixel(event.pageX, event.pageY);
    }

    public zoomPixel(x,y) {
        this.meta.colorPicker.zoomPixel(x - this.meta.left, y - this.meta.top);
        this.meta.colorPickerSmall.zoomPixel(x - this.meta.left, y - this.meta.top);
    }


    public loadHintSettings() {
        let settings = Storage.get(this.keyHintSettings());
        if (!settings) { return; }
        this.meta.hint.compact = settings.compact;
        this.meta.hint.top = settings.top;
        this.meta.hint.left = settings.left;
        this.resizeWindow(null);
        if (this.meta.hint.left + 20 >= this.meta.windowWidth
            || this.meta.hint.top + 20 >= this.meta.windowHeight) {

            this.meta.hint.left = 0;
            this.meta.hint.top = 0;
        }
    }

    public keyHintSettings() {
        return 'layoutsViewer.hint.settings';
    }

    public saveHintSettings() {
        let settings = {
            compact: this.meta.hint.compact,
            top: this.meta.hint.top,
            left: this.meta.hint.left,
        };
        Storage.set(this.keyHintSettings(), settings);
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

            if (event.key === 's') {
                if(!this.meta.boxEditor.getBox().isVisible) return;
                document.getElementById("downloadBoxSelection").click(); // simulate click on download file link
                event.preventDefault();
            }
        }


    }

    public selectColor() {
        this.meta.colorPicker.selectColor();
        this.meta.colorPickerSmall.selectColor();
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
        // event.preventDefault();
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

    public toggleCompactHint() {
        this.meta.hint.compact = !this.meta.hint.compact;
        this.saveHintSettings();
    }

    public closeHint() {
        this.meta.hint.show = false;
    }

    public showHintOrHideBox() {

        this.meta.hint.show = true;
    }

    public sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    // ---------- move hint -----------------
    public moveHintStart(event: any) {
        if(this.meta.hint.ignoreInfoMove) return;
        this.meta.hint.move = true;
        this.meta.hint.moveStartMouseTop = event.screenY - this.meta.hint.top;
        this.meta.hint.moveStartMouseLeft = event.screenX - this.meta.hint.left;
    }

    public moveHintStop(event) {
        this.meta.hint.move = false;
        this.saveHintSettings();
    }

    public moveHint(event) {
        if (this.meta.hint.move) {
            this.meta.hint.top = event.screenY - this.meta.hint.moveStartMouseTop;
            this.meta.hint.left = event.screenX - this.meta.hint.moveStartMouseLeft;
        }
    }

    // ---------- box -----------------

    public arrowsManipulate(x, y) {
        this.meta.boxEditor.arrowsManipulate(x,y);
        this.arrowsColorMove(x,y);
    }

    public arrowsColorMove(shiftX, shiftY) {
        this.meta.colorPicker.zoomPixelShift(shiftX, shiftY);
        this.meta.colorPickerSmall.zoomPixelShift(shiftX, shiftY);
    }
}
