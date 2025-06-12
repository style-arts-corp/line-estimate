"use client"

import { useState } from "react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import type { Category, Item } from "@/lib/types"

interface CategoryAccordionProps {
  categories: Category[]
  onItemSelect: (item: Item) => void
}

export function CategoryAccordion({ categories, onItemSelect }: CategoryAccordionProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null)

  return (
    <Accordion
      type="single"
      collapsible
      value={expandedCategory || undefined}
      onValueChange={(value) => setExpandedCategory(value)}
      className="w-full"
    >
      {categories.map((category) => (
        <AccordionItem key={category.id} value={category.id}>
          <AccordionTrigger className="text-left">{category.name}</AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 gap-2 mt-2">
              {category.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-2 border border-gray-200 rounded hover:bg-gray-50"
                >
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-gray-500">¥{item.price.toLocaleString()}</div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={() => onItemSelect(item)} className="h-8 px-2">
                    <PlusCircle className="h-5 w-5 mr-1" />
                    追加
                  </Button>
                </div>
              ))}
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
