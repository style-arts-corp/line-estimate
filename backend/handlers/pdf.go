package handlers

import (
	"bytes"
	_ "embed"
	"fmt"
	"math"
	"os"
	"path/filepath"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/signintech/gopdf"
	"line-estimate-backend/models"
	"line-estimate-backend/services"
	"line-estimate-backend/utils"
)

//go:embed NotoSansJP-Regular.ttf
var notoSansJPFont []byte

// loadJapaneseFont loads Japanese font for PDF
func loadJapaneseFont(pdf *gopdf.GoPdf) error {
	// Use embedded font
	fontErr := pdf.AddTTFFontData("noto-sans", notoSansJPFont)
	if fontErr != nil {
		return fmt.Errorf("embedded font loading failed: %v", fontErr)
	}
	return nil
}

// GenerateEstimatePDF generates an estimate PDF from the provided data
// This is an internal function, not exposed as an API endpoint
func GenerateEstimatePDF(estimate *models.PDFEstimate) (*gopdf.GoPdf, error) {
	// Create a new PDF document
	pdf := &gopdf.GoPdf{}
	pdf.Start(gopdf.Config{PageSize: *gopdf.PageSizeA4})

	// Load Japanese font
	if err := loadJapaneseFont(pdf); err != nil {
		return nil, err
	}

	// First page
	pdf.AddPage()

	// Create helper
	helper := utils.NewPDFHelper(pdf)

	// Draw header
	if err := helper.DrawHeader(estimate); err != nil {
		return nil, err
	}

	// Draw customer info
	if err := helper.DrawCustomerInfo(estimate); err != nil {
		return nil, err
	}

	// Draw title
	if err := helper.DrawTitle(estimate.Title); err != nil {
		return nil, err
	}

	// Draw items table (now includes totals)
	tableEndY, err := helper.DrawTable(estimate, 320)
	if err != nil {
		return nil, err
	}

	// Draw remarks
	if len(estimate.Remarks) > 0 {
		if err := helper.DrawRemarks(estimate.Remarks, tableEndY+20); err != nil {
			return nil, err
		}
	}

	// Second page (for company seal)
	pdf.AddPage()
	if err := pdf.SetFont("noto-sans", "", 10); err != nil {
		return nil, err
	}

	// Draw "社印" label with border
	// First, measure text dimensions
	textStr := "社印"
	textWidth, _ := pdf.MeasureTextWidth(textStr)

	// Define box dimensions as a square
	boxSize := 40.0 // Larger square

	// Position the box centered above the seal area
	sealBoxX := 430.0
	sealBoxWidth := 100.0
	boxX := sealBoxX + (sealBoxWidth-boxSize)/2
	boxY := 75.0 // Above the seal box

	// Draw white-filled square with black border
	pdf.SetLineWidth(1.0)
	pdf.SetStrokeColor(0, 0, 0)     // Black border
	pdf.SetFillColor(255, 255, 255) // White fill
	pdf.RectFromUpperLeftWithStyle(boxX, boxY, boxSize, boxSize, "FD")

	// Calculate text position to center it in the box
	// For vertical centering, we need to account for font baseline
	fontSize := 10.0
	textX := boxX + (boxSize-textWidth)/2
	textY := boxY + (boxSize / 2) + (fontSize / 3) // Approximate centering

	// Draw the text
	pdf.SetX(textX)
	pdf.SetY(textY)
	pdf.SetTextColor(0, 0, 0) // Black text
	pdf.Cell(nil, textStr)

	// Draw box for seal
	pdf.SetLineWidth(0.5)
	pdf.Rectangle(430, 120, 100, 100, "D", 0, 0)

	return pdf, nil
}

// CreateEstimatePDF godoc
// @Summary 見積もりPDFを生成
// @Description 見積もり情報からPDFを生成します
// @Tags Estimates
// @Accept json
// @Produce application/pdf
// @Param estimate body models.PDFEstimateRequest true "見積もり情報"
// @Success 200 {file} binary
// @Failure 400 {object} utils.ErrorResponse
// @Failure 500 {object} utils.ErrorResponse
// @Router /api/v1/estimates/pdf [post]
func CreateEstimatePDF(c *gin.Context) {
	var request models.PDFEstimateRequest
	if err := c.ShouldBindJSON(&request); err != nil {
		utils.SendErrorResponse(c, 400, "無効なリクエストデータ: "+err.Error())
		return
	}

	// Convert request to PDFEstimate format
	now := time.Now().In(time.FixedZone("JST", 9*60*60))
	estimate := models.PDFEstimate{
		EstimateNo: fmt.Sprintf("EST-%s-%03d", now.Format("20060102"), 1),
		IssueDate:  now,
		Customer: models.PDFCustomerInfo{
			CompanyName: request.Customer.Name,
			PostalCode:  "000-0000", // デフォルト値
			Address:     request.Customer.Address,
			Tel:         request.Customer.Phone,
			Fax:         "", // デフォルト値
		},
		Recipient: request.Customer.Name + " 様",
		Title:     "廃棄物処理に関する見積書",
		Items:     []models.PDFLineItem{},
		Remarks: []string{
			"※お見積もりの有効期限は発行日より1ヶ月となります。",
			"※実際の廃棄物量により金額が変更となる場合がございます。",
			"※お支払い条件：作業完了後、請求書発行日より30日以内",
		},
	}

	// Convert items
	var subTotal float64
	for _, item := range request.Items {
		pdfItem := models.PDFLineItem{
			Description: item.ID,
			Quantity:    item.Quantity,
			UnitPrice:   item.CustomPrice,
			Amount:      item.Amount,
		}
		estimate.Items = append(estimate.Items, pdfItem)
		subTotal += item.Amount
	}

	// Calculate totals
	estimate.SubTotal = subTotal
	estimate.TaxRate = 0.10
	estimate.Tax = math.Floor(subTotal * estimate.TaxRate)
	estimate.Total = subTotal + estimate.Tax

	// Generate PDF
	pdf, err := GenerateEstimatePDF(&estimate)
	if err != nil {
		utils.SendErrorResponse(c, 500, "PDF生成に失敗しました: "+err.Error())
		return
	}

	// Generate unique filename with timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("estimate_%s_%s.pdf", estimate.EstimateNo, timestamp)

	// PDFをバイト配列に変換
	var buf bytes.Buffer
	if err := pdf.Write(&buf); err != nil {
		utils.SendErrorResponse(c, 500, "PDFの書き込みに失敗しました: "+err.Error())
		return
	}

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

// CreatePDF godoc
// @Summary テストPDFを生成
// @Description 開発用のテストPDFを生成します
// @Tags Development
// @Accept json
// @Produce application/pdf
// @Success 200 {file} binary
// @Failure 500 {object} utils.ErrorResponse
// @Router /dev/create-pdf [get]
func CreatePDF(c *gin.Context) {
	// Create test estimate data
	testEstimate := &models.PDFEstimate{
		EstimateNo: "EST-20250425-001",
		IssueDate:  time.Now().In(time.FixedZone("JST", 9*60*60)),
		Customer: models.PDFCustomerInfo{
			CompanyName: "株式会社丸井",
			PostalCode:  "123-4567",
			Address:     "東京都新宿区○○1-2-3",
			Tel:         "03-1234-5678",
			Fax:         "03-8765-4321",
		},
		Recipient: "佐藤 様",
		Title:     "廃棄物処理に関する見積書",
		Items: []models.PDFLineItem{
			{
				Description: "オフィスチェア",
				Quantity:    10,
				UnitPrice:   1500,
				Amount:      15000,
			},
			{
				Description: "会議用テーブル",
				Quantity:    3,
				UnitPrice:   4000,
				Amount:      12000,
			},
			{
				Description: "収集運搬費",
				Quantity:    1,
				UnitPrice:   20000,
				Amount:      20000,
			},
		},
		SubTotal: 47000,
		TaxRate:  0.10,
		Tax:      4700,
		Total:    51700,
		Remarks: []string{
			"※お見積もりの有効期限は発行日より1ヶ月となります。",
			"※実際の廃棄物量により金額が変更となる場合がございます。",
			"※お支払い条件：作業完了後、請求書発行日より30日以内",
		},
	}

	// Generate PDF
	pdf, err := GenerateEstimatePDF(testEstimate)
	if err != nil {
		utils.SendErrorResponse(c, 500, "PDF生成に失敗しました: "+err.Error())
		return
	}

	// Generate unique filename with timestamp
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("test_estimate_%s.pdf", timestamp)

	// PDFをバイト配列に変換
	var buf bytes.Buffer
	if err := pdf.Write(&buf); err != nil {
		utils.SendErrorResponse(c, 500, "PDFの書き込みに失敗しました: "+err.Error())
		return
	}

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
