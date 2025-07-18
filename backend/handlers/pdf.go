package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/signintech/gopdf"
	"line-estimate-backend/utils"
)

func CreatePDF(c *gin.Context) {
	// Create a new PDF document
	pdf := gopdf.GoPdf{}
	pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})
	pdf.AddPage()

	// Try to add a font (optional, fallback to basic drawing)
	fontAdded := false
	err := pdf.AddTTFFont("noto-sans", "./fonts/NotoSans-Regular.ttf")
	if err == nil {
		pdf.SetFont("noto-sans", "", 16)
		fontAdded = true
	} else {
		// Try alternative font
		err = pdf.AddTTFFont("arial", "./fonts/arial.ttf")
		if err == nil {
			pdf.SetFont("arial", "", 16)
			fontAdded = true
		}
	}

	// Add "Test" text to the PDF
	if fontAdded {
		pdf.Cell(nil, "Test")
	} else {
		// Fallback: Use basic text drawing without custom fonts
		pdf.Text(100, 100, "Test")
	}

	// Create pdfs directory if it doesn't exist
	pdfDir := "./pdfs"
	if err := os.MkdirAll(pdfDir, 0755); err != nil {
		utils.ErrorResponse(c, 500, "PDFディレクトリの作成に失敗しました")
		return
	}

	// Generate unique filename with timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("test_%s.pdf", timestamp)
	filepath := filepath.Join(pdfDir, filename)

	// Save the PDF
	err = pdf.WritePdf(filepath)
	if err != nil {
		utils.ErrorResponse(c, 500, "PDFの保存に失敗しました: "+err.Error())
		return
	}

	// Return success response
	utils.SuccessResponse(c, gin.H{
		"message":  "PDFが正常に作成されました",
		"filename": filename,
		"filepath": filepath,
	})
}