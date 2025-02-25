const codeAdd = `const node = await IPFS.create()

const data = 'Hello, <YOUR NAME HERE>'

// add your data to to IPFS - this can be a string, a Buffer,
// a stream of Buffers, etc
const files = await node.add(data)

// 'hash', known as CID, is a string uniquely addressing the data
// and can be used to get it again. 'files' is an array because
// 'add' supports multiple additions, but we only added one entry
console.log(files[0].hash)`

const codeGet = (cid) => `const node = await IPFS.create()

const data = await node.cat('${cid}')

// data is returned as a Buffer, conver it back to a string
console.log(data.toString())`

function transformCode (code) {
  return `function () {
    (async function () {
      ${code}
    })()
    return null
  }`
}

function log (fn) {
  return {
    error: fn,
    log: fn,
    warning: fn
  }
}

function stubIpfs (node, IPFS) {
  node.once = (e, fn) => fn()
  node.on = (e, fn) => fn()

  const WrapIPFS = function () {
    return node
  }

  return Object.assign(WrapIPFS, IPFS, { create: async () => node })
}

async function getIpfs (opts) {
  // We are using webpackChunkName in the comment so that our chunk
  // will be named `ipfs.[hash].js` instead of `[id].[hash].js`
  const { default: Ipfs } = await import(/* webpackChunkName: "ipfs" */ 'ipfs')
  const node = await Ipfs.create({ repo: 'getting-started' })

  return stubIpfs(node, Ipfs)
}

export {
  transformCode,
  log,
  stubIpfs,
  getIpfs,
  codeAdd,
  codeGet
}
