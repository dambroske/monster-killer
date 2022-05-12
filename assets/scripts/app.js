const HEAL_VALUE = 50;
const MODE_ATTACK = 'ATTACK';
const MODE_STRONG_ATTACK = 'STRONG_ATTACK';

const LOG_PLAYER_ATTACK = 'PLAYER_ATTACK';
const LOG_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_GAME_OVER = 'GAME_OVER';

// those variables below are declared in CAPITAL
// because once they're started in the code 
// they'll actually behave like constants. 
// so I created them this way for readbility purposes
let PLAYER_ATTACK_VALUE;
let MONSTER_ATTACK_VALUE;
let PLAYER_STRONG_ATTACK_VALUE;
let MONSTER_STRONG_ATTACK_VALUE;

let chosenMaxLife = 100;
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBonusLife = true;
let remainingPlayerHeals = 2;

let battleLog = [];

adjustHealthBars(chosenMaxLife);
selectGameDifficulty();

function selectGameDifficulty() {

    const selectedLevel = prompt('Please, select the game difficulty. 1 - Easy \ 2 - Normal \ 3 - Hard', 
                                 'only numbers here, please');

    if (selectedLevel == 1) {
        setGameDifficulty(15, 10, 22, 15);
    } else if (selectedLevel == 2) {
        setGameDifficulty(15, 15, 22, 22);
    } else if (selectedLevel == 3) {
        setGameDifficulty(10, 20, 20, 30);
    } else {
        alert('Invalid output. Level was set as "normal" by default.')
        setGameDifficulty(15, 15, 22, 22);
    }
}

function setGameDifficulty(playerAttack, monsterAttack, playerStrgAttack, monsterStrgAttack) {

    PLAYER_ATTACK_VALUE = playerAttack;
    MONSTER_ATTACK_VALUE = monsterAttack;
    PLAYER_STRONG_ATTACK_VALUE = playerStrgAttack;
    MONSTER_STRONG_ATTACK_VALUE = monsterStrgAttack;

}

function writeToLog(event, value, monsterHealth, playerHealth) {

    let logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
    }

    if (event === LOG_PLAYER_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (event === LOG_PLAYER_STRONG_ATTACK) {
        logEntry.target = 'MONSTER';
    } else if (event === LOG_MONSTER_ATTACK) {
        logEntry.target = 'PLAYER';
    } else if (event === LOG_PLAYER_HEAL) {
        logEntry.target = 'PLAYER';
    }

    battleLog.push(logEntry);

}

function attackMonster(modeOfAttack) {

    let maxPlayerDamage;
    let maxMonsterDamage;
    let logTypeOfAttack

    if (modeOfAttack === MODE_ATTACK) {

        maxPlayerDamage = PLAYER_ATTACK_VALUE;
        maxMonsterDamage = MONSTER_ATTACK_VALUE;
        logTypeOfAttack = LOG_PLAYER_ATTACK;

    } else if (modeOfAttack === MODE_STRONG_ATTACK) {

        maxPlayerDamage = PLAYER_STRONG_ATTACK_VALUE;
        maxMonsterDamage = MONSTER_STRONG_ATTACK_VALUE;
        logTypeOfAttack = LOG_PLAYER_STRONG_ATTACK;

    }

    const monsterDamage = dealMonsterDamage(maxPlayerDamage);
    currentMonsterHealth -= monsterDamage;
    const playerDamage = dealPlayerDamage(maxMonsterDamage);
    currentPlayerHealth -= playerDamage;

    writeToLog(
        logTypeOfAttack,
        playerDamage,
        currentMonsterHealth,
        currentPlayerHealth
    )
    checkingResults();

}

function checkingResults() {

    if (currentPlayerHealth <= 0 && hasBonusLife) {
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth = 35;
        increasePlayerHealth(35);
        alert('You just used your bonus life!')
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {

        alert('You won!')
        reset()

        writeToLog(
            LOG_GAME_OVER,
            'END-GAME! PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )

    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {

        alert('You lost!')
        reset()

        writeToLog(
            LOG_GAME_OVER,
            'END-GAME! MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )

    } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {

        alert('You have a draw!')
        reset()

        writeToLog(
            LOG_GAME_OVER,
            'END-GAME! ITS A DRAW!',
            currentMonsterHealth,
            currentPlayerHealth
        )

    }

}

function reset() {

    currentMonsterHealth = chosenMaxLife;
    currentPlayerHealth = chosenMaxLife;
    resetGame(chosenMaxLife);
    remainingPlayerHeals = 2;
    alert('A new round will start!')

}

function onHeal() {

    let healValue;

    if (remainingPlayerHeals > 0) {

        remainingPlayerHeals--;

        if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {

            alert(`You can't heal more than your FULL LIFE!`);
            healValue = chosenMaxLife - currentPlayerHealth;
    
        } else {
            healValue = HEAL_VALUE;
        }
    
        increasePlayerHealth(healValue);
        const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
        currentPlayerHealth += HEAL_VALUE;
    
        writeToLog(
            LOG_PLAYER_HEAL,
            healValue,
            currentMonsterHealth,
            currentPlayerHealth
        )
    
        checkingResults();
    } else {
        alert('You already used all of your "Heal" power for this round.')
    }

}

function onAttack() {
    attackMonster(MODE_ATTACK);
}

function onStrongAttack() {
    attackMonster(MODE_STRONG_ATTACK);
}

function onPrintLog() {
    let index = 1;
    for (const logEntry of battleLog){
        console.log(`#${index}`);
        console.log(logEntry);
        index++
    }
    alert('LOG SUCCESFULLY GENERATED! It can be seen in "Developer Tools"');
}

attackBtn.addEventListener('click', onAttack);
strongAttackBtn.addEventListener('click', onStrongAttack);
healBtn.addEventListener('click', onHeal);
logBtn.addEventListener('click', onPrintLog);