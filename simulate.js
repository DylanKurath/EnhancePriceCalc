// Simulate n tries going from base to pen
function simulateAccessoryAll(n=1, stacks=[0,0,0,0,0], useCrons=[false, false, false, false, false], cronAmounts=[0,0,0,0,0]){
    let data = [];
    let chances = [];
    for(var i = 1; i <=5; i++){
        chances.push(chanceFromFailstackAccessory(i, stacks[i-1]));
    }
    for(var i = 0; i < n; i++){
        iteration = {
            baseCount: 0,
            cronCount: 0,
            fails: [0,0,0,0,0],
            successes: [0,0,0,0,0],
            pitiesHit: [0,0,0,0,0],
        }
        let currentPities = [0,0,0,0,0];
        let currentLevel = 0;
        while(currentLevel < 5){
            if(currentLevel){
                iteration.baseCount += 2;
            }
            else{
                iteration.baseCount++;
            }
            if(useCrons[currentLevel]){
                iteration.cronCount += cronAmounts[currentLevel];
            }
            let success;
            if(currentPities[currentLevel] == accessoryPityAmounts[currentLevel]){
                success = true;
                pitiesHit[currentLevel]++;
            }
            else{
                success = Math.random() <= chances[currentLevel];
            }
            if(success){
                iteration.successes[currentLevel]++;
                currentPities[currentLevel] = 0;
                currentLevel++;
            }
            else{
                iteration.fails[currentLevel]++;
                currentPities[currentLevel]++;
                if(useCrons[currentLevel]){
                    if(currentLevel != 0){
                        let downgrade = Math.random() <= 0.4;
                        if(downgrade){
                            currentLevel--;
                        }
                    }
                    else{
                        iterations.baseCount--;
                    }
                }
                else{
                    currentLevel = 0;
                }
            }
        }
        data.push(iteration)
    }
    return data
}