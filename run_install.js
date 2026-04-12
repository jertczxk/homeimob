const { execSync } = require('child_process');
const fs = require('fs');

try {
    console.log('Starting install...');
    const output = execSync('npm install openai@6.34.0', { encoding: 'utf8' });
    fs.writeFileSync('install_log.txt', output);
    console.log('Install finished.');
} catch (error) {
    fs.writeFileSync('install_log.txt', error.stdout + '\n' + error.stderr);
    console.log('Install failed.');
}
