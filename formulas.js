
// Calculate the success chance for a give enhance and failstack
function chanceFromFailstackAccessory(level, failstack) {
    let baseChances = [25, 10, 7.5, 2.5, 0.5]; // chance at 0 stacks
    let growthRates = [2.5, 1, 0.75, 0.25, 0.05]; // bonus chance per stack
    let softcaps = [18, 40, 44, 110, 490]; // failstack softcap
    let softcapGrowthRates = [0.5, 0.2, 0.15, 0.05, 0.01]; // bonus chance per stack after softcap

    // select values for current enhance level
    let bc = baseChances[level - 1];
    let gr = growthRates[level - 1];
    let sc = softcaps[level - 1];
    let scgr = softcapGrowthRates[level - 1];

    // you can probably figure this out
    let finalChance = (bc + Math.min(failstack, sc) * gr + Math.max(failstack - sc, 0) * scgr) / 100;

    // failstacks only go up to 90% chance
    return Math.min(finalChance, 0.9)
}

// Calculate the average cost of raw tapping an accessory to a given level
function rawTapAccessory(level, previousPrice, basePrice, failstack) {
    let chance = chanceFromFailstackAccessory(level, failstack);

    // Average 1/p taps, each tap costs a base and what you're enhancing
    return (previousPrice + basePrice) * (1 / chance);
}

// Calculate the average cost of cron tapping an accessory to a given level
function cronTapAccessory(level, previousPrice, secondPreviousPrice, basePrice, failstack, cronAmount, cronPrice) {
    let chance = chanceFromFailstackAccessory(level, failstack);

    // On downgrade you lose a base and what you were enhancing, gain back the level below
    let downgradeCost = basePrice + previousPrice - secondPreviousPrice;

    // 60% chance to not downgrade, just lose a base, 40% chance to downgrade
    let failCost = cronAmount * cronPrice + 0.6 * basePrice + 0.4 * downgradeCost;

    // On success you lose what you're enhancing, a base and the crons
    let successCost = cronAmount * cronPrice + previousPrice + basePrice;

    // If you succeed in 1/p tries, you fail 1/p - 1 times and succeed 1 time
    let total = failCost * ((1/chance) - 1) + successCost;
    
    return total;
}

// calculate the average cost of hammer tapping an accessory to a given level
function hammerTapAccessory(level, previousPrice, basePrice, failstack, hammerPrice) {
    let chance = chanceFromFailstackAccessory(level, failstack);

    // On fail you lose the hammer and the base
    let failCost = hammerPrice + basePrice;

    // On succeed you lose the hammer, base and what you're enhancing
    let successCost = hammerPrice + previousPrice + basePrice;

    // If you succeed in 1/p tries, you fail 1/p - 1 times and succeed 1 time
    let total = failCost * ((1/chance) - 1) + successCost;
    
    return total
}

let cronMatrix = [
    [1,1,1,4,9], // 0
    [1,1,1,6,13], // 1
    [1,1,2,8,19], // 2
    [1,1,3,11,25], // 3
    [1,1,4,13,29], // 4
    [1,1,4,13,33], // 5
    [1,1,4,15,35], // 6
    [1,1,5,17,39], // 7
    [1,2,9,30,69], // 8
    [1,5,19,61,139], // 9
    [10,20,40,60,120], // 10
    [2,7,27,87,199], // 11
    [2,7,27,87,299], // 12
    [3,11,41,131,299], // 13
    [4,14,54,174,399], // 14
    [6,18,68,218,499], // 15
    [7,22,82,262,599], // 16
    [8,26,98,314,714], // 17
    [7,22,82,261,896], // 18
    [7,22,82,262,899], // 19
    [11,33,123,393,899], // 20
    [13,39,119,331,1059], // 21
    [9,29,107,342,1173], // 22
    [9,29,109,342,1173], // 23
    [12,37,137,436,1497], // 24
    [18,56,168,468,1499], // 25
    [18,56,168,468,2249], // 26
    [22,67,202,562,2699], // 27
    [24,74,224,625,2999], // 28
    [24,74,275,874,2999], // 29
    [29,89,269,749,3600], // 30
    [37,112,336,934,4484], // 31
    [37,112,337,937,4499], // 32
    [37,112,412,1312,4499], // 33
    [47,142,427,1187,5699], // 34
    [62,187,562,1562,7499], // 35
    [95,288,865,2405,11548] // 36
]

// return a list of the amount of crons you need for each level based on accessories
function getCronAmounts(accessoryLevel){
    return cronMatrix[accessoryLevel]
}