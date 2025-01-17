(function(window) {
    'use strict';

    var query = uri_query();
	var state = query.state;
	var variation = query.variation;
	var swordless = query.swordless;
	var enem = query.enemizer;
	
	var is_standard = state === 'standard';
	var is_keysanity = variation === 'keysanity';
	var is_inverted = state === 'inverted';
	var is_swordless = swordless === 'yes';
	var is_retro = variation === 'retro';
	var is_enemizer = enem === 'yes';
	
    function medallion_check(i) {
        if ((!items.sword && swordless === 'no') || !items.bombos && !items.ether && !items.quake) return 'unavailable';
        if (medallions[i] === 1 && !items.bombos ||
            medallions[i] === 2 && !items.ether ||
            medallions[i] === 3 && !items.quake) return 'unavailable';
        if (medallions[i] === 0 && !(items.bombos && items.ether && items.quake)) return 'possible';
    }
	
	function crystal_check() {
		var crystal_count = 0;
		for (var k = 0; k < 10; k++) {
			if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
				crystal_count++;
			}
		}
		return crystal_count;
	}		

    function melee() { return items.sword || items.hammer; }
    function melee_bow() { return melee() || items.bow > 1; }
    function cane() { return items.somaria || items.byrna; }
    function rod() { return items.firerod || items.icerod; }
	function agatowerweapon() { return items.sword > 0 || items.somaria || items.bow > 1 || items.hammer || items.firerod; }

    function always() { return 'available'; }

	function enemizer_check(i, d, p) {
		if (enemizer[i] === 0) {
			return 'possible';
		} else if (enemizer[i] === 1) {
			//Armos
			if (items.sword > 0 || items.hammer || items.bow > 0 || items.boomerang > 0 || items.byrna || items.somaria || items.icerod || items.firerod) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 2) {
			//Lanmola
			if (melee_bow() || cane() || rod() || items.hammer) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 3) {
			//Moldorm
			if (items.sword > 0 || items.hammer) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 4) {
			//Helmasaur
			if (items.sword > 0 || items.hammer) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 5) {
			//Arrghus
			if (items.hookshot && (items.sword > 0 || items.hammer)) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 6) {
			//Mothula
			if (items.sword > 0 || items.hammer || items.firerod) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 7) {
			//Blind
			if (items.sword > 0 || items.hammer || items.somaria) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 8) {
			//Kholdstare
			if (items.firerod || (items.bombos && (items.sword > 0 || items.hammer))) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 9) {
			//Vitreous
			if (melee_bow() || items.hammer) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		} else if (enemizer[i] === 10) {
			//Trinexx
			if (items.firerod && items.icerod && (items.hammer || items.sword > 0)) return d ? p == true ? 'possible' : 'available' : 'dark';
			return 'unavailable';
		}
	}
	
	function can_reach_outcast() {
		return items.moonpearl && (
			items.glove === 2 || items.glove && items.hammer ||
			items.agahnim && items.hookshot && (items.hammer || items.glove || items.flippers));
	}
	
	function canReachLightWorld()//Can walk around in Light World as Link
	{
		return items.moonpearl && (items.glove === 2 || items.glove && items.hammer || items.agahnim);
	}

	function canReachLightWorldBunny()//Can walk around in Light World as bunny or Link
	{
		return items.agahnim || canReachLightWorld() || (items.glove === 2 && activeFlute());
	}

	function canReachPyramid()
	{
		return items.flippers || canReachPyramidWithoutFlippers();
	}

	function canReachPyramidWithoutFlippers()
	{
		return items.hammer || activeFlute() || (items.mirror && canReachLightWorldBunny());
	}

	function activeFlute()
	{
		return items.flute && canReachLightWorld();
	}

	
// define dungeon chests
	if(is_inverted)
	{
		window.dungeons = [{ // [0]
			caption: 'Eastern Palace {lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (is_enemizer) {
						if(!items.bigkey0 || items.bow < 2 || !canReachLightWorld()) return 'unavailable';
						return enemizer_check(0, items.lantern, false);
					} else {
						if(!items.bigkey0 || items.bow < 2 || !canReachLightWorld()) return 'unavailable';
						return items.lantern ? 'available' : 'dark';
					}
				} else {
					if (is_enemizer) {
						return canReachLightWorld() ? enemizer_check(0, items.lantern) : 'unavailable';
					} else {
						return items.bow > 1 && canReachLightWorld() ?
							items.lantern ? 'available' : 'dark' :
							'unavailable';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!canReachLightWorldBunny()) return 'unavailable';
					if (items.bigkey0 && items.bow > 1 && items.lantern) return 'available';
					if (items.keychest0 >= 4) return 'possible';
					if (items.keychest0 >= 3 && !items.bigkey0 && !items.lantern) return 'dark';
					if (items.keychest0 >= 3 && (items.bigkey0 || items.lantern)) return 'possible';
					if (items.keychest0 >= 2 && items.bigkey0) return items.lantern ? 'possible' : 'dark';
					if (items.bigkey0 && items.bow > 1 && !items.lantern) return 'dark';
					return 'unavailable';					
				} else {
					return canReachLightWorldBunny() ? (items.chest0 <= 2 && !items.lantern ||
						items.chest0 === 1 && !(items.bow > 1 && items.moonpearl) ?
						'possible' : (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable'))) : 'unavailable';
				}
			}
		}, { // [1]
			caption: 'Desert Palace',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (is_enemizer) {
					} else {
					}
					if (!canReachLightWorldBunny()) return 'unavailable';
					if (!items.bigkey1) return 'unavailable';
					if (!(melee_bow() || cane() || rod())) return 'unavailable';
					if (!items.book || !items.glove || (!items.lantern && !items.firerod)) return 'unavailable';
					return 'available';
				} else {
					if (is_enemizer) {
					} else {
					}
					if (!(melee_bow() || cane() || rod())) return 'unavailable';
					if (!(items.book && items.glove && canReachLightWorld())) return 'unavailable';
					if (!items.lantern && !items.firerod) return 'unavailable';
					return items.boots ? 'available' : 'possible';
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!canReachLightWorldBunny() || !items.book) return 'unavailable';
					if (items.bigkey1 && items.smallkey1 === 1 && items.glove && (items.lantern || items.firerod) && items.boots) return 'available';
									
					// item count approach
					var reachable = 0;
					var curr_keys = 0;
					curr_keys += items.smallkey1;
					reachable += 1; // free first chest
					// 0 key chests
					if (items.boots) {
						reachable += 1; // bonk spot on torch
					}

					if (items.bigkey1) {
						reachable += 1; // big chest
						if (items.glove && (items.lantern || items.firerod)) {
							reachable += 1; // boss kill
						}
					}
									
					// 1 key chests
					if (curr_keys > 0) {
						reachable += 2; // Right side small key room
						curr_keys -= 1;
					}				
					
					if (items.keychest1 > 6 - reachable) {
						return 'possible';
					}					
					return 'unavailable';					
				} else {
					if (!items.book || !canReachLightWorldBunny() || (!items.moonpearl && !items.mirror)) return 'unavailable';
					if (items.glove && (items.firerod || items.lantern) && items.boots) return (items.moonpearl ? 'available' : 'sequencebreak');
					return items.chest1 > 1 && items.boots ? (items.moonpearl ? 'available' : 'sequencebreak') : 'possible';
				}
			}
		}, { // [2]
			caption: 'Tower of Hera',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (is_enemizer) {
					} else {
					}
					if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2))
					return 'unavailable';
					if (items.bigkey2) return (items.lantern || activeFlute()) ? 'available' : 'dark';
					return 'unavailable';
				} else {
					if (is_enemizer) {
					} else {
					}
					return this.can_get_chest();
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2))
					return 'unavailable';
				
					if (items.bigkey2 && items.smallkey2 === 1 && melee() && (items.lantern || items.firerod) && ((items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2))) return 'available';
					
					if (items.keychest2 >= 5) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					if (items.keychest2 >= 4 && items.smallkey2 === 1 && (items.firerod || items.lantern)) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					if (items.keychest2 >= 3 && items.bigkey2) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					if (items.keychest2 >= 2 && items.bigkey2 && (melee() || (items.smallkey2 === 1 && (items.firerod || items.lantern)))) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					return 'unavailable';
				} else {
					if(!(items.glove || activeFlute()) || !items.moonpearl || !items.hammer || !(items.hookshot || items.glove === 2))
						return 'unavailable';
					return items.firerod || items.lantern ?
						(items.lantern || activeFlute() ? 'available' : 'dark') :
						'possible';					
				}
			}
		}, { // [3]
			caption: 'Palace of Darkness {lantern}',
			is_beaten: false,
			is_beatable: function() {
				if(!canReachPyramid() || !(items.bow > 1) || !items.hammer) return 'unavailable';
				if (is_keysanity) {
					if (!items.bigkey3 || items.smallkey3 === 0) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(3, items.lantern, items.smallkey3 < 6);
					} else {
						if (items.smallkey3 < 6) return items.lantern ? 'possible' : 'dark';
						return items.lantern ? 'available' : 'dark';
					}
				} else {
					if (is_enemizer) {
						return enemizer_check(3, items.lantern, false);
					} else {
						return items.lantern ? 'available' : 'dark';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!canReachPyramidWithoutFlippers() && !canReachPyramid()) return 'unavailable';
					if (items.smallkey3 === 6 && items.bigkey3 && items.hammer && items.bow > 1 && items.lantern) return 'available';
					// item count approach
					var reachable = 0;
					var curr_keys = 0;
					var dark_chests = 0;
					curr_keys += items.smallkey3;
					reachable += 1; // free first chest
					// 0 key chests
					if (items.bow > 1) reachable += 2; // bow locked right side
					// conditioned key usage
					if (items.bow > 1 && items.hammer) {
						reachable += 2; // bridge and dropdown
					} else {
						if (curr_keys > 0) {
							reachable += 2; // bridge and dropdown
							curr_keys -= 1; // front door used
						}
					}
					// 1 key chests
					if (curr_keys > 0) {
						reachable += 3; // Back side of POD, since it yields most chests for the key
						curr_keys -= 1;
						dark_chests += 2;
					}
					if (curr_keys > 0) {
						reachable += items.bigkey3 ? 3 : 2; // Dark area with big chest
						curr_keys -= 1;
						dark_chests += items.bigkey3 ? 3 : 2;
					}
					if (items.bow > 1 && items.hammer && items.bigkey3 && curr_keys > 0) {
						reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
						curr_keys -= 1;
						dark_chests += 1;
					}
					if (curr_keys > 0) {
						reachable += 1; // Spike Room
						curr_keys -= 1;
					}
					if (curr_keys > 0) {
						reachable += 1; // Vanilla big key chest
						curr_keys -= 1;
					}

					if (items.keychest3 > 14 - reachable) {
						if (items.keychest3 > 14 - (reachable - dark_chests)) {
							return 'possible';
						} else {
							return items.lantern ? 'possible' : 'dark';
						}
					}
					
					return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
				} else {
					if(canReachPyramidWithoutFlippers())
						return !(items.bow > 1 && items.lantern) ||
							items.chest3 === 1 && !items.hammer ?
							'possible' : 'available';
					if(!items.flippers) //Will add back in sequence break logic later
						return 'unavailable';
					return !(items.bow > 1) ||
						items.chest3 === 1 && !items.hammer ?
						'possible' : (items.flippers ? (items.lantern ? 'available' : 'possible') : 'sequencebreak');
				}
			}
		}, { // [4]
			caption: 'Swamp Palace {mirror}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (items.smallkey4 === 0 || !items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers || !items.hammer || !items.hookshot) return 'unavailable';					
					if (is_enemizer) {
						return enemizer_check(4, true, false);
					} else {
						return 'available'
					}
				} else {
					if (!items.moonpearl || !canReachLightWorldBunny() || !items.mirror || !items.flippers || !items.hammer || !items.hookshot) return 'unavailable';	
					if (is_enemizer) {
						return enemizer_check(4, true, false);
					} else {
						return 'available'
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
					if (!canReachLightWorldBunny()) return 'unavailable';
					if (items.bigkey4 && items.smallkey4 === 1 && items.hammer && items.hookshot) return 'available';
					if (items.keychest4 === 10) return 'possible';
					if (items.keychest4 >= 9 && items.smallkey4 === 1) return 'possible';
					if (items.keychest4 >= 6 && items.smallkey4 === 1 && items.hammer) return 'possible';
					if (items.keychest4 >= 5 && items.bigkey4 && items.smallkey4 === 1 && items.hammer) return 'possible';				
					if (items.keychest4 >= 2 && items.smallkey4 === 1 && items.hammer && items.hookshot) return 'possible';
					return 'unavailable';					
				} else {
					if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
					if (!canReachLightWorldBunny()) return 'unavailable';
					var entryMethod = items.moonpearl ? 'available' : 'sequencebreak';
					if (items.chest4 <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : entryMethod;
					if (items.chest4 <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : entryMethod;
					if (items.chest4 <= 5) return !items.hammer ? 'unavailable' : entryMethod;
					return !items.hammer ? 'possible' : entryMethod;
				}
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				if (!items.firerod || (items.sword == 0 && !is_swordless)) {
					return 'unavailable';
				}
				if (is_enemizer) {
					return enemizer_check(5, true, false);
				} else {
					return 'available';
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (items.bigkey5 && items.firerod && (items.sword > 0 || swordless === 'yes')) return 'available';
					if (items.keychest5 >= 4) return 'possible';
					if (items.keychest5 >= 3 && (items.bigkey5 || items.firerod)) return 'possible';
					if (items.keychest5 >= 2 && items.firerod && ((items.sword > 0 && swordless === 'no') || items.bigkey5)) return 'possible';
					return 'unavailable';					
				} else {
					return items.firerod ? 'available' : 'possible';
				}
			}
		}, { // [6]
			caption: 'Thieves\' Town',
			is_beaten: false,
			is_beatable: function() {
				if (!(melee() || cane())) return 'unavailable';
				if (is_keysanity) {
					if (!items.bigkey6) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(6, true, false);
					} else {
						return 'available';
					}
				} else {
					if (is_enemizer) {
						return enemizer_check(6, true, false);
					} else {
						return 'available';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (items.bigkey6 && items.smallkey6 === 1 && items.hammer) return 'available';
					if (items.keychest6 >= 5) return 'possible';
					if (items.keychest6 >= 3 && items.bigkey6) return 'possible';
					if (items.keychest6 >= 2 && items.bigkey6 && (melee() || cane())) return 'possible';
					return 'unavailable';
				} else {
					return items.chest6 === 1 && !items.hammer ? 'possible' : 'available';
				}
			}
		}, { // [7]
			caption: 'Ice Palace (yellow=must bomb jump)',
			is_beaten: false,
			is_beatable: function() {
				if (!items.flippers || !items.hammer) return 'unavailable';
				if (!items.firerod && !items.bombos) return 'unavailable';
				if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
				if (is_keysanity) {
					if (is_enemizer) {
						if (items.bigkey7 && ((items.smallkey7 > 0 && items.somaria) || items.smallkey7 > 1)) {
							return enemizer_check(7, true, false);
						} else {
							return enemizer_check(7, true, true);
						}
					} else {
						if (items.bigkey7 && ((items.smallkey7 > 0 && items.somaria) || items.smallkey7 > 1)) return 'available';
						return 'possible'; /* via bomb jump */
					}
				} else {
					if (is_enemizer) {
						if (items.hookshot || items.somaria) {
							return enemizer_check(7, true, false);
						} else {
							return enemizer_check(7, true, true);
						}
					} else {
						return (items.hookshot || items.somaria) ? 'available' : 'unavailable';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.flippers) return 'unavailable';
					if (!items.firerod && !items.bombos) return 'unavailable';
					if (items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
					if (items.bigkey7 && items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
					if (items.bigkey7 && items.hammer) return 'possible';
					if (items.keychest7 >= 5) return 'possible';
					if (items.keychest7 >= 4 && items.bigkey7) return 'possible';
					if (items.keychest7 >= 2 && items.hammer) return 'possible';
					return 'unavailable';
				} else {
					if (!items.flippers) return 'unavailable';
					if (!items.firerod && !items.bombos) return 'unavailable';
					if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
					return items.hammer && items.glove !== 0 ? (items.flippers ? 'available' : (items.boots || canReachPyramidWithoutFlippers() ? 'sequencebreak' : 'unavailable')) : 
						(items.flippers || items.boots || canReachPyramidWithoutFlippers() ? 'possible' : 'unavailable');
				}
			}
		}, { // [8]
			caption: 'Misery Mire {medallion0}{lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (!melee_bow()) return 'unavailable';
				if (!(activeFlute() || (items.mirror && canReachLightWorldBunny())) || !items.somaria) return 'unavailable';
				if (!items.boots && !items.hookshot) return 'unavailable';

				
				if (is_keysanity) {
					if (!items.bigkey8) return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;
					
					if (is_enemizer) {
						return enemizer_check(8, items.lantern, false);
					} else {
						return items.lantern || items.firerod ? items.lantern ? 'available' : 'dark' : 'possible';
					}
				} else {
					var state = medallion_check(0);
					if (state) return state;
					
					if (is_enemizer) {
						if (!items.firerod && !items.lantern) return enemizer_check(8, items.lantern, true);
						return enemizer_check(8, items.lantern, false);
					} else {
						return items.lantern || items.firerod ? items.lantern ? 'available' : 'dark' : 'possible';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;

					if (items.lantern && items.bigkey8 && items.somaria) return 'available';

					if (items.keychest8 >= 5) return 'possible';
					if (items.keychest8 >= 4 && items.bigkey8) return 'possible';
					if (items.keychest8 >= 3 && items.bigkey8 && items.somaria && !items.lantern && !items.firerod) return 'dark';
					if (items.keychest8 >= 3 && (items.lantern || items.firerod)) return 'possible';
					if (items.keychest8 >= 2 && (items.firerod || items.lantern) && items.bigkey8) return 'possible';
					if (items.keychest8 >= 1 && !items.lantern && items.firerod && items.bigkey8 && items.somaria) return 'dark';
					return 'unavailable';
				} else {
					if (!(activeFlute() || (items.mirror && canReachLightWorldBunny()))) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					if(!(items.sword || items.hammer || items.somaria || items.byrna || items.firerod || items.bow > 1))
						return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;

					return (items.chest8 > 1 ?
						items.lantern || items.firerod :
						items.lantern && items.somaria) ?
						'available' : 'possible';
				}
			}
		}, { // [9]
			caption: 'Turtle Rock {medallion0}/{mirror}{lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (!(items.glove || activeFlute()) || !items.somaria) return 'unavailable';
				if ((!items.icerod && !is_enemizer) || !items.firerod || !melee()) return 'unavailable';
				if (is_keysanity) {
					if (!items.bigkey9) return 'unavailable';
					
					if (is_enemizer) {
						if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2 && items.hammer)))
						{
							//Back door is available, override normal logic
							return enemizer_check(9, items.lantern, items.smallkey9 < 4);
						}
						else
						{
							if (items.smallkey9 < 3) return 'unavailable';
							//Back door is not available, use normal logic
							var state = medallion_check(1);
							if(state) return state;
							if (items.smallkey9 === 4) {
								return enemizer_check(9, items.lantern, false);
							}
						}
					} else {
						if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2 && items.hammer)))
						{
							//Back door is available, override normal logic
							return items.smallkey9 === 4 ? (items.lantern || items.flute) ? 'available' : 'dark' : (items.lantern || items.flute) ? 'possible' : 'dark';
						}
						else
						{
							if (items.smallkey9 < 3) return 'unavailable';
							//Back door is not available, use normal logic
							var state = medallion_check(1);
							if(state) return state;
							return items.smallkey9 === 4 ? 'available' : 'possible';
						}
					}
				} else {
					if (is_enemizer) {
						if(items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2 && items.hammer)))
						{
							if(!items.lantern || !(items.byrna || items.cape || items.shield === 3))
								return enemizer_check(9, items.lantern, true);
							if(medallion_check(1))
								return enemizer_check(9, items.lantern, true);
							return enemizer_check(9, items.lantern, false);
						}
						var state = medallion_check(1);
						if(state) return state;
						if(!items.lantern || !(items.byrna || items.cape || items.shield === 3)) {
							return enemizer_check(9, items.lantern, true);
						} else {
							return enemizer_check(9, items.lantern, false);
						}
					} else {
						if(items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2 && items.hammer)))
						{
							if(!items.lantern || !(items.byrna || items.cape || items.shield === 3))
								return 'possible';
							if(medallion_check(1))
								return 'possible';
							return 'available';
						}
						var state = medallion_check(1);
						if(state) return state;
						return 'possible';
					}
				}				
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (items.mirror && ((items.hookshot && items.moonpearl) || (items.glove === 2 && items.hammer)))
					{
						//Back door is available, override normal logic
						//First 4 chests are available from the laser bridge based off safety
						//if (items.smallkey9 === 0) {
						if (items.somaria) {
							//With cane, no small keys, can get all 12 chests based off items as long as no doors are opened from behind
							//4 chests with safety, sequencebreak without safety
							//Lantern is only required for one chest if you don't have a small key or the big key
							//Fire rod adds 2 chests
							//Fire rod, ice rod, and big key adds 1 chest (Trinexx)
							//Big Key adds 1 chest
							
							if (items.bigkey9 && items.firerod && items.icerod)
							{
								if (items.keychest9 >= 5) return (items.lantern || items.flute) ? 'available' : 'dark';
								return (items.byrna || items.cape || items.shield === 3) ? (items.lantern || items.flute) ? 'available' : 'dark' : (items.lantern || items.flute) ? 'available' : 'dark';
								//TEMPORARLY DISABLING THE SEQUENCE BREAK CHECK, WILL ADD INTO TOGGLE SWITCH
								//return (items.byrna || items.cape || items.shield === 3) ? (items.lantern || items.flute) ? 'available' : 'dark' : (items.lantern || items.flute) ? 'sequencebreak' : 'dark';									
							}
							
							var totalchests = 0;
							var darkchests = 0;
							var sequencechests = 0;
							
							totalchests = 3;
							
							if (items.bigkey9) totalchests = totalchests + 1;
							if (items.firerod) totalchests = totalchests + 2;

							if (items.byrna || items.cape || items.shield === 3)
							{
								totalchests = totalchests + 4;
							}
							else
							{
								sequencechests = sequencechests + 4;
								totalchests = totalchests + 4;
							}

							if (!items.lantern && !items.bigkey9 && items.smallkey9 == 0)
							{
								darkchests = darkchests + 1;
								totalchests = totalchests + 1;
							}
							else
							{
								totalchests = totalchests + 1;
							}
							
							sequencechests = 0;
							
							if (items.keychest9 > 12 - totalchests) {
								if (items.keychest9 > 12 - (totalchests - darkchests - sequencechests)) {
									return items.lantern ? 'possible' : 'dark';
								} else {
									return items.lantern ? 'possible' : 'dark';
								}
							}
							
							return 'unavailable';
						} else {
							//No cane, no small keys
							if (items.keychest9 >= 9) {
								return (items.byrna || items.cape || items.shield === 3) ? 'available' : 'sequencebreak';
							} else {
								return 'unavailable';
							}
						}
					}
					else
					{
						//Back door is not available, use normal logic
						if (!items.somaria) return 'unavailable';						
						
						var state = medallion_check(1);
						if (state) return state;

						if (items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
						
						// item count approach
						var reachable = 0;
						var curr_keys = 0;
						var dark_chests = 0;
						curr_keys += items.smallkey9;
						reachable += 1; // free first chest
						// 0 key chests
						if (items.firerod) {
							reachable += 2; // fire rod locked right side				
						}
						// 1 key chests
						if (curr_keys > 0) {
							reachable += 1; // Chain Chomp room
							curr_keys -= 1;
						}
						// 2 key chests
						if (curr_keys > 0) { 
							curr_keys -= 1;
							if (!items.bigkey9) {
								// Unable to proceed beyond big key room, but can get vanilla big key chest
								reachable += 1;
							} else {
								reachable += 2; // Big chest and roller room
								if (items.byrna || items.cape || items.shield === 3) {
									// Logic for laser bridge, needs safety item to be in logic
									reachable += 4;
									if (!items.lantern) {
										dark_chests += 4;
									}
								}
							}
						}
						// 3 key chests
						if (curr_keys > 0) { 
							curr_keys -= 1;
							reachable += 1; // Either Trinexx or vanilla big key chest will be obtainable with 3 keys
						}				
						
						// 4 key chests
						if (curr_keys > 0) { 
							if (!items.lantern && items.icerod && items.firerod) {
								dark_chests += 1; // All of TR is clearable in the dark
								reachable += 1;
							}
						}
						
						if (items.keychest9 > 12 - reachable) {
							if (items.keychest9 > 12 - (reachable - dark_chests)) {
								return 'possible';
							} else {
								return items.lantern ? 'possible' : 'dark';
							}
						}
						
						return 'unavailable';
					}					
					
					return 'unavailable';
				} else {
					if(!(items.glove || activeFlute()))
						return 'unavailable';
					var laser_safety = items.byrna || items.cape || items.shield === 3,
						dark_room = items.lantern ? 'available' : 'dark';
					if(items.mirror && ((items.hookshot && items.moonpearl) || items.glove === 2))
					{
						if(!items.somaria)
							return 'possible';
						if(medallion_check(1))
						{
							if(items.chest9 <= 3)
								return 'possible';
							if(items.chest9 <= 4)
								return laser_safety && items.lantern ? 'available' : 'possible';
							return laser_safety && items.lantern ? 'available' : 'possible';
						}
						//Disabled sequence break logic until that revision
						if(items.chest9 <= 1)
							return !laser_safety ? (items.firerod && items.icerod ? 'possible' : 'possible') : items.firerod && items.icerod && items.lantern ? 'available' : 'possible';
						if(items.chest9 <= 2)
							return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod && items.lantern ? 'available' : 'possible';
						if(items.chest9 <= 3)
							return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod ? (items.lantern || activeFlute() ? 'available' : 'dark') : 'possible';
						return !laser_safety ? (items.firerod ? 'possible' : 'possible') : items.firerod ? (items.lantern || activeFlute() ? 'available' : 'dark') : (items.lantern ? 'available' : 'possible');
					}
					if(!items.somaria)
						return 'unavailable';
					var state = medallion_check(1);
					if(state)
						return state;
					return 'possible';
				}
			}
		}, { // [10]
			caption: 'Ganon\'s Castle (7 Crystals)',
			is_beaten: false,
			is_beatable: function() {
				if (crystal_check() < 7) {
					return 'unavailable';
				}
				
				if (is_keysanity) {
					if (items.bigkey10 &&  items.bow > 1 && items.hookshot && (items.firerod || items.lantern)) {
						if (items.smallkey10 < 3) return 'possible';
						if (items.smallkey10 >= 3) return (is_enemizer && !items.icerod) ? 'possible' : 'available';
					}
					return 'unavailable';
				} else {
					if (items.bow > 1 && items.hookshot && (items.firerod || items.lantern)) {
						if (!items.somaria || !items.boots) return 'possible';
						return (is_enemizer && !items.icerod) ? 'possible' : 'available';
					} else {
						return 'unavailable';
					}
				}
			},
			can_get_chest: function() {
				if (crystal_check() < 7) {
					return 'unavailable';
				}
				
				if (is_keysanity) {
					if (items.bigkey10 && items.smallkey10 > 2 && items.bow > 1 && items.hookshot && items.firerod && items.somaria) return 'available';
					// Counting reachable items and keys
					var reachable = 0;
					var curr_keys = 0;
					curr_keys += items.smallkey10;
					curr_keys += 1; // free key on left side
					// 0 key chests
					reachable += 2; // first two right side chests
					if (items.boots) reachable += 1; // torch
					if (items.somaria) reachable += 1; // tile room
					if (items.hookshot && items.hammer) reachable += 4; // stalfos room
					if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod)){ 
						reachable += 2; // mini helmasaur room
						curr_keys += 1; // mini helmasaur room
					}
					// 0 key chests with common sense
					if (items.somaria && items.firerod && curr_keys > 0) reachable += 4; // rest of the right side chests. The key is gained back after those.
					if (items.hookshot && items.hammer) reachable += 1; // chest before randomizer room. We assume the key in the switch room is used for this one
					if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod) && curr_keys > 0) {
						reachable += 1; // room after mini helmasaurs. We assume players keep enough keys to reach top. If they didnt, then they got other chests for that key.
						curr_keys -= 1;
					}
					if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod) && items.hookshot && ((items.sword > 0 || swordless === 'yes') || items.hammer) && curr_keys > 0) {
						reachable += 1; // Chest after Moldorm. See assumptions above.
						curr_keys -= 1;
					}
					// 1 key chests 
					if (curr_keys > 0) {
						if (items.hookshot && items.hammer) { // we can reach randomizer room and the area after that
							reachable += items.bigkey10 ? 9 : 8;
							curr_keys -= 1;
						} else {
							if (items.somaria && items.firerod) {    // we can reach armos' area via right side
								reachable += items.bigkey10 ? 5 : 4;
								curr_keys -= 1;
							}
						}
					}
					if ((items.hookshot || items.boots) && items.hammer && curr_keys > 0) {
						reachable += 1; // Vanilla map chest aka double firebar chest. Since one item for one key is the least bang for the buck we check this one last.
						curr_keys -= 1;
					}
					// 1 key chests
					if (items.keychest10 > (27 - reachable)) return 'possible'; // available was checked at the beginning. You can get all items with 2 smallkey10 alone but let's make it 'possible' in case someone had to open second right side door to get to armos in order to get hookshot

					return 'unavailable'; // We got all reachable items or even more than that in case the player did not follow the 'common sense'
				} else {
					if (items.bow > 1 && items.hookshot && items.firerod && items.somaria && items.boots) return 'available';
					return 'possible';
				}
			}
		}];

		window.agahnim = {
			caption: 'Agahnim {sword1}{lantern}',
			is_available: function() {
				if (is_keysanity) {
					return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 1))) && (items.sword || (is_swordless && (items.hammer || items.net))) && (activeFlute() || items.glove) && items.smallkeyhalf1 === 2 && agatowerweapon() ?
						items.lantern ? 'available' : 'dark' :
						'unavailable';					
				} else {
					return (items.sword || items.hammer || (items.net && (items.somaria || items.byrna || items.firerod || items.bow > 1))) && (items.sword || (is_swordless && (items.hammer || items.net))) && (activeFlute() || items.glove) ?
						items.lantern && agatowerweapon() ? 'available' : 'dark' :
						'unavailable';
				}
			}
		};

		//define overworld chests
		window.chests = [{ // [0]
			caption: 'King\'s Tomb {boots} + {glove2}',
			is_opened: false,
			is_available: function() {
				return items.boots && items.glove === 2 && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [1]
			caption: 'Light World Swamp (2)',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [2]
			caption: 'Stoops Lonk\'s Hoose',
			is_opened: false,
			is_available: always
		}, { // [3]
			caption: 'Spiral Cave',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.moonpearl ? (items.lantern || activeFlute() ? 'available' : 'dark') : 'sequencebreak') :
					'unavailable';
			}
		}, { // [4]
			caption: 'Mimic Cave',
			is_opened: false,
			is_available: function() {
				return items.hammer && items.moonpearl && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'dark') :
					'unavailable';
			}
		}, { // [5]
			caption: 'Tavern',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [6]
			caption: 'Chicken House {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [7]
			caption: 'Bombable Hut {bomb}',
			is_opened: false,
			is_available: always
		}, { // [8]
			caption: 'C House',
			is_opened: false,
			is_available: always
		}, { // [9]
			caption: 'Aginah\'s Cave {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [10]
			caption: 'Mire Shed (2)',
			is_opened: false,
			is_available: function() {
				return activeFlute() || (items.mirror && canReachLightWorldBunny()) ? 'available' : 'unavailable';
			}
		}, { // [11]
			caption: 'Super Bunny Chests (2)',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) ?
					(items.lantern || activeFlute() ? 'available' : 'dark') :
					'unavailable';
			}
		}, { // [12]
			caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror && items.boots ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [13]
			caption: 'Byrna Spike Cave',
			is_opened: false,
			is_available: function() {
				return items.glove && items.hammer && (items.byrna || items.cape) ?
					items.lantern || activeFlute() ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [14]
			caption: 'Kakariko Well (4 + {bomb})',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [15]
			caption: 'Thieve\'s Hut (4 + {bomb})',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'possible' : 'unavailable')) : 'unavailable';
			}
		}, { // [16]
			caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
			is_opened: false,
			is_available: always
		}, { // [17]
			caption: 'Paradox Cave (5 + 2 {bomb})',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.moonpearl ? (items.lantern || activeFlute() ? 'available' : 'dark') : (items.sword >= 2 ? 'possible' : 'unavailable')) :
					'unavailable';
			}
		}, { // [18]
			caption: 'West of Sanctuary {boots}',
			is_opened: false,
			is_available: function() {
				return items.boots && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [19]
			caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [20]
			caption: 'Ice Rod Cave {bomb}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [21]
			caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
			is_opened: false,
			is_available: function() {
				return items.glove && (items.boots || items.hookshot) ?
					(items.lantern || activeFlute() ? 'available' : 'dark') :
					'unavailable';
			}
		}, { // [22]
			caption: 'Hookshot Cave (3 top chests) {hookshot}',
			is_opened: false,
			is_available: function() {
				return items.glove && items.hookshot ?
					(items.lantern || activeFlute() ? 'available' : 'dark') :
					'unavailable';
			}
		}, { // [23]
			caption: 'Treasure Chest Minigame: Pay 30 rupees',
			is_opened: false,
			is_available: always
		}, { // [24]
			caption: 'Bottle Vendor: Pay 100 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [25]
			caption: 'Sahasrahla {pendant0}',
			is_opened: false,
			is_available: function() {
				if(canReachLightWorldBunny())
					for(var k = 0; k < 10; k++)
						if(prizes[k] === 1 && items['boss'+k])
							return 'available';
				return 'unavailable';
			}
		}, { // [26]
			caption: 'Ol\' Stumpy',
			is_opened: false,
			is_available: always
		}, { // [27]
			caption: 'Lazy Drunk Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.bottle ? 'available' : 'unavailable';
			}
		}, { // [28]
			caption: 'Gary\'s Lunchbox (save the frog first)',
			is_opened: false,
			is_available: function() {
				return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [29]
			caption: 'Fugitive under the bridge {flippers}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers ? 'available' : 'sequencebreak') : 'unavailable';
			}
		}, { // [30]
			caption: 'Ether Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.hammer && items.book && (activeFlute() || items.glove) && (items.hookshot || items.glove === 2) ?
					(items.sword >= 2 || (is_swordless && items.hammer) ? (items.lantern || activeFlute() ? 'available' : 'dark') : 'possible') :
					'unavailable';
			}
		}, { // [31]
			caption: 'Bombos Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() && items.book ?
					(items.sword >= 2 || (is_swordless && items.hammer)) ? 'available' : 'possible' :
					'unavailable';
			}
		}, { // [32]
			caption: 'Catfish',
			is_opened: false,
			is_available: function() {
				if(!items.glove)
					return 'unavailable';
				if(canReachPyramid())
					return 'available';
				return items.boots ? 'sequencebreak' : 'unavailable';
			}
		}, { // [33]
			caption: 'King Zora: Pay 500 rupees',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers || items.glove ? 'available' : 'sequencebreak') : 'unavailable';
			}
		}, { // [34]
			caption: 'Lost Old Man {lantern}',
			is_opened: false,
			is_available: function() {
				return items.glove || activeFlute() ? items.lantern ? 'available' : 'dark' : 'unavailable';
			}
		}, { // [35]
			caption: 'Witch: Give her {mushroom}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() && items.mushroom ? 'available' : 'unavailable';
			}
		}, { // [36]
			caption: 'Forest Hideout',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [37]
			caption: 'Lumberjack Tree {agahnim}{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.agahnim && items.boots && items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [38]
			caption: 'Spectacle Rock Cave',
			is_opened: false,
			is_available: function() {
				return items.glove || activeFlute() ? (items.lantern || activeFlute() ? 'available' : 'dark') : 'unavailable';
			}
		}, { // [39]
			caption: 'South of Grove',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'possible')) : 'unavailable';
			}
		}, { // [40]
			caption: 'Graveyard Cliff Cave',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [41]
			caption: 'Checkerboard Cave',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() && items.glove ? 'available' : 'unavailable';
			}
		}, { // [42]
			caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
			is_opened: false,
			is_available: function() {
				return items.hammer && (items.glove === 2 || (items.mirror && canReachLightWorldBunny())) ? 'available' : 'unavailable';
			}
		}, { // [43]
			caption: 'Library {boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.boots ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'possible')) : 'possible') : 'unavailable';
			}
		}, { // [44]
			caption: 'Mushroom',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [45]
			caption: 'Spectacle Rock',
			is_opened: false,
			is_available: function() {
				if(!(items.glove || activeFlute()))
					return 'unavailable';
				return items.moonpearl && items.hammer && (items.hookshot || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'dark') :
					'possible';
			}
		}, { // [46]
			caption: 'Floating Island',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) && ((items.hookshot && items.moonpearl) || items.glove === 2) ?
					(items.lantern || activeFlute() ? 'available' : 'dark') :
					'unavailable';
			}
		}, { // [47]
			caption: 'Race Minigame {bomb}/{boots}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : 'possible') : 'unavailable';
			}
		}, { // [48]
			caption: 'Desert West Ledge {book}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.book ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'possible')) : 'possible') : 'unavailable';
			}
		}, { // [49]
			caption: 'Lake Hylia Island {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorldBunny())
					return 'unavailable';
				return items.moonpearl ? (items.flippers ? 'available' : 'sequencebreak') : 'possible';
			}
		}, { // [50]
			caption: 'Bumper Cave {cape}{mirror}',
			is_opened: false,
			is_available: function() {
				return items.glove && items.cape && items.mirror && canReachLightWorld() ? 'available' : 'possible';
			}
		}, { // [51]
			caption: 'Pyramid',
			is_opened: false,
			is_available: function() {
				if(canReachPyramid())
					return 'available';
				return items.boots ? 'sequencebreak' : 'unavailable';
			}
		}, { // [52]
			caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
			is_opened: false,
			is_available: always
		}, { // [53]
			caption: 'Zora River Ledge {flippers}',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorld())
					return 'unavailable';
				if(items.flippers)
					return 'available';
				//if(items.boots)
					//return 'sequencebreak';
				return 'possible';
			}
		}, { // [54]
			caption: 'Buried Item {shovel}',
			is_opened: false,
			is_available: function() {
				return items.shovel && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [55]
			caption: 'Escape Sewer Side Room (3) {bomb}/{boots} (yellow = might need small key)',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.glove && items.moonpearl ? 'available' :
					(items.mirror ? 'possible' : 'unavailable')) : 'unavailable';
			}
		}, { // [56]
			caption: "Castle Secret Entrance (Uncle + 1)",
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [57]
			caption: 'Hyrule Castle Dungeon (3)',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [58]
			caption: 'Sanctuary',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? 'available' : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [59]
			caption: 'Mad Batter {hammer} + {powder}',
			is_opened: false,
			is_available: function() {
				return items.powder && items.hammer && canReachLightWorld() ? 'available' : 'unavailable';
			}
		}, { // [60]
			caption: 'Take the frog home',
			is_opened: false,
			is_available: function() {
				return (items.mirror || items.glove === 2) && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [61]
			caption: 'Fat Fairy: Buy OJ bomb from Light Link\'s House after {crystal}5 {crystal}6 (2 items)',
			is_opened: false,
			is_available: function() {
				//crystal check
				var crystal_count = 0;
				for(var k = 0; k < 10; k++)
					if(prizes[k] === 4 && items['boss'+k])
						crystal_count += 1;
				return crystal_count >= 2 && items.mirror && canReachLightWorldBunny() ? 'available' : 'unavailable';
			}
		}, { // [62]
			caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
			is_opened: false,
			is_available: function() {
				if(!canReachLightWorldBunny())
					return 'unavailable';
				var pendant_count = 0;
				for(var k = 0; k < 10; k++)
					if((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k])
						if(++pendant_count === 3)
							return 'available';
				return items.book ? 'possible' : 'unavailable';
			}
		}, { // [63]
			caption: 'Escape Sewer Dark Room {lantern}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorldBunny() ? (items.moonpearl ? (items.lantern ? 'available' : 'dark') : (items.mirror ? 'sequencebreak' : 'unavailable')) : 'unavailable';
			}
		}, { // [64]
			caption: 'Waterfall of Wishing (2) {flippers}',
			is_opened: false,
			is_available: function() {
				return canReachLightWorld() ? (items.flippers ? 'available' : 'sequencebreak') : 'unavailable';
			}
		}, { // [65]
			caption: 'Castle Tower',
			is_opened: false,
			is_available: function() {
				return (activeFlute() || items.glove) ? items.lantern ? 'available' : 'dark' : 'unavailable';
			}
		}, { // [66]
			caption: 'Castle Tower (small key)',
			is_opened: false,
			is_available: function() {
				if (is_retro) {
					return (activeFlute() || items.glove) ? items.lantern ? 'available' : 'dark' : 'unavailable';
				} else {
					return (activeFlute() || items.glove) && items.smallkeyhalf1 > 0 ? items.lantern ? 'available' : 'dark' : 'unavailable';
				}
			}
		}];
	}
	else
	{
		// define dungeon chests
		window.dungeons = [{ // [0]
			caption: 'Eastern Palace {lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity && !items.bigkey0) return 'unavailable';
				if (is_enemizer) {
					return enemizer_check(0, items.lantern, false);
				} else {
					return items.bow > 1 ?
						items.lantern ? 'available' : 'dark' :
						'unavailable';
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (items.bigkey0 && items.bow > 1 && items.lantern) return 'available';
					if (items.keychest0 >= 4) return 'possible';
					if (items.keychest0 >= 3 && !items.bigkey0 && !items.lantern) return 'dark';
					if (items.keychest0 >= 3 && (items.bigkey0 || items.lantern)) return 'possible';
					if (items.keychest0 >= 2 && items.bigkey0) return items.lantern ? 'possible' : 'dark';
					if (items.bigkey0 && items.bow > 1 && !items.lantern) return 'dark';
					return 'unavailable';			
				} else {
					return items.chest0 <= 2 && !items.lantern ||
						items.chest0 === 1 && !(items.bow > 1) ?
						'possible' : 'available';
				}
			}
		}, { // [1]
			caption: 'Desert Palace',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!items.bigkey1) return 'unavailable';
					if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
					if (!items.lantern && !items.firerod) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(1, true, false);
					} else {
						if (!(melee_bow() || cane() || rod())) return 'unavailable';
						return 'available';
					}					
				} else {
					if (!(items.book && items.glove) && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
					if (!items.lantern && !items.firerod) return 'unavailable';
					if (is_enemizer) {
						return items.boots ? enemizer_check(1, true, false) : enemizer_check(1, true, true);
					} else {
						if (!(melee_bow() || cane() || rod())) return 'unavailable';
						return items.boots ? 'available' : 'possible';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
					if (items.bigkey1 && items.smallkey1 === 1 && items.glove && (items.lantern || items.firerod) && items.boots) return 'available';
					
					// item count approach
					var reachable = 0;
					var curr_keys = 0;
					curr_keys += items.smallkey1;
					reachable += 1; // free first chest
					// 0 key chests
					if (items.boots) {
						reachable += 1; // bonk spot on torch
					}

					if (items.bigkey1) {
						reachable += 1; // big chest
						if (items.glove && (items.lantern || items.firerod)) {
							reachable += 1; // boss kill
						}
					}
									
					// 1 key chests
					if (curr_keys > 0) {
						reachable += 2; // Right side small key room
						curr_keys -= 1;
					}				
					
					if (items.keychest1 > 6 - reachable) {
						return 'possible';
					}					
					return 'unavailable'; 
				} else {
					if (!items.book && !(items.flute && items.glove === 2 && items.mirror)) return 'unavailable';
					if (items.glove && (items.firerod || items.lantern) && items.boots) return 'available';
					return items.chest1 > 1 && items.boots ? 'available' : 'possible';
				}
			}
		}, { // [2]
			caption: 'Tower of Hera',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!melee() || !items.bigkey2) return 'unavailable';
					if (!items.flute && !items.glove) return 'unavailable';
					if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(2, items.lantern, false);
					} else {
						return !items.flute && !items.lantern ? 'dark' : 'available';
					}
				} else {
					if (!items.flute && !items.glove) return 'unavailable';
					if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(2, (items.flute || items.lantern), false);
					} else {
						if (!melee()) return 'unavailable';
						return this.can_get_chest();
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!(items.flute || items.glove) || !(items.mirror || (items.hookshot && items.hammer))) return 'unavailable';	
					if (items.bigkey2 && items.smallkey2 === 1 && melee() && (items.lantern || items.firerod)) return (!items.flute && !items.lantern) ? 'dark' : 'available';
					if (items.keychest2 >= 5) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					if (items.keychest2 >= 4 && items.smallkey2 === 1 && (items.firerod || items.lantern)) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					if (items.keychest2 >= 3 && items.bigkey2) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					if (items.keychest2 >= 2 && items.bigkey2 && (melee() || (items.smallkey2 === 1 && (items.firerod || items.lantern)))) return (!items.flute && !items.lantern) ? 'dark' : 'possible';
					return 'unavailable';
				} else {
					if (!items.flute && !items.glove) return 'unavailable';
					if (!items.mirror && !(items.hookshot && items.hammer)) return 'unavailable';
					return items.firerod || items.lantern ?
						items.flute || items.lantern ? 'available' : 'dark' :
						'possible';
				}
			}
		}, { // [3]
			caption: 'Palace of Darkness {lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !(items.bow > 1) || !items.hammer) return 'unavailable';
					if (!items.agahnim && !items.glove) return 'unavailable';
					if (!items.bigkey3 || items.smallkey3 === 0) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(3, items.lantern, items.smallkey3 < 6);
					} else {
						if (items.smallkey3 < 6) return items.lantern ? 'possible' : 'dark';
						return items.lantern ? 'available' : 'dark';
					}
					
				} else {
					if (!items.moonpearl || !(items.bow > 1) || !items.hammer) return 'unavailable';
					if (!items.agahnim && !items.glove) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(3, items.lantern, false);
					} else {
						return items.lantern ? 'available' : 'dark';
					}					
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.moonpearl) return 'unavailable';
					if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
					if (items.smallkey3 === 6 && items.bigkey3 && items.hammer && items.bow > 1 && items.lantern) return 'available';
					// item count approach
					var reachable = 0;
					var curr_keys = 0;
					var dark_chests = 0;
					curr_keys += items.smallkey3;
					reachable += 1; // free first chest
					// 0 key chests
					if (items.bow > 1) reachable += 2; // bow locked right side
					// conditioned key usage
					if (items.bow > 1 && items.hammer) {
						reachable += 2; // bridge and dropdown
					} else {
						if (curr_keys > 0) {
							reachable += 2; // bridge and dropdown
							curr_keys -= 1; // front door used
						}
					}
					// 1 key chests
					if (curr_keys > 0) {
						reachable += 3; // Back side of POD, since it yields most chests for the key
						curr_keys -= 1;
						dark_chests += 2;
					}
					if (curr_keys > 0) {
						reachable += items.bigkey3 ? 3 : 2; // Dark area with big chest
						curr_keys -= 1;
						dark_chests += items.bigkey3 ? 3 : 2;
					}
					if (items.bow > 1 && items.hammer && items.bigkey3 && curr_keys > 0) {
						reachable += 1; // King Helmasaur. We do not prioritize him when he is beatable. This way we show the max amount of items.
						curr_keys -= 1;
						dark_chests += 1;
					}
					if (curr_keys > 0) {
						reachable += 1; // Spike Room
						curr_keys -= 1;
					}
					if (curr_keys > 0) {
						reachable += 1; // Vanilla big key chest
						curr_keys -= 1;
					}

					if (items.keychest3 > 14 - reachable) {
						if (items.keychest3 > 14 - (reachable - dark_chests)) {
							return 'possible';
						} else {
							return items.lantern ? 'possible' : 'dark';
						}
					}
					
					return 'unavailable'; // We got all reachable chests or even more if helmasaur was not prioritized
				} else {
					if (!items.moonpearl) return 'unavailable';
					if (!items.agahnim && !(items.hammer && items.glove) && !(items.glove === 2 && items.flippers)) return 'unavailable';
					return !(items.bow > 1 && items.lantern) ||
						items.chest3 === 1 && !items.hammer ?
						'possible' : 'available';
				}
			}
		}, { // [4]
			caption: 'Swamp Palace {mirror}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
					if (!items.hammer || !items.hookshot || items.smallkey4 === 0) return 'unavailable';
					if (!items.glove && !items.agahnim) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(4, true, false);
					} else {
						return 'available';
					}
				} else {
					if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
					if (!items.hammer || !items.hookshot) return 'unavailable';
					if (!items.glove && !items.agahnim) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(4, true, false);
					} else {
						return 'available';				
					}					
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
					if (!can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';
					if (items.bigkey4 && items.smallkey4 === 1 && items.hammer && items.hookshot) return 'available';
					if (items.keychest4 === 10) return 'possible';
					if (items.keychest4 >= 9 && items.smallkey4 === 1) return 'possible';
					if (items.keychest4 >= 6 && items.smallkey4 === 1 && items.hammer) return 'possible';
					if (items.keychest4 >= 5 && items.bigkey4 && items.smallkey4 === 1 && items.hammer) return 'possible';				
					if (items.keychest4 >= 2 && items.smallkey4 === 1 && items.hammer && items.hookshot) return 'possible';
					return 'unavailable';
				} else {
					if (!items.moonpearl || !items.mirror || !items.flippers) return 'unavailable';
					if (!can_reach_outcast() && !(items.agahnim && items.hammer)) return 'unavailable';
					if (items.chest4 <= 2) return !items.hammer || !items.hookshot ? 'unavailable' : 'available';
					if (items.chest4 <= 4) return !items.hammer ? 'unavailable' : !items.hookshot ? 'possible' : 'available';
					if (items.chest4 <= 5) return !items.hammer ? 'unavailable' : 'available';
					return !items.hammer ? 'possible' : 'available';
				}
			}
		}, { // [5]
			caption: 'Skull Woods',
			is_beaten: false,
			is_beatable: function() {
				if(!can_reach_outcast() || !items.firerod || (items.sword == 0 && !is_swordless)) {
					return 'unavailable';
				}
				if (is_enemizer) {
					return enemizer_check(5, true, false);
				} else {
					return 'available';
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!can_reach_outcast()) return 'unavailable';
					if (items.bigkey5 && items.firerod && (items.sword > 0 || swordless === 'yes')) return 'available';
					if (items.keychest5 >= 4) return 'possible';
					if (items.keychest5 >= 3 && (items.bigkey5 || items.firerod)) return 'possible';
					if (items.keychest5 >= 2 && items.firerod && ((items.sword > 0 && swordless === 'no') || items.bigkey5)) return 'possible';
					return 'unavailable';
				} else {
					if (!can_reach_outcast()) return 'unavailable';
					return items.firerod ? 'available' : 'possible';				
				}
			}
		}, { // [6]
			caption: 'Thieves\' Town',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!(melee() || cane())) return 'unavailable';
					if (!can_reach_outcast()) return 'unavailable';
					if (!items.bigkey6) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(6, true, false);
					} else {
						return 'available';
					}
				} else {
					if (!(melee() || cane())) return 'unavailable';
					if (!can_reach_outcast()) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(6, true, false);
					} else {
						return 'available';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!can_reach_outcast()) return 'unavailable';
					if (items.bigkey6 && items.smallkey6 === 1 && items.hammer) return 'available';
					if (items.keychest6 >= 5) return 'possible';
					if (items.keychest6 >= 3 && items.bigkey6) return 'possible';
					if (items.keychest6 >= 2 && items.bigkey6 && (melee() || cane())) return 'possible';
					return 'unavailable';
				} else {
					if (!can_reach_outcast()) return 'unavailable';
					return items.chest6 === 1 && !items.hammer ? 'possible' : 'available';
				}
			}
		}, { // [7]
			caption: 'Ice Palace (yellow=must bomb jump)',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
					if (!items.firerod && !items.bombos) return 'unavailable';
					if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';

					if (items.bigkey7 && ((items.smallkey7 > 0 && items.somaria) || items.smallkey7 > 1)) {
						if (is_enemizer) {
							return enemizer_check(7, true, false);
						} else {
							return 'available';
						}
					}
					if (is_enemizer) {
						return enemizer_check(7, true, true);
					} else {
						return 'possible'; /* via bomb jump */
					}
					
				} else {
					if (!items.moonpearl || !items.flippers || items.glove !== 2 || !items.hammer) return 'unavailable';
					if (!items.firerod && !items.bombos) return 'unavailable';
					if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
					if (is_enemizer) {
						if (items.hookshot || items.somaria) {
							return enemizer_check(7, true, false);
						}
						return enemizer_check(7, true, true);
						//return 'possible'; /* via bomb jump */
					} else {
						return items.hookshot || items.somaria ? 'available' : 'possible';				
					}
					
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
					if (!items.firerod && !items.bombos) return 'unavailable';
					if (items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
					if (items.bigkey7 && items.hammer) return ((items.smallkey7 === 1 && items.somaria) || items.smallkey7 === 2) ? 'available' : 'possible';
					if (items.bigkey7 && items.hammer) return 'possible';
					if (items.keychest7 >= 5) return 'possible';
					if (items.keychest7 >= 4 && items.bigkey7) return 'possible';
					if (items.keychest7 >= 2 && items.hammer) return 'possible';
					return 'unavailable';
				} else {
					if (!items.moonpearl || !items.flippers || items.glove !== 2) return 'unavailable';
					if (!items.firerod && !items.bombos) return 'unavailable';
					if (!items.firerod && items.bombos && (items.sword == 0 && !is_swordless)) return 'unavailable';
					return items.hammer ? 'available' : 'possible';
				}
			}
		}, { // [8]
			caption: 'Misery Mire {medallion0}{lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!melee_bow()) return 'unavailable';
					if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;
					if (!items.bigkey8) return 'unavailable';
					if (is_enemizer) {
						return enemizer_check(8, items.lantern, false);
					} else {
						return items.lantern ? 'available' : 'dark'
					}
				} else {
					if (!melee_bow()) return 'unavailable';
					if (!items.moonpearl || !items.flute || items.glove !== 2 || !items.somaria) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;

					if (is_enemizer) {
						if (!items.firerod && !items.lantern) return enemizer_check(8, items.lantern, true);
						return enemizer_check(8, items.lantern, false);
					} else {
						return items.lantern || items.firerod ? items.lantern ? 'available' : 'dark' : 'possible';
					}
				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;

					if (items.lantern && items.bigkey8 && items.somaria) return 'available';

					if (items.keychest8 >= 5) return 'possible';
					if (items.keychest8 >= 4 && items.bigkey8) return 'possible';
					if (items.keychest8 >= 3 && items.bigkey8 && items.somaria && !items.lantern && !items.firerod) return 'dark';
					if (items.keychest8 >= 3 && (items.lantern || items.firerod)) return 'possible';
					if (items.keychest8 >= 2 && (items.firerod || items.lantern) && items.bigkey8) return 'possible';
					if (items.keychest8 >= 1 && !items.lantern && items.firerod && items.bigkey8 && items.somaria) return 'dark';					
					return 'unavailable';
				} else {
					if (!items.moonpearl || !items.flute || items.glove !== 2) return 'unavailable';
					if (!items.boots && !items.hookshot) return 'unavailable';
					var state = medallion_check(0);
					if (state) return state;

					return (items.chest8 > 1 ?
						items.lantern || items.firerod :
						items.lantern && items.somaria) ?
						'available' : 'possible';
				}
			}
		}, { // [9]
			caption: 'Turtle Rock {medallion0}{lantern}',
			is_beaten: false,
			is_beatable: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					if ((!items.icerod && !is_enemizer) || !items.firerod) return 'unavailable';
					if (!items.bigkey9 || items.smallkey9 < 3) return 'unavailable';
					var state = medallion_check(1);
					if (state) return state;
					if (items.smallkey9 === 3) {
						if (is_enemizer) {
							return enemizer_check(9, items.lantern, true);
						} else {
							return items.lantern ? 'possible' : 'dark';
						}
					}
					if (is_enemizer) {
						return enemizer_check(9, items.lantern, false);
					} else {
						return items.lantern ? 'available' : 'dark';
					}
				} else {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					if ((!items.icerod && !is_enemizer) || !items.firerod) return 'unavailable';
					var state = medallion_check(1);
					if (state) return state;
					
					if (is_enemizer) {
						if (items.byrna || items.cape || items.shield === 3) {
							return enemizer_check(9, items.lantern, false);
						} else {
							return enemizer_check(9, items.lantern, true);
						}
					} else {
						return items.byrna || items.cape || items.shield === 3 ?
							items.lantern ? 'available' : 'dark' :
							'possible';
					}	

				}
			},
			can_get_chest: function() {
				if (is_keysanity) {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					var state = medallion_check(1);
					if (state) return state;

					if (items.bigkey9 && items.smallkey9 === 4 && items.firerod && items.icerod && items.lantern && (items.byrna || items.cape || items.shield === 3)) return 'available';
					
					// item count approach
					var reachable = 0;
					var curr_keys = 0;
					var dark_chests = 0;
					curr_keys += items.smallkey9;
					reachable += 1; // free first chest
					// 0 key chests
					if (items.firerod) {
						reachable += 2; // fire rod locked right side				
					}
					// 1 key chests
					if (curr_keys > 0) {
						reachable += 1; // Chain Chomp room
						curr_keys -= 1;
					}
					// 2 key chests
					if (curr_keys > 0) { 
						curr_keys -= 1;
						if (!items.bigkey9) {
							// Unable to proceed beyond big key room, but can get vanilla big key chest
							reachable += 1;
						} else {
							reachable += 2; // Big chest and roller room
							if (items.byrna || items.cape || items.shield === 3) {
								// Logic for laser bridge, needs safety item to be in logic
								reachable += 4;
								if (!items.lantern) {
									dark_chests += 4;
								}
							}
						}
					}
					if (items.bigkey9) {
						// 3 key chests
						if (curr_keys > 0) { 
							curr_keys -= 1;
							reachable += 1; // Either Trinexx or vanilla big key chest will be obtainable with 3 keys
						}				
						
						// 4 key chests
						if (curr_keys > 0) { 
							if (!items.lantern && items.icerod && items.firerod) {
								dark_chests += 1; // All of TR is clearable in the dark
								reachable += 1;
							}
						}				
					}
					if (items.keychest9 > 12 - reachable) {
						if (items.keychest9 > 12 - (reachable - dark_chests)) {
							return 'possible';
						} else {
							return items.lantern ? 'possible' : 'dark';
						}
					}
					
					return 'unavailable';
				} else {
					if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria) return 'unavailable';
					if (!items.hookshot && !items.mirror) return 'unavailable';
					var state = medallion_check(1);
					if (state) return state;

					var laser_safety = items.byrna || items.cape || items.shield === 3,
						dark_room = items.lantern ? 'available' : 'dark';
					if (items.chest9 <= 1) return !laser_safety ? 'unavailable' : items.firerod && items.icerod ? dark_room : 'possible';
					if (items.chest9 <= 2) return !laser_safety ? 'unavailable' : items.firerod ? dark_room : 'possible';
					if (items.chest9 <= 4) return laser_safety && items.firerod && items.lantern ? 'available' : 'possible';
					return items.firerod && items.lantern ? 'available' : 'possible';
				}
			}
		}, { // [10]
			caption: 'Ganon\'s Castle (7 Crystals)',
			is_beaten: false,
			is_beatable: function() {
				var crystal_count = 0;
				for (var k = 0; k < 10; k++) {
					if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
						crystal_count++;
					}
				}
				if (is_keysanity) {
					if (crystal_count === 7 && items.bigkey10 &&  items.bow > 1 && items.hookshot && (items.firerod || items.lantern)) {
						if (items.smallkey10 < 3) return 'possible';
						if (items.smallkey10 >= 3) return (is_enemizer && !items.icerod) ? 'possible' : 'available';
					}
					return 'unavailable';
				} else {
					if (crystal_count === 7 && items.glove === 2 && items.bow > 1 && items.hookshot && (items.firerod || items.lantern)) {
						if (!items.somaria || !items.boots || !items.firerod) return 'possible';
						return (is_enemizer && !items.icerod) ? 'possible' : 'available';
					} else {
						return 'unavailable';
					}
				}
			},
			can_get_chest: function() {
				var crystal_count = 0;
				for (var k = 0; k < 10; k++) {
					if ((prizes[k] === 3 || prizes[k] === 4) && items['boss'+k]) {
						crystal_count++;
					}
				}
				if (crystal_count < 7 || items.glove < 2 || !items.hammer) return 'unavailable';
				
				if (is_keysanity) {
					if (items.bigkey10 && items.smallkey10 > 2 && items.bow > 1 && items.hookshot && items.firerod && items.somaria) return 'available';
					// Counting reachable items and keys
					var reachable = 0;
					var curr_keys = 0;
					curr_keys += items.smallkey10;
					curr_keys += 1; // free key on left side
					// 0 key chests
					reachable += 2; // first two right side chests
					if (items.boots) reachable += 1; // torch
					if (items.somaria) reachable += 1; // tile room
					if (items.hookshot && items.hammer) reachable += 4; // stalfos room
					if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod)){ 
						reachable += 2; // mini helmasaur room
						curr_keys += 1; // mini helmasaur room
					}
					// 0 key chests with common sense
					if (items.somaria && items.firerod && curr_keys > 0) reachable += 4; // rest of the right side chests. The key is gained back after those.
					if (items.hookshot && items.hammer) reachable += 1; // chest before randomizer room. We assume the key in the switch room is used for this one
					if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod) && curr_keys > 0) {
						reachable += 1; // room after mini helmasaurs. We assume players keep enough keys to reach top. If they didnt, then they got other chests for that key.
						curr_keys -= 1;
					}
					if (items.bigkey10 && items.bow > 1 && (items.lantern || items.firerod) && items.hookshot && ((items.sword > 0 || swordless === 'yes') || items.hammer) && curr_keys > 0) {
						reachable += 1; // Chest after Moldorm. See assumptions above.
						curr_keys -= 1;
					}
					// 1 key chests 
					if (curr_keys > 0) {
						if (items.hookshot && items.hammer) { // we can reach randomizer room and the area after that
							reachable += items.bigkey10 ? 9 : 8;
							curr_keys -= 1;
						} else {
							if (items.somaria && items.firerod) {    // we can reach armos' area via right side
								reachable += items.bigkey10 ? 5 : 4;
								curr_keys -= 1;
							}
						}
					}
					if ((items.hookshot || items.boots) && items.hammer && curr_keys > 0) {
						reachable += 1; // Vanilla map chest aka double firebar chest. Since one item for one key is the least bang for the buck we check this one last.
						curr_keys -= 1;
					}
					// 1 key chests
					if (items.keychest10 > (27 - reachable)) return 'possible'; // available was checked at the beginning. You can get all items with 2 smallkey10 alone but let's make it 'possible' in case someone had to open second right side door to get to armos in order to get hookshot

					return 'unavailable'; // We got all reachable items or even more than that in case the player did not follow the 'common sense'
				} else {
					if (items.bow > 1 && items.hookshot && items.firerod && items.somaria && items.boots) return 'available';
					return 'possible';
				}
			}
		}];

		window.agahnim = {
			caption: 'Agahnim {sword2}/ ({cape}{sword1}){lantern}',
			is_available: function() {
				if (is_keysanity) {
					return (items.sword >= 2 || (items.cape && items.sword) || (is_swordless && (items.hammer || (items.cape && items.net)))) && items.smallkeyhalf1 === 2 && agatowerweapon() ?
						items.lantern ? 'available' : 'dark' :
						'unavailable';
				} else {
					return ((items.sword >= 2 || (items.cape && items.sword) || (is_swordless && (items.hammer || (items.cape && items.net)))) && agatowerweapon()) ?
						items.lantern ? 'available' : 'dark' :
						'unavailable';
				}
			}
		};

		//define overworld chests
		window.chests = [{ // [0]
			caption: 'King\'s Tomb {boots} + {glove2}/{mirror}',
			is_opened: false,
			is_available: function() {
				if (!items.boots) return 'unavailable';
				if (can_reach_outcast() && items.mirror || items.glove === 2) return 'available';
				return 'unavailable';
			}
		}, { // [1]
			caption: 'Light World Swamp (2)',
			is_opened: false,
			is_available: always
		}, { // [2]
			caption: 'Stoops Lonk\'s Hoose',
			is_opened: is_standard,
			is_available: always
		}, { // [3]
			caption: 'Spiral Cave',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [4]
			caption: 'Mimic Cave ({mirror} outside of Turtle Rock)(Yellow = {medallion0} unkown OR possible w/out {firerod})',
			is_opened: false,
			is_available: function() {
				if (!items.moonpearl || !items.hammer || items.glove !== 2 || !items.somaria || !items.mirror) return 'unavailable';
				var state = medallion_check(1);
				if (state) return state;

				if (is_keysanity) {
					return items.smallkey9 <= 1 ? 'unavailable' : 'available';
				}

				return items.firerod ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'possible';
			}
		}, { // [5]
			caption: 'Tavern',
			is_opened: false,
			is_available: always
		}, { // [6]
			caption: 'Chicken House {bomb}',
			is_opened: false,
			is_available: always
		}, { // [7]
			caption: 'Bombable Hut {bomb}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [8]
			caption: 'C House',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [9]
			caption: 'Aginah\'s Cave {bomb}',
			is_opened: false,
			is_available: always
		}, { // [10]
			caption: 'Mire Shed (2)',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.flute && items.glove === 2 ? 'available' : 'unavailable';
			}
		}, { // [11]
			caption: 'Super Bunny Chests (2)',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && (items.hookshot || items.mirror && items.hammer) ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [12]
			caption: 'Sahasrahla\'s Hut (3) {bomb}/{boots}',
			is_opened: false,
			is_available: always
		}, { // [13]
			caption: 'Byrna Spike Cave',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove && items.hammer && (items.byrna || items.cape) ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [14]
			caption: 'Kakariko Well (4 + {bomb})',
			is_opened: false,
			is_available: always
		}, { // [15]
			caption: 'Thieve\'s Hut (4 + {bomb})',
			is_opened: false,
			is_available: always
		}, { // [16]
			caption: 'Hype Cave! {bomb} (NPC + 4 {bomb})',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || (items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
			}
		}, { // [17]
			caption: 'Paradox Cave (5 + 2 {bomb})',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.mirror && items.hammer) ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [18]
			caption: 'West of Sanctuary {boots}',
			is_opened: false,
			is_available: function() {
				return items.boots ? 'available' : 'unavailable';
			}
		}, { // [19]
			caption: 'Minimoldorm Cave (NPC + 4) {bomb}',
			is_opened: false,
			is_available: always
		}, { // [20]
			caption: 'Ice Rod Cave {bomb}',
			is_opened: false,
			is_available: always
		}, { // [21]
			caption: 'Hookshot Cave (bottom chest) {hookshot}/{boots}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && (items.hookshot || (items.mirror && items.hammer && items.boots)) ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [22]
			caption: 'Hookshot Cave (3 top chests) {hookshot}',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && items.hookshot ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [23]
			caption: 'Treasure Chest Minigame: Pay 30 rupees',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [24]
			caption: 'Bottle Vendor: Pay 100 rupees',
			is_opened: false,
			is_available: always
		}, { // [25]
			caption: 'Sahasrahla {pendant0}',
			is_opened: false,
			is_available: function() {
				for (var k = 0; k < 10; k++) {
					if (prizes[k] === 1 && items['boss'+k])
						return 'available';
				}
				return 'unavailable';
			}
		}, { // [26]
			caption: 'Ol\' Stumpy',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
			}
		}, { // [27]
			caption: 'Lazy Drunk Kid: Distract him with {bottle} because he can\'t lay off the sauce!',
			is_opened: false,
			is_available: function() {
				return items.bottle ? 'available' : 'unavailable';
			}
		}, { // [28]
			caption: 'Gary\'s Lunchbox (save the frog first)',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
			}
		}, { // [29]
			caption: 'Fugitive under the bridge {flippers}',
			is_opened: false,
			is_available: function() {
				return items.flippers ? 'available' : 'unavailable';
			}
		}, { // [30]
			caption: 'Ether Tablet {sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.book && (items.glove || items.flute) && (items.mirror || items.hookshot && items.hammer) ?
					(items.sword >= 2 || swordless === 'yes') ?
						items.lantern || items.flute ? 'available' : 'dark' :
						'possible' :
					'unavailable';
			}
		}, { // [31]
			caption: 'Bombos Tablet {mirror}{sword2}{book}',
			is_opened: false,
			is_available: function() {
				return items.book && items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ?
					(items.sword >= 2 || swordless === 'yes')? 'available' : 'possible' :
					'unavailable';
			}
		}, { // [32]
			caption: 'Catfish',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove && (items.agahnim || items.hammer || items.glove === 2 && items.flippers) ?
					'available' : 'unavailable';
			}
		}, { // [33]
			caption: 'King Zora: Pay 500 rupees',
			is_opened: false,
			is_available: function() {
				return items.flippers || items.glove ? 'available' : 'unavailable';
			}
		}, { // [34]
			caption: 'Lost Old Man {lantern}',
			is_opened: false,
			is_available: function() {
				return items.glove || items.flute ?
					items.lantern ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [35]
			caption: 'Witch: Give her {mushroom}',
			is_opened: false,
			is_available: function() {
				return items.mushroom ? 'available' : 'unavailable';
			}
		}, { // [36]
			caption: 'Forest Hideout',
			is_opened: false,
			is_available: always
		}, { // [37]
			caption: 'Lumberjack Tree {agahnim}{boots}',
			is_opened: false,
			is_available: function() {
				return items.agahnim && items.boots ? 'available' : 'possible';
			}
		}, { // [38]
			caption: 'Spectacle Rock Cave',
			is_opened: false,
			is_available: function() {
				return items.glove || items.flute ?
					items.lantern || items.flute ? 'available' : 'dark' :
					'unavailable';
			}
		}, { // [39]
			caption: 'South of Grove {mirror}',
			is_opened: false,
			is_available: function() {
				return items.mirror && (can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer) ? 'available' : 'unavailable';
			}
		}, { // [40]
			caption: 'Graveyard Cliff Cave {mirror}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() && items.mirror ? 'available' : 'unavailable';
			}
		}, { // [41]
			caption: 'Checkerboard Cave {mirror}',
			is_opened: false,
			is_available: function() {
				return items.flute && items.glove === 2 && items.mirror ? 'available' : 'unavailable';
			}
		}, { // [42]
			caption: '{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}{hammer}!!!!!!!!',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 && items.hammer ? 'available' : 'unavailable';
			}
		}, { // [43]
			caption: 'Library {boots}',
			is_opened: false,
			is_available: function() {
				return items.boots ? 'available' : 'possible';
			}
		}, { // [44]
			caption: 'Mushroom',
			is_opened: false,
			is_available: always
		}, { // [45]
			caption: 'Spectacle Rock {mirror}',
			is_opened: false,
			is_available: function() {
				return items.glove || items.flute ?
					items.mirror ?
						items.lantern || items.flute ? 'available' : 'dark' :
						'possible' :
					'unavailable';
			}
		}, { // [46]
			caption: 'Floating Island {mirror}',
			is_opened: false,
			is_available: function() {
				return (items.glove || items.flute) && (items.hookshot || items.hammer && items.mirror) ?
					items.mirror && items.moonpearl && items.glove === 2 ?
						items.lantern || items.flute ? 'available' : 'dark' :
						'possible' :
					'unavailable';
			}
		}, { // [47]
			caption: 'Race Minigame {bomb}/{boots}',
			is_opened: false,
			is_available: always
		}, { // [48]
			caption: 'Desert West Ledge {book}/{mirror}',
			is_opened: false,
			is_available: function() {
				return items.book || items.flute && items.glove === 2 && items.mirror ? 'available' : 'possible';
			}
		}, { // [49]
			caption: 'Lake Hylia Island {mirror}',
			is_opened: false,
			is_available: function() {
				return items.flippers ?
					items.moonpearl && items.mirror && (items.agahnim || items.glove === 2 || items.glove && items.hammer) ?
						'available' : 'possible' :
					'unavailable';
			}
		}, { // [50]
			caption: 'Bumper Cave {cape}',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() ?
					items.glove && items.cape ? 'available' : 'possible' :
					'unavailable';
			}
		}, { // [51]
			caption: 'Pyramid',
			is_opened: false,
			is_available: function() {
				return items.agahnim || items.glove && items.hammer && items.moonpearl ||
					items.glove === 2 && items.moonpearl && items.flippers ? 'available' : 'unavailable';
			}
		}, { // [52]
			caption: 'Alec Baldwin\'s Dig-a-Thon: Pay 80 rupees',
			is_opened: false,
			is_available: function() {
				return can_reach_outcast() || items.agahnim && items.moonpearl && items.hammer ? 'available' : 'unavailable';
			}
		}, { // [53]
			caption: 'Zora River Ledge {flippers}',
			is_opened: false,
			is_available: function() {
				if (items.flippers) return 'available';
				if (items.glove) return 'possible';
				return 'unavailable';
			}
		}, { // [54]
			caption: 'Buried Itam {shovel}',
			is_opened: false,
			is_available: function() {
				return items.shovel ? 'available' : 'unavailable';
			}
		}, { // [55]
			caption: 'Escape Sewer Side Room (3) {bomb}/{boots}' + (is_standard ? '' : ' (yellow = need small key)'),
			is_opened: false,
			is_available: function() {
				if (is_standard) return 'available';
				if (is_keysanity) {
					if (items.glove) return 'available';
					if (items.smallkeyhalf0 === 1) return items.lantern ? 'available' : 'dark';
					return 'unavailable';
				}
				
				return items.glove ? 'available' : items.lantern ? 'possible' : 'dark';
			}
		}, { // [56]
			caption: "Castle Secret Entrance (Uncle + 1)",
			is_opened: is_standard,
			is_available: always
		}, { // [57]
			caption: 'Hyrule Castle Dungeon (3)',
			is_opened: is_standard,
			is_available: always
		}, { // [58]
			caption: 'Sanctuary',
			is_opened: is_standard,
			is_available: always
		}, { // [59]
			caption: 'Mad Batter {hammer}/{mirror} + {powder}',
			is_opened: false,
			is_available: function() {
				return items.powder && (items.hammer || items.glove === 2 && items.mirror && items.moonpearl) ? 'available' : 'unavailable';
			}
		}, { // [60]
			caption: 'Take the frog home {mirror} / Save+Quit',
			is_opened: false,
			is_available: function() {
				return items.moonpearl && items.glove === 2 ? 'available' : 'unavailable';
			}
		}, { // [61]
			caption: 'Fat Fairy: Buy OJ bomb from Dark Link\'s House after {crystal}5 {crystal}6 (2 items)',
			is_opened: false,
			is_available: function() {
				//crystal check
				var crystal_count = 0;
				for (var k = 0; k < 10; k++) {
					if (prizes[k] === 4 && items['boss'+k])
						crystal_count += 1;
				}

				if (!items.moonpearl || crystal_count < 2) return 'unavailable';
				return items.hammer && (items.agahnim || items.glove) ||
					items.agahnim && items.mirror && can_reach_outcast() ? 'available' : 'unavailable';
			}
		}, { // [62]
			caption: 'Master Sword Pedestal {pendant0}{pendant1}{pendant2} (can check with {book})',
			is_opened: false,
			is_available: function() {
				var pendant_count = 0;
				for (var k = 0; k < 10; k++) {
					if ((prizes[k] === 1 || prizes[k] === 2) && items['boss'+k]) {
						if (++pendant_count === 3) return 'available';
					}
				}
				return items.book ? 'possible' : 'unavailable';
			}
		}, { // [63]
			caption: 'Escape Sewer Dark Room {lantern}',
			is_opened: is_standard,
			is_available: function() {
				return is_standard || items.lantern ? 'available' : 'dark';
			}
		}, { // [64]
			caption: 'Waterfall of Wishing (2) {flippers}',
			is_opened: false,
			is_available: function() {
				return items.flippers ? 'available' : 'unavailable';
			}
		}, { // [65]
			caption: 'Castle Tower',
			is_opened: false,
			is_available: function() {
				return items.sword >= 2 || (is_swordless && items.hammer) || items.cape ? 'available' : 'unavailable';
			}
		}, { // [66]
			caption: 'Castle Tower (small key)',
			is_opened: false,
			is_available: function() {
				if (is_retro) {
					return (items.sword >= 2 || (is_swordless && items.hammer) || items.cape) ? items.lantern ? 'available' : 'dark' : 'unavailable';
				} else {
					return (items.sword >= 2 || (is_swordless && items.hammer) || items.cape) && items.smallkeyhalf1 > 0 ? items.lantern ? 'available' : 'dark' : 'unavailable';
				}
			}
		}];
	}
}(window));
