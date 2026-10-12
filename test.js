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
          fillText: () => {}
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
    eval(domCode + code);
    console.log('No syntax errors found on load.');
    setTimeout(() => { console.log('Successfully ran 50ms.'); process.exit(0); }, 50);
  } catch (e) {
    console.error('Error:', e);
  }
}
