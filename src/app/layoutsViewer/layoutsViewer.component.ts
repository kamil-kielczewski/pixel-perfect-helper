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
        top: 0,
        left: 0,
        windowHeight: 0,
        windowWidth: 0,
        pixelScroll: false,
        verticalScroll: false,
        pristineVertical: true,
        mouseX: 0,
        mouseY: 0,

        hint : {
            compact: false,
            top: 0,
            left: 0,
            show: true,
            move: false,
            moveStartMouseTop: 0,
            moveStartMouseLeft: 0,
        },

        box: {
            move: false,
            draw: false,
            moveLine: false,
            selectedLine: 0,
            l: 0,
            t: 0,
            r: 0,
            b: 0,
            width: 0,
            height: 0,
            moveStartMouseX: 0,
            moveStartMouseY: 0,
            lastAction: null,
            isVisible: false,

        }
    };

    constructor(private _route: ActivatedRoute) {}

    public updateMousePosition(event) {
        this.meta.mouseX = event.pageX;
        this.meta.mouseY = event.pageY;
    }

    public ngOnInit() {
        this._route.params.subscribe( (params) => {
            let key = params['key'];
            this.imgItem = Storage.get(key);
            this.loadHintSettings();
        });

        this.resizeWindow(null);
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
        }

        if (event.key === 'Shift') {
            this.meta.verticalScroll = event.type === 'keydown';
        }
        console.log(event);

        if (event.type === 'keyup') {
            if (event.key === 'ArrowRight') {
                this.boxArrowsManipulate(1, 0);
            }

            if (event.key === 'ArrowLeft') {
                this.boxArrowsManipulate(-1, 0);
            }

            if (event.key === 'ArrowUp') {
                this.boxArrowsManipulate(0, -1);
            }

            if (event.key === 'ArrowDown') {
                this.boxArrowsManipulate(0, 1);
            }
        }

        event.preventDefault();
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

        if (this.meta.hint.show) {

            this.meta.box.isVisible = false;
            this.meta.box.l = 0;
            this.meta.box.r = 0;
            this.meta.box.t = 0;
            this.meta.box.b = 0;
        }

        this.meta.hint.show = true;
    }

    public sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    // ---------- move hint -----------------
    public moveHintStart(event: any) {
        console.log('moveHintStart');
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
    public refreshBoxData() {
        this.meta.box.width = Math.abs(this.meta.box.l - this.meta.box.r);
        this.meta.box.height = Math.abs(this.meta.box.t - this.meta.box.b);
    }

    public boxVertices() {
        let l = this.meta.box.l;
        let r = this.meta.box.r;
        let t = this.meta.box.t;
        let b = this.meta.box.b;

        return [
            {x: l, y: t}, {x: r, y: t}, {x: r, y: b}, {x: l, y: b}
        ];
    }

    public boxVerticesSvg() {
        let s = '';
        for (let v of this.boxVertices()) {
            s += v.x + ',' + v.y + ' ';
        }
        return s;
    }

    public svgMouseMove(event: any) {
        console.log('svgMouseMove');
        if (this.meta.box.move) { this.moveBox(event); }
        if (this.meta.box.draw) { this.boxDraw(event); }
        if (this.meta.box.moveLine) { this.boxMoveLine(event); }
    }

    public svgMouseMoveUp(event: any) {
        if (this.meta.box.draw) { this.boxDrawStop(event); }
        if (this.meta.box.moveLine) { this.boxMoveLineStop(event); }
    }

    public boxArrowsManipulate(x, y) {

        if (this.meta.box.lastAction === 'moveBox') {

            this.arrowsBoxMove(x, y);
        }

        if (this.meta.box.lastAction === 'moveLine') {

            this.arrowsBoxEdgeMove(x, y);
        }
    }

    // ------- Box draw -------

    public boxDrawStart(event: any) {

        if (!this.meta.box.isVisible) {

            this.meta.box.isVisible = true;
            this.meta.box.draw = true;
            this.meta.box.l = event.pageX;
            this.meta.box.t = event.pageY;
            this.meta.box.r = event.pageX;
            this.meta.box.b = event.pageY;

            event.stopPropagation();
        }
    }

    public boxDraw(event) {
        this.meta.box.b = event.pageY;
        this.meta.box.r = event.pageX;
        this.refreshBoxData();
    }

    public boxDrawStop(event) {
        this.meta.box.draw = false;
    }

    // --------- Box Move -----------

    public moveBoxStart(event) {
        this.meta.box.move = true;
        this.meta.box.moveStartMouseX = event.pageX - this.meta.box.l;
        this.meta.box.moveStartMouseY = event.pageY - this.meta.box.t;
        event.stopPropagation();
    }

    public moveBoxStop(event) {
        this.meta.box.move = false;
    }

    public moveBox(event) {
        if (this.meta.box.move ) {

            this.meta.box.lastAction = 'moveBox';
            let oldL = this.meta.box.l;
            let oldT = this.meta.box.t;
            this.meta.box.l = event.pageX - this.meta.box.moveStartMouseX;
            this.meta.box.t = event.pageY - this.meta.box.moveStartMouseY;
            this.meta.box.r += this.meta.box.l - oldL;
            this.meta.box.b += this.meta.box.t - oldT;
            this.refreshBoxData();
        }
    }

    public arrowsBoxMove(shiftX, shiftY) {
        this.meta.box.l += shiftX;
        this.meta.box.t += shiftY;
        this.meta.box.r += shiftX;
        this.meta.box.b += shiftY;
        this.refreshBoxData();
    }

    public boxLineVertices() {
        let result = [];
        let tmp = 0;
        let l = this.meta.box.l + 1;
        let r = this.meta.box.r;
        let t = this.meta.box.t + 1;
        let b = this.meta.box.b;

        result.push({ x1: l - 1, y1: t, x2: r, y2: t, });
        result.push({ x1: r, y1: t, x2: r, y2: b, });
        result.push({ x1: r, y1: b, x2: l, y2: b, });
        result.push({ x1: l, y1: b, x2: l, y2: t, });

        return result;
    }

    public boxMoveLineStart(i, event) {
        this.meta.box.selectedLine = i;
        this.meta.box.moveLine = true;
        event.stopPropagation();
    }

    public boxMoveLine(event) {
        let i = this.meta.box.selectedLine;
        if (this.meta.box.moveLine) {

            this.meta.box.lastAction = 'moveLine';

            if (i === 0) { // top line
                this.meta.box.t = event.pageY;
            }

            if (i === 1) { // right line
                this.meta.box.r = event.pageX;
            }

            if (i === 2) { // bottom line
                this.meta.box.b = event.pageY;
            }

            if (i === 3) { // left line
                this.meta.box.l = event.pageX;
            }

            this.refreshBoxData();
        }
        event.stopPropagation();
    }

    public boxMoveLineStop(event) {
        this.meta.box.moveLine = false;
    }

    public arrowsBoxEdgeMove(shiftX, shiftY) {
        let i = this.meta.box.selectedLine;
        if (i === 0) { // top line
            this.meta.box.t += shiftY;
        }

        if (i === 1) { // right line
            this.meta.box.r += shiftX;
        }

        if (i === 2) { // bottom line
            this.meta.box.b += shiftY;
        }

        if (i === 3) { // left line
            this.meta.box.l += shiftX;
        }
        this.refreshBoxData();
    }

}
