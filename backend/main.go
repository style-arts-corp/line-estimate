package main

import (
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	swaggerFiles "github.com/swaggo/files"
	ginSwagger "github.com/swaggo/gin-swagger"

	_ "line-estimate-backend/docs"
	"line-estimate-backend/handlers"
)

// @title Line Estimate API
// @version 1.0
// @description 見積もり管理システムのAPI
// @termsOfService http://swagger.io/terms/

// @contact.name API Support
// @contact.url http://www.swagger.io/support
// @contact.email support@swagger.io

// @license.name Apache 2.0
// @license.url http://www.apache.org/licenses/LICENSE-2.0.html

// @host localhost:18080
// @BasePath /

func main() {
	// 環境変数の読み込み
	if err := godotenv.Load(); err != nil {
		// ファイルが存在しない場合とパースエラーを区別
		if strings.Contains(err.Error(), "no such file or directory") {
			log.Println(".envファイルが見つかりません（オプション）")
		} else if strings.Contains(err.Error(), "keys cannot contain new lines") {
			log.Printf("エラー: .envファイルの解析に失敗しました - %v", err)
			log.Println("環境変数のキーまたは値に改行文字が含まれている可能性があります")
		} else {
			log.Printf(".envファイルの読み込みエラー: %v", err)
		}
	}

	// Ginエンジンの初期化
	r := gin.Default()

	// CORS設定（簡易版）
	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "*")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Swagger UI
	r.GET("/swagger/*any", ginSwagger.WrapHandler(swaggerFiles.Handler))

	// ヘルスチェック
	r.GET("/health", handlers.HealthCheck)

	// 開発用エンドポイント
	dev := r.Group("/dev")
	{
		dev.GET("/create-pdf", handlers.CreatePDF)
		dev.GET("/create-instruction-pdf", handlers.CreateTestInstructionPDF)
	}

	// API v1 ルートグループ
	v1 := r.Group("/api/v1")
	{
		// カテゴリー関連
		v1.GET("/categories", handlers.GetCategories)

		// 見積もり関連
		estimates := v1.Group("/estimates")
		{
			estimates.GET("/", handlers.GetEstimates)
			estimates.POST("/", handlers.CreateEstimate)
			estimates.GET("/:id", handlers.GetEstimate)
			estimates.PUT("/:id", handlers.UpdateEstimate)
			estimates.DELETE("/:id", handlers.DeleteEstimate)
			estimates.POST("/pdf", handlers.CreateEstimatePDF)
		}

		// 指示書関連
		instructions := v1.Group("/instructions")
		{
			instructions.POST("/pdf", handlers.CreateInstructionPDF)
		}

		// ユーザー関連
		users := v1.Group("/users")
		{
			users.GET("/profile", handlers.GetProfile)
			users.PUT("/profile", handlers.UpdateProfile)
		}
	}

	// サーバー開始
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
