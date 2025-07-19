package utils

import (
	"github.com/signintech/gopdf"
	"line-estimate-backend/models"
)

// PDFInstructionHelper provides helper functions for instruction sheet PDF generation
type PDFInstructionHelper struct {
	pdf *gopdf.GoPdf
}

// NewPDFInstructionHelper creates a new PDF instruction helper instance
func NewPDFInstructionHelper(pdf *gopdf.GoPdf) *PDFInstructionHelper {
	return &PDFInstructionHelper{pdf: pdf}
}

// DrawInstructionHeader draws the header section of the instruction sheet
func (h *PDFInstructionHelper) DrawInstructionHeader(instruction *models.PDFInstruction, isReceipt bool) error {
	// Title
	h.pdf.SetX(50)
	h.pdf.SetY(40)
	if err := h.pdf.SetFont("noto-sans", "", 16); err != nil {
		return err
	}

	title := "作業指示書"
	if isReceipt {
		title = "控"
	}
	h.pdf.Cell(nil, title)

	// Receipt date label
	h.pdf.SetX(180)
	h.pdf.SetY(40)
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}
	h.pdf.Cell(nil, "受付日")

	// Issue date
	h.pdf.SetX(180)
	h.pdf.SetY(60)
	h.pdf.Cell(nil, instruction.IssueDate.Format("2006年1月2日"))

	return nil
}

// DrawContactInfo draws the contact information section
func (h *PDFInstructionHelper) DrawContactInfo(instruction *models.PDFInstruction, isReceipt bool) error {
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	startY := float64(100)

	// Draw box
	h.pdf.SetLineWidth(0.5)
	h.pdf.Rectangle(50, startY, 200, 120, "D", 0, 0)

	// Section title
	h.pdf.SetX(55)
	h.pdf.SetY(startY + 10)
	h.pdf.Cell(nil, "収集先")

	var info models.PDFContractorInfo
	if isReceipt {
		info = models.PDFContractorInfo(instruction.Collector)
	} else {
		info = instruction.Contractor
	}

	// Name
	h.pdf.SetX(55)
	h.pdf.SetY(startY + 30)
	h.pdf.Cell(nil, "名称")
	h.pdf.SetX(90)
	h.pdf.SetY(startY + 30)
	h.pdf.Cell(nil, info.Name)

	// Address
	h.pdf.SetX(55)
	h.pdf.SetY(startY + 50)
	h.pdf.Cell(nil, "住所")
	h.pdf.SetX(90)
	h.pdf.SetY(startY + 50)
	h.pdf.Cell(nil, info.Address)

	// Person in charge
	h.pdf.SetX(55)
	h.pdf.SetY(startY + 70)
	h.pdf.Cell(nil, "担当")
	h.pdf.SetX(90)
	h.pdf.SetY(startY + 70)
	h.pdf.Cell(nil, info.Person)

	// TEL
	h.pdf.SetX(150)
	h.pdf.SetY(startY + 70)
	h.pdf.Cell(nil, "TEL")
	h.pdf.SetX(170)
	h.pdf.SetY(startY + 70)
	h.pdf.Cell(nil, info.Tel)

	// Draw vertical lines
	h.pdf.Line(85, startY+20, 85, startY+90)
	h.pdf.Line(145, startY+60, 145, startY+90)

	// Draw horizontal lines
	h.pdf.Line(50, startY+20, 250, startY+20)
	h.pdf.Line(50, startY+40, 250, startY+40)
	h.pdf.Line(50, startY+60, 250, startY+60)
	h.pdf.Line(50, startY+90, 250, startY+90)

	return nil
}

// DrawMemoSection draws the memo section (only for display, not printed)
func (h *PDFInstructionHelper) DrawMemoSection(memo string) error {
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	// Memo title with note
	h.pdf.SetX(300)
	h.pdf.SetY(100)
	h.pdf.Cell(nil, "メモ（印刷されません）")

	// Memo box
	h.pdf.SetLineWidth(0.5)
	h.pdf.Rectangle(300, 120, 245, 100, "D", 0, 0)

	// Memo content
	if memo != "" {
		h.pdf.SetX(305)
		h.pdf.SetY(135)
		if err := h.pdf.SetFont("noto-sans", "", 9); err != nil {
			return err
		}
		h.pdf.Cell(nil, memo)
	}

	return nil
}

// DrawWorkItems draws the work items section
func (h *PDFInstructionHelper) DrawWorkItems(items []models.PDFWorkItem) error {
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	startY := float64(240)

	// Section title
	h.pdf.SetX(50)
	h.pdf.SetY(startY)
	h.pdf.Cell(nil, "- 内容 -")

	// Draw box for items
	h.pdf.SetLineWidth(0.5)
	h.pdf.Rectangle(50, startY+20, 495, 250, "D", 0, 0)

	// Draw grid lines (horizontal)
	for i := 1; i < 10; i++ {
		y := startY + 20 + float64(i*25)
		h.pdf.Line(50, y, 545, y)
	}

	// Add items
	currentY := startY + 35
	for i, item := range items {
		if i >= 10 {
			break // Limit to 10 items per page
		}
		h.pdf.SetX(55)
		h.pdf.SetY(currentY)
		h.pdf.Cell(nil, item.Description)
		currentY += 25
	}

	return nil
}

// DrawWorkDetails draws the work details section at the bottom
func (h *PDFInstructionHelper) DrawWorkDetails(details models.PDFWorkDetails) error {
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	startY := float64(520)

	// Work slip
	h.pdf.SetX(50)
	h.pdf.SetY(startY)
	h.pdf.Cell(nil, "作業伝票")
	h.pdf.SetX(110)
	h.pdf.Cell(nil, details.Contractor)

	// Amount
	h.pdf.SetX(50)
	h.pdf.SetY(startY + 20)
	h.pdf.Cell(nil, "計 量")
	h.pdf.SetX(110)
	h.pdf.Cell(nil, details.Amount)

	// Collection amount
	h.pdf.SetX(200)
	h.pdf.SetY(startY + 20)
	h.pdf.Cell(nil, "集 金 額")
	h.pdf.SetX(250)
	h.pdf.Cell(nil, "（税込）")

	// Manifest
	h.pdf.SetX(50)
	h.pdf.SetY(startY + 40)
	h.pdf.Cell(nil, "マニフェスト")
	h.pdf.SetX(120)
	h.pdf.Cell(nil, details.Manifest)

	// T-Point
	h.pdf.SetX(200)
	h.pdf.SetY(startY + 40)
	h.pdf.Cell(nil, "Tポイント")
	h.pdf.SetX(260)
	h.pdf.Cell(nil, details.ManifestType)

	// Tax info
	h.pdf.SetX(300)
	h.pdf.SetY(startY + 40)
	h.pdf.Cell(nil, "税抜@")

	// Recycling fee
	h.pdf.SetX(50)
	h.pdf.SetY(startY + 60)
	h.pdf.Cell(nil, "リサイクル券")

	if details.NoRecyclingFee {
		h.pdf.SetX(120)
		h.pdf.Cell(nil, "無")
	}

	// Point
	h.pdf.SetX(300)
	h.pdf.SetY(startY + 60)
	h.pdf.Cell(nil, "ポイント")

	return nil
}

// DrawSeparator draws a separator line between sheets
func (h *PDFInstructionHelper) DrawSeparator() error {
	// Draw dotted line in the middle
	h.pdf.SetLineWidth(0.5)
	// Since SetLineDashPattern is not available in gopdf, we'll draw multiple short lines
	for y := 30.0; y < 570.0; y += 6 {
		h.pdf.Line(297.5, y, 297.5, y+3)
	}
	return nil
}
