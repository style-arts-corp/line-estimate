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

	// Try to add a font
	fontAdded := false

	// Get current working directory for debugging
	cwd, _ := os.Getwd()

	// Try multiple font paths
	fontPaths := []string{
		"./fonts/NotoSansJP-Regular.ttf",
		"fonts/NotoSansJP-Regular.ttf",
		filepath.Join(cwd, "fonts", "NotoSansJP-Regular.ttf"),
		"/app/fonts/NotoSansJP-Regular.ttf", // Docker path
	}

	var fontErr error
	for _, path := range fontPaths {
		if _, err := os.Stat(path); err == nil {
			// Font file exists, try to add it
			fontErr = pdf.AddTTFFont("noto-sans", path)
			if fontErr == nil {
				fontErr = pdf.SetFont("noto-sans", "", 16)
				if fontErr == nil {
					fontAdded = true
					break
				}
			}
		}
	}

	// Log font loading status
	if !fontAdded {
		fmt.Printf("Font loading failed. CWD: %s, Error: %v\n", cwd, fontErr)
	}

	// Add "Test" text to the PDF
	if fontAdded {
		pdf.SetX(100)
		pdf.SetY(100)
		pdf.Cell(nil, "こんにちは")
	} else {
		// Return early with a blank PDF, but still create it
		fmt.Printf("No font could be loaded, creating blank PDF\n")
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
	if err := pdf.WritePdf(filepath); err != nil {
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
