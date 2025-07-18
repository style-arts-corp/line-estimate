package main

import (
	"log"
	"os"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"line-estimate-backend/handlers"
	"line-estimate-backend/middleware"
)

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

	// CORS設定
	r.Use(middleware.CORSMiddleware())

	// ヘルスチェック
	r.GET("/health", handlers.HealthCheck)

	// 開発用エンドポイント
	dev := r.Group("/dev")
	{
		dev.GET("/create-pdf", handlers.CreatePDF)
	}

	// API v1 ルートグループ
	v1 := r.Group("/api/v1")
	{
		// 認証不要エンドポイント
		auth := v1.Group("/auth")
		{
			auth.POST("/login", handlers.Login)
			auth.POST("/register", handlers.Register)
		}

		// 認証必要エンドポイント
		protected := v1.Group("/")
		protected.Use(middleware.AuthMiddleware())
		{
			// 見積もり関連
			estimates := protected.Group("/estimates")
			{
				estimates.GET("/", handlers.GetEstimates)
				estimates.POST("/", handlers.CreateEstimate)
				estimates.GET("/:id", handlers.GetEstimate)
				estimates.PUT("/:id", handlers.UpdateEstimate)
				estimates.DELETE("/:id", handlers.DeleteEstimate)
				estimates.POST("/pdf", handlers.CreateEstimatePDF) // 一時的にコメントアウト
			}

			// ユーザー関連
			users := protected.Group("/users")
			{
				users.GET("/profile", handlers.GetProfile)
				users.PUT("/profile", handlers.UpdateProfile)
			}
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
