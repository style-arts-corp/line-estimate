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
func (h *PDFHelper) DrawTable(estimate *models.PDFEstimate, startY float64) (float64, error) {
	// Set font for the table
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return startY, err
	}

	// Set the starting position for the table
	marginLeft := 50.0
	rowHeight := 25.0
	items := estimate.Items
	// Add 3 more rows for subtotal, tax, and total
	maxRows := len(items) + 3

	// Create a new table layout
	table := h.pdf.NewTableLayout(marginLeft, startY, rowHeight, maxRows)

	// Add columns to the table (total width: 495 to match header)
	table.AddColumn("品目", 235, "left")
	table.AddColumn("数量", 70, "right")
	table.AddColumn("単価（円）", 95, "right")
	table.AddColumn("金額（円）", 95, "right")

	// Set the style for table header
	table.SetHeaderStyle(gopdf.CellStyle{
		BorderStyle: gopdf.BorderStyle{
			Top:      false,
			Left:     false,
			Bottom:   true,
			Right:    false,
			Width:    0.5,
			RGBColor: gopdf.RGBColor{R: 0, G: 0, B: 0},
		},
		FillColor: gopdf.RGBColor{R: 242, G: 242, B: 242},
		TextColor: gopdf.RGBColor{R: 0, G: 0, B: 0},
		Font:      "noto-sans",
		FontSize:  10,
	})

	// Set the style for table cells
	table.SetCellStyle(gopdf.CellStyle{
		BorderStyle: gopdf.BorderStyle{
			Top:      false,
			Left:     false,
			Bottom:   true,
			Right:    false,
			Width:    0.5,
			RGBColor: gopdf.RGBColor{R: 0, G: 0, B: 0},
		},
		FillColor: gopdf.RGBColor{R: 255, G: 255, B: 255},
		TextColor: gopdf.RGBColor{R: 0, G: 0, B: 0},
		Font:      "noto-sans",
		FontSize:  10,
	})

	// Add rows to the table
	for _, item := range items {
		quantityStr := fmt.Sprintf("%.0f", item.Quantity)
		if item.Unit != "" {
			quantityStr = fmt.Sprintf("%.0f%s", item.Quantity, item.Unit)
		}
		unitPriceStr := FormatCurrency(item.UnitPrice)
		amountStr := FormatCurrency(item.Amount)

		table.AddRow([]string{
			item.Description,
			quantityStr,
			unitPriceStr,
			amountStr,
		})
	}

	// Add subtotal row
	table.AddRow([]string{
		"",
		"",
		"小計",
		FormatCurrency(estimate.SubTotal),
	})

	// Add tax row
	taxLabel := fmt.Sprintf("消費税（%.0f%%）", estimate.TaxRate*100)
	table.AddRow([]string{
		"",
		"",
		taxLabel,
		FormatCurrency(estimate.Tax),
	})

	// Add total row
	table.AddRow([]string{
		"",
		"",
		"合計金額",
		FormatCurrency(estimate.Total),
	})

	// Draw the table
	table.DrawTable()

	// Draw a thicker line above subtotal row
	// Position: header (1 row) + item rows - 1
	subtotalRowY := startY + rowHeight + (rowHeight * float64(len(items)))
	h.pdf.SetLineWidth(1.5) // Thicker line
	h.pdf.SetStrokeColor(0, 0, 0)
	h.pdf.Line(marginLeft, subtotalRowY, marginLeft+495, subtotalRowY)

	// Draw a thicker line above total row
	// Position: header (1 row) + item rows + subtotal row + tax row
	totalRowY := startY + rowHeight + (rowHeight * float64(len(items)+2))
	h.pdf.SetLineWidth(1.5) // Thicker line
	h.pdf.SetStrokeColor(0, 0, 0)
	h.pdf.Line(marginLeft, totalRowY, marginLeft+495, totalRowY)

	// Calculate the end Y position (header + all rows including totals)
	endY := startY + rowHeight + (rowHeight * float64(maxRows))

	return endY, nil
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

	// Draw remarks box with fill
	h.pdf.SetLineWidth(1.0)
	h.pdf.SetStrokeColor(0, 0, 0)     // Black border
	h.pdf.SetFillColor(255, 255, 255) // White fill
	h.pdf.RectFromUpperLeftWithStyle(50, startY, 495, 100, "FD")

	// Remarks title
	h.pdf.SetX(55)
	h.pdf.SetY(startY + 10)
	h.pdf.SetTextColor(0, 0, 0) // Ensure text is black
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
