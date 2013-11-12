var switch_tab;
var current_tab = "resource";

$(document).ready(function() {
	switch_tab = function(tab_name) {
		if(tab_name != current_tab) {
			$("#"+current_tab+"_tab").toggleClass('highlighted');
			current_tab = tab_name;
			$("#"+tab_name+"_tab").toggleClass('highlighted');
		}
	}
});