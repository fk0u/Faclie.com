/* eslint-disable */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('===================================================');
console.log('   FACLIE CLIENT SIMULATION GAME LOCAL INSTALLER   ');
console.log('===================================================');

const sourceDir = path.join(__dirname, '..', 'dist', 'Faclie-win32-x64');
const destDir = path.join(process.env.LOCALAPPDATA || path.join(process.env.USERPROFILE, 'AppData', 'Local'), 'Faclie');

if (!fs.existsSync(sourceDir)) {
  console.error(`\n[ERROR] Source build folder not found at: ${sourceDir}`);
  console.error('Please run "npm run desktop:build" first to compile the application.');
  process.exit(1);
}

console.log(`\n[1/3] Copying application files to: ${destDir}...`);
try {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(destDir, { recursive: true });
  
  // Use Windows xcopy for recursive, robust, fast folder copy
  execSync(`xcopy "${sourceDir}" "${destDir}" /E /I /H /Y /Q`);
  console.log('      Files copied successfully.');
} catch (err) {
  console.error('      Failed to copy files:', err.message);
  process.exit(1);
}

console.log('\n[2/3] Creating Windows Shortcut links...');
const desktopPath = path.join(process.env.USERPROFILE, 'Desktop', 'Faclie.lnk');
const startMenuPath = path.join(process.env.APPDATA, 'Microsoft', 'Windows', 'Start Menu', 'Programs', 'Faclie.lnk');
const targetExe = path.join(destDir, 'Faclie.exe');

const createShortcutPs = (shortcutPath, targetPath) => {
  const psCommand = `
    $WshShell = New-Object -ComObject WScript.Shell;
    $Shortcut = $WshShell.CreateShortcut("${shortcutPath}");
    $Shortcut.TargetPath = "${targetPath}";
    $Shortcut.WorkingDirectory = "${path.dirname(targetPath)}";
    $Shortcut.Save();
  `;
  execSync(`powershell -Command "${psCommand.replace(/\n/g, '').trim()}"`);
};

try {
  createShortcutPs(desktopPath, targetExe);
  createShortcutPs(startMenuPath, targetExe);
  console.log('      Shortcuts created on Desktop and Start Menu!');
} catch (err) {
  console.warn('      Failed to create shortcut links:', err.message);
}

console.log('\n[3/3] Checking local hosts domain mapping (Faclie.space)...');
const hostsPath = 'C:\\Windows\\System32\\drivers\\etc\\hosts';
const mapping = '127.0.0.1 Faclie.space';

try {
  const hostsContent = fs.readFileSync(hostsPath, 'utf8');
  if (hostsContent.includes('Faclie.space')) {
    console.log('      Domain "Faclie.space" is already mapped in your hosts file.');
  } else {
    // Attempt appending to system hosts file (requires administrator privileges)
    fs.appendFileSync(hostsPath, `\n${mapping}\n`);
    console.log('      Mapped "Faclie.space" successfully to 127.0.0.1 in hosts file!');
  }
} catch (err) {
  console.warn('      [!] WARNING: Unable to write to hosts file (Permission Denied).');
  console.warn(`      To map "Faclie.space" to your localhost, please manually add this line:`);
  console.warn(`         ${mapping}`);
  console.warn(`      to your hosts file at: ${hostsPath}`);
  console.warn(`      (Open Notepad as Administrator, edit the file, and save it).`);
}

console.log('\n===================================================');
console.log(' INSTALLATION COMPLETE! Launch Faclie from Desktop.');
console.log('===================================================');
