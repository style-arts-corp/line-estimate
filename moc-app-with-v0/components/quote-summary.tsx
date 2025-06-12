interface QuoteSummaryProps {
  total: number
  itemCount: number
}

export function QuoteSummary({ total, itemCount }: QuoteSummaryProps) {
  return (
    <div>
      <div className="text-sm text-gray-500">{itemCount}点のアイテム</div>
      <div className="text-xl font-bold">合計(税込): ¥{total.toLocaleString()}</div>
    </div>
  )
}
