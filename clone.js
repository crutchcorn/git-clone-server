const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;

const clone = (url, dir) => {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        const cloneSpawn = spawn('git', ['clone', url, '--depth', '1', '--single-branch'], {
            cwd: dir
        });

        cloneSpawn.on('close', function (code) {
            resolve(code);
        });


        cloneSpawn.on('error', function (err) {
            console.error("I failed to clone", err)
            reject(err);
        });


    })
}

exports.clone = clone;
