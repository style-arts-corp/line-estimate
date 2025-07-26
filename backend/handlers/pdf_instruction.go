package handlers

import (
	"bytes"
	"fmt"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/signintech/gopdf"
	"line-estimate-backend/models"
	"line-estimate-backend/services"
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

	// Draw both sides (instruction sheet and receipt)
	if err := helper.DrawBothSides(instruction); err != nil {
		return nil, err
	}

	return pdf, nil
}

// CreateInstructionPDF godoc
// @Summary 指示書PDFを生成
// @Description 指示書情報からPDFを生成します
// @Tags Instructions
// @Accept json
// @Produce application/pdf
// @Param instruction body models.PDFInstruction true "指示書情報"
// @Success 200 {file} binary
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

	// Convert PDF to bytes
	var buf bytes.Buffer
	if err := pdf.Write(&buf); err != nil {
		utils.SendErrorResponse(c, 500, "PDFの出力に失敗しました: "+err.Error())
		return
	}

	// Generate filename for Content-Disposition header
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("instruction_%s_%s.pdf", instruction.InstructionNo, timestamp)

	// Check if local save mode
	saveLocal := os.Getenv("SAVE_LOCAL_PDF")

	if saveLocal == "true" {
		// ローカル保存
		pdfDir := "./pdfs"
		if err := os.MkdirAll(pdfDir, 0755); err != nil {
			utils.SendErrorResponse(c, 500, "PDFディレクトリの作成に失敗しました: "+err.Error())
			return
		}
		localPath := filepath.Join(pdfDir, filename)
		if err := pdf.WritePdf(localPath); err != nil {
			utils.SendErrorResponse(c, 500, "PDFのローカル保存に失敗しました: "+err.Error())
			return
		}
	} else {
		// Google Driveにアップロード
		driveService, err := services.NewDriveService()
		if err != nil {
			utils.SendErrorResponse(c, 500, "Google Driveサービスの初期化に失敗しました: "+err.Error())
			return
		}

		_, err = driveService.UploadFile(filename, "application/pdf", buf.Bytes())
		if err != nil {
			utils.SendErrorResponse(c, 500, "Google Driveへのアップロードに失敗しました: "+err.Error())
			return
		}
	}

	// 保存処理の後、常にPDFファイルを直接レスポンスとして返す
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Length", fmt.Sprintf("%d", buf.Len()))
	c.Data(200, "application/pdf", buf.Bytes())
}

// CreateTestInstructionPDF godoc
// @Summary テスト指示書PDFを生成
// @Description 開発用のテスト指示書PDFを生成します
// @Tags Development
// @Accept json
// @Produce application/pdf
// @Success 200 {file} binary
// @Failure 500 {object} utils.ErrorResponse
// @Router /dev/create-instruction-pdf [get]
func CreateTestInstructionPDF(c *gin.Context) {
	// Create test instruction data
	testInstruction := &models.PDFInstruction{
		InstructionNo:   "INS-20250425-001",
		IssueDate:       time.Now(),
		CollectionDate:  "令和7年4月30日（水）",
		AcceptanceCheck: true,
		AcceptedBy:      "田中",
		Contractor: models.PDFContractorInfo{
			Recipient: "受付済",
			Name:      "株式会社サンプル工業",
			Address:   "東京都新宿区西新宿1-2-3 サンプルビル5F",
			Person:    "山田太郎",
			Tel:       "03-1234-5678",
		},
		Collector: models.PDFCollectorInfo{
			Recipient: "受付済",
			Name:      "株式会社サンプル工業",
			Address:   "東京都新宿区西新宿1-2-3 サンプルビル5F",
			Person:    "山田太郎",
			Tel:       "03-1234-5678",
		},
		Items: []models.PDFWorkItem{
			{Description: "オフィスチェア 10脚"},
			{Description: "会議用テーブル 3台"},
			{Description: "キャビネット 5台"},
			{Description: "パソコンデスク 8台"},
			{Description: "書類保管庫 2台"},
			{Description: "プリンター 3台"},
			{Description: "その他事務用品一式"},
		},
		Memo: "14時頃到着予定。駐車場は建物裏側を利用してください。",
		WorkDetails: models.PDFWorkDetails{
			WorkSlip:          "WS-2025-0430",
			CollectionAmount:  "55,000円",
			Weight:            "2.5t",
			Manifest:          "MF-123456",
			TPoint:            "550pt",
			TaxExcludedRate:   "20円/kg",
			RecyclingTicket:   "",
			RecyclingTicketNo: true,
			Points:            "1,100",
		},
	}

	// Generate PDF
	pdf, err := GenerateInstructionPDF(testInstruction)
	if err != nil {
		utils.SendErrorResponse(c, 500, "PDF生成に失敗しました: "+err.Error())
		return
	}

	// Convert PDF to bytes
	var buf bytes.Buffer
	if err := pdf.Write(&buf); err != nil {
		utils.SendErrorResponse(c, 500, "PDFの出力に失敗しました: "+err.Error())
		return
	}

	// Generate unique filename with timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("test_instruction_%s.pdf", timestamp)

	// Check if local save mode
	saveLocal := os.Getenv("SAVE_LOCAL_PDF")

	if saveLocal == "true" {
		// ローカル保存
		pdfDir := "./pdfs"
		if err := os.MkdirAll(pdfDir, 0755); err != nil {
			utils.SendErrorResponse(c, 500, "PDFディレクトリの作成に失敗しました: "+err.Error())
			return
		}
		localPath := filepath.Join(pdfDir, filename)
		if err := pdf.WritePdf(localPath); err != nil {
			utils.SendErrorResponse(c, 500, "PDFのローカル保存に失敗しました: "+err.Error())
			return
		}
	} else {
		// Google Driveにアップロード
		driveService, err := services.NewDriveService()
		if err != nil {
			utils.SendErrorResponse(c, 500, "Google Driveサービスの初期化に失敗しました: "+err.Error())
			return
		}

		_, err = driveService.UploadFile(filename, "application/pdf", buf.Bytes())
		if err != nil {
			utils.SendErrorResponse(c, 500, "Google Driveへのアップロードに失敗しました: "+err.Error())
			return
		}
	}

	// 保存処理の後、常にPDFファイルを直接レスポンスとして返す
	c.Header("Content-Type", "application/pdf")
	c.Header("Content-Disposition", fmt.Sprintf("attachment; filename=%s", filename))
	c.Header("Content-Length", fmt.Sprintf("%d", buf.Len()))
	c.Data(200, "application/pdf", buf.Bytes())
}
