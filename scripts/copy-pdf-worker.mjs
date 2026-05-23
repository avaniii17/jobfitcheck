import { copyFileSync, existsSync, mkdirSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const src = join(root, 'node_modules/pdfjs-dist/build/pdf.worker.min.mjs')
const destDir = join(root, 'public')
const dest = join(destDir, 'pdf.worker.min.mjs')

if (!existsSync(src)) {
  console.warn('pdfjs-dist worker not found; skip copy (run npm install first).')
  process.exit(0)
}

mkdirSync(destDir, { recursive: true })
copyFileSync(src, dest)
console.log('Copied pdf.worker.min.mjs to public/')
