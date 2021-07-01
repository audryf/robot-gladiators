/* GAME FUNCTIONS */

// Function to generate a random numeric value
var randomNumber = function(min, max) {
    var value = Math.floor(Math.random() * (max - min + 1)+ min);

    return value;
};

// Function to check if player wants to fight or skip
var fightOrSkip = function() {
    // ask player if they'd like to fight or skip 
    var promptFight = window.prompt('Would you like to FIGHT or SKIP this battle? Enter "FIGHT" or "SKIP" to choose.');

    // Validate prompt answer
    if (promptFight === "" || promptFight === null) {
        window.alert("You need to provide a valid answer! Please try again.");
        // Use return to call it again and stop the rest of this function from running
        return fightOrSkip();
    }
  
    // Convert promptFight to all lowercase so we can check with less options
    promptFight = promptFight.toLowerCase();

    if (promptFight === "skip") {
        // Confirm player wants to skip
        var confirmSkip = window.confirm("Are you sure you'd like to quit?");
  
        // If yes (true), leave fight
        if (confirmSkip) {
             window.alert(playerInfo.name + " has decided to skip this fight. Goodbye!");
            // Subtract money from playerMoney for skipping, but don't let them go into the negative
            playerInfo.money = Math.max(0, playerInfo.money - 10);
            // Stop while() loop using break; enter next fight

            // Return true if player wants to leave
            return true;
        }
    }
    return false;
};

// Fight function (now with parameter for enemy's object holding name, health, and attack values)
var fight = function(enemy) {
    // Keep track of who goes first
    var isPlayerTurn = true;

    // Randomly change turn order
    if (Math.random() > 0.5) {
        isPlayerTurn = false;
    }

    while(playerInfo.health > 0 && enemy.health > 0) {
        if (isPlayerTurn) {
            // Ask the player if they'd like to fight or skip using fightOrSkip function
            if (fightOrSkip()) {
                // If true, leave fight by breaking loop
                break;
            }

            var damage = randomNumber(playerInfo.attack - 3, playerInfo.attack);

            // Remove enemy's health by subtracting the amount we set in the damage variable
            enemy.health = Math.max(0, enemy.health - damage);
            console.log(
                playerInfo.name + 
                " attacked " + 
                enemy.name + 
                ". " + 
                enemy.name + 
                " now has " + 
                enemy.health + 
                " health remaining."
            );

            // Check enemy's health
            if (enemy.health <= 0) {
                window.alert(enemy.name + " has died!");
    
                // Award player money for winning
                playerInfo.money = playerInfo.money + 20;

                // Leave while() loop since enemy is dead
                break;
            }   else {
                window.alert(enemy.name + " still has " + enemy.health + " health left.");
            }
            // Player gets attacked first
        } else { 
            var damage = randomNumber(enemy.attack - 3, enemy.attack);
        
            // Remove player's health by subtracting the amount set in the damage variable
            playerInfo.health = Math.max(0, playerInfo.health - damage);
            console.log(
                enemy.name + 
                " attacked " + 
                playerInfo.name + 
                ". " + 
                playerInfo.name + 
                " now has " + 
                playerInfo.health + 
                " health remaining."
            );

            // check player's health
            if (playerInfo.health <= 0) {
                window.alert(playerInfo.name + " has died!");
                // Leave while() loop if player is dead
                break; 
            }   else {
                window.alert(playerInfo.name + " still has " + playerInfo.health + " health left.");
            }
        }
        // Switch turn order for next round
        isPlayerTurn = !isPlayerTurn;
    }
};

// Function to start a new game
var startGame = function() {
    // Reset player stats
    playerInfo.reset();

    // Fight each enemy-robot by looping over them and fighting them one at a time
    for (var i = 0; i < enemyInfo.length; i++) {
        // Check player stats
        console.log(playerInfo);

        // If player is still alive, keep fighting
        if (playerInfo.health > 0) {
            // Let player know what round they are in, remember that arrays start at 0 so it needs to have 1 added to it
             window.alert('Welcome to Robot Gladiators! Round ' + (i + 1));

            // Pick new enemy to fight based on the index of the enemyInfo array
            var pickedEnemyObj = enemyInfo[i];

            // Reset enemyHealth before starting new fight
            pickedEnemyObj.health = randomNumber(40, 60);

            console.log(pickedEnemyObj);

            // Pass the pickedEnemyName variable's value into the fight function, where it will assume the value of the enemyName parameter
            fight(pickedEnemyObj);

            // If player is still alive and we're not at the last enemy in the array
            if (playerInfo.health > 0 && i < enemyInfo.length - 1) {
                // Ask if player wants to use the store before next round
                var storeConfirm = window.confirm("The fight is over, visit the store before the next round?");

                // If yes, take them to the shop() function
                if (storeConfirm) {
                    shop();
                }
            }
        }
        // If player isn't alive, stop the game
        else {
            window.alert('You have lost your robot in battle! Game Over!');
            break;
        }
    }

    // After loop ends, we are either out of playerInfo.health or enemies to fight, so run the endGame function
    endGame();
};

// Function to end the entire game
var endGame = function() {
    window.alert("The game has now ended. Let's see how you did!");

    // Check localStorage for high score, if it's not there, use 0
    var highScore = localStorage.getItem("highscore");
    if (highScore === null) {
        highScore = 0;
    }

    // If player has more money than the high score, player has new high score!
    if (playerInfo.money > highScore) {
        localStorage.setItem("highscore", playerInfo.money);
        localStorage.setItem("name", playerInfo.name);

        alert(playerInfo.name + " now has a high score of " + playerInfo.money + "!");
    } else {
        alert(playerInfo.name + " did not beat high score of " + highScore + ". Maybe next time!");
    }
    
    // Ask player if they'd like to play again
    var playAgainConfirm = window.confirm("Would you like to play again?");

    if (playAgainConfirm) {
        startGame();
    } else {
        window.alert("Thank you for playing Robot Gladiators! Come back soon!");
    }
};

// Go to shop between battles function
var shop = function() {
    // Ask player what they'd like to do
    var shopOptionPrompt = window.prompt(
        "Would you like to REFILL your health, UPGRADE your attack, or LEAVE the store? Please enter one: '1' for REFILL, '2' for UPGRADE, or 3 for LEAVE."
    );

    // Convert answer from prompt to an actual number
    shopOptionPrompt = parseInt(shopOptionPrompt);

    // Use switch to carry out action
    switch (shopOptionPrompt) {
        case 1: 
            playerInfo.refillHealth();
            break;
        case 2:
            playerInfo.upgradeAttack();
            break;
        case 3:
            window.alert("Leaving the store.");
            break;
        default:
            window.alert("You did not pick a valid option. Try again.");
            shop();
            break;
    }
};

// Function to set name
var getPlayerName = function() {
    var name = "";

    while (name === "" || name === null) {
        name = prompt("What is your robot's name?");
    }
    console.log("Your robot's name is " + name);
    return name;
};

/* END GAME FUNCTIONS */

/* GAME INFORMATION / VARIABLES */

var playerInfo = {
    name: getPlayerName(),
    health: 100,
    attack: 10,
    money:10,
    reset: function() {
        this.health = 100;
        this.money = 10;
        this.attack = 10;
    },
    refillHealth: function() {
        if (this.money >= 7) {
            window.alert("Refilling player's health by 20 for 7 dollars.");
            this.health += 20;
            this.money -= 7;
        }   else {
            window.alert("You don't have enough money!");
        }
    },
    upgradeAttack: function() {
        if (this.money >= 7) {
            window.alert("Upgrading player's attack by 6 for 7 dollars.");
            this.attack += 6;
            this.money -= 7;
        }   else {
            window.alert("You don't have enough money!");
        }
    }
};

var enemyInfo = [
    {
        name: "Roborto",
        attack: randomNumber(10, 14)
    },
    {
        name: "Amy Android",
        attack: randomNumber(10, 14)
    },
    {
        name: "Robo Trumble",
        attack: randomNumber(10, 14)
    }
];

/* END GAME INFORMATION / VARIABLES */

/* RUN GAME */
startGame();
