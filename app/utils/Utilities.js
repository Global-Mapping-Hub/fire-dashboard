import tippy from 'tippy.js';

/**********************************************/
/* initialize or re-initialize tippy tooltips */
/**********************************************/
export function tippyInit() {
	tippy('[data-tippy-content]', {placement: 'right'});
}

/*************************************/
/* google xml to js object converter */
/*************************************/
export function xml2js(data) {
	// first parse the xml | papaparse alternative
	let jsonData = JSON.parse(data.request.response);
	let rows = jsonData.feed.entry

	// foreach row
	let finalObj = [];
	rows.forEach(function(row, i) {
		// foreach column
		let finalObjRow = {};
		for (const [key, value] of Object.entries(row)) {
			if (key.includes('gsx$')) finalObjRow[key.split('$')[1]] = value['$t'];
		}
		finalObj.push(finalObjRow);
	})

	return finalObj;
}
