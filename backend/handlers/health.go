package handlers

import (
	"line-estimate-backend/utils"

	"github.com/gin-gonic/gin"
)

func HealthCheck(c *gin.Context) {
	utils.SuccessResponse(c, gin.H{
		"status":  "ok",
		"message": "API is running",
	})
}
