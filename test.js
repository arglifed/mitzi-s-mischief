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

      console.log('Testing BossRoster and 6 stage bosses...');
      if (!BossRoster || BossRoster.length !== 6) throw new Error('BossRoster length is not 6');
      const expectedNames = [
        "Briar Pixie",
        "Shadown Tanuki Sho",
        "Cat Punk",
        "Grumpy Chef",
        "Proxy",
        "Madame Satsuki"
      ];
      BossRoster.forEach((BossClass, idx) => {
        const b = new BossClass();
        if (b.name !== expectedNames[idx]) throw new Error('Boss name mismatch: ' + b.name + ' vs ' + expectedNames[idx]);
        b.active = true;
        for (let f = 0; f < 120; f++) b.update();
        if (bossBullets.length === 0) throw new Error('Boss did not fire bullets in Phase 1: ' + b.name);
        b.hp = Math.floor(b.maxHP * 0.4);
        b.update();
        if (!b.phase2) throw new Error('Boss failed to enter Phase 2: ' + b.name);
        if (b.flashTimer !== 44) throw new Error('Flash timer not set on phase 2 entry');
        for (let f = 0; f < 120; f++) b.update();
        console.log('Validated Boss: ' + b.name + ' (HP: ' + b.maxHP + ', Phase 2 trigger OK)');
        bossBullets.length = 0;
      });
    `);
    console.log('No syntax errors found on load.');
    setTimeout(() => { console.log('Successfully ran test simulation.'); process.exit(0); }, 50);
  } catch (e) {
    console.error('Error:', e);
    process.exit(1);
  }
}
