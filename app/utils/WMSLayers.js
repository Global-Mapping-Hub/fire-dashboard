/* ================= */
/* custom wms layers */
/* ================= */
export class NASAGIBSLayer {
	constructor(wms_layer, date) {
		this.date = date;

		this.layer = L.tileLayer.wms('https://gibs.earthdata.nasa.gov/wms/epsg3857/best/wms.cgi', {
			layers: wms_layer,
			TIME: this.date,
			format: 'image/png',
			pane: 'basemaps'
		});
	}
	getLayer() {
		return this.layer;
	}
	setDate(newDate) {
		this.layer.setParams({TIME: `${newDate}`,}, false);
	}
}