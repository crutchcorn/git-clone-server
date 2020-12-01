const path = require('path');
const fs = require('fs');

// const Git = require("nodegit");

const iso = require('isomorphic-git')
const http = require('isomorphic-git/http/node')

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
    dir
})
    .then(() => {
        
    })
