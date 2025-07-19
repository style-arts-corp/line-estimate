package utils

import (
	"fmt"
	"github.com/signintech/gopdf"
	"line-estimate-backend/models"
	"strings"
)

// PDFHelper provides helper functions for PDF generation
type PDFHelper struct {
	pdf *gopdf.GoPdf
}

// NewPDFHelper creates a new PDF helper instance
func NewPDFHelper(pdf *gopdf.GoPdf) *PDFHelper {
	return &PDFHelper{pdf: pdf}
}

// DrawHeader draws the header section of the estimate
func (h *PDFHelper) DrawHeader(estimate *models.PDFEstimate) error {
	// Title "見積書"
	h.pdf.SetX(250)
	h.pdf.SetY(40)
	if err := h.pdf.SetFont("noto-sans", "", 24); err != nil {
		return err
	}
	h.pdf.Cell(nil, "見積書")

	// Estimate number
	h.pdf.SetX(400)
	h.pdf.SetY(80)
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}
	h.pdf.Cell(nil, fmt.Sprintf("見積番号：%s", estimate.EstimateNo))

	// Issue date
	h.pdf.SetX(400)
	h.pdf.SetY(100)
	h.pdf.Cell(nil, fmt.Sprintf("発行日：%s", estimate.IssueDate.Format("2006年1月2日")))

	// Draw horizontal line
	h.pdf.SetLineWidth(1)
	h.pdf.Line(50, 130, 545, 130)

	return nil
}

// DrawCustomerInfo draws the customer information section
func (h *PDFHelper) DrawCustomerInfo(estimate *models.PDFEstimate) error {
	if err := h.pdf.SetFont("noto-sans", "", 12); err != nil {
		return err
	}

	// Customer company name
	h.pdf.SetX(50)
	h.pdf.SetY(160)
	h.pdf.Cell(nil, estimate.Customer.CompanyName)

	// Customer address
	h.pdf.SetX(50)
	h.pdf.SetY(180)
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}
	h.pdf.Cell(nil, fmt.Sprintf("〒%s", estimate.Customer.PostalCode))

	h.pdf.SetX(50)
	h.pdf.SetY(195)
	h.pdf.Cell(nil, estimate.Customer.Address)

	// Customer TEL/FAX
	h.pdf.SetX(50)
	h.pdf.SetY(215)
	h.pdf.Cell(nil, fmt.Sprintf("TEL: %s", estimate.Customer.Tel))

	h.pdf.SetX(50)
	h.pdf.SetY(230)
	h.pdf.Cell(nil, fmt.Sprintf("FAX: %s", estimate.Customer.Fax))

	// Recipient name
	h.pdf.SetX(400)
	h.pdf.SetY(160)
	if err := h.pdf.SetFont("noto-sans", "", 14); err != nil {
		return err
	}
	h.pdf.Cell(nil, estimate.Recipient)

	return nil
}

// DrawTitle draws the estimate title
func (h *PDFHelper) DrawTitle(title string) error {
	h.pdf.SetX(50)
	h.pdf.SetY(270)
	if err := h.pdf.SetFont("noto-sans", "", 14); err != nil {
		return err
	}
	h.pdf.Cell(nil, title)
	return nil
}

// DrawTable draws the items table
func (h *PDFHelper) DrawTable(items []models.PDFLineItem, startY float64) (float64, error) {
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return startY, err
	}

	// Table headers
	headers := []string{"品目", "数量", "単価（円）", "金額（円）"}
	colWidths := []float64{250, 80, 100, 100}
	startX := float64(50)

	// Draw header row
	h.pdf.SetLineWidth(0.5)
	currentX := startX
	for i, header := range headers {
		h.pdf.SetX(currentX)
		h.pdf.SetY(startY)
		h.pdf.Cell(nil, header)

		// Draw vertical lines
		h.pdf.Line(currentX, startY-5, currentX, startY+20)
		currentX += colWidths[i]
	}
	// Last vertical line
	h.pdf.Line(currentX, startY-5, currentX, startY+20)

	// Draw horizontal line under headers
	h.pdf.Line(startX, startY+20, startX+530, startY+20)

	// Draw items
	currentY := startY + 30
	for _, item := range items {
		currentX = startX

		// Description
		h.pdf.SetX(currentX + 5)
		h.pdf.SetY(currentY)
		h.pdf.Cell(nil, item.Description)
		h.pdf.Line(currentX, currentY-5, currentX, currentY+20)
		currentX += colWidths[0]

		// Quantity
		h.pdf.SetX(currentX + 5)
		h.pdf.SetY(currentY)
		quantityStr := fmt.Sprintf("%.0f", item.Quantity)
		if item.Unit != "" {
			quantityStr = fmt.Sprintf("%.0f%s", item.Quantity, item.Unit)
		}
		h.pdf.Cell(nil, quantityStr)
		h.pdf.Line(currentX, currentY-5, currentX, currentY+20)
		currentX += colWidths[1]

		// Unit price
		h.pdf.SetX(currentX + 5)
		h.pdf.SetY(currentY)
		h.pdf.Cell(nil, FormatCurrency(item.UnitPrice))
		h.pdf.Line(currentX, currentY-5, currentX, currentY+20)
		currentX += colWidths[2]

		// Amount
		h.pdf.SetX(currentX + 5)
		h.pdf.SetY(currentY)
		h.pdf.Cell(nil, FormatCurrency(item.Amount))
		h.pdf.Line(currentX, currentY-5, currentX, currentY+20)
		currentX += colWidths[3]

		// Last vertical line
		h.pdf.Line(currentX, currentY-5, currentX, currentY+20)

		// Horizontal line
		h.pdf.Line(startX, currentY+20, startX+530, currentY+20)

		currentY += 25
	}

	return currentY, nil
}

// DrawTotals draws the totals section
func (h *PDFHelper) DrawTotals(estimate *models.PDFEstimate, startY float64) error {
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	// Subtotal
	h.pdf.SetX(350)
	h.pdf.SetY(startY)
	h.pdf.Cell(nil, "小計")
	h.pdf.SetX(480)
	h.pdf.Cell(nil, FormatCurrency(estimate.SubTotal))

	// Tax
	h.pdf.SetX(350)
	h.pdf.SetY(startY + 20)
	h.pdf.Cell(nil, fmt.Sprintf("消費税（%.0f%%）", estimate.TaxRate*100))
	h.pdf.SetX(480)
	h.pdf.Cell(nil, FormatCurrency(estimate.Tax))

	// Draw line above total
	h.pdf.SetLineWidth(1)
	h.pdf.Line(350, startY+35, 530, startY+35)

	// Total
	h.pdf.SetX(350)
	h.pdf.SetY(startY + 45)
	if err := h.pdf.SetFont("noto-sans", "", 12); err != nil {
		return err
	}
	h.pdf.Cell(nil, "合計金額")
	h.pdf.SetX(480)
	h.pdf.Cell(nil, FormatCurrency(estimate.Total))

	return nil
}

// DrawRemarks draws the remarks section
func (h *PDFHelper) DrawRemarks(remarks []string, startY float64) error {
	if err := h.pdf.SetFont("noto-sans", "", 9); err != nil {
		return err
	}

	// Draw remarks box
	h.pdf.SetLineWidth(0.5)
	h.pdf.Rectangle(50, startY, 480, 100, "D", 0, 0)

	// Remarks title
	h.pdf.SetX(55)
	h.pdf.SetY(startY + 10)
	h.pdf.Cell(nil, "【備考】")

	// Remarks content
	currentY := startY + 25
	for _, remark := range remarks {
		h.pdf.SetX(55)
		h.pdf.SetY(currentY)
		h.pdf.Cell(nil, remark)
		currentY += 15
	}

	return nil
}

// FormatCurrency formats a number as Japanese currency
func FormatCurrency(amount float64) string {
	// Format with comma separators
	formatted := fmt.Sprintf("%.0f", amount)

	// Add commas
	parts := []string{}
	for i := len(formatted); i > 0; i -= 3 {
		start := i - 3
		if start < 0 {
			start = 0
		}
		parts = append([]string{formatted[start:i]}, parts...)
	}

	return strings.Join(parts, ",")
}
