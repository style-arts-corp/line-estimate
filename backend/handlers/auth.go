package handlers

import (
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"

	"line-estimate-backend/config"
	"line-estimate-backend/models"
	"line-estimate-backend/utils"
)

func Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// TODO: データベースからユーザー検索
	// 仮実装：ハードコードされたユーザー
	if req.Email == "test@example.com" && req.Password == "password123" {
		token, err := generateJWT(1, req.Email)
		if err != nil {
			utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token")
			return
		}

		user := models.User{
			ID:    1,
			Email: req.Email,
			Name:  "Test User",
		}

		utils.SuccessResponse(c, models.LoginResponse{
			Token: token,
			User:  user,
		})
		return
	}

	utils.ErrorResponse(c, http.StatusUnauthorized, "Invalid credentials")
}

func Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, err.Error())
		return
	}

	// パスワードハッシュ化
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to hash password")
		return
	}

	// TODO: データベースにユーザー保存
	user := models.User{
		ID:       2,
		Email:    req.Email,
		Password: string(hashedPassword),
		Name:     req.Name,
	}

	token, err := generateJWT(user.ID, user.Email)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "Failed to generate token")
		return
	}

	utils.SuccessResponse(c, models.LoginResponse{
		Token: token,
		User:  user,
	})
}

func generateJWT(userID uint, email string) (string, error) {
	claims := jwt.MapClaims{
		"userID": userID,
		"email":  email,
		"exp":    time.Now().Add(time.Hour * 24).Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(config.GetConfig().JWTSecret))
}
