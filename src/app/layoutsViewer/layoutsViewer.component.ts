import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Storage } from '../common';

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
            width: 270,
            height: 170,
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
            x: 0,
            y: 0,
            width: 0,
            height: 0,
            moveStartMouseX: 0,
            moveStartMouseY: 0,
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
            console.log(this.imgItem);
        });

        this.resizeWindow(null);
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

    public closeHint() {
        this.meta.hint.show = false;
    }

    public sign(x) {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    // ---------- move hint -----------------
    public moveHintStart(event: any) {
        this.meta.hint.move = true;
        this.meta.hint.moveStartMouseTop = event.screenY - this.meta.hint.top;
        this.meta.hint.moveStartMouseLeft = event.screenX - this.meta.hint.left;
    }

    public moveHintStop(event) {
        this.meta.hint.move = false;
    }

    public moveHint(event) {
        if (this.meta.hint.move) {
            this.meta.hint.top = event.screenY - this.meta.hint.moveStartMouseTop;
            this.meta.hint.left = event.screenX - this.meta.hint.moveStartMouseLeft;
            console.log(event);
        }
    }

    // ---------- box -----------------
    public boxDrawStart(event: any) {
        if (this.meta.box.move) { return; }
        this.meta.box.draw = true;
        this.meta.box.y = event.pageY;
        this.meta.box.x = event.pageX;
        this.meta.box.width = 0;
        this.meta.box.height = 0;
    }

    public boxDrawStop(event) {
        this.meta.box.draw = false;
    }

    public boxDraw(event) {
        if (this.meta.box.move) { return; }
        if (this.meta.box.draw) {
            this.meta.box.height = event.pageY - this.meta.box.y;
            this.meta.box.width = event.pageX - this.meta.box.x;
        }
    }

    public moveBoxStart(event) {
        this.meta.box.move = true;
        this.meta.box.moveStartMouseX = event.pageX - this.meta.box.x;
        this.meta.box.moveStartMouseY = event.pageY - this.meta.box.y;
    }

    public moveBoxStop(event) {
        this.meta.box.move = false;
    }

    public moveBox(event) {
        if (this.meta.box.move) {
            this.meta.box.x = event.pageX - this.meta.box.moveStartMouseX;
            this.meta.box.y = event.pageY - this.meta.box.moveStartMouseY;
        }
    }

}
