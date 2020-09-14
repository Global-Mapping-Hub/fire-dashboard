/* ================== */
/* custom tile layers */
/* ================== */
const getUrl = function(value) {return `https://earthengine.google.org/static/hansen_2014/gfw_loss_tree_year_${value}_2014/{z}/{x}/{y}.png`}
export class TreeCover {
	constructor() {
		this.percentage = 10;
		this.layer = new L.TileLayer.PixelFilter(getUrl(this.percentage), {
			pane: 'basemaps',
			attribution: 'Hansen/UMD/Google/USGS/NASA',
			pixelCodes: [
				[0, 0, 0] // find black pixels
			],
			matchRGBA: [255, 255, 255, 0], // translate matching to this
			//missRGBA: [255, 255, 255, 64] // others
		});
	}
	getLayer() {
		return this.layer;
	}
	setPercentage(percentage) {
		this.percentage = percentage;
		this.layer.setUrl(getUrl(this.percentage))
	}
}