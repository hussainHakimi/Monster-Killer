const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 14;
const STRONG_ATTACK_VALUE = 17;
const HEAL_VALUE = 20;

let chosenMaxLife = 100;
let currentMosterHealth = chosenMaxLife;
let currentPlaterHealth = chosenMaxLife;
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function reset(){
    currentMosterHealth = chosenMaxLife;
    currentPlaterHealth = chosenMaxLife;
    resetGame(chosenMaxLife);

}

function endRound(){
    const initialPlayerHealth = currentPlaterHealth;
    const playerDamage =  dealPlayerDamage(MONSTER_ATTACK_VALUE);
    currentPlaterHealth -= playerDamage;
    if(currentPlaterHealth <= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlaterHealth = initialPlayerHealth;
        setPlayerHealth(initialPlayerHealth);
        alert('You almost dead but the bonus life saved you');
    }
    if(currentMosterHealth <= 0 && currentPlaterHealth > 0){
        alert('Congratulate! You Win')
    }else if(currentPlaterHealth <= 0 && currentMosterHealth > 0){
        alert('Sorry! You lose the game.');
    }else if(currentMosterHealth <= 0 && currentPlaterHealth <= 0){
        alert('you have a drow');
    }


    if(currentMosterHealth < 0 || currentPlaterHealth < 0){
        reset();
    }
}


function attackMonster(mode){
    let maxDamage;
    if(mode = 'ATTACK'){
        maxDamage = ATTACK_VALUE
    }else if(mode = 'STRONG_ATTACK'){
        maxDamage = STRONG_ATTACK_VALUE;
    }
    const damage = dealMonsterDamage(maxDamage);
    currentMosterHealth -= damage;

    endRound();
}

function attackHandler(){
    attackMonster('ATTACK');
    }

function strongAttackHandler(){
    attackMonster('STRONG_ATTACK');
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
    endRound();
}

attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click', strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);