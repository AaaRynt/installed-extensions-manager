import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const vscodeExtDir = path.join(os.homedir(), '.vscode', 'extensions')
const projectRoot = process.cwd()

const outputTs = path.join(projectRoot, 'src', 'data', 'extensions.ts')
const iconOutputDir = path.join(projectRoot, 'public', 'extension-icons')

const marketplaceEndpoint =
  'https://marketplace.visualstudio.com/_apis/public/gallery/extensionquery?api-version=3.0-preview.1'

fs.mkdirSync(path.dirname(outputTs), { recursive: true })
fs.mkdirSync(iconOutputDir, { recursive: true })

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function getDirectorySize(directory) {
  let totalSize = 0

  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const entryPath = path.join(directory, entry.name)

    try {
      if (entry.isDirectory()) {
        totalSize += getDirectorySize(entryPath)
      } else if (entry.isFile()) {
        totalSize += fs.statSync(entryPath).size
      }
    } catch (error) {
      console.warn(`Unable to read ${entryPath}: ${error.message}`)
    }
  }

  return totalSize
}

function compareVersions(a, b) {
  const aParts = String(a)
    .split(/[.-]/)
    .map((part) => Number.parseInt(part, 10) || 0)

  const bParts = String(b)
    .split(/[.-]/)
    .map((part) => Number.parseInt(part, 10) || 0)

  const length = Math.max(aParts.length, bParts.length)

  for (let index = 0; index < length; index += 1) {
    const aPart = aParts[index] ?? 0
    const bPart = bParts[index] ?? 0

    if (aPart > bPart) return 1
    if (aPart < bPart) return -1
  }

  return 0
}

async function fetchMarketplaceStats(extensionId) {
  const response = await fetch(marketplaceEndpoint, {
    method: 'POST',
    headers: {
      Accept: 'application/json;api-version=3.0-preview.1',
      'Content-Type': 'application/json',
      'User-Agent': 'local-vscode-extension-manager-data-generator',
    },
    body: JSON.stringify({
      filters: [
        {
          criteria: [
            {
              filterType: 8,
              value: 'Microsoft.VisualStudio.Code',
            },
            {
              filterType: 12,
              value: '4096',
            },
            {
              filterType: 7,
              value: extensionId,
            },
          ],
          pageNumber: 1,
          pageSize: 1,
          sortBy: 0,
          sortOrder: 0,
        },
      ],
      assetTypes: [],
      flags: 914,
    }),
  })

  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  const marketplaceExtension = data.results?.[0]?.extensions?.[0]

  if (!marketplaceExtension) {
    return {
      rating: null,
      ratingCount: null,
      downloads: null,
      marketplaceUrl: null,
    }
  }

  const statistics = Object.fromEntries(
    (marketplaceExtension.statistics ?? []).map((statistic) => [statistic.statisticName, statistic.value]),
  )

  const rating = typeof statistics.averagerating === 'number' ? Number(statistics.averagerating.toFixed(1)) : null

  const ratingCount = typeof statistics.ratingcount === 'number' ? Math.round(statistics.ratingcount) : null

  const downloads = typeof statistics.install === 'number' ? Math.round(statistics.install) : null

  return {
    rating,
    ratingCount,
    downloads,
    marketplaceUrl: `https://marketplace.visualstudio.com/items?itemName=${encodeURIComponent(extensionId)}`,
  }
}

const dirs = fs
  .readdirSync(vscodeExtDir)
  .filter((name) => !name.startsWith('.'))
  .map((name) => path.join(vscodeExtDir, name))
  .filter((directory) => {
    try {
      return fs.statSync(directory).isDirectory()
    } catch {
      return false
    }
  })

const localExtensionsById = new Map()

for (const dir of dirs) {
  const pkgPath = path.join(dir, 'package.json')

  if (!fs.existsSync(pkgPath)) {
    continue
  }

  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'))

    if (!pkg.publisher || !pkg.name) {
      console.warn(`Skipped invalid extension manifest: ${pkgPath}`)
      continue
    }

    const id = `${pkg.publisher}.${pkg.name}`
    const current = localExtensionsById.get(id)

    if (current && compareVersions(current.pkg.version, pkg.version) >= 0) {
      continue
    }

    localExtensionsById.set(id, {
      dir,
      pkg,
    })
  } catch (error) {
    console.warn(`Unable to parse ${pkgPath}: ${error.message}`)
  }
}

const extensions = []
const localExtensions = [...localExtensionsById.entries()]

console.log(`Found ${localExtensions.length} unique local extensions.`)

for (const [index, [id, { dir, pkg }]] of localExtensions.entries()) {
  let icon = '/extension-icons/default.svg'

  if (pkg.icon) {
    const iconSource = path.resolve(dir, pkg.icon)

    if (fs.existsSync(iconSource)) {
      const extension = path.extname(iconSource) || '.png'
      const safeName = id.replace(/[^a-zA-Z0-9.-]/g, '_') + extension
      const iconTarget = path.join(iconOutputDir, safeName)

      fs.copyFileSync(iconSource, iconTarget)
      icon = `/extension-icons/${safeName}`
    }
  }

  const directoryStats = fs.statSync(dir)
  const sizeBytes = getDirectorySize(dir)

  let marketplaceStats = {
    rating: null,
    ratingCount: null,
    downloads: null,
    marketplaceUrl: null,
  }

  try {
    marketplaceStats = await fetchMarketplaceStats(id)

    const marketStatus =
      marketplaceStats.downloads === null ? 'not found' : `${marketplaceStats.downloads.toLocaleString()} installs`

    console.log(`[${index + 1}/${localExtensions.length}] ${id}: ${marketStatus}`)
  } catch (error) {
    console.warn(`[${index + 1}/${localExtensions.length}] ${id}: Marketplace request failed: ${error.message}`)
  }

  extensions.push({
    id,
    name: pkg.displayName ?? pkg.name,
    publisher: pkg.publisher,
    version: pkg.version ?? '0.0.0',
    description: pkg.description ?? '',
    categories: Array.isArray(pkg.categories) ? pkg.categories : [],
    icon,
    rating: marketplaceStats.rating,
    ratingCount: marketplaceStats.ratingCount,
    downloads: marketplaceStats.downloads,
    marketplaceUrl: marketplaceStats.marketplaceUrl,
    sizeBytes,
    installedAt: directoryStats.birthtime.toISOString(),
    updatedAt: directoryStats.mtime.toISOString(),
  })

  // 请求量不大，但稍微放慢一些，避免连续猛敲 Marketplace。
  await sleep(150)
}

extensions.sort((a, b) =>
  a.name.localeCompare(b.name, 'en', {
    sensitivity: 'base',
  }),
)

const content = `export interface ExtensionItem {
  id: string
  name: string
  publisher: string
  version: string
  description: string
  categories: string[]
  icon: string
  rating: number | null
  ratingCount: number | null
  downloads: number | null
  marketplaceUrl: string | null
  sizeBytes: number
  installedAt: string
  updatedAt: string
}

export const extensionsData: ExtensionItem[] = ${JSON.stringify(extensions, null, 2)}
`

fs.writeFileSync(outputTs, content)

console.log('')
console.log(`Generated ${extensions.length} extensions.`)
console.log(`Output: ${outputTs}`)
console.log(`Icons: ${iconOutputDir}`)
