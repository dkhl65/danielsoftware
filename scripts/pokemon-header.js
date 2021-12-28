const SE = 2; // super effective
const ND = 1; // normal damage
const NV = 0.5; // not very effective
const IM = 0; // immune
const TYPES = [
	"normal", "fire", "water", "grass", "electric", "ice", 
	"fighting", "poison", "ground", "flying", "psychic", "bug", 
	"rock", "ghost", "dragon", "dark", "steel", "fairy"
];
const MATCHUPS = [
//   NOR FIR WTR GRS ELC ICE FTN PSN GND FLY PSY BUG ROC GOS DRA DRK STL FAR
	[ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, NV, IM, ND, ND, NV, ND], // normal
	[ND, NV, NV, SE, ND, SE, ND, ND, ND, ND, ND, SE, NV, ND, NV, ND, SE, ND], // fire
	[ND, SE, NV, NV, ND, ND, ND, ND, SE, ND, ND, ND, SE, ND, NV, ND, ND, ND], // water
	[ND, NV, SE, NV, ND, ND, ND, NV, SE, NV, ND, NV, SE, ND, NV, ND, NV, ND], // grass
	[ND, ND, SE, NV, NV, ND, ND, ND, IM, SE, ND, ND, ND, ND, NV, ND, ND, ND], // electric
	[ND, NV, NV, SE, ND, NV, ND, ND, SE, SE, ND, ND, ND, ND, SE, ND, NV, ND], // ice
	[SE, ND, ND, ND, ND, SE, ND, NV, ND, NV, NV, NV, SE, IM, ND, SE, SE, NV], // fighting
	[ND, ND, ND, SE, ND, ND, ND, NV, NV, ND, ND, ND, NV, NV, ND, ND, IM, SE], // poison
	[ND, SE, ND, NV, SE, ND, ND, SE, ND, IM, ND, NV, SE, ND, ND, ND, SE, ND], // ground
	[ND, ND, ND, SE, NV, ND, SE, ND, ND, ND, ND, SE, NV, ND, ND, ND, NV, ND], // flying
	[ND, ND, ND, ND, ND, ND, SE, SE, ND, ND, NV, ND, ND, ND, ND, IM, NV, ND], // psychic
	[ND, NV, ND, SE, ND, ND, NV, NV, ND, NV, SE, ND, ND, NV, ND, SE, NV, NV], // bug
	[ND, SE, ND, ND, ND, SE, NV, ND, NV, SE, ND, SE, ND, ND, ND, ND, NV, ND], // rock
	[IM, ND, ND, ND, ND, ND, ND, ND, ND, ND, SE, ND, ND, SE, ND, NV, ND, ND], // ghost
	[ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, ND, SE, ND, NV, IM], // dragon
	[ND, ND, ND, ND, ND, ND, NV, ND, ND, ND, SE, ND, ND, SE, ND, NV, ND, NV], // dark
	[ND, NV, NV, ND, NV, SE, ND, ND, ND, ND, ND, ND, SE, ND, ND, ND, NV, SE], // steel
	[ND, NV, ND, ND, ND, ND, SE, NV, ND, ND, ND, ND, ND, ND, SE, SE, NV, ND], // fairy
	[ND, NV, SE, SE, ND, NV, ND, ND, SE, SE, ND, ND, ND, ND, SE, ND, NV, ND], // freeze-dry
	[ND, SE, ND, NV, SE, ND, ND, SE, ND, ND, ND, NV, SE, ND, ND, ND, SE, ND] // thousand arrows
];
const ABILITIES = ["Lightning Rod", "Motor Drive", "Volt Absorb", "Storm Drain", "Water Absorb", "Dry Skin",
"Fluffy", "Flash Fire", "Heatproof", "Water Bubble", "Thick Fat", "Levitate", "Sap Sipper", "Wonder Guard",
"Scrappy", "Tinted Lens"];

function getMatchup(attack, ability, type1, type2) {
	let matchup = MATCHUPS[attack][type1];
	if(!!type2) {
		matchup *= MATCHUPS[attack][type2];
	}
	if(ability === "Tinted Lens" && matchup < 1) {
		matchup *= 2;
	} else if(ability === "Scrappy" && (type1 === TYPES.indexOf("ghost") || type2 ===  TYPES.indexOf("ghost")) && matchup === 0) {
		matchup = 1;
	}
	return matchup;
}

function getIneffectiveCoverage(attacks, abilities) {
	if(attacks.length < 1) {
		return [];
	}
	
	let ineffective = [];
	for(let type1 = 0; type1 < TYPES.length; type1++) {
		//check effectiveness against a single type
		let effective = false;
		for(let i = 0; i < attacks.length; i++) {
			if(getMatchup(attacks[i], abilities[i], type1) >= 1) {
				effective = true;
				break;
			}
		}
		if(!effective && ineffective.indexOf(`${type1}`) < 0) {
			for(let i = 0; i < ineffective.length; i++) {
				if(ineffective[i].indexOf(`${type1}`) >= 0) {
					ineffective.splice(i, 1);
					i--;
				}
			}
			ineffective.push(`${type1}`);
			continue;
		}
		
		// effectiveness for type combos
		for(let type2 = 0; type2 < TYPES.length; type2++) {
			effective = false;
			if(type1 === type2 || ineffective.indexOf(`${type2}-${type1}`) > -1 || ineffective.indexOf(`${type2}`) > -1) {
				continue;
			}
			for(let i = 0; i < attacks.length; i++) {
				if(getMatchup(attacks[i], abilities[i], type1, type2) >= 1) {
					effective = true;
					break;
				}
			}
			if(!effective) {
				ineffective.push(`${type1}-${type2}`);
			}
		}
	}
	
	return ineffective.slice();
}
