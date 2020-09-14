class SidebarLegend {
	constructor() {
		this.sidebar = document.getElementById('sidebar_legends');
	}
	add(title, data) {
		this.legendEntry = document.createElement('div');

		let html = '';
		Object.entries(data).forEach(function(el) {
			let title = el[0];
			let color = el[1];
			html += `<li class="sidebar_legend_item"><div>
						<div class="sidebar_legend_icon" style="width: 12px; height: 12px; background-color: ${color};"></div>
						<span class="sidebar_legend_name">${title}</span>
					</div></li>`;
		});
		this.ul = document.createElement('ul');
		this.ul.setAttribute('class', 'sidebar_legend_ul');
		this.ul.innerHTML = html;

		this.legendEntry.append(this.ul);
		this.sidebar.append(this.legendEntry);

		this.sidebar.style.display = 'block';
	}
	remove() {
		this.legendEntry.remove();
	}
}

export default SidebarLegend;