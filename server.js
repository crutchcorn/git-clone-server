const path = require('path');
const fs = require('fs');

const iso = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const express = require('express')
const app = express()
const port = 3000

const {clone} = require('./clone');

const shrinkRay = require('shrink-ray-current');
const {
  performance
} = require('perf_hooks');

// Brotli
app.use(shrinkRay());

async function walk(dir) {
    const finalObj = {};
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);

        if (d.isDirectory()) {
            finalObj[d.name] = await walk(entry);
            continue;
        }

        // b64 encoding takes literally 16 seconds on NextJS repo clone 😬
        const contents = await fs.promises.readFile(entry, {encoding: 'base64'});

        finalObj[d.name] = contents;

        continue;

    }

    return finalObj;
}

app.get('/', (req, res) => {
    const url = "https://github.com/vercel/next.js.git";

    const repoPath = url.replace(/^https?:\/\//, '');

    const dir = path.resolve("./tmp", repoPath)

    const start = performance.now();

    clone(url,dir)
    .then(() => {
        console.log('Clone done', performance.now() - start)
        return walk(dir)
    })
    .then(val => {
        console.log('Walk done', performance.now() - start)
        res.send(JSON.stringify(val));
    })
    .catch(e => console.error(e))

    // fs.rmdirSync(dir, { recursive: true })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
