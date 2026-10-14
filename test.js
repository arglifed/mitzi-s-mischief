const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
if (scriptMatch) {
  const code = scriptMatch[1];
  const domCode = `
    const document = {
      getElementById: () => ({
        getContext: () => ({
          fillRect: () => {},
          clearRect: () => {},
          drawImage: () => {},
          fillText: () => {},
          save: () => {},
          restore: () => {},
          translate: () => {},
          rotate: () => {},
          beginPath: () => {},
          arc: () => {},
          ellipse: () => {},
          fill: () => {},
          stroke: () => {},
          strokeRect: () => {},
          createRadialGradient: () => ({ addColorStop: () => {} })
        }),
        width: 160,
        height: 152
      })
    };
    const window = {
      addEventListener: () => {}
    };
    const requestAnimationFrame = (cb) => { setTimeout(cb, 16); };
    class Image {
        constructor() { this.complete = true; this.naturalHeight = 32; this.naturalWidth = 32; }
    }
  `;
  try {
    eval(domCode + code + `
      resetGame();
      gameState = 'PLAYING';
      console.log('Testing deterministic waves...');
      let wavesSpawned = 0;
      for (let f = 1; f <= 500; f++) {
        update();
        if (cameraX % 80 === 0 && cameraX > 0) {
          wavesSpawned++;
          console.log('Spawn milestone cameraX=' + cameraX + ', enemy count=' + enemies.length + ', latest enemy dropsCrystal=' + (enemies[enemies.length-1] && enemies[enemies.length-1].dropsCrystal));
        }
      }
      if (wavesSpawned < 5) throw new Error('Expected at least 5 waves to spawn');
    `);
    console.log('No syntax errors found on load.');
    setTimeout(() => { console.log('Successfully ran test simulation.'); process.exit(0); }, 50);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}
