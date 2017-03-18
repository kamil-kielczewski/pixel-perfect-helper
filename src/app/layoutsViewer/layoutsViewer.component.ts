import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { Storage } from '../common';

@Component({
    selector: 'layouts-viewer',
    templateUrl: './layoutsViewer.html',
    host: {
        '(document:keydown)': 'handleKeyboardEvents($event)',
        '(document:keyup)': 'handleKeyboardEvents($event)',
    }
})
export class LayoutsViewer implements OnInit
{
    imgItem = null;

    meta = {
        top: 0,
        left: 0,
        windowHeight: 0,
        windowWidth: 0,
        pixelScroll: false,
        verticalScroll: false,
        pristineVertical: true,

        hint : {
            width: 270,
            height: 170,
            top: 0,
            left: 0,
            show:true,
            move: false,
            moveStartMouseTop: 0,
            moveStartMouseLeft: 0,
        },
    };

    constructor(private _route: ActivatedRoute)
    {
    }

    public ngOnInit()
    {
        this._route.params.subscribe(params => {
            let key = params['key'];
            this.imgItem = Storage.get(key);
            console.log(this.imgItem);
        });

        this.resizeWindow(null);
        //setTimeout( () => { this.meta.hint.show=false}, 10000);
    }

    handleKeyboardEvents(event: KeyboardEvent) {

        if (event.key == 'Alt')
        {
            if(event.type == 'keydown')
            {
                this.meta.pixelScroll = true;
            }
            else
            {
                this.meta.pixelScroll = false;
            }
        }

        if (event.key == 'Shift')
        {

            if(event.type == 'keydown')
            {
                this.meta.verticalScroll = true;
            }
            else
            {
                this.meta.verticalScroll = false;
            }
        }

        event.preventDefault();
    }

    handleMouseScrollEvents(event: WheelEvent) {
        if(this.meta.verticalScroll) {
            this.meta.pristineVertical = false;
            this.meta.left -= this.meta.pixelScroll ? this.sign(event.deltaX) : Math.round(event.deltaX);
            if(this.meta.left < -this.imgItem.width) this.meta.left = -this.imgItem.width;
            if(this.meta.left > this.meta.windowWidth) this.meta.left = this.meta.windowWidth;
        } else {
            this.meta.top -= this.meta.pixelScroll ? this.sign(event.deltaY) : Math.round(event.deltaY);
            let sub = this.imgItem.height-this.meta.windowHeight;

            if(sub>0) {
                if(this.meta.top>0) this.meta.top = 0;
                if (this.meta.top < -sub) this.meta.top = -sub;
            } else {
                if(this.meta.top<0) this.meta.top = 0;
                if (this.meta.top > -sub) this.meta.top = -sub;
            }

        }
        //event.preventDefault();
    }

    centerPicture() {
        this.meta.left = Math.floor((this.meta.windowWidth - this.imgItem.width)/2);
        if(this.imgItem.height<this.meta.windowHeight) {
            this.meta.top = Math.floor((this.meta.windowHeight - this.imgItem.height)/2);
        }
    }

    resizeWindow(event) {
        this.meta.windowHeight = window.innerHeight;
        this.meta.windowWidth = window.innerWidth;

        if(this.meta.pristineVertical) {
            this.centerPicture();
        }
    }

    closeHint() {
        this.meta.hint.show=false;
    }

    sign(x)
    {
        return typeof x === 'number' ? x ? x < 0 ? -1 : 1 : x === x ? 0 : NaN : NaN;
    }

    // ---------- move hint -----------------
    moveHintStart(event:any) {
        this.meta.hint.move = true;
        this.meta.hint.moveStartMouseTop = event.screenY - this.meta.hint.top;
        this.meta.hint.moveStartMouseLeft = event.screenX - this.meta.hint.left;
    }

    moveHintStop(event) {
        this.meta.hint.move = false
    }

    moveHint(event) {
        if(this.meta.hint.move) {
            this.meta.hint.top = event.screenY-this.meta.hint.moveStartMouseTop;
            this.meta.hint.left = event.screenX - this.meta.hint.moveStartMouseLeft;
            console.log(event);
        }
    }

}


