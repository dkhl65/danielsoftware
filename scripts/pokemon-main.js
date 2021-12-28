$(document).ready(() => {
	// set up the type select menus
	for(let i = 0; i < TYPES.length; i++) {
		$(".type-select, .attack-select").append(`<option value="${i}">${TYPES[i][0].toUpperCase() + TYPES[i].substring(1)}</option>`);
		if(i > 0 && i % 6 === 0) {
			$(".type-chart").append("<br>");
		}
		$(".type-chart").append(`<span class="matchup-span"><img class="matchup-img" src="images/icons/${TYPES[i]}.png"></img><label class="icon-label"></label></span>`);
	}
	$(".attack-select").append('<option value="18">Freeze-Dry</option>');
	$(".attack-select").append('<option value="19">Thousand Arrows</option>');
	
	// set up the ability menu
	for(let i = 0; i < ABILITIES.length; i++) {
		$(".ability-select").append(`<option value="${i}">${ABILITIES[i]}</option>`);
	}
	
	// make six copies of pokemon rows
	for(let i = 1; i <= 5; i++) {
		let row = $(".pokemon-row:last");
		let newRow = row.clone();
		row.after(newRow);
	}
	
	// update matchups when a setting is changed
	$(".type-column").change(() => {
		// reset totals
		let weaknesses = [];
		let resistances = [];
		let immunities = [];
		for(let i = 0; i < TYPES.length; i++) {
			weaknesses.push(0);
			resistances.push(0);
			immunities.push(0);
		}
		$("#total-row").find(".matchup-img").css("opacity", "0.1");
		$("#total-row").find(".icon-label").html("");
		
		$(".pokemon-row").each((a, row) => {
			// refresh the row
			$(row).find(".matchup-img").css("opacity", "0.1");
			$(row).find(".icon-label").html("");
			
			// calculate weaknesses and resistances (matchups)
			let type = [];
			$(row).find(".type-select").each((b, obj) => {
				let value = parseInt($(obj).val());
				if(value >= 0 && type.indexOf(value) < 0) {
					type.push(value);
				}
			});
			let ability = parseInt($(row).find(".ability-select").val());
			for(let i = 0; i < TYPES.length; i++) {
				let matchup = 1;
				let weakness = 0;
				let immunity = 0;
				let resistance = 0;
				
				// ability effects
				if((ability >= 0 && ability <= 2 && i === TYPES.indexOf("electric")) ||
				(ability >= 3 && ability <= 5 && i === TYPES.indexOf("water")) ||
				(ability === ABILITIES.indexOf("Flash Fire") && i === TYPES.indexOf("fire")) ||
				(ability === ABILITIES.indexOf("Levitate") && i === TYPES.indexOf("ground")) ||
				(ability === ABILITIES.indexOf("Sap Sipper") && i === TYPES.indexOf("grass"))) {
					$(row).find(".resistances-column").find(".matchup-img").eq(i).css("opacity", "1");
					$(row).find(".resistances-column").find(".icon-label").eq(i).html("Im");
					if(!$(row).find(".ignore-checkbox").prop("checked")) {
						immunities[i]++;
					}
					continue;
				}
				if(ability === ABILITIES.indexOf("Dry Skin") && i === TYPES.indexOf("fire")) {
					matchup *= 1.25;
				}
				if(ability === ABILITIES.indexOf("Fluffy") && i === TYPES.indexOf("fire")) {
					matchup *= 2;
				}
				if(ability >= 8 && ability <= 10 && i === TYPES.indexOf("fire")) {
					matchup *= 0.5;
				}
				if(ability === ABILITIES.indexOf("Thick Fat") && i === TYPES.indexOf("ice")) {
					matchup *= 0.5;
				}
				
				// label the row and count the total
				for(let j = 0; j < type.length; j++) {
					matchup *= MATCHUPS[i][type[j]];
				}
				if(matchup > 1) {
					$(row).find(".weaknesses-column").find(".matchup-img").eq(i).css("opacity", "1");
					weakness = 1;
				}
				if(matchup > 2) {
					$(row).find(".weaknesses-column").find(".icon-label").eq(i).html("2");
					weakness = 2;
				}
				if(matchup < 1 || (matchup <= 1 && ability === ABILITIES.indexOf("Wonder Guard"))) {
					$(row).find(".resistances-column").find(".matchup-img").eq(i).css("opacity", "1");
				}
				if(matchup === 0 || (matchup <= 1 && ability === ABILITIES.indexOf("Wonder Guard"))) {
					$(row).find(".resistances-column").find(".icon-label").eq(i).html("Im");
					immunity = 1;
				} else if(matchup > 0 && matchup <= 0.25) {
					$(row).find(".resistances-column").find(".icon-label").eq(i).html("2");
					resistance = 2;
				} else if(matchup > 0 && matchup < 1) {
					resistance = 1;
				}
				if(!$(row).find(".ignore-checkbox").prop("checked")) {
					weaknesses[i] += weakness;
					resistances[i] += resistance;
					immunities[i] += immunity;
				}
			}
			
			// display the total matchup
			for(let i = 0; i < weaknesses.length; i++) {
				if(weaknesses[i] > 0) {
					$("#total-row").find(".weaknesses-column").find(".matchup-img").eq(i).css("opacity", "1");
					$("#total-row").find(".weaknesses-column").find(".icon-label").eq(i).html(weaknesses[i]);
				}
				if(immunities[i] > 0) {
					$("#total-row").find(".resistances-column").find(".matchup-img").eq(i).css("opacity", "1");
					$("#total-row").find(".resistances-column").find(".icon-label").eq(i).html(`${resistances[i]}+${immunities[i]}`);
				} else if(resistances[i] > 0) {
					$("#total-row").find(".resistances-column").find(".matchup-img").eq(i).css("opacity", "1");
					$("#total-row").find(".resistances-column").find(".icon-label").eq(i).html(resistances[i]);
				}
			}
		});
	});
	
	// update coverage when a setting is changed
	$(".attack-column, .ignore-checkbox, .ability-select").change(() => {
		$(".coverage-column").empty();
		let allAttacks = [];
		let allAbilities = [];
		
		$(".pokemon-row").each((a, row) => {
			let attacks = [];
			let ability = $(row).find(".ability-select").val();
			let abilityCopies = [];
			$(row).find(".attack-select").each((b, obj) => {
				let attack = parseInt($(obj).val());
				if(attack >= 0) {
					if(attacks.indexOf(attack) < 0) {
						attacks.push(attack);
						abilityCopies.push(ABILITIES[ability] || "");
						if(!$(row).find(".ignore-checkbox").prop("checked")) {
							allAttacks.push(attack);
							allAbilities.push(ABILITIES[ability] || "");
						}
					}
				}
			});		
			
			// get the ineffective type combinations
			let ineffective = getIneffectiveCoverage(attacks, abilityCopies);
			if(ineffective.length < 1 && attacks.length > 0) {
				$(row).find(".coverage-column").html("Perfect coverage!");
			}
			
			// display the icons of ineffective type combinations
			for(let i = 0; i < ineffective.length; i++) {
				let types = ineffective[i].split('-');
				if(types.length > 1) {
					$(row).find(".coverage-column").append(`<div class="coverage-div"><span class="coverage-span"><img class="left-coverage-img" src="images/icons/${TYPES[types[0]]}.png"></span><span class="coverage-span"><img class="right-coverage-img" src="images/icons/${TYPES[types[1]]}.png"></span></div> `);
				} else {
					$(row).find(".coverage-column").append(`<img class="coverage-img" src="images/icons/${TYPES[types[0]]}.png"> `);
				}
			}
		});
		
		// get the common uncovered types
		let totalIneffective = getIneffectiveCoverage(allAttacks, allAbilities);
		if(totalIneffective.length < 1 && allAttacks.length > 0) {
			$("#total-row").find(".coverage-column").html("Perfect coverage!");
		}
		
		// display the icons of ineffective type combinations
		for(let i = 0; i < totalIneffective.length; i++) {
			let types = totalIneffective[i].split('-');
			if(types.length > 1) {
				$("#total-row").find(".coverage-column").append(`<div class="coverage-div"><span class="coverage-span"><img class="left-coverage-img" src="images/icons/${TYPES[types[0]]}.png"></span><span class="coverage-span"><img class="right-coverage-img" src="images/icons/${TYPES[types[1]]}.png"></span></div> `);
			} else {
				$("#total-row").find(".coverage-column").append(`<img class="coverage-img" src="images/icons/${TYPES[types[0]]}.png"> `);
			}
		}
	});
	
	// reset buttons
	$(".reset-button").click((ev) => {
		$(ev.target).parents(".pokemon-row").find(".matchup-img").css("opacity", "0.1");
		$(ev.target).parents(".pokemon-row").find(".icon-label").html("");
		$(ev.target).parents(".pokemon-row").find("select").val("-1");
		$("td").trigger("change");
	});
	$("#reset-all-button").click(() => {
		$(".matchup-img").css("opacity", "0.1");
		$(".icon-label").html("");
		$("table").find("select").val("-1");
		$("td").trigger("change");
	});
	
	// help button
	$("#help-button").click(() => {
		if($("#help-div").is(":hidden")) {
			$("#help-button").text("Hide Help");
		} else {
			$("#help-button").text("Show Help");
		}
		$("#help-div").toggle();
	});
});
