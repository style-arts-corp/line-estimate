'use client'

import React, { useState } from 'react'
import { ConsignmentApplication, ConsignmentSearchResult } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { format } from 'date-fns'
import { ja } from 'date-fns/locale'
import { CalendarIcon, Search, Download, Eye, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface ConsignmentApplicationResultProps {
  searchResult?: ConsignmentSearchResult
  onSearch?: (filters: SearchFilters) => void
  onViewDetail?: (application: ConsignmentApplication) => void
  onExport?: () => void
  loading?: boolean
}

interface SearchFilters {
  applicationNumber?: string
  companyName?: string
  status?: string
  startDate?: Date
  endDate?: Date
}

export function ConsignmentApplicationResult({
  searchResult,
  onSearch,
  onViewDetail,
  onExport,
  loading = false
}: ConsignmentApplicationResultProps) {
  const [filters, setFilters] = useState<SearchFilters>({})
  const [currentPage, setCurrentPage] = useState(1)

  const handleSearch = () => {
    onSearch?.(filters)
  }

  const getStatusBadge = (status: ConsignmentApplication['status']) => {
    const statusConfig = {
      pending: { label: '申請中', variant: 'secondary' as const },
      approved: { label: '承認済', variant: 'default' as const },
      rejected: { label: '却下', variant: 'destructive' as const },
      completed: { label: '完了', variant: 'outline' as const }
    }
    
    const config = statusConfig[status]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'yyyy年MM月dd日', { locale: ja })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>外部委託申請検索</CardTitle>
          <CardDescription>
            条件を指定して外部委託申請を検索できます
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium">申請番号</label>
              <Input
                placeholder="申請番号を入力"
                value={filters.applicationNumber || ''}
                onChange={(e) => setFilters({ ...filters, applicationNumber: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">会社名</label>
              <Input
                placeholder="会社名を入力"
                value={filters.companyName || ''}
                onChange={(e) => setFilters({ ...filters, companyName: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">ステータス</label>
              <Select
                value={filters.status || ''}
                onValueChange={(value) => setFilters({ ...filters, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="ステータスを選択" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">すべて</SelectItem>
                  <SelectItem value="pending">申請中</SelectItem>
                  <SelectItem value="approved">承認済</SelectItem>
                  <SelectItem value="rejected">却下</SelectItem>
                  <SelectItem value="completed">完了</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">開始日</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.startDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.startDate ? (
                      format(filters.startDate, "yyyy年MM月dd日", { locale: ja })
                    ) : (
                      <span>開始日を選択</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.startDate}
                    onSelect={(date) => setFilters({ ...filters, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">終了日</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !filters.endDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {filters.endDate ? (
                      format(filters.endDate, "yyyy年MM月dd日", { locale: ja })
                    ) : (
                      <span>終了日を選択</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={filters.endDate}
                    onSelect={(date) => setFilters({ ...filters, endDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={handleSearch} disabled={loading} className="flex-1">
                <Search className="mr-2 h-4 w-4" />
                検索
              </Button>
              <Button variant="outline" onClick={() => setFilters({})}>
                クリア
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchResult && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>検索結果</CardTitle>
              <CardDescription>
                {searchResult.totalCount}件の申請が見つかりました
              </CardDescription>
            </div>
            {searchResult.totalCount > 0 && (
              <Button variant="outline" onClick={onExport}>
                <Download className="mr-2 h-4 w-4" />
                エクスポート
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {searchResult.applications.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>申請番号</TableHead>
                        <TableHead>申請日</TableHead>
                        <TableHead>会社名</TableHead>
                        <TableHead>申請者</TableHead>
                        <TableHead>ステータス</TableHead>
                        <TableHead className="text-right">金額</TableHead>
                        <TableHead className="text-center">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {searchResult.applications.map((application) => (
                        <TableRow key={application.id}>
                          <TableCell className="font-medium">
                            {application.applicationNumber}
                          </TableCell>
                          <TableCell>{formatDate(application.applicationDate)}</TableCell>
                          <TableCell>{application.companyName}</TableCell>
                          <TableCell>{application.applicantName}</TableCell>
                          <TableCell>{getStatusBadge(application.status)}</TableCell>
                          <TableCell className="text-right">
                            {formatCurrency(application.totalAmount)}
                          </TableCell>
                          <TableCell className="text-center">
                            <div className="flex justify-center gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => onViewDetail?.(application)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <FileText className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {searchResult.totalPages > 1 && (
                  <div className="mt-4 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage > 1) setCurrentPage(currentPage - 1)
                            }}
                          />
                        </PaginationItem>
                        
                        {[...Array(searchResult.totalPages)].map((_, i) => {
                          const page = i + 1
                          if (
                            page === 1 ||
                            page === searchResult.totalPages ||
                            (page >= currentPage - 1 && page <= currentPage + 1)
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationLink
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault()
                                    setCurrentPage(page)
                                  }}
                                  isActive={page === currentPage}
                                >
                                  {page}
                                </PaginationLink>
                              </PaginationItem>
                            )
                          } else if (
                            page === currentPage - 2 ||
                            page === currentPage + 2
                          ) {
                            return (
                              <PaginationItem key={page}>
                                <PaginationEllipsis />
                              </PaginationItem>
                            )
                          }
                          return null
                        })}
                        
                        <PaginationItem>
                          <PaginationNext
                            href="#"
                            onClick={(e) => {
                              e.preventDefault()
                              if (currentPage < searchResult.totalPages) {
                                setCurrentPage(currentPage + 1)
                              }
                            }}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                検索条件に一致する申請が見つかりませんでした
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}