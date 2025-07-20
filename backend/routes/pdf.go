package routes

import (
	"github.com/gin-gonic/gin"
	"line-estimate-backend/handlers"
)

// SetupPDFRoutes PDFに関連するルートを設定
func SetupPDFRoutes(r *gin.Engine) {
	// API グループ
	api := r.Group("/api")
	{
		// PDF関連のエンドポイント
		pdf := api.Group("/pdf")
		{
			// テスト用PDF生成（GET /api/pdf/test）
			pdf.POST("/test", handlers.CreatePDF)
			
			// 見積書PDF生成（POST /api/pdf/estimate）
			pdf.POST("/estimate", handlers.CreateEstimatePDF)
			
			// 作業指示書PDF生成（POST /api/pdf/instruction）
			pdf.POST("/instruction", handlers.CreateInstructionPDF)
		}
	}
}