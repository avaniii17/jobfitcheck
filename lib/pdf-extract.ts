/** Extract PDF text while preserving line breaks and rough layout from coordinates. */
export async function extractTextFromPdfFile(file: File): Promise<string> {
  const pdfjsLib = await import('pdfjs-dist')
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise

  const pages: string[] = []

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const textContent = await page.getTextContent()
    pages.push(layoutTextItems(textContent.items))
  }

  return pages.join('\n\n').trim()
}

type TextItemLike = {
  str?: string
  transform?: number[]
}

function layoutTextItems(items: unknown[]): string {
  const lines: { y: number; parts: { x: number; text: string }[] }[] = []

  for (const raw of items) {
    const item = raw as TextItemLike
    const text = item.str?.trim()
    if (!text || !item.transform) continue

    const x = item.transform[4] ?? 0
    const y = Math.round(item.transform[5] ?? 0)
    const line = lines.find((l) => Math.abs(l.y - y) <= 4)

    if (line) {
      line.parts.push({ x, text })
    } else {
      lines.push({ y, parts: [{ x, text }] })
    }
  }

  lines.sort((a, b) => b.y - a.y)

  return lines
    .map((line) => {
      line.parts.sort((a, b) => a.x - b.x)
      return line.parts.map((p) => p.text).join(' ')
    })
    .join('\n')
}
