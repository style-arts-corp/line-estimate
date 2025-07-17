import { Category } from './types'

export const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: '家具',
    items: [
      { id: '1-1', name: 'オフィスチェア', price: 3000, category: '家具' },
      { id: '1-2', name: 'オフィスデスク', price: 5000, category: '家具' },
      { id: '1-3', name: '会議テーブル', price: 8000, category: '家具' },
      { id: '1-4', name: '書類棚', price: 4000, category: '家具' },
      { id: '1-5', name: 'ロッカー', price: 3500, category: '家具' },
    ],
  },
  {
    id: '2',
    name: '電子機器',
    items: [
      { id: '2-1', name: 'デスクトップPC', price: 8000, category: '電子機器' },
      { id: '2-2', name: 'ノートPC', price: 6000, category: '電子機器' },
      { id: '2-3', name: 'モニター', price: 3000, category: '電子機器' },
      { id: '2-4', name: 'プリンター', price: 4000, category: '電子機器' },
      { id: '2-5', name: 'スキャナー', price: 2500, category: '電子機器' },
      { id: '2-6', name: 'プロジェクター', price: 5000, category: '電子機器' },
    ],
  },
  {
    id: '3',
    name: '家電',
    items: [
      { id: '3-1', name: '冷蔵庫', price: 10000, category: '家電' },
      { id: '3-2', name: '電子レンジ', price: 3000, category: '家電' },
      { id: '3-3', name: 'コーヒーメーカー', price: 2000, category: '家電' },
      { id: '3-4', name: '空気清浄機', price: 4000, category: '家電' },
      { id: '3-5', name: '加湿器', price: 2500, category: '家電' },
    ],
  },
  {
    id: '4',
    name: 'その他',
    items: [
      { id: '4-1', name: 'ホワイトボード', price: 2000, category: 'その他' },
      { id: '4-2', name: '観葉植物', price: 1000, category: 'その他' },
      { id: '4-3', name: '掃除機', price: 3000, category: 'その他' },
      { id: '4-4', name: 'シュレッダー', price: 2500, category: 'その他' },
      { id: '4-5', name: '傘立て', price: 1500, category: 'その他' },
    ],
  },
]