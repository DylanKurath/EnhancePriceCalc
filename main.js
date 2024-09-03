let markets = []
let failstacks = []
let chances = []
let prices = []
let methods = []

const gearSelect = document.getElementById('gearSelect');
const cronPrice = document.getElementById('cronPrice');
const cronMethod = document.getElementById('cronMethod');
const dontBuyPen = document.getElementById('noBuyPen');

let accessories = [
    ["Deboreka Necklace",36],
    ["Deboreka Belt",36],
    ["Deboreka Earring",36],
    ["Deboreka Ring",36],
    ["Ominous Ring",35],
    ["Tungrad Ring",35],
    ["Revived Lunar Necklace",35],
    ["Revived River Necklace",35],
    ["Tungrad Necklace",35],
    ["Taebaek's Belt",35],
    ["Tungrad Belt",35],
    ["Turo's Belt",35],
    ["Black Distortion Earring",35],
    ["Dawn Earring",35],
    ["Vaha's Dawn",35],
    ["Laytenn's Power Stone",34],
    ["Ogre Ring",34],
    ["Orkinrad's Belt",34],
    ["Valtarra Eclipsed Belt",34],
    ["Ethereal Earring",34],
    ["Tungrad Earring",34],
    ["Ocean Haze Ring",34],
    ["Centaurus Belt",33],
    ["Eye of the Ruins Ring",32],
    ["Basilisk's Belt",32],
    ["Narc Ear Accessory",32],
    ["Manos Blue Coral Belt",31],
    ["Manos Golden Coral Belt",31],
    ["Manos Green Coral Belt",31],
    ["Manos Red Coral Belt",31],
    ["Sicil's Necklace",30],
    ["Ring of Cadry Guardian",29],
    ["Ring of Crescent Guardian",29],
    ["Serap's Necklace",28],
    ["Blue Whale Molar Earring",27],
    ["Fugitive Khalk's Earring",27],
    ["Forest Ronaros Ring",26],
    ["Tree Spirit Belt",25],
    ["Manos Diamond Necklace",24],
    ["Manos Emerald Necklace",24],
    ["Manos Ruby Necklace",24],
    ["Manos Sapphire Necklace",24],
    ["Manos Topaz Necklace",24],
    ["Ancient Guardian's Seal",23],
    ["Manos Ruby Ring",22],
    ["Manos Topaz Ring",22],
    ["Manos Sapphire Earring",22],
    ["Rainbow Coral Ring",21],
    ["Necklace of Good Deeds",20],
    ["Red Coral Earring",19],
    ["Manos Ruby Earring",18],
    ["Manos Topaz Earring",18],
    ["Kagtum Submission Ring",17],
    ["Ancient Weapon Core",16],
    ["Mark of Shadow",15],
    ["Necklace of Shultz the Gladiator",15],
    ["Witch's Earring",15],
    ["Bensho's Necklace",14],
    ["Belt of Shultz the Gladiator",13],
    ["Blue Coral Earring",12],
    ["Mesto Earring",12],
    ["Blue Coral Ring",11],
    ["Scarla Necklace",11],
    ["Token of Friendship",11],
    ["Red Coral Ring",9],
    ["Outlaw's Ring",8],
    ["Shrine Guardian Token",8],
    ["Ridell Earring",7],
    ["Rhutum Elite Belt",6],
    ["Rhutum Belt",5],
    ["Ring of Good Deeds",4],
    ["Gartner Belt",4],
    ["Nert Ring",3],
    ["Bares Necklace",2],
    ["Elisha Necklace",2],
    ["Hesus Necklace",2],
    ["Kalis Necklace",2],
    ["Talis Necklace",2],
    ["Yuria Necklace",2],
    ["Bares Belt",1],
    ["Elisha Belt",1],
    ["Hesus Belt",1],
    ["Kalis Belt",1],
    ["Kalis Belt",1],
    ["Talis Belt",1],
    ["Yuria Belt",1],
    ["Bares Ring",0],
    ["Elisha Ring",0],
    ["Hesus Ring",0],
    ["Kalis Ring",0],
    ["Talis Ring",0],
    ["Yuria Ring",0],
    ["Bares Earring",0],
    ["Elisha Earring",0],
    ["Hesus Earring",0],
    ["Kalis Earring",0],
    ["Talis Earring",0],
    ["Yuria Earring",0]
]

function calculate(){
    // Update Cron prices
    let vendor = parseInt(markets[6].value);
    let outfit = parseInt(markets[7].value) / 993;
    let cron;
    if(outfit < vendor){
        cronPrice.textContent = outfit.toFixed(0);
        cronMethod.textContent = " by pre-ordering outfits.";
        cron = outfit;
    }
    else{
        cronPrice.textContent = vendor.toFixed(0);
        cronMethod.textContent = " by buying from vendor.";
        cron = vendor;
    }

    let hammerPrice = parseInt(markets[8].value);

    // Get Cron amounts
    let cronAmounts = getCronAmounts(parseInt(gearSelect.value));

    let bestCosts = [parseInt(markets[0].value)];
    for(let i = 1; i <= 5; i++){
        // Update chances for failstacks
        let stack = parseInt(failstacks[i].value);
        chances[i].textContent = (chanceFromFailstackAccessory(i, stack) * 100).toFixed(2);

        // Update prices and methods
        let previousPrice = bestCosts[i-1];
        let secondPreviousPrice = bestCosts[Math.max(0, i-2)];
        let basePrice = bestCosts[0];
        let failstack = parseInt(failstacks[i].value);
        let cronAmount = cronAmounts[i-1];
        let method = methods[i];
        let price = prices[i];
        let marketPrice = parseInt(markets[i].value);

        if(i == 5 && noBuyPen.checked){
            marketPrice = Infinity;
        }

        let rawTapPrice = Math.round(rawTapAccessory(i, previousPrice, basePrice, failstack));
        let cronTapPrice = Math.round(cronTapAccessory(i, previousPrice, secondPreviousPrice, basePrice, failstack, cronAmount, cron));
        let hammerTapPrice = Math.round(hammerTapAccessory(i, previousPrice, basePrice, failstack, hammerPrice));
        let bestCost;

        method.textContent = '';

        if(rawTapPrice <= cronTapPrice && rawTapPrice <= hammerTapPrice && rawTapPrice <= marketPrice) {
            bestCost = rawTapPrice;
            price.textContent = rawTapPrice;
            method.textContent += "Raw Tap";
        }
        if(cronTapPrice <= rawTapPrice && cronTapPrice <= hammerTapPrice && cronTapPrice <= marketPrice) {
            bestCost = cronTapPrice;
            price.textContent = cronTapPrice;
            if(method.textContent.length > 0) {
                method.textContent += " or Cron Tap";
            }
            else{
                method.textContent += "Cron Tap";
            }
        }
        if(hammerTapPrice <= rawTapPrice && hammerTapPrice <= cronTapPrice && hammerTapPrice <= marketPrice) {
            bestCost = hammerTapPrice;
            price.textContent = hammerTapPrice;
            if(method.textContent.length > 0) {
                method.textContent += " or Hammer Tap";
            }
            else{
                method.textContent += "Hammer Tap";
            }
        }
        if(marketPrice <= rawTapPrice && marketPrice <= cronTapPrice && marketPrice <= hammerTapPrice) {
            bestCost = marketPrice;
            price.textContent = marketPrice;
            if(method.textContent.length > 0) {
                method.textContent += " or Buy from Market";
            }
            else{
                method.textContent += "Buy from Market";
            }
        }
        bestCosts.push(bestCost);
        
    }
}

document.addEventListener('DOMContentLoaded', function(){
    accessories.forEach(accessory => {
        gearSelect.innerHTML += `
            <option value='${accessory[1]}'>${accessory[0]}</option>
        `;
    });
    for(let i = 0; i <= 8; i++){
        markets.push(document.getElementById('market' + i));
        failstacks.push(document.getElementById('failstack' + i));
        chances.push(document.getElementById('chance' + i));
        prices.push(document.getElementById('price' + i));
        methods.push(document.getElementById('method' + i));
    }
    document.querySelectorAll('input, select').forEach(inputField => {
        inputField.addEventListener('change', function(){
            calculate();
        })
    });
    calculate();
});
