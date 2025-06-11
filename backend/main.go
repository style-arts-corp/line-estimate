package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"

	"line-estimate-backend/handlers"
	"line-estimate-backend/middleware"
)

func main() {
	// 環境変数の読み込み
	if err := godotenv.Load(); err != nil {
		log.Println("No .env file found")
	}

	// Ginエンジンの初期化
	r := gin.Default()

	// CORS設定
	r.Use(middleware.CORSMiddleware())

	// ヘルスチェック
	r.GET("/health", handlers.HealthCheck)

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
