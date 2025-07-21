package handlers

import (
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/signintech/gopdf"
	"line-estimate-backend/models"
	"line-estimate-backend/utils"
)

// GenerateInstructionPDF generates an instruction sheet PDF from the provided data
func GenerateInstructionPDF(instruction *models.PDFInstruction) (*gopdf.GoPdf, error) {
	// Create a new PDF document (A4 Landscape for side-by-side layout)
	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{
		PageSize: gopdf.Rect{W: 841.89, H: 595.28}, // A4 Landscape
	})

	// Load Japanese font
	if err := loadJapaneseFont(pdf); err != nil {
		return nil, err
	}

	// Add page
	pdf.AddPage()

	// Create helper
	helper := utils.NewPDFInstructionHelper(pdf)

	// Draw separator line
	if err := helper.DrawSeparator(); err != nil {
		return nil, err
	}

	// Left side - 作業指示書 (Work Instruction Sheet)
	// Draw header
	if err := helper.DrawInstructionHeader(instruction, false); err != nil {
		return nil, err
	}

	// Draw contact info
	if err := helper.DrawContactInfo(instruction, false); err != nil {
		return nil, err
	}

	// Draw work items
	if err := helper.DrawWorkItems(instruction.Items); err != nil {
		return nil, err
	}

	// Draw work details
	if err := helper.DrawWorkDetails(instruction.WorkDetails); err != nil {
		return nil, err
	}

	// Right side - 控 (Receipt)
	// Offset all X coordinates by 420 for right side
	pdf.SetX(420 + 50)
	pdf.SetY(40)
	if err := pdf.SetFont("noto-sans", "", 16); err != nil {
		return nil, err
	}
	pdf.Cell(nil, "控")

	// Receipt date label
	pdf.SetX(420 + 180)
	pdf.SetY(40)
	if err := pdf.SetFont("noto-sans", "", 10); err != nil {
		return nil, err
	}
	pdf.Cell(nil, "受付日")

	// Issue date
	pdf.SetX(420 + 180)
	pdf.SetY(60)
	pdf.Cell(nil, instruction.IssueDate.Format("2006年1月2日"))

	// Draw receipt contact info (similar structure, offset X by 420)
	startY := float64(100)
	pdf.SetLineWidth(0.5)
	pdf.Rectangle(420+50, startY, 200, 120, "D", 0, 0)

	// Continue with receipt side details...
	// (Implementation would continue with all receipt side elements)

	// Draw memo section on the right side
	if err := helper.DrawMemoSection(instruction.Memo); err != nil {
		return nil, err
	}

	return pdf, nil
}

// CreateInstructionPDF godoc
// @Summary 指示書PDFを生成
// @Description 指示書情報からPDFを生成します
// @Tags Instructions
// @Accept json
// @Produce json
// @Param instruction body models.PDFInstruction true "指示書情報"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /api/v1/instructions/pdf [post]
func CreateInstructionPDF(c *gin.Context) {
	var instruction models.PDFInstruction
	if err := c.ShouldBindJSON(&instruction); err != nil {
		utils.SendErrorResponse(c, 400, "無効なリクエストデータ: "+err.Error())
		return
	}

	// Generate PDF
	pdf, err := GenerateInstructionPDF(&instruction)
	if err != nil {
		utils.SendErrorResponse(c, 500, "PDF生成に失敗しました: "+err.Error())
		return
	}

	// Create pdfs directory if it doesn't exist
	pdfDir := "./pdfs"
	if err := os.MkdirAll(pdfDir, 0755); err != nil {
		utils.SendErrorResponse(c, 500, "PDFディレクトリの作成に失敗しました")
		return
	}

	// Generate unique filename with timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("instruction_%s_%s.pdf", instruction.InstructionNo, timestamp)
	filepath := filepath.Join(pdfDir, filename)

	// Save the PDF
	if err := pdf.WritePdf(filepath); err != nil {
		utils.SendErrorResponse(c, 500, "PDFの保存に失敗しました: "+err.Error())
		return
	}

	// Return success response
	utils.SuccessResponse(c, gin.H{
		"message":  "指示書PDFが正常に作成されました",
		"filename": filename,
		"filepath": filepath,
	})
}

// CreateTestInstructionPDF godoc
// @Summary テスト指示書PDFを生成
// @Description 開発用のテスト指示書PDFを生成します
// @Tags Development
// @Accept json
// @Produce json
// @Success 200 {object} utils.Response
// @Failure 500 {object} utils.ErrorResponse
// @Router /dev/create-instruction-pdf [get]
func CreateTestInstructionPDF(c *gin.Context) {
	// Create test instruction data
	testInstruction := &models.PDFInstruction{
		InstructionNo: "INS-20250425-001",
		IssueDate:     time.Now(),
		Contractor: models.PDFContractorInfo{
			Recipient: "受付済",
			Name:      "株式会社サンプル",
			Address:   "東京都新宿区○○1-2-3",
			Person:    "山田太郎",
			Tel:       "03-1234-5678",
		},
		Collector: models.PDFCollectorInfo{
			Recipient: "受付済",
			Name:      "株式会社サンプル",
			Address:   "東京都新宿区○○1-2-3",
			Person:    "山田太郎",
			Tel:       "03-1234-5678",
		},
		Items: []models.PDFWorkItem{
			{Description: "オフィスチェア 10脚"},
			{Description: "会議用テーブル 3台"},
			{Description: "キャビネット 5台"},
			{Description: "その他事務用品一式"},
		},
		Memo: "14時頃到着予定。駐車場は建物裏側を利用してください。",
		WorkDetails: models.PDFWorkDetails{
			Contractor:     "A-123",
			Amount:         "2.5t",
			Manifest:       "B-456",
			ManifestType:   "産廃",
			NoRecyclingFee: true,
			ExtraPoints:    false,
		},
	}

	// Generate PDF
	pdf, err := GenerateInstructionPDF(testInstruction)
	if err != nil {
		utils.SendErrorResponse(c, 500, "PDF生成に失敗しました: "+err.Error())
		return
	}

	// Create pdfs directory if it doesn't exist
	pdfDir := "./pdfs"
	if err := os.MkdirAll(pdfDir, 0755); err != nil {
		utils.SendErrorResponse(c, 500, "PDFディレクトリの作成に失敗しました")
		return
	}

	// Generate unique filename with timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("test_instruction_%s.pdf", timestamp)
	filepath := filepath.Join(pdfDir, filename)

	// Save the PDF
	if err := pdf.WritePdf(filepath); err != nil {
		utils.SendErrorResponse(c, 500, "PDFの保存に失敗しました: "+err.Error())
		return
	}

	// Return success response
	utils.SuccessResponse(c, gin.H{
		"message":  "テスト指示書PDFが正常に作成されました",
		"filename": filename,
		"filepath": filepath,
	})
}
