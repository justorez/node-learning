module.exports = function (playerAction) {
  const actions = ['rock', 'scissor', 'paper'];

  if (!actions.includes(playerAction)) {
    throw new Error('invalid playerAction');
  }

  let computerAction;
  let random = Math.random() * 3;
  if (random < 1) {
    computerAction = actions[0];
  } else if (random > 2) {
    computerAction = actions[1];
  } else {
    computerAction = actions[2];
  }

  if (computerAction === playerAction) {
    return 0;
  } else if (
    (computerAction === 'rock' && playerAction === 'scissor') ||
    (computerAction === 'scissor' && playerAction === 'paper') ||
    (computerAction === 'paper' && playerAction === 'rock')
  ) {
    return -1;
  } else {
    return 1;
  }
}
