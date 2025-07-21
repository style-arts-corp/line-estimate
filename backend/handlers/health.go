package handlers

import (
	"line-estimate-backend/utils"

	"github.com/gin-gonic/gin"
)

// HealthCheck godoc
// @Summary ヘルスチェック
// @Description APIの動作状態を確認します
// @Tags System
// @Accept json
// @Produce json
// @Success 200 {object} utils.Response{data=map[string]string}
// @Router /health [get]
func HealthCheck(c *gin.Context) {
	utils.SuccessResponse(c, gin.H{
		"status":  "ok",
		"message": "API is running. API は正常に動作しています。",
	})
}
