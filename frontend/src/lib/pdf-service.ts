import type { CustomerInfo, SelectedItem } from './types'

export interface EstimateData {
  customerInfo: CustomerInfo
  selectedItems: SelectedItem[]
  totalAmount: number
  estimateNumber: string
  issueDate: string
}

export interface PDFGenerationResponse {
  success: boolean
  pdfUrl?: string
  error?: string
}

/**
 * Main PDF generation service
 * Collects all estimate data and sends it to the backend for PDF creation
 */
export class PDFService {
  private static generateEstimateNumber(): string {
    const now = new Date()
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '')
    const timeStr = now.getTime().toString().slice(-3)
    return `EST-${dateStr}-${timeStr}`
  }

  private static formatEstimateData(
    customerInfo: CustomerInfo,
    selectedItems: SelectedItem[],
    totalAmount: number
  ): EstimateData {
    return {
      customerInfo,
      selectedItems,
      totalAmount,
      estimateNumber: this.generateEstimateNumber(),
      issueDate: new Date().toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }

  /**
   * Main function to generate PDF estimate
   * This is the function you call from your confirmation page
   */
  static async generateEstimatePDF(
    customerInfo: CustomerInfo,
    selectedItems: SelectedItem[],
    totalAmount: number
  ): Promise<PDFGenerationResponse> {
    try {
      // Format the data
      const estimateData = this.formatEstimateData(
        customerInfo,
        selectedItems,
        totalAmount
      )

      // Validate data before sending
      const validation = this.validateEstimateData(estimateData)
      if (!validation.isValid) {
        return {
          success: false,
          error: `�f�[�^���؃G���[: ${validation.errors.join(', ')}`
        }
      }

      // Send to backend for PDF generation
      const response = await this.callPDFGenerationAPI(estimateData)
      
      if (response.success) {
        return {
          success: true,
          pdfUrl: response.pdfUrl
        }
      } else {
        return {
          success: false,
          error: response.error || 'PDF�����Ɏ��s���܂���'
        }
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      return {
        success: false,
        error: '�V�X�e���G���[���������܂���'
      }
    }
  }

  /**
   * Validate estimate data before sending to backend
   */
  private static validateEstimateData(data: EstimateData): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Customer info validation
    if (!data.customerInfo.name?.trim()) {
      errors.push('�ڋq�������͂���Ă��܂���')
    }
    if (!data.customerInfo.address?.trim()) {
      errors.push('�Z�������͂���Ă��܂���')
    }
    if (!data.customerInfo.phone?.trim()) {
      errors.push('�d�b�ԍ������͂���Ă��܂���')
    }

    // Items validation
    if (!data.selectedItems || data.selectedItems.length === 0) {
      errors.push('�p���i���I������Ă��܂���')
    }

    // Amount validation
    if (data.totalAmount <= 0) {
      errors.push('���v���z���������v�Z����Ă��܂���')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Call the backend API for PDF generation
   */
  private static async callPDFGenerationAPI(data: EstimateData): Promise<PDFGenerationResponse> {
    try {
      const response = await fetch('/api/generate-estimate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      return result
    } catch (error) {
      console.error('API call error:', error)
      return {
        success: false,
        error: 'API�G���[���������܂���'
      }
    }
  }

  /**
   * Helper function to calculate tax amount
   */
  static calculateTax(subtotal: number, taxRate: number = 0.1): number {
    return Math.floor(subtotal * taxRate)
  }

  /**
   * Helper function to format currency for display
   */
  static formatCurrency(amount: number): string {
    return `\${amount.toLocaleString()}`
  }
}
