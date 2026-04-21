/**
 * 文件导出工具函数
 */

export const exportToText = (content: string, filename: string = 'output.txt') => {
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
  downloadBlob(blob, filename)
}

export const exportToMarkdown = (content: string, filename: string = 'output.md') => {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  downloadBlob(blob, filename)
}

export const exportToDocx = (content: string, filename: string = 'output.txt') => {
  // 注意：真正的DOCX导出需要复杂的库，这里我们使用简化的方式
  // 实际项目中可以使用 docx 或 mammoth.js 等库
  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Export</title>
  <style>
    body { font-family: 'Microsoft YaHei', Arial, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; }
    pre { white-space: pre-wrap; word-wrap: break-word; background: #f5f5f5; padding: 15px; border-radius: 5px; }
  </style>
</head>
<body>
  <pre>${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>
  `
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
  downloadBlob(blob, filename.replace('.docx', '.html'))
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

export const readTextFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = reject
    reader.readAsText(file)
  })
}

export const getFileExtension = (filename: string): string => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export const isValidFile = (file: File, allowedExtensions: string[]): boolean => {
  const extension = getFileExtension(file.name)
  return allowedExtensions.includes(extension)
}
