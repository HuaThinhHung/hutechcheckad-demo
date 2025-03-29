const fs = require('fs-extra')
const path = require('node:path')

const sourceDir = path.join(__dirname, '..', 'server', 'utils', 'template')
const destDir = path.join(__dirname, '..', 'dist', 'server', 'template')

async function copyStaticFiles() {
  try {
    await fs.copy(sourceDir, destDir)
    console.log('Server template copied successfully!')
  } catch (err) {
    console.error('Error copying server template:', err)
  }
}

copyStaticFiles()
