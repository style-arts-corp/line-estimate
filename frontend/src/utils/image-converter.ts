import type { QuoteImage } from '@/lib/types'
import type { ModelsPDFImage } from '@/orval/generated/model/modelsPDFImage'

/**
 * QuoteImageをModelsPDFImageに変換する
 * FileオブジェクトをBase64エンコードされた文字列に変換
 */
export async function convertQuoteImageToPDFImage(image: QuoteImage): Promise<ModelsPDFImage> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onloadend = () => {
      const result = reader.result as string
      resolve({
        id: image.id,
        name: image.name,
        data: result
      })
    }
    
    reader.onerror = () => {
      reject(new Error(`Failed to read image file: ${image.name}`))
    }
    
    reader.readAsDataURL(image.file)
  })
}

/**
 * 複数のQuoteImageを並列でModelsPDFImageに変換
 */
export async function convertQuoteImagesToPDFImages(
  images: QuoteImage[]
): Promise<ModelsPDFImage[]> {
  try {
    const convertedImages = await Promise.all(
      images.map(image => convertQuoteImageToPDFImage(image))
    )
    return convertedImages
  } catch (error) {
    console.error('Error converting images:', error)
    throw new Error('画像の変換中にエラーが発生しました')
  }
}

/**
 * 画像ファイルのサイズを検証
 * @param file - 検証するファイル
 * @param maxSizeMB - 最大サイズ（MB単位）
 */
export function validateImageSize(file: File, maxSizeMB: number = 10): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

/**
 * 複数画像の合計サイズを検証
 * @param images - 検証する画像の配列
 * @param maxTotalSizeMB - 合計最大サイズ（MB単位）
 */
export function validateTotalImageSize(
  images: QuoteImage[],
  maxTotalSizeMB: number = 50
): boolean {
  const totalSize = images.reduce((sum, image) => sum + image.file.size, 0)
  const maxSizeBytes = maxTotalSizeMB * 1024 * 1024
  return totalSize <= maxSizeBytes
}

/**
 * 画像変換の進捗を追跡するためのヘルパー関数
 */
export async function convertImagesWithProgress(
  images: QuoteImage[],
  onProgress?: (completed: number, total: number) => void
): Promise<ModelsPDFImage[]> {
  const total = images.length
  let completed = 0
  const results: ModelsPDFImage[] = []
  
  for (const image of images) {
    try {
      const converted = await convertQuoteImageToPDFImage(image)
      results.push(converted)
      completed++
      onProgress?.(completed, total)
    } catch (error) {
      console.error(`Failed to convert image ${image.name}:`, error)
      // エラーが発生した画像はスキップして続行
      completed++
      onProgress?.(completed, total)
    }
  }
  
  return results
}