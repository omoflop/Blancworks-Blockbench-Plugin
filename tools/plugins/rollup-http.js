const fs = require('fs'),
    path = require('path'),
    axios = require("axios")
const axiosInstance = axios.default;
const createDir = path => !fs.existsSync(path) && fs.mkdirSync(path)
const mirrorDirectoryPaths = async ({ cacheLocation, url }) => {
    createDir(cacheLocation)
    const dirs = [], scriptPath = url.replace(/:\/\/|:/g, "-")

    let currentDir = path.dirname(scriptPath)
    while (currentDir !== '.') {
        dirs.unshift(currentDir)
        currentDir = path.dirname(currentDir)
    }
    dirs.forEach(d => createDir(`${cacheLocation}${d}`))
    return `${cacheLocation}${scriptPath}`
}

const cacheIndex = {}
const writeToDiskCache = async ({ cacheLocation, url }) => {
    //Write a file to the local disk cache for rollup to pick up.
    //If the file is already existing use it instead of writing a new one.
    const cached = cacheIndex[url]
    if (cached) return cached

    const cacheFile = await mirrorDirectoryPaths({ cacheLocation, url }),
        data = (await axiosInstance.get(url).catch((e) => { console.log(url, e) })).data
    fs.writeFileSync(cacheFile, data)
    cacheIndex[url] = cacheFile

    return cacheFile
}

export const http = (options = { cacheLocation }) => {
    return {
        async resolveId(importee, importer) {
            //We importing from a URL
            if (/^https?:\/\//.test(importee)) {
                return await writeToDiskCache({ cacheLocation: options.cacheLocation, url: importee })
            }
            //We are importing from a file within the cacheLocation (originally from a URL) and need to continue the cache import chain.
            if (importer && importer.startsWith(options.cacheLocation) && /^..?\//.test(importee)) {
                const importerUrl = Object.keys(cacheIndex).find(key => cacheIndex[key] === importer),
                    importerPath = path.dirname(importerUrl),
                    importeeUrl = path.normalize(`${importerPath}/${importee}`).replace(":\\", "://").replace(/\\/g, "/")
                return await writeToDiskCache({ cacheLocation: options.cacheLocation, url: importeeUrl })
            }
        }
    }
}