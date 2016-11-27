function toggleProjects(selected) {
	var projects = $(".projects-wrapper").children();

	$.each(projects, function(element) {
		var current = $(projects[element])

		if ((current.hasClass(selected))) {
			$(current).removeClass("hidden");
			$(current).addClass("visible");
		} else {
			$(current).removeClass("visible");
			$(current).addClass("hidden");
		}
	});
}

function toggleTabs(selected) {
	$("li.active").removeClass("active");
	$(selected).addClass("active");
}

$(document).ready(function(){

	$(".tab").on("click", function(e) {
		var selected = $(this).text()
		toggleTabs($(this));
		toggleProjects(selected.toLowerCase());
	});

});
