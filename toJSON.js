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
    const items = await toArray(await fs.promises.opendir(dir));
    return await items.reduce(async (prev, d) => {
        prev = await prev;
        const entry = path.join(dir, d.name);

        if (d.isDirectory()) {
            prev[d.name] = await walk(entry);
            return prev;
        }

        const contents = await fs.promises.readFile(entry);

        prev[d.name] = contents;

        return prev;
    }, Promise.resolve({}))
}

(async () => {
    // for await (const p of walk(dir))
    const p = await walk(dir);
        console.log(p)
})()