package handlers

import (
	"net/http"
	"strconv"

	"line-estimate-backend/models"
	"line-estimate-backend/utils"

	"github.com/gin-gonic/gin"
)

// GetEstimates godoc
// @Summary 見積もり一覧を取得
// @Description すべての見積もりを取得します
// @Tags Estimates
// @Accept json
// @Produce json
// @Success 200 {object} utils.Response{data=map[string]interface{}}
// @Router /api/v1/estimates/ [get]
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

// CreateEstimate godoc
// @Summary 見積もりを作成
// @Description 新しい見積もりを作成します
// @Tags Estimates
// @Accept json
// @Produce json
// @Param estimate body models.CreateEstimateRequest true "見積もり情報"
// @Success 201 {object} utils.Response{data=models.Estimate}
// @Failure 400 {object} utils.ErrorResponse
// @Router /api/v1/estimates/ [post]
func CreateEstimate(c *gin.Context) {
	var req models.CreateEstimateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
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

// GetEstimate godoc
// @Summary 見積もりを取得
// @Description IDを指定して見積もりを取得します
// @Tags Estimates
// @Accept json
// @Produce json
// @Param id path int true "見積もりID"
// @Success 200 {object} utils.Response{data=models.Estimate}
// @Failure 400 {object} utils.ErrorResponse
// @Router /api/v1/estimates/{id} [get]
func GetEstimate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid estimate ID")
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

// UpdateEstimate godoc
// @Summary 見積もりを更新
// @Description 指定したIDの見積もりを更新します
// @Tags Estimates
// @Accept json
// @Produce json
// @Param id path int true "見積もりID"
// @Param estimate body models.UpdateEstimateRequest true "更新する見積もり情報"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.ErrorResponse
// @Router /api/v1/estimates/{id} [put]
func UpdateEstimate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid estimate ID")
		return
	}

	var req models.UpdateEstimateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// TODO: データベースで見積もり更新
	utils.SuccessResponse(c, gin.H{
		"message": "Estimate updated successfully",
		"id":      id,
	})
}

// DeleteEstimate godoc
// @Summary 見積もりを削除
// @Description 指定したIDの見積もりを削除します
// @Tags Estimates
// @Accept json
// @Produce json
// @Param id path int true "見積もりID"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.ErrorResponse
// @Router /api/v1/estimates/{id} [delete]
func DeleteEstimate(c *gin.Context) {
	id, err := strconv.Atoi(c.Param("id"))
	if err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, "Invalid estimate ID")
		return
	}

	// TODO: データベースから見積もり削除
	utils.SuccessResponse(c, gin.H{
		"message": "Estimate deleted successfully",
		"id":      id,
	})
}

// GetProfile godoc
// @Summary ユーザープロフィールを取得
// @Description 現在のユーザー情報を取得します
// @Tags Users
// @Accept json
// @Produce json
// @Success 200 {object} utils.Response{data=models.User}
// @Router /api/v1/users/profile [get]
func GetProfile(c *gin.Context) {
	// userID := c.GetFloat64("userID")

	// TODO: データベースからユーザー情報取得
	user := models.User{
		Email: "test@example.com",
		Name:  "Test User",
	}

	utils.SuccessResponse(c, user)
}

// UpdateProfile godoc
// @Summary ユーザープロフィールを更新
// @Description ユーザー情報を更新します
// @Tags Users
// @Accept json
// @Produce json
// @Param user body models.UpdateUserRequest true "更新するユーザー情報"
// @Success 200 {object} utils.Response
// @Failure 400 {object} utils.ErrorResponse
// @Router /api/v1/users/profile [put]
func UpdateProfile(c *gin.Context) {
	// userID := c.GetFloat64("userID")

	var req struct {
		Name string `json:"name" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		utils.SendErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// TODO: データベースでユーザー情報更新
	utils.SuccessResponse(c, gin.H{
		"message": "Profile updated successfully",
		"name":    req.Name,
	})
}
