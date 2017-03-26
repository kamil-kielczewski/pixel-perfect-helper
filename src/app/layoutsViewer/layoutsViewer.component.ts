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

        box: {
            move: false,
            draw: false,
            moveLine: false,
            moveVertex: false,
            selectedLine: 0,
            selectedVertex: 0,
            l: -1,
            t: -1,
            r: -1,
            b: -1,

            moveStartMouseX: 0,
            moveStartMouseY: 0,

            isVisible: false,
            ignoreInfoMove: false,

            // values to show in info box
            left:0,
            right:0,
            top: 0,
            bottom: 0,
            width: 0,
            height: 0,
        },

        zoom: {
            srcPixelRadius: 3,
            zoomPixelSize: 8, // center pixel max size (in pixels)
            colorCenterPixel: [0,0,0,255],
            colorSelected: [0,0,0,255],
            colorSelectedHex: '#000000ff',
            colorSelectedRgba: 'rgba(0,0,0,1)',
            colorSelectedHsla: 'hsl(0,0,0,1)',
            factor: 10,
            canvas: null,
            zoomedCanvas: null,
            zoomeDataUrl: '',
            selectedPixel: {
                x:0,
                y:0,
            }
        },
    };

    constructor(private _route: ActivatedRoute) {}

    cutBoxAndDownload() {
        if(!this.meta.box.isVisible) return;

        let canvas: any = document.createElement('canvas');
        let sizeX = this.meta.box.right - this.meta.box.left;
        let sizeY = this.meta.box.bottom - this.meta.box.top;
        canvas.width = sizeX;
        canvas.height = sizeY;

        let pixelData = this.meta.canvas.getContext('2d').getImageData(this.meta.box.left - this.meta.left, this.meta.box.top - this.meta.top, sizeX,sizeY); //.data;
        canvas.getContext('2d').putImageData(pixelData,0,0); // copy 1:1 pixels under mouse to canvas
        let name = this.imgItem.name + '_' + this.getFileCounterNext() + '.png';
        let link: any = document.getElementById("downloadBoxSelection");
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
            this.initCanvasAndZoom()
        },1);
    }


    public updateMousePosition(event) {

        this.meta.mouseX = event.pageX;
        this.meta.mouseY = event.pageY;

        this.meta.zoom.selectedPixel.x = event.pageX - this.meta.left;
        this.meta.zoom.selectedPixel.y = event.pageY - this.meta.top;
        this.zoomReadPixels(this.meta.zoom.selectedPixel.x, this.meta.zoom.selectedPixel.y, this.meta.zoom.srcPixelRadius)
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

            if (event.key === 's') {
                if(!this.meta.box.isVisible) return;
                document.getElementById("downloadBoxSelection").click(); // simulate click on download file link
                event.preventDefault();
            }
        }


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
            this.meta.box.l = -1;
            this.meta.box.r = -1;
            this.meta.box.t = -1;
            this.meta.box.b = -1;
        }

        this.meta.hint.show = true;
    }

    public hideBox() {

        if (this.meta.hint.show && this.meta.box.isVisible) {

            this.meta.box.isVisible = false;
            this.meta.box.l = -1;
            this.meta.box.r = -1;
            this.meta.box.t = -1;
            this.meta.box.b = -1;

        }
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
    public refreshBoxData() {
        this.meta.box.width = Math.abs(this.meta.box.l - this.meta.box.r);
        this.meta.box.height = Math.abs(this.meta.box.t - this.meta.box.b);

        if (this.meta.box.l < this.meta.box.r) {
            this.meta.box.left = this.meta.box.l;
            this.meta.box.right = this.meta.box.r;
        } else {
            this.meta.box.left = this.meta.box.r;
            this.meta.box.right = this.meta.box.l;
        }

        if (this.meta.box.t < this.meta.box.b) {
            this.meta.box.bottom = this.meta.box.b;
            this.meta.box.top = this.meta.box.t;
        } else {
            this.meta.box.bottom = this.meta.box.t;
            this.meta.box.top = this.meta.box.b;
        }
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

        if (this.meta.box.move) { this.moveBox(event); }
        if (this.meta.box.draw) { this.boxDraw(event); }
        if (this.meta.box.moveLine) { this.boxMoveLine(event); }
        if (this.meta.box.moveVertex) { this.boxMoveVertex(event); }
    }

    public svgMouseMoveUp(event: any) {
        if (this.meta.box.draw) { this.boxDrawStop(event); }
        if (this.meta.box.moveLine) { this.boxMoveLineStop(event); }
    }

    public arrowsManipulate(x, y) {

        if (this.meta.lastAction === 'moveBox') {

            this.arrowsBoxMove(x, y);
        }

        if (this.meta.lastAction === 'moveLine') {

            this.arrowsBoxEdgeMove(x, y);
        }

        if (this.meta.lastAction === 'moveVertex') {

            this.arrowsBoxVertexMove(x, y);
        }

        this.arrowsColorMove(x,y);
        this.zoomReadPixels(this.meta.zoom.selectedPixel.x, this.meta.zoom.selectedPixel.y, this.meta.zoom.srcPixelRadius);
    }

    // ------- Box draw -------

    public boxDrawStart(event: any) {

        this.meta.box.isVisible = true;
        this.meta.box.draw = true;
        this.meta.box.l = event.pageX;
        this.meta.box.t = event.pageY;
        this.meta.box.r = event.pageX;
        this.meta.box.b = event.pageY;

        event.stopPropagation();
        this.selectColor();
    }

    public boxDraw(event) {
        this.meta.box.b = event.pageY;
        this.meta.box.r = event.pageX;
        this.refreshBoxData();
    }

    public boxDrawStop(event) {
        this.meta.box.draw = false;


        if(this.meta.box.l == this.meta.box.r || this.meta.box.t == this.meta.box.b) {
            this.meta.box.l = -1;
            this.meta.box.r = -1;
            this.meta.box.t = -1;
            this.meta.box.b = -1;
            this.meta.box.isVisible = false;
        }

        this.refreshBoxData();
        this.selectColor();
    }

    // --------- Box Move -----------

    public moveBoxStart(event) {
        this.meta.box.move = true;
        this.meta.box.moveStartMouseX = event.pageX - this.meta.box.l;
        this.meta.box.moveStartMouseY = event.pageY - this.meta.box.t;
        event.stopPropagation();
        this.selectColor();
    }

    public moveBoxStop(event) {
        this.meta.box.move = false;
    }

    public moveBox(event) {
        if (this.meta.box.move ) {

            this.meta.lastAction = 'moveBox';
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

    public arrowsColorMove(shiftX, shiftY) {
        this.meta.zoom.selectedPixel.x += shiftX;
        this.meta.zoom.selectedPixel.y += shiftY;
        this.refreshBoxData();
    }

    public boxLineVertices() {
        let result = [];
        let tmp = 0;
        let l = this.meta.box.l;
        let r = this.meta.box.r;
        let t = this.meta.box.t;
        let b = this.meta.box.b;

        if(l<r) {
            l+=1;
        } else {
            r+=1;
        }

        if(t<b) {
            t+=1;
        } else {
            b+=1;
        }

        result.push({ x1: l<r ? l-1:l, y1: t, x2: l<r ? r:r-1, y2: t, });
        result.push({ x1: r, y1: t, x2: r, y2: b, });
        result.push({ x1: l<r ? r:r-1, y1: b, x2: l<r ? l-1:l, y2: b, });
        result.push({ x1: l, y1: b, x2: l, y2: t, });

        return result;
    }

    // -------- move line --------

    public boxMoveLineStart(i, event) {
        this.meta.box.selectedLine = i;
        this.meta.box.moveLine = true;
        event.stopPropagation();
    }

    public boxMoveLine(event) {
        let i = this.meta.box.selectedLine;
        if (this.meta.box.moveLine) {

            this.meta.lastAction = 'moveLine';

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

    // ------ move box vertex ------
    public boxMoveVertexStart(i,event) {
        this.meta.box.selectedVertex = i;
        this.meta.box.moveVertex = true;
        event.stopPropagation();
    }

    public boxMoveVertex(event) {
        let i = this.meta.box.selectedVertex;
        if (this.meta.box.moveVertex) {

            this.meta.lastAction = 'moveVertex';

            if (i === 0) { // top line
                this.meta.box.t = event.pageY;
                this.meta.box.l = event.pageX;
            }

            if (i === 1) { // right line
                this.meta.box.r = event.pageX;
                this.meta.box.t = event.pageY;
            }

            if (i === 2) { // bottom line
                this.meta.box.b = event.pageY;
                this.meta.box.r = event.pageX;
            }

            if (i === 3) { // left line
                this.meta.box.l = event.pageX;
                this.meta.box.b = event.pageY;
            }

            this.refreshBoxData();
        }
        event.stopPropagation();
    }

    public boxMoveVertexStop(i,event) {
        this.meta.box.moveVertex = false;
    }

    public arrowsBoxVertexMove(shiftX, shiftY) {
        let i = this.meta.box.selectedVertex;
        if (i === 0) { // top line
            this.meta.box.t += shiftY;
            this.meta.box.l += shiftX;
        }

        if (i === 1) { // right line
            this.meta.box.r += shiftX;
            this.meta.box.t += shiftY;
        }

        if (i === 2) { // bottom line
            this.meta.box.b += shiftY;
            this.meta.box.r += shiftX;
        }

        if (i === 3) { // left line
            this.meta.box.l += shiftX;
            this.meta.box.b += shiftY;
        }
        this.refreshBoxData();
    }

    // ----- Color picker and zooom -----

    ignoreHintClick(event) {
        this.meta.hint.ignoreInfoMove = true;
    }

    stopIgnoreHintClick(event) {
        this.meta.hint.ignoreInfoMove = false;
    }

    selectColor() {
        this.meta.zoom.colorSelected = this.meta.zoom.colorCenterPixel;
        let [r,g,b,a] = this.meta.zoom.colorSelected;
        this.meta.zoom.colorSelectedHex = this.meta.zoom.colorCenterPixel;
        this.meta.zoom.colorSelectedRgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (a/255) + ')';
        this.meta.zoom.colorSelectedHex = this.rgbaToHex(r,g,b,a);
        this.meta.zoom.colorSelectedHsla = this.rgbToHsl(r,g,b,a);
    }

    componentToHex(c) {
        let hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    }

    rgbaToHex(r, g, b, a) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b) + this.componentToHex(a);
    }

    rgbToHsl(r, g, b, a) {
        r /= 255, g /= 255, b /= 255, a /= 255;

        var max = Math.max(r, g, b), min = Math.min(r, g, b);
        var h, s, l = (max + min) / 2;

        if (max == min) {
            h = s = 0; // achromatic
        } else {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }

            h /= 6;
        }

        s= Math.round(s * 100 * 100)/100;
        l= Math.round(l * 100 * 100)/100;
        h= Math.round(h * 360);
        a= Math.round(a*10000)/10000;
        
        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    }

    initCanvasAndZoom() {
        let img: any = document.getElementById('layoutImage');
        let canvas:any = document.createElement('canvas');
        let zoomedCanvas:any = document.createElement('canvas');

        canvas.width = img.width;
        canvas.height = img.height;

        let size = this.meta.zoom.srcPixelRadius*2+1;
        zoomedCanvas.width = size;
        zoomedCanvas.height = size;

        zoomedCanvas.getContext('2d').fillStyle = 'green';
        zoomedCanvas.getContext('2d').fillRect(0, 0, size, size);

        canvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);
        this.meta.canvas = canvas;
        this.meta.zoom.zoomedCanvas = zoomedCanvas;


    }

    zoomReadPixels(x,y, zoomPixelRadius) {
        if(!this.meta.canvas) return;
        let pixelData = this.meta.canvas.getContext('2d').getImageData(x -zoomPixelRadius-1, y - zoomPixelRadius*2, zoomPixelRadius*2 + 1, zoomPixelRadius*2 + 1); //.data;
        this.meta.zoom.colorCenterPixel = this.zoomReadXYFromPixels(zoomPixelRadius,zoomPixelRadius,zoomPixelRadius,pixelData.data);
        this.meta.zoom.zoomedCanvas.getContext('2d').putImageData(pixelData,0,0); // copy 1:1 pixels under mouse to canvas
        this.meta.zoom.zoomeDataUrl = this.meta.zoom.zoomedCanvas.toDataURL('image/png');
    }

    zoomReadXYFromPixels(x,y,zoomPixelRadius, pixelData) {
        let size = zoomPixelRadius*2+1;
        let index  = 4* (x+ y*size);
        return [pixelData[index],pixelData[index+1], pixelData[index+2], pixelData[index+3]];
    }

}



