interface QuoteSummaryProps {
  total: number
  itemCount: number
}

export function QuoteSummary({ total, itemCount }: QuoteSummaryProps) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-gray-700">
        選択済み: {itemCount}品目
      </p>
      <p className="text-lg font-semibold text-gray-900">
        合計(税込): ¥{total.toLocaleString()}
      </p>
    </div>
  )
}