import controls from '../../constants/controls';

function randomIntFromInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomFromInterval(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function reduceHealthIndicator(percentage, position) {
    const bar = document.getElementById(`${position}-fighter-indicator`);
    bar.style.width = `${percentage}%`;
}

function doDamage(fighter, damage, fighterHealth, position) {
    let newHealth = fighterHealth - damage;
    newHealth = newHealth < 0 ? 0 : newHealth;

    reduceHealthIndicator((newHealth / fighter.health) * 100, position);

    return newHealth;
}

export function getHitPower(fighter) {
    return fighter.attack * randomIntFromInterval(1, 2);
}

export function getBlockPower(fighter) {
    return fighter ? fighter.defense * randomFromInterval(1, 2) : 0;
}

export function getDamage(attacker, defender) {
    const damage = getHitPower(attacker) - getBlockPower(defender);
    return damage >= 0 ? damage : 0;
}

export async function fight(firstFighter, secondFighter) {
    let firstBlocking = false;
    let secondBlocking = false;

    let firstHealth = firstFighter.health;
    let secondHealth = secondFighter.health;

    const delayBetweenStrikes = 10000;

    let firstKeysPressed = {};
    let secondKeysPressed = {};
    let firstCriticalHitReadyTime = 0;
    let secondCriticalHitReadyTime = 0;

    return new Promise(resolve => {
        document.addEventListener('keydown', event => {
            if (event.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }

            /*
                Very poor solution.
                https://www.aleksandrhovhannisyan.com/blog/key-sequences-in-javascript/ this was the initial idea,
                but a lack of time has taken over :)
            */
            if (controls.PlayerOneCriticalHitCombination.includes(event.code)) {
                firstKeysPressed[event.code] = true;
                const allKeysPressed = controls.PlayerOneCriticalHitCombination.every(key => firstKeysPressed[key]);

                if (allKeysPressed && Date.now() > firstCriticalHitReadyTime) {
                    secondHealth = doDamage(secondFighter, firstFighter.attack * 2, secondHealth, 'right');

                    firstCriticalHitReadyTime = Date.now() + delayBetweenStrikes;
                    firstKeysPressed = {};
                }

                return;
            }

            if (controls.PlayerTwoCriticalHitCombination.includes(event.code)) {
                secondKeysPressed[event.code] = true;
                const allKeysPressed = controls.PlayerTwoCriticalHitCombination.every(key => secondKeysPressed[key]);

                if (allKeysPressed && Date.now() > secondCriticalHitReadyTime) {
                    firstHealth = doDamage(firstFighter, secondFighter.attack * 2, firstHealth, 'left');

                    secondCriticalHitReadyTime = Date.now() + delayBetweenStrikes;
                    secondKeysPressed = {};
                }
                return;
            }

            switch (event.code) {
                case controls.PlayerOneBlock:
                    firstBlocking = true;
                    break;
                case controls.PlayerTwoBlock:
                    secondBlocking = true;
                    break;

                default:
                    break;
            }
        });

        document.addEventListener('keyup', event => {
            if (event.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }

            switch (event.code) {
                case controls.PlayerOneAttack:
                    {
                        const damage = getDamage(firstFighter, secondBlocking ? secondFighter : null);
                        secondHealth = doDamage(secondFighter, damage, secondHealth, 'right');
                    }
                    break;

                case controls.PlayerTwoAttack:
                    {
                        const damage = getDamage(secondFighter, firstBlocking ? firstFighter : null);
                        firstHealth = doDamage(firstFighter, damage, firstHealth, 'left');
                    }
                    break;

                case controls.PlayerOneBlock:
                    firstBlocking = false;
                    break;

                case controls.PlayerTwoBlock:
                    secondBlocking = false;
                    break;

                default:
                    break;
            }

            if (!firstHealth || !secondHealth) {
                resolve(!firstHealth ? secondFighter : firstFighter);
            }
        });
    });
}
