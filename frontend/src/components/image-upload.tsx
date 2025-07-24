'use client'

import React, { useCallback, useRef } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import type { QuoteImage } from '@/lib/types'

interface ImageUploadProps {
  images: QuoteImage[]
  onImageAdd: (image: QuoteImage) => void
  onImageRemove: (id: string) => void
  maxSize?: number // MB単位
  acceptedTypes?: string[]
}

export function ImageUpload({
  images,
  onImageAdd,
  onImageRemove,
  maxSize = 10,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = React.useState(false)

  const generateId = () => {
    return `img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleFiles = useCallback((files: FileList) => {
    // 現在の画像数と追加する画像数の合計をチェック
    const totalImageCount = images.length + files.length
    if (totalImageCount > 20) {
      alert(`画像は最大20枚までです。現在${images.length}枚、追加できるのは${20 - images.length}枚までです。`)
      return
    }

    // 合計サイズを計算
    let totalSize = images.reduce((sum, img) => sum + img.file.size, 0)
    const newFiles = Array.from(files)
    
    for (const file of newFiles) {
      totalSize += file.size
    }
    
    // 50MBを超える場合は警告
    if (totalSize > 50 * 1024 * 1024) {
      alert('画像の合計サイズが50MBを超えています。一部の画像を削除してから追加してください。')
      return
    }

    Array.from(files).forEach(file => {
      // ファイルタイプチェック
      if (!acceptedTypes.includes(file.type)) {
        alert(`${file.name} は対応していないファイル形式です。対応形式: JPEG, PNG, GIF, WebP`)
        return
      }

      // ファイルサイズチェック
      if (file.size > maxSize * 1024 * 1024) {
        alert(`${file.name} のサイズが大きすぎます。最大サイズ: ${maxSize}MB`)
        return
      }

      // Object URLを作成
      const preview = URL.createObjectURL(file)
      
      const newImage: QuoteImage = {
        id: generateId(),
        file,
        preview,
        name: file.name
      }

      onImageAdd(newImage)
    })
  }, [acceptedTypes, maxSize, onImageAdd, images])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [handleFiles])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const handleRemove = useCallback((id: string, preview: string) => {
    // Object URLをクリーンアップ
    URL.revokeObjectURL(preview)
    onImageRemove(id)
  }, [onImageRemove])

  return (
    <div className="space-y-4">
      {/* アップロードエリア */}
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
          dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={acceptedTypes.join(',')}
          onChange={handleChange}
          className="hidden"
        />
        
        <div className="text-center">
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            画像をドラッグ&ドロップ、または
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              ファイルを選択
            </button>
          </p>
          <p className="mt-1 text-xs text-gray-500">
            対応形式: JPEG, PNG, GIF, WebP（最大{maxSize}MB）
          </p>
        </div>
      </div>

      {/* 画像プレビュー */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image) => (
            <div key={image.id} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                <Image
                  src={image.preview}
                  alt={image.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity" />
              </div>
              
              {/* 削除ボタン */}
              <button
                onClick={() => handleRemove(image.id, image.preview)}
                className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              >
                <X className="h-4 w-4" />
              </button>
              
              {/* ファイル名 */}
              <p className="mt-2 text-xs text-gray-600 truncate">{image.name}</p>
            </div>
          ))}
        </div>
      )}

      {/* 画像カウントとサイズ情報 */}
      {images.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ImageIcon className="h-4 w-4" />
            <span>{images.length}枚の画像が選択されています（最大20枚）</span>
          </div>
          <div className="text-xs text-gray-500">
            合計サイズ: {(images.reduce((sum, img) => sum + img.file.size, 0) / 1024 / 1024).toFixed(1)}MB / 50MB
          </div>
        </div>
      )}
    </div>
  )
}