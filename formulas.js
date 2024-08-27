
// Calculate the success chance for a give enhance and failstack
function chanceFromFailstackAccessory(level, failstack) {
    let baseChances = [30, 10, 7.5, 2.5, 0.5]; // chance at 0 stacks
    let growthRates = [3, 1, 0.75, 0.25, 0.05]; // bonus chance per stack
    let softcaps = [14, 40, 45, 110, 490]; // failstack softcap
    let softcapGrowthRates = [0.6, 0.2, 0.15, 0.05, 0.01]; // bonus chance per stack after softcap

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