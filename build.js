import { parse } from 'acorn'
import { inspect } from 'node:util';
import config from './build.config.js'
import fs from 'fs/promises'
import path from 'path'
async function readSource () {
    const fileHandle = await fs.open(`./${config.input}/index.js`, 'r+')
    return fileHandle.readFile({encoding: 'utf8'})
}

async function output (node) {
    try {
        await fs.access(config.output)
        await fs.rm(config.output, {recursive: true})
    }catch (err) {
    }
    await fs.mkdir(`${config.output}`)
    const fileHandle = await fs.open(`./${config.output}/index.json`, 'w')
    await fileHandle.writeFile(JSON.stringify(node, {}, 4), {encoding: 'utf8'})
    await fileHandle.close()
    console.log(`build to '${config.output}/index.json' success`)
}


async function build () {
    const source = await readSource()
    const node = parse(source, {
        ecmaVersion: 2015,
        sourceFile: true,
        // locations: true
    });
    return output(node)
}

build()

