const chokidar = require('chokidar');
const updater = require('./src/updater');
const NodeSsh = require('node-ssh');

const nodeSsh = new NodeSsh();
const args = process.argv.slice(2);

if (!args.length) {
  throw new Error('Argument with directory to watch is required');
}

const dirToWatch = args[0];
const sshUser = args[1];
const sshServer = args[2];
const sshDestDir = args[3];

if (!sshUser) {
  console.error('Argument with ssh user name is missing');
  return;
} else if (!sshServer) {
  console.error('Argument with ssh server address is missing');
  return;
} else if (!sshDestDir) {
  console.error('Argument with ssh server destination dir is missing');
  return;
}

async function run() {
  await nodeSsh.connect({
    host: sshServer,
    username: sshUser,
    privateKey: '/Users/jaydeepparmar/.ssh/id_rsa'
  });
  
  const watcher = chokidar.watch(dirToWatch, { ignored: /^\./, persistent: true });
  
  watcher
    .on('change', updater.uploadNewFile({nodeSsh, sshDestDir}))
    .on('unlink', updater.removeFile({nodeSsh, sshDestDir}));
}

run();
