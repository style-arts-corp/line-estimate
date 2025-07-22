// Category type definition that is not auto-generated from swagger
// This is because the backend doesn't export Category as a model

export interface Category {
  id: string
  name: string
  items: Item[]
}

export interface Item {
  id: string
  name: string
  price: number
  category: string
}