/*************************************************************************************/
/* generate a chroma legend bar                                                      */
/* courtesy of https://github.com/gka/chroma.js/blob/master/docs/src/footer.inc.html */
/*************************************************************************************/

class colorLegend {
	constructor(id, title, suffix) {
		this.legendElement = document.getElementById(id);
		this.title = title;
		this.suffix = suffix;
	}
	gen(obj, [minimum, maximum]) {
		// get rounded max and min values
		let max = Math.round(maximum);
		let min = Math.round(minimum);

		// generate html
		let s = '';
		let dom = obj.domain ? obj.domain() : [0,1],
			dmin = Math.min(dom[0], dom[dom.length-1]),
			dmax = Math.max(dom[dom.length-1], dom[0]);
		// generate a scale from 0 to 100
		for (var i=0; i<=100; i++) {
			s += `<span class="grad-step" style="background-color:${obj(dmin + i/100 * (dmax - dmin))}"></span>`;
		}
		s += `<span class="domain-min">${(min) ? min : dmin} ${this.suffix}</span>`;
		s += `<span class="domain-med">${this.title}</span>`;
		s += `<span class="domain-max">${(max) ? max : dmax} ${this.suffix}</span>`;

		// set
		this.legendElement.innerHTML = `<div class="gradient">${s}</div>`;
		// show bar
		this.legendElement.style.display = 'block'
	}
	hide() {
		this.legendElement.innerHTML = '';
		this.legendElement.style.display = 'none'
	}
}

export default colorLegend;