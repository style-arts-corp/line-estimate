package utils

import (
	"fmt"

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

// DrawBothSides draws both the instruction sheet and receipt side by side
func (h *PDFInstructionHelper) DrawBothSides(instruction *models.PDFInstruction) error {
	// Draw center divider
	if err := h.DrawCenterDivider(); err != nil {
		return err
	}

	// Draw left side (instruction sheet)
	if err := h.DrawSection(0, instruction, false); err != nil {
		return err
	}

	// Draw right side (receipt)
	if err := h.DrawSection(420.945, instruction, true); err != nil {
		return err
	}

	return nil
}

// DrawSection draws either instruction sheet or receipt based on offsetX
func (h *PDFInstructionHelper) DrawSection(offsetX float64, instruction *models.PDFInstruction, isReceipt bool) error {
	// Draw outer border
	h.pdf.SetLineWidth(1)
	h.pdf.SetStrokeColor(0, 0, 0)
	h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 30, 360, 535, "D")

	// Draw header
	if err := h.DrawHeader(offsetX, instruction, isReceipt); err != nil {
		return err
	}

	// Draw collection date
	if err := h.DrawCollectionDate(offsetX, instruction); err != nil {
		return err
	}

	// Draw collector box
	if err := h.DrawCollectorBox(offsetX, instruction, isReceipt); err != nil {
		return err
	}

	// Draw content section
	if err := h.DrawContentSection(offsetX, instruction.Items); err != nil {
		return err
	}

	// Draw footer
	if err := h.DrawFooter(offsetX, instruction.WorkDetails); err != nil {
		return err
	}

	return nil
}

// DrawHeader draws the header section with title, acceptance check, and accepted by
func (h *PDFInstructionHelper) DrawHeader(offsetX float64, instruction *models.PDFInstruction, isReceipt bool) error {
	// Header box
	h.pdf.SetLineWidth(1)
	h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 30, 360, 40, "D")

	// Title
	h.pdf.SetX(offsetX + 50)
	h.pdf.SetY(45)
	if err := h.pdf.SetFont("noto-sans", "", 16); err != nil {
		return err
	}
	title := "作業指示書"
	if isReceipt {
		title = "控"
	}
	h.pdf.Cell(nil, title)

	// Acceptance check box
	h.pdf.SetLineWidth(1)
	// h.pdf.RectFromUpperLeftWithStyle(offsetX+180, 42, 50, 20, "D")
	h.pdf.SetX(offsetX + 150)
	h.pdf.SetY(55)
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}
	h.pdf.Cell(nil, "受付")

	// Accepted by box
	// h.pdf.RectFromUpperLeftWithStyle(offsetX+260, 42, 50, 20, "D")
	h.pdf.SetX(offsetX + 250)
	h.pdf.SetY(55)
	h.pdf.Cell(nil, "受付者")

	// Accepted by value box
	if err := h.pdf.SetFont("noto-sans", "", 14); err != nil {
		return err
	}
	if instruction.AcceptedBy != "" {
		h.pdf.SetX(offsetX + 300)
		h.pdf.SetY(52)
		h.pdf.Cell(nil, instruction.AcceptedBy)
	}

	return nil
}

// DrawCollectionDate draws the collection date section
func (h *PDFInstructionHelper) DrawCollectionDate(offsetX float64, instruction *models.PDFInstruction) error {
	// Collection date box
	h.pdf.SetLineWidth(1)
	h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 70, 360, 30, "D")

	h.pdf.SetX(offsetX + 40)
	h.pdf.SetY(82)
	if err := h.pdf.SetFont("noto-sans", "", 11); err != nil {
		return err
	}
	h.pdf.Cell(nil, "収集日")

	// Draw underline for date
	// h.pdf.SetLineWidth(0.5)
	// h.pdf.Line(offsetX+100, 92, offsetX+250, 92)

	if instruction.CollectionDate != "" {
		h.pdf.SetX(offsetX + 110)
		h.pdf.SetY(82)
		h.pdf.Cell(nil, instruction.CollectionDate)
	}

	return nil
}

// DrawCollectorBox draws the collector information box
func (h *PDFInstructionHelper) DrawCollectorBox(offsetX float64, instruction *models.PDFInstruction, isReceipt bool) error {
	// Main box
	h.pdf.SetLineWidth(1)
	h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 100, 360, 90, "D")

	// Vertical line for "収集先"
	h.pdf.Line(offsetX+80, 100, offsetX+80, 190)

	// "収集先" label
	h.pdf.SetX(offsetX + 45)
	h.pdf.SetY(130)
	if err := h.pdf.SetFont("noto-sans", "", 12); err != nil {
		return err
	}
	h.pdf.Cell(nil, "収")
	h.pdf.SetX(offsetX + 45)
	h.pdf.SetY(145)
	h.pdf.Cell(nil, "集")
	h.pdf.SetX(offsetX + 45)
	h.pdf.SetY(160)
	h.pdf.Cell(nil, "先")

	// Get appropriate info
	var info models.PDFContractorInfo
	if isReceipt {
		info = models.PDFContractorInfo(instruction.Collector)
	} else {
		info = instruction.Contractor
	}

	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	// Name
	h.pdf.SetX(offsetX + 90)
	h.pdf.SetY(115)
	h.pdf.Cell(nil, "名称")
	h.pdf.Line(offsetX+120, 125, offsetX+380, 125)
	if info.Name != "" {
		h.pdf.SetX(offsetX + 125)
		h.pdf.SetY(115)
		h.pdf.Cell(nil, info.Name)
	}

	// Address
	h.pdf.SetX(offsetX + 90)
	h.pdf.SetY(140)
	h.pdf.Cell(nil, "住所")
	h.pdf.Line(offsetX+120, 150, offsetX+380, 150)
	if info.Address != "" {
		h.pdf.SetX(offsetX + 125)
		h.pdf.SetY(140)
		h.pdf.Cell(nil, info.Address)
	}

	// Person and TEL
	h.pdf.SetX(offsetX + 90)
	h.pdf.SetY(165)
	h.pdf.Cell(nil, "担当")
	h.pdf.Line(offsetX+120, 175, offsetX+250, 175)
	if info.Person != "" {
		h.pdf.SetX(offsetX + 125)
		h.pdf.SetY(165)
		h.pdf.Cell(nil, info.Person)
	}

	h.pdf.SetX(offsetX + 260)
	h.pdf.SetY(165)
	h.pdf.Cell(nil, "TEL")
	h.pdf.Line(offsetX+285, 175, offsetX+380, 175)
	if info.Tel != "" {
		h.pdf.SetX(offsetX + 290)
		h.pdf.SetY(165)
		h.pdf.Cell(nil, info.Tel)
	}

	return nil
}

// DrawContentSection draws the content items section
func (h *PDFInstructionHelper) DrawContentSection(offsetX float64, items []models.PDFWorkItem) error {
	// Content header box
	h.pdf.SetLineWidth(1)
	// h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 190, 360, 25, "D")

	h.pdf.SetX(offsetX + 35)
	h.pdf.SetY(190)
	if err := h.pdf.SetFont("noto-sans", "", 11); err != nil {
		return err
	}
	h.pdf.Cell(nil, "- 内容 -")

	// Content items box
	// h.pdf.SetLineWidth(1)
	// h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 215, 360, 250, "D")

	// Draw items
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	startY := 225.0
	for i := 0; i < 10; i++ {
		if i < len(items) {
			h.pdf.SetX(offsetX + 40)
			h.pdf.SetY(startY + float64(i*25))
			h.pdf.Cell(nil, items[i].Description)
		}
	}

	return nil
}

// DrawFooter draws the footer section with work details
func (h *PDFInstructionHelper) DrawFooter(offsetX float64, details models.PDFWorkDetails) error {
	// Footer box
	h.pdf.SetLineWidth(1)
	h.pdf.RectFromUpperLeftWithStyle(offsetX+30, 465, 360, 100, "D")

	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	// Row 1: Work slip and Collection amount
	h.pdf.SetX(offsetX + 40)
	h.pdf.SetY(480)
	h.pdf.Cell(nil, "作業伝票")
	h.pdf.Line(offsetX+90, 490, offsetX+160, 490)
	if details.WorkSlip != "" {
		h.pdf.SetX(offsetX + 95)
		h.pdf.SetY(480)
		h.pdf.Cell(nil, details.WorkSlip)
	}

	h.pdf.SetX(offsetX + 210)
	h.pdf.SetY(480)
	h.pdf.Cell(nil, "集金額（税込）")
	h.pdf.Line(offsetX+290, 490, offsetX+330, 490)
	if details.CollectionAmount != "" {
		h.pdf.SetX(offsetX + 290)
		h.pdf.SetY(480)
		h.pdf.Cell(nil, fmt.Sprintf("%s", details.CollectionAmount))
	}

	// Row 2: Weight
	h.pdf.SetX(offsetX + 40)
	h.pdf.SetY(505)
	h.pdf.Cell(nil, "計　量")
	h.pdf.Line(offsetX+90, 515, offsetX+160, 515)
	if details.Weight != "" {
		h.pdf.SetX(offsetX + 95)
		h.pdf.SetY(505)
		h.pdf.Cell(nil, details.Weight)
	}

	// Row 3: Manifest, T-Point, Tax excluded rate
	h.pdf.SetX(offsetX + 40)
	h.pdf.SetY(530)
	h.pdf.Cell(nil, "マニフェスト")
	h.pdf.Line(offsetX+110, 540, offsetX+180, 540)
	if details.Manifest != "" {
		h.pdf.SetX(offsetX + 115)
		h.pdf.SetY(530)
		h.pdf.Cell(nil, details.Manifest)
	}

	h.pdf.SetX(offsetX + 250)
	h.pdf.SetY(505)
	h.pdf.Cell(nil, "税抜@")
	if details.TaxExcludedRate != "" {
		h.pdf.SetX(offsetX + 290)
		h.pdf.SetY(505)
		h.pdf.Cell(nil, details.TaxExcludedRate)
	}

	// Row 4: Recycling ticket and Points
	h.pdf.SetX(offsetX + 40)
	h.pdf.SetY(545)
	h.pdf.Cell(nil, "リサイクル券")
	h.pdf.Line(offsetX+110, 555, offsetX+180, 555)
	if details.RecyclingTicket != "" {
		h.pdf.SetX(offsetX + 115)
		h.pdf.SetY(545)
		h.pdf.Cell(nil, details.RecyclingTicket)
	}

	h.pdf.SetX(offsetX + 210)
	h.pdf.SetY(530)
	h.pdf.Cell(nil, "Vポイント")
	if details.RecyclingTicketNo {
		h.pdf.SetX(offsetX + 210)
		h.pdf.SetY(545)
		h.pdf.Cell(nil, "無")
	}

	if details.VPoint != "" {
		h.pdf.SetX(offsetX + 260)
		h.pdf.SetY(530)
		h.pdf.Cell(nil, details.VPoint)
	}
	if details.Points != "" {
		h.pdf.SetX(offsetX + 300)
		h.pdf.SetY(545)
		h.pdf.Cell(nil, details.Points)
	}
	h.pdf.SetX(offsetX + 350)
	h.pdf.SetY(545)
	h.pdf.Cell(nil, "ポイント")

	return nil
}

// DrawCenterDivider draws a dashed line in the center to separate the two sections
func (h *PDFInstructionHelper) DrawCenterDivider() error {
	h.pdf.SetLineWidth(0.5)
	h.pdf.SetStrokeColor(128, 128, 128)

	// Draw dashed line by drawing multiple small lines
	for y := 30.0; y < 565.0; y += 8 {
		h.pdf.Line(420.945, y, 420.945, y+4)
	}

	h.pdf.SetStrokeColor(0, 0, 0) // Reset to black
	return nil
}
