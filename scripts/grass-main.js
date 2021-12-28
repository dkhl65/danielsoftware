$(document).ready(() => {
	// create the 50x50 plain dark background
	for(let i = 0; i < 50; i++) {
		for(let j = 0; j < 50; j++) {
			$("#editor-div").append('<img class="grass-img" src="images/grass/dark.png"></img>');
		}
		$("#editor-div").append("<br>");
	}
	
	let grassDeployed = 0; // count how many grass tiles are used
	
	// deploy or reclaim individual grass tiles by clicking
	$(".grass-img").click((ev) => {
		if ($(ev.target).prop("src").indexOf("dark.png") >= 0 && grassDeployed < 50) {
			$(ev.target).prop("src", "images/grass/grass.png");
			grassDeployed++;
		} else if($(ev.target).prop("src").indexOf("grass.png") >= 0) {
			$(ev.target).prop("src", "images/grass/dark.png");
			grassDeployed--;
		}
		$("#remaining-grass-text").text(50 - grassDeployed);
	});
	
	// prevent the middle mouse button from scrolling
	$(".grass-img").on("mousedown", (ev) => {
		if(ev.which === 2) {
			return false;
		}
	});
	
	// hold middle mouse button and drag to deploy grass continuously
	$(".grass-img").on("mousemove", (ev) => {
		if(ev.which === 2 && $(ev.target).prop("src").indexOf("dark.png") >= 0 && grassDeployed < 50) {
			$(ev.target).prop("src", "images/grass/grass.png");
			grassDeployed++;
		}
		$("#remaining-grass-text").text(50 - grassDeployed);
	});
	
	// press space bar to reclaim all grass tiles
	$("body").keypress((ev) => {
		if(ev.which === 32) {
			$(".grass-img").prop("src", "images/grass/dark.png");
			grassDeployed = 0;
			ev.preventDefault();
		}
		$("#remaining-grass-text").text(50 - grassDeployed);
	});
	
	// show and hide help text
	$("#help-button").click(() => {
		if($("#help-div").is(":hidden")) {
			$("#help-button").text("Hide Help");
		} else {
			$("#help-button").text("Show Help");
		}
		$("#help-div").toggle();
	});
});
