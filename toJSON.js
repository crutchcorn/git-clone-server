const path = require('path');
const fs = require('fs');


const url = "https://github.com/gothinkster/react-redux-realworld-example-app.git";

const repoPath = url.replace(/^https?:\/\//, '');

const dir = path.resolve("./tmp", repoPath)

/*
{
    foo.js: Buffer[],
    directory: {
        foo.other: Buffer[]
    }
}
*/

async function toArray(asyncIterator){ 
    const arr=[]; 
    for await(const i of asyncIterator) arr.push(i); 
    return arr;
}

async function walk(dir) {
    const finalObj = {};
    for await (const d of await fs.promises.opendir(dir)) {
        const entry = path.join(dir, d.name);

        if (d.isDirectory()) {
            finalObj[d.name] = await walk(entry);
            continue;
        }

        const contents = await fs.promises.readFile(entry);

        finalObj[d.name] = contents;

        continue;

    }

    return finalObj;
}

(async () => {
    // for await (const p of walk(dir))
    const p = await walk(dir);
        console.log(p)
})()