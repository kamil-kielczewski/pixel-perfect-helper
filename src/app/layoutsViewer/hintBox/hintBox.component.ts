import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '../../common';

@Component({
    selector: 'hint-box',
    templateUrl: './hintBox.html',
})
export class HintBoxComponent implements OnInit {

    @Input() canvas: any;
    @Input() box: any;      // look: selectionBox component
    @Input() imgItem: any;
    @Input() imgLeft: any;
    @Input() imgTop: any;
    @Input() screenWidth: any;
    @Input() screenHeight: any;
    @Input() mouseX: any;
    @Input() mouseY: any;

    @Output() saveCutImg: EventEmitter<any> = new EventEmitter();

    hint = {
        compact: false,
        top: 0,
        left: 0,
        show: true,
        move: false,
        moveStartMouseTop: 0,
        moveStartMouseLeft: 0,
        link: 'downloadBoxSelection',
        linkSmall: 'downloadBoxSelectionSmall',
        saveLink: '',
        ignoreMove: false,
    };

    public meta = {
        colorPicker: null,
        colorPickerSmall: null,
        show: false,

    };

    constructor(private _route: ActivatedRoute) {}

    public ngOnInit() {
        this.loadHintSettings();
    }

    bindColorPicker(colorPicker) { this.meta.colorPicker = colorPicker }
    bindColorPickerSmall(colorPicker) { this.meta.colorPickerSmall = colorPicker }

    public getHint() {
        return this.hint;
    }

    public open() {
        this.hint.show = true;
    }

    public close() {
        this.hint.show = false;
    }

    public toggleOpen() {
        this.hint.show = !this.hint.show;
    }

    saveCutImgClick() {
        this.saveCutImg.emit();
    }

    public saveImg(filename, imgDataUrl) {

        let link: any = document.getElementById( this.hint.compact ? this.hint.linkSmall : this.hint.link );

        // if no parameters invoke click on link event (we do it in this way
        // because browser technical reasons related by save file by click on <a>)
        if(!filename) {
            link.click();
            return;
        }

        link.download = filename;
        link.href = imgDataUrl;
    }

    public toggleCompactHint() {

        this.hint.compact = !this.hint.compact;
        this.saveHintSettings();
    }

    // ----- hint setting ------

    public loadHintSettings() {

        let settings = Storage.get(this.keyHintSettings());

        if (!settings) { return; }

        this.hint.compact = settings.compact;
        this.hint.top = settings.top;
        this.hint.left = settings.left;

        if (this.hint.left + 220 >= this.screenWidth
            || this.hint.top + 20 >= this.screenHeight
            || this.hint.left < 0 || this.hint.top < 0
        ) {
            this.hint.left = 0;
            this.hint.top = 0;
        }
    }

    public keyHintSettings() {

        return 'layoutsViewer.hint.settings';
    }

    ignoreMove(event) {

        this.hint.ignoreMove = event;
    }

    public saveHintSettings() {

        let settings = {
            compact: this.hint.compact,
            top: this.hint.top,
            left: this.hint.left,
        };

        Storage.set(this.keyHintSettings(), settings);
    }

    // ---------- move hint -----------------

    public moveHintStart(event: any) {

        this.hint.move = true;
        this.hint.moveStartMouseTop = event.screenY - this.hint.top;
        this.hint.moveStartMouseLeft = event.screenX - this.hint.left;
    }

    public moveHintStop(event) {

        this.hint.move = false;

        this.ignoreMove(false);
        this.saveHintSettings();
    }

    public moveHint(event) {

        if (this.hint.move && !this.hint.ignoreMove) {

            this.hint.top = event.screenY - this.hint.moveStartMouseTop;
            this.hint.left = event.screenX - this.hint.moveStartMouseLeft;
        }
    }

    public arrowsColorMove(shiftX, shiftY) {

        this.meta.colorPicker.zoomPixelShift(shiftX, shiftY);
        this.meta.colorPickerSmall.zoomPixelShift(shiftX, shiftY);
    }

    public selectColor() {

        this.meta.colorPicker.selectColor();
        this.meta.colorPickerSmall.selectColor();
    }

    public zoomPixel(x,y) {

        this.meta.colorPicker.zoomPixel(x - this.imgLeft, y - this.imgTop);
        this.meta.colorPickerSmall.zoomPixel(x - this.imgLeft, y - this.imgTop);
    }

}
