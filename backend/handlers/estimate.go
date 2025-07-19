package handlers

import (
	"net/http"
	"strconv"

	"line-estimate-backend/models"
	"line-estimate-backend/utils"

	"github.com/gin-gonic/gin"
)

func GetEstimates(c *gin.Context) {
	// TODO: データベースから見積もり一覧取得
	estimates := []models.Estimate{
		{
			ID:          1,
			UserID:      1,
			Title:       "Webアプリケーション開発",
			Description: "React + Node.js",
			TotalLines:  5000,
			HourlyRate:  8000,
			TotalCost:   400000,
			Status:      "completed",
		},
	}

	utils.SuccessResponse(c, gin.H{
		"estimates": estimates,
		"total":     len(estimates),
	})
}

func CreateEstimate(c *gin.Context) {
	var req models.CreateEstimateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	userID := c.GetFloat64("userID")

	// 総コスト計算（簡単な例：1行あたり0.1時間として計算）
	estimatedHours := float64(req.TotalLines) * 0.1
	totalCost := estimatedHours * req.HourlyRate

	estimate := models.Estimate{
		ID:          2,
		UserID:      uint(userID),
		Title:       req.Title,
		Description: req.Description,
		TotalLines:  req.TotalLines,
		HourlyRate:  req.HourlyRate,
		TotalCost:   totalCost,
		Status:      "draft",
	}

	// TODO: データベースに保存

	utils.SuccessResponse(c, estimate)
}

func GetEstimate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid estimate ID")
		return
	}

	// TODO: データベースから特定の見積もり取得
	estimate := models.Estimate{
		ID:          uint(id),
		UserID:      1,
		Title:       "Webアプリケーション開発",
		Description: "React + Node.js",
		TotalLines:  5000,
		HourlyRate:  8000,
		TotalCost:   400000,
		Status:      "completed",
	}

	utils.SuccessResponse(c, estimate)
}

func UpdateEstimate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid estimate ID")
		return
	}

	var req models.UpdateEstimateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// TODO: データベースで見積もり更新
	utils.SuccessResponse(c, gin.H{
		"message": "Estimate updated successfully",
		"id":      id,
	})
}

func DeleteEstimate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "Invalid estimate ID")
		return
	}

	// TODO: データベースから見積もり削除
	utils.SuccessResponse(c, gin.H{
		"message": "Estimate deleted successfully",
		"id":      id,
	})
}

func GetProfile(c *gin.Context) {
	// userID := c.GetFloat64("userID")

	// TODO: データベースからユーザー情報取得
	user := models.User{
		Email: "test@example.com",
		Name:  "Test User",
	}

	utils.SuccessResponse(c, user)
}

func UpdateProfile(c *gin.Context) {
	// userID := c.GetFloat64("userID")

	var req struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// TODO: データベースでユーザー情報更新
	utils.SuccessResponse(c, gin.H{
		"message": "Profile updated successfully",
		"name":    req.Name,
	})
}
