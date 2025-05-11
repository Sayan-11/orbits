// Grab DOM elements
export const gameMessage = document.getElementById("gameMessage");
export const restartButton = document.getElementById("restartButton");

// Show a message on the UI
export function showMessage(text, duration = 2000) {
  if (gameMessage.timeoutId) {
    clearTimeout(gameMessage.timeoutId);
    gameMessage.timeoutId = null;
  }
  gameMessage.textContent = text;
  gameMessage.classList.add("visible");
  gameMessage.timeoutId = setTimeout(() => {
    gameMessage.classList.remove("visible");
    gameMessage.timeoutId = null;
  }, duration);
}

// Draw the start screen
export function drawStartScreen(ctx, canvas, starfield, logoImage) {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw starfield
  for (const star of starfield) {
    ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
    ctx.fill();
  }

  // Draw logo
  const logoWidth = 200;
  const logoHeight = 100;
  const logoX = canvas.width / 2 - logoWidth / 2;
  const logoY = canvas.height / 2 - logoHeight / 2;
  ctx.drawImage(logoImage, logoX, logoY, logoWidth, logoHeight);

  // Draw start button
  const buttonWidth = 200;
  const buttonHeight = 50;
  const buttonX = canvas.width / 2 - buttonWidth / 2;
  const buttonY = canvas.height * 0.8;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.strokeStyle = 'white';
  ctx.lineWidth = 2;
  ctx.strokeRect(buttonX, buttonY, buttonWidth, buttonHeight);
  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Start Game', canvas.width / 2, buttonY + buttonHeight / 2);
}

// Handle start button click
export function handleStartButtonClick(x, y, canvas, initGame) {
  const scale = Math.min(canvas.clientWidth, canvas.clientHeight) / 600;
  const buttonWidth = 200 * scale;
  const buttonHeight = 50 * scale;
  const buttonX = canvas.clientWidth / 2 - buttonWidth / 2;
  const buttonY = canvas.clientHeight * 0.8;
  if (x > buttonX && x < buttonX + buttonWidth &&
      y > buttonY && y < buttonY + buttonHeight) {
    initGame();
    return true;
  }
  return false;
} 