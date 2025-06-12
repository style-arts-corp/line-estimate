export interface Item {
  id: string
  name: string
  price: number
  category: string
}

export interface SelectedItem extends Item {
  quantity: number
  customPrice: number
  imageUrl?: string // 写真のURLまたはBase64文字列
}

export interface Category {
  id: string
  name: string
  items: Item[]
}

export interface CustomerInfo {
  name: string
  address: string
  phone: string
  email: string
  disposalDate: string
}
