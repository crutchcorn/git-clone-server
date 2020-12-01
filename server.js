const path = require('path');
const fs = require('fs');

const iso = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

const express = require('express')
const app = express()
const port = 3000

const shrinkRay = require('shrink-ray-current');

// Brotli
// app.use(shrinkRay());


async function walk(dir) {
    const finalObj = {};
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);

        if (d.isDirectory()) {
            finalObj[d.name] = await walk(entry);
            continue;
        }

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

    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    iso.clone({
        fs,
        http,
        url,
        singleBranch: true,
        depth: 1,
        dir,
    })
    .then(() => {
        return walk(dir)
    })
    .then(val => {
        res.send(JSON.stringify(val));
    })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
