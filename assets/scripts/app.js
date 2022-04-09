const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';
const LOG_EVENT_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK'; 
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';

let battleLog = [];
let lastLoggedEntry;

function getMaxLifeValues(){
    const enteredValue = prompt('Maximum life for you and monster.', '100');

    let parsedValue = parseInt(enteredValue);
    if(isNaN(parsedValue) || parsedValue <= 0){
        throw {message: 'Invalid user input, not a number!'};
    }
    return parsedValue;
}
let chosenMaxLife;
try{
    chosenMaxLife = getMaxLifeValues();
}catch(error){
    console.log(error);
    chosenMaxLife = 100;
    alert('you entered something wrong, default value of 100 was used!');

    // throw error;
}finally{

}

let currentMosterHealth = chosenMaxLife;
let currentPlaterHealth = chosenMaxLife;
let hasBonusLife = true;



adjustHealthBars(chosenMaxLife);

function writeToLog(eve, val, monsterHealth, playerHealth){
    let logEntry = {
            event : eve,
            value : val,
            finalMonsterHealth : monsterHealth,
            finalPlayerHealth : playerHealth
    };
    // if(eve === LOG_EVENT_PLAYER_ATTACK){
    //     logEntry.target = 'MONSTER';
    // } else if(eve === LOG_EVENT_PLAYER_STRONG_ATTACK){
    //     logEntry = {
    //         event : eve,
    //         value : val,
    //         target : 'MONSTER',
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth : playerHealth
    //     };
    // }else if(eve === LOG_EVENT_MONSTER_ATTACK){
    //     logEntry = {
    //         event : eve,
    //         value : val,
    //         target : 'PLAYER',
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth : playerHealth
    //     };
    // }else if(eve === LOG_EVENT_PLAYER_HEAL){
    //     logEntry = {
    //         event : eve,
    //         value : val,
    //         target : 'PLAYER',
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth : playerHealth
    //     };
    // }else if(eve === LOG_EVENT_GAME_OVER){
    //     logEntry = {
    //         event : eve,
    //         value : val,
    //         finalMonsterHealth : monsterHealth,
    //         finalPlayerHealth : playerHealth
    //     };
    // }

    switch(eve){
        case LOG_EVENT_PLAYER_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_PLAYER_STRONG_ATTACK:
            logEntry.target = 'MONSTER';
            break;
        case LOG_EVENT_MONSTER_ATTACK:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_PLAYER_HEAL:
            logEntry.target = 'PLAYER';
            break;
        case LOG_EVENT_GAME_OVER:
            logEntry = {
                        event : eve,
                        value : val,
                        finalMonsterHealth : monsterHealth,
                        finalPlayerHealth : playerHealth
                    };
            break;
        default:
            logEntry = {};
    }
    battleLog.push(logEntry);
}

function reset(){
    currentMosterHealth = chosenMaxLife;
    currentPlaterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);

}

function endRound(){
    const initialPlayerHealth = currentPlaterHealth;
    const playerDamage =  dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlaterHealth -= playerDamage;

    writeToLog(LOG_EVENT_MONSTER_ATTACK, playerDamage, currentMosterHealth, currentPlaterHealth);

    if(currentPlaterHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlaterHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You almost dead but the bonus life saved you');
    }
    if(currentMosterHealth <= 0 && currentPlaterHealth > 0){
        alert('Congratulate! You Win');
        writeToLog(LOG_EVENT_GAME_OVER, 'PLAYER WON', currentMosterHealth, currentPlaterHealth);
    }else if(currentPlaterHealth <= 0 && currentMosterHealth > 0){
        alert('Sorry! You lose the game.');
        writeToLog(LOG_EVENT_GAME_OVER, 'MONSTER WON', currentMosterHealth, currentPlaterHealth);
    }else if(currentMosterHealth <= 0 && currentPlaterHealth <= 0){
        alert('you have a drow');
        writeToLog(LOG_EVENT_GAME_OVER, 'A DRAW', currentMosterHealth, currentPlaterHealth);
    }

    if(currentMosterHealth < 0 || currentPlaterHealth < 0){
        reset();
    }
}


function attackMonster(mode){
    // let maxDamage;
    // let logEvent;
    // if(mode === MODE_ATTACK ){
    //     maxDamage = ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_ATTACK;
    // }else if(mode === MODE_STRONG_ATTACK){
    //     maxDamage = STRONG_ATTACK_VALUE;
    //     logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
    // }
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
    const logEvent = mode === MODE_ATTACK ? LOG_EVENT_PLAYER_ATTACK : LOG_EVENT_PLAYER_STRONG_ATTACK;

    const damage = dealMonsterDamage(maxDamage);
    currentMosterHealth -= damage;
    writeToLog(logEvent, damage, currentMosterHealth, currentPlaterHealth);

    endRound();
}

function attackHandler(){
    attackMonster(MODE_ATTACK);
    }

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
    let healValue;
    if (currentPlaterHealth >= chosenMaxLife - HEAL_VALUE){
        alert("you can't heal more than your max initial health");
        healValue = chosenMaxLife - currentPlaterHealth;
    }else{
        healValue = HEAL_VALUE;
    }
    increasePlayerHealth(healValue);
    currentPlaterHealth += healValue;

    writeToLog(LOG_EVENT_PLAYER_HEAL, HEAL_VALUE, currentMosterHealth, currentPlaterHealth);
    endRound();
}

function printLogHandler(){
    let i = 0;
    for(const logEntry of battleLog){
        if (!lastLoggedEntry || lastLoggedEntry < i){
            console.log(`#${i}`);
            for(const key in logEntry){
                console.log(`${key} => ${logEntry[key]}`);
            }
            lastLoggedEntry = i;
            break;
        }
        i++;
    }
    console.log(battleLog);
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click', printLogHandler);