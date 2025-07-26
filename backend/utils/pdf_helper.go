package utils

import (
	"bytes"
	"fmt"
	"math"
	"strings"

	"github.com/signintech/gopdf"

	"line-estimate-backend/models"
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
	// Title "御見積書" with underline
	h.pdf.SetX(240)
	h.pdf.SetY(50)
	if err := h.pdf.SetFont("noto-sans", "", 28); err != nil {
		return err
	}
	h.pdf.Cell(nil, "御　見　積　書")

	// Draw underline for title
	h.pdf.SetLineWidth(1)
	h.pdf.Line(210, 80, 460, 80)
	h.pdf.Line(210, 82, 460, 82)

	// Company info (right side)
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	// Issue date in 令和 format
	h.pdf.SetX(460)
	h.pdf.SetY(130)
	year := estimate.IssueDate.Year()
	reiwaYear := year - 2018
	h.pdf.Cell(nil, fmt.Sprintf("令和 %d年 %d月 %d日",
		reiwaYear,
		estimate.IssueDate.Month(),
		estimate.IssueDate.Day()))

	// Company info with stamp image
	h.pdf.Image("../handlers/company-info-with-stamp.png", 380, 135, &gopdf.Rect{
		W: 150,
		H: 100,
	})

	// Phone
	h.pdf.SetX(400)
	h.pdf.SetY(185)
	h.pdf.Cell(nil, "PHONE : 090-8836-0462")

	// Email
	h.pdf.SetX(400)
	h.pdf.SetY(195)
	h.pdf.Cell(nil, "MAIL : sakai@marukyou.com")

	return nil
}

// DrawCustomerInfo draws the customer information section
func (h *PDFHelper) DrawCustomerInfo(estimate *models.PDFEstimate) error {
	// Customer name with 御中
	h.pdf.SetX(250)
	h.pdf.SetY(100)
	if err := h.pdf.SetFont("noto-sans", "", 16); err != nil {
		return err
	}
	h.pdf.Cell(nil, "御中")

	// Draw underline for 御中
	h.pdf.SetLineWidth(1)
	h.pdf.Line(50, 115, 290, 115)

	// Standard greeting texts
	h.pdf.SetX(50)
	h.pdf.SetY(130)
	if err := h.pdf.SetFont("noto-sans", "", 11); err != nil {
		return err
	}
	h.pdf.Cell(nil, "下記のとおり御見積申し上げます。")

	h.pdf.SetX(50)
	h.pdf.SetY(145)
	h.pdf.Cell(nil, "何卒御下命の程お願い申し上げます。")

	return nil
}

// DrawEstimateInfo draws the estimate information section
func (h *PDFHelper) DrawEstimateInfo(estimate *models.PDFEstimate) error {
	startY := 170.0
	leftX := 50.0
	labelWidth := 80.0

	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}

	// 場所 (Location)
	h.pdf.SetX(leftX)
	h.pdf.SetY(startY)
	h.pdf.Cell(nil, "場　　所")
	h.pdf.SetX(leftX + labelWidth)
	h.pdf.Line(leftX, startY+10, leftX+250, startY+10)

	// 期日 (Due Date)
	h.pdf.SetX(leftX)
	h.pdf.SetY(startY + 20)
	h.pdf.Cell(nil, "期　　日")
	h.pdf.SetX(leftX + labelWidth)
	h.pdf.Line(leftX, startY+30, leftX+250, startY+30)

	// 取引方法 (Transaction Method)
	h.pdf.SetX(leftX)
	h.pdf.SetY(startY + 40)
	h.pdf.Cell(nil, "取引方法")
	h.pdf.SetX(leftX + labelWidth)
	h.pdf.Cell(nil, "当社規定による")
	h.pdf.Line(leftX, startY+50, leftX+250, startY+50)

	// 有効期限 (Validity Period)
	h.pdf.SetX(leftX)
	h.pdf.SetY(startY + 60)
	h.pdf.Cell(nil, "有効期限")
	h.pdf.SetX(leftX + labelWidth)
	// Calculate validity date (30 days from issue date by default)
	validityDate := estimate.IssueDate.AddDate(0, 1, 0) // 1 month
	reiwaYear := validityDate.Year() - 2018
	h.pdf.Cell(nil, fmt.Sprintf("令和 %d 年 %d 月 %d 日迄",
		reiwaYear,
		validityDate.Month(),
		validityDate.Day()))
	h.pdf.Line(leftX, startY+70, leftX+250, startY+70)

	// 廃棄物搬出・収集運搬・処分 (Waste disposal info)
	h.pdf.Line(leftX, startY+78, leftX+500, startY+78)
	h.pdf.Line(leftX, startY+80, leftX+500, startY+80)
	h.pdf.SetX(leftX + 100)
	h.pdf.SetY(startY + 80)
	if err := h.pdf.SetFont("noto-sans", "", 20); err != nil {
		return err
	}
	h.pdf.Cell(nil, "廃棄物搬出・収集運搬・処分")
	h.pdf.Line(leftX, startY+100, leftX+500, startY+100)
	h.pdf.Line(leftX, startY+102, leftX+500, startY+102)

	return nil
}

// DrawTotalAmount draws the large total amount display with stamp box
func (h *PDFHelper) DrawTotalAmount(total float64) error {
	// Draw total amount box
	boxX := 50.0
	boxY := 280.0
	boxWidth := 300.0
	boxHeight := 50.0

	// Draw border for total amount
	h.pdf.SetLineWidth(1)
	h.pdf.SetStrokeColor(0, 0, 0)
	h.pdf.RectFromUpperLeftWithStyle(boxX, boxY, boxWidth, boxHeight, "D")

	// Draw label
	h.pdf.SetX(boxX + 10)
	h.pdf.SetY(boxY + 15)
	if err := h.pdf.SetFont("noto-sans", "", 14); err != nil {
		return err
	}
	h.pdf.Cell(nil, fmt.Sprintf("合計金額   ¥ %s", FormatCurrency(total)))

	// Draw stamp box
	stampBoxX := 400.0
	stampBoxY := 280.0
	stampBoxWidth := 100.0
	stampBoxHeight := 50.0

	// Draw outer border
	h.pdf.SetLineWidth(1)
	h.pdf.RectFromUpperLeftWithStyle(stampBoxX, stampBoxY, stampBoxWidth, stampBoxHeight, "D")

	// Draw inner divider
	h.pdf.Line(stampBoxX+stampBoxWidth/2, stampBoxY, stampBoxX+stampBoxWidth/2, stampBoxY+stampBoxHeight)

	// Draw labels
	h.pdf.SetX(stampBoxX + 2)
	h.pdf.SetY(stampBoxY + 2)
	if err := h.pdf.SetFont("noto-sans", "", 9); err != nil {
		return err
	}
	h.pdf.Cell(nil, "検印")

	h.pdf.SetX(stampBoxX + stampBoxWidth/2 + 2)
	h.pdf.SetY(stampBoxY + 2)
	h.pdf.Cell(nil, "担当")

	// Draw company seal stamp area on the first page
	// Position it in the right side, below the company info
	sealX := 455.0
	sealY := 290.0
	sealSize := 37.0

	// Draw circle for company seal
	h.pdf.SetLineWidth(2)
	h.pdf.SetStrokeColor(200, 0, 0) // Red color for seal

	// Draw circle using Oval function
	h.pdf.Oval(sealX, sealY, sealSize, sealSize)

	// 担当者 のはんこ
	h.pdf.SetX(sealX + 4)
	h.pdf.SetY(sealY + 14)
	if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
		return err
	}
	h.pdf.SetTextColor(200, 0, 0) // Red text
	h.pdf.Cell(nil, "担当者")
	h.pdf.SetTextColor(0, 0, 0) // Reset to black

	return nil
}

// DrawTitle draws the estimate title
func (h *PDFHelper) DrawTitle(title string) error {
	h.pdf.SetX(50)
	h.pdf.SetY(220)
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
	table.AddColumn("項目", 180, "left")
	table.AddColumn("数量", 50, "right")
	table.AddColumn("単価", 70, "right")
	table.AddColumn("金額", 70, "right")
	table.AddColumn("仕様", 125, "left")

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

		// Use Specification field if available, otherwise empty
		specification := ""
		if item.Specification != "" {
			specification = item.Specification
		}

		table.AddRow([]string{
			item.Description,
			quantityStr,
			unitPriceStr,
			amountStr,
			specification,
		})
	}

	// Add subtotal row
	table.AddRow([]string{
		"",
		"",
		"小計",
		FormatCurrency(estimate.SubTotal),
		"",
	})

	// Add tax row
	table.AddRow([]string{
		"",
		"",
		"消費税",
		FormatCurrency(estimate.Tax),
		"",
	})

	// Add total row
	table.AddRow([]string{
		"",
		"",
		"合計金額",
		FormatCurrency(estimate.Total),
		"",
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
	h.pdf.Cell(nil, "消費税")
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
	remarksBoxY := 700.0

	// Draw remarks box with fill
	h.pdf.SetLineWidth(1.0)
	h.pdf.SetStrokeColor(0, 0, 0)     // Black border
	h.pdf.SetFillColor(255, 255, 255) // White fill
	h.pdf.RectFromUpperLeftWithStyle(50, remarksBoxY, 495, 100, "FD")

	// Remarks title
	h.pdf.SetX(55)
	h.pdf.SetY(remarksBoxY + 10)
	h.pdf.SetTextColor(0, 0, 0) // Ensure text is black
	h.pdf.Cell(nil, "【備考】")

	// Remarks content
	currentY := remarksBoxY + 25
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

// DrawImageGrid draws images in a grid layout
func (h *PDFHelper) DrawImageGrid(images []models.PDFImage, startPage int) error {
	if len(images) == 0 {
		return nil
	}

	// Image grid configuration
	const (
		imagesPerRow  = 2
		imagesPerCol  = 3
		imagesPerPage = imagesPerRow * imagesPerCol
		imageWidth    = 220.0
		imageHeight   = 165.0
		marginLeft    = 50.0
		marginTop     = 100.0
		horizontalGap = 35.0
		verticalGap   = 50.0
	)

	imageHelper := NewImageHelper(imageWidth, imageHeight)

	// Process images in batches of imagesPerPage
	for pageIdx := 0; pageIdx < len(images); pageIdx += imagesPerPage {
		// Add new page for images
		h.pdf.AddPage()

		// Draw page header
		h.pdf.SetX(50)
		h.pdf.SetY(50)
		if err := h.pdf.SetFont("noto-sans", "", 16); err != nil {
			return err
		}
		h.pdf.Cell(nil, "添付画像")

		// Draw horizontal line
		h.pdf.SetLineWidth(0.5)
		h.pdf.Line(50, 70, 545, 70)

		// Get images for this page
		endIdx := pageIdx + imagesPerPage
		if endIdx > len(images) {
			endIdx = len(images)
		}
		pageImages := images[pageIdx:endIdx]

		// Draw images in grid
		for idx, img := range pageImages {
			// Calculate grid position
			row := idx / imagesPerRow
			col := idx % imagesPerRow

			x := marginLeft + float64(col)*(imageWidth+horizontalGap)
			y := marginTop + float64(row)*(imageHeight+verticalGap)

			// Decode and process image
			imageData, format, err := imageHelper.DecodeBase64Image(img.Data)
			if err != nil {
				// Draw error placeholder
				h.pdf.SetStrokeColor(200, 200, 200)
				h.pdf.SetLineWidth(1)
				h.pdf.RectFromUpperLeftWithStyle(x, y, imageWidth, imageHeight, "D")

				h.pdf.SetX(x + 10)
				h.pdf.SetY(y + imageHeight/2)
				if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
					return err
				}
				h.pdf.Cell(nil, "画像読み込みエラー")
				continue
			}

			// Resize image if needed
			resizedData, err := imageHelper.ResizeImage(imageData, format)
			if err != nil {
				// Draw error placeholder
				h.pdf.SetStrokeColor(200, 200, 200)
				h.pdf.SetLineWidth(1)
				h.pdf.RectFromUpperLeftWithStyle(x, y, imageWidth, imageHeight, "D")

				h.pdf.SetX(x + 10)
				h.pdf.SetY(y + imageHeight/2)
				if err := h.pdf.SetFont("noto-sans", "", 10); err != nil {
					return err
				}
				h.pdf.Cell(nil, "画像処理エラー")
				continue
			}

			// Get actual image dimensions to maintain aspect ratio
			width, height, err := imageHelper.GetImageDimensions(resizedData)
			if err != nil {
				continue
			}

			// Calculate display dimensions maintaining aspect ratio
			displayWidth := imageWidth
			displayHeight := imageHeight

			aspectRatio := float64(width) / float64(height)
			boxAspectRatio := imageWidth / imageHeight

			if aspectRatio > boxAspectRatio {
				// Image is wider than box
				displayHeight = imageWidth / aspectRatio
			} else {
				// Image is taller than box
				displayWidth = imageHeight * aspectRatio
			}

			// Center image in box
			offsetX := (imageWidth - displayWidth) / 2
			offsetY := (imageHeight - displayHeight) / 2

			// Draw image border
			h.pdf.SetStrokeColor(200, 200, 200)
			h.pdf.SetLineWidth(0.5)
			h.pdf.RectFromUpperLeftWithStyle(x, y, imageWidth, imageHeight, "D")

			// Add image to PDF
			imgHolder, err := gopdf.ImageHolderByReader(bytes.NewReader(resizedData))
			if err != nil {
				continue
			}

			err = h.pdf.ImageByHolder(imgHolder, x+offsetX, y+offsetY, &gopdf.Rect{
				W: displayWidth,
				H: displayHeight,
			})
			if err != nil {
				continue
			}

			// Draw image filename
			h.pdf.SetX(x)
			h.pdf.SetY(y + imageHeight + 10)
			if err := h.pdf.SetFont("noto-sans", "", 9); err != nil {
				return err
			}
			h.pdf.SetTextColor(100, 100, 100)

			// Truncate filename if too long
			filename := img.Name
			if len(filename) > 30 {
				filename = filename[:27] + "..."
			}
			h.pdf.Cell(nil, filename)
			h.pdf.SetTextColor(0, 0, 0) // Reset text color
		}
	}

	return nil
}
