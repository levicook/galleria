import axios from 'axios'
import { readFile, mkdir, writeFile } from 'fs/promises'
import path from 'path'
import yargs from 'yargs/yargs'
import { hideBin } from 'yargs/helpers'
import { BloomFilter } from 'bloom-filters'
import { createWriteStream } from 'fs'

const defaultPublicDir = path.join(__dirname, '..', 'public')

// This 1000% belongs somewhere else.
// Possibly in blocklist-automation or more likely somewhere that can bring that together with phantoms blocklist too.
yargs(hideBin(process.argv))
  .option('public-dir', {
    describe: 'The root directory for blocklists',
    type: 'string',
    default: path.normalize(defaultPublicDir),
    coerce: path.normalize,
  })
  .demandCommand()
  .command(
    'cache-blocklists',
    'create local copies of the blocklists (for transparency & convenience)',
    (yargs) => {
      return yargs
        .option('solflare-remote-blocklist', {
          type: 'string',
          default: 'https://raw.githubusercontent.com/solflare-wallet/blocklist-automation/master/dist/blocklist.json',
        })
        .option('solflare-local-blocklist', {
          type: 'string',
          default: 'blocklists/solflare/blocklist.json',
        })
    }, async ({
      publicDir,
      solflareLocalBlocklist,
      solflareRemoteBlocklist
    }) => {
    solflareLocalBlocklist = path.join(publicDir, solflareLocalBlocklist)

    await mkdir(path.dirname(solflareLocalBlocklist), { recursive: true })

    const response = await axios({
      method: 'get',
      url: solflareRemoteBlocklist,
      responseType: 'stream'
    })

    const writer = createWriteStream(solflareLocalBlocklist)
    response.data.pipe(writer)
    return new Promise((resolve, reject) => {
      writer.on('finish', resolve)
      writer.on('error', reject)
    })
  })
  .command(
    'build-blooms',
    '...',
    (yargs) => {
      return yargs
        .option('falsePositiveRate', {
          alias: 'fpr',
          describe: 'The acceptable false positive rate',
          type: 'number',
          default: 0.0001, // 1 in 10k
        })
        .option('solflare-local-blocklist', {
          type: 'string',
          default: 'blocklists/solflare/blocklist.json',
        })
    }, async ({
      falsePositiveRate,
      publicDir,
      solflareLocalBlocklist
    }) => {
    solflareLocalBlocklist = path.join(publicDir, solflareLocalBlocklist)
    const solflwareLocalDir = path.dirname(solflareLocalBlocklist)

    let blocklistData = JSON.parse(await readFile(solflareLocalBlocklist, { encoding: 'utf-8' }))
    const { nftBlocklist } = blocklistData

    const bloomFilter = BloomFilter.create(nftBlocklist.length, falsePositiveRate)
    nftBlocklist.forEach((address: string) => bloomFilter.add(address))

    await writeFile(
      path.join(solflwareLocalDir, 'nftBlocklist.json'),
      JSON.stringify(bloomFilter.saveAsJSON()), {
      encoding: 'utf-8'
    })
  })
  .help()
  .alias('help', 'h')
  .parse()