var switch_tab;
var load_tab;
var current_tab = "messages";
var div_id_content = $('#content');

$(document).ready(function() {
	load_tab = function(tab_name) {
		
	}

	switch_tab = function(tab_name) {
		if(tab_name != current_tab) {
			$("#"+current_tab+"_tab").toggleClass('highlighted');
			current_tab = tab_name;
			$("#"+tab_name+"_tab").toggleClass('highlighted');
			//load_tab(tab_name);
		}
	}
});