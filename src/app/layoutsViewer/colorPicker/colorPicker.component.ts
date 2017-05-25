import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'color-picker',
    templateUrl: './colorPicker.html',
})
export class ColorPickerComponent implements OnInit {

    @Input() public width: string;
    @Input() public height: string;
    @Input() public canvas: any;
    @Input() public small: boolean;

    @Output() public ignoreMove: EventEmitter<any> = new EventEmitter();

    public zoom = {

        ignoreParentMove: false,    // used to text selection by mouse of color hex,rgb,hsl
        srcPixelRadius: 3,
        zoomPixelSize: 8,           // center pixel max size (in pixels)

        colorCenterPixel: [0, 0, 0, 255],
        colorSelected: [0, 0, 0, 255],
        colorSelectedHex: '#000000ff',
        colorSelectedRgba: 'rgba(0, 0, 0, 1)',
        colorSelectedHsla: 'hsl(0, 0%, 0%, 1)',

        factor: 10,
        canvas: null,
        zoomedCanvas: null,
        zoomeDataUrl: '',

        selectedPixel: {
            x: 0,
            y: 0,
        }
    };

    constructor(private _route: ActivatedRoute) {}

    public ngOnInit() {

        this.initCanvasAndZoom();
        this.zoomPixel(0, 0);
    }

    public ignoreHintClick(event) {

        this.ignoreMove.emit(event);
    }

    public zoomPixel(x, y) {

        this.zoom.selectedPixel.x = x;
        this.zoom.selectedPixel.y = y;
        this.zoomReadPixels(x, y, this.zoom.srcPixelRadius);
    }

    public zoomPixelShift(shiftX, shiftY) {

        this.zoom.selectedPixel.x += shiftX;
        this.zoom.selectedPixel.y += shiftY;
        this.zoomPixel(this.zoom.selectedPixel.x, this.zoom.selectedPixel.y);
    }

    public selectColor() {
        this.zoom.colorSelected = this.zoom.colorCenterPixel;
        
        let [r, g, b, a] = this.zoom.colorSelected;
        this.zoom.colorSelectedRgba = 'rgba(' + r + ', ' + g + ', ' + b + ', ' + (a / 255) + ')';
        this.zoom.colorSelectedHex = this.rgbaToHex(r, g, b, a);
        this.zoom.colorSelectedHsla = this.rgbToHsl(r, g, b, a);
    }

    public componentToHex(c) {

        let hex = c.toString(16);

        return hex.length === 1 ? '0' + hex : hex;
    }

    public rgbaToHex(r, g, b, a) {

        return '#' + this.componentToHex(r) + this.componentToHex(g) +
            this.componentToHex(b) + this.componentToHex(a);
    }

    public rgbToHsl(r, g, b, a) {

        r /= 255;
        g /= 255;
        b /= 255;
        a /= 255;

        let max = Math.max(r, g, b);
        let min = Math.min(r, g, b);
        let h;
        let s;
        let l = (max + min) / 2;

        if (max === min) {
            h = s = 0; // achromatic
        } else {
            let d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
                default: break;
            }

            h /= 6;
        }

        s = Math.round( s * 100 * 100 ) / 100;
        l = Math.round( l * 100 * 100 ) / 100;
        h = Math.round( h * 360);
        a = Math.round( a * 10000 ) / 10000;

        return 'hsla(' + h + ', ' + s + '%, ' + l + '%, ' + a + ')';
    }

    public initCanvasAndZoom() {

        let zoomedCanvas: any = document.createElement('canvas');
        let size = this.zoom.srcPixelRadius * 2 + 1;

        zoomedCanvas.width = size;
        zoomedCanvas.height = size;

        zoomedCanvas.getContext('2d').fillStyle = 'green';
        zoomedCanvas.getContext('2d').fillRect(0, 0, size, size);

        this.zoom.zoomedCanvas = zoomedCanvas;
    }

    public zoomReadPixels(x, y, zoomPixelRadius) {

        if (!this.canvas) { return; }

        let pixelData = this.canvas.getContext('2d').getImageData(
            x - zoomPixelRadius - 1,
            y - zoomPixelRadius * 2,
            zoomPixelRadius * 2 + 1,
            zoomPixelRadius * 2 + 1
        );

        this.zoom.colorCenterPixel = this.zoomReadXYFromPixels(
            zoomPixelRadius,
            zoomPixelRadius,
            zoomPixelRadius,
            pixelData.data
        );

        // copy 1:1 pixels under mouse to canvas
        this.zoom.zoomedCanvas.getContext('2d').putImageData(pixelData, 0, 0);
        this.zoom.zoomeDataUrl = this.zoom.zoomedCanvas.toDataURL('image/png');
    }

    public zoomReadXYFromPixels(x, y, zoomPixelRadius, pixelData) {

        let size = zoomPixelRadius * 2 + 1;
        let index  = 4 * (x + y * size);

        return [pixelData[index], pixelData[index + 1], pixelData[index + 2], pixelData[index + 3]];
    }

}
