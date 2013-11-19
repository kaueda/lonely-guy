var current_tab = "messages";
var div_id_content = $('#content');
var switch_tab;

$(document).ready(function() {
	switch_tab = function(tab_name) {
		if(tab_name != current_tab) {
			$("#"+current_tab+"_tab").toggleClass('highlighted');
			$("#"+current_tab+"_content").hide();
			current_tab = tab_name;
			$("#"+tab_name+"_tab").toggleClass('highlighted');
			$("#"+tab_name+"_content").show(500);
		}
	}
});