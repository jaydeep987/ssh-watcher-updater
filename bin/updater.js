#!/usr/bin/env node

function uploadNewFile(options) {
  const { nodeSsh, sshDestDir } = options;
  return async (path) => {
    try {
      await nodeSsh.putFile(path, `${sshDestDir}/${path}`);
      console.log('File uploaded ... ', path);
    } catch(e) {
      console.log(e);
    }
  }
}

function removeFile(options) {
  const { nodeSsh, sshDestDir } = options;
  return async (path) => {
    try {
      await nodeSsh.execCommand(`rm -r ${path}`, { cwd: sshDestDir });
      console.log('File removed success ... ', path);
      const fileDir = path.substr(0, path.lastIndexOf('/'));
      console.log('fileDir', fileDir);
      // if it was only file in dir, remove that dir too!
      const response = await nodeSsh.execCommand(`ls -l ${fileDir}/ | wc -l`, { cwd: sshDestDir });
      console.log('count', response)
      if (response.stdout === '1') {
        await nodeSsh.execCommand(`rm -r ${fileDir}`, { cwd: sshDestDir });
        console.log('Directory was empty, removed success ... ', fileDir);
      }
    } catch(e) {
      console.error('Error while removing', e);
    }
  }
}

module.exports = {
  uploadNewFile,
  removeFile,
};
