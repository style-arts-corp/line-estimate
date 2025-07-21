package utils

import (
	"encoding/json"
	"io"
	"log"
	"os"

	"github.com/gin-gonic/gin"
)

// Logger is a global logger instance
var Logger = log.New(os.Stdout, "[LINE-ESTIMATE] ", log.LstdFlags|log.Lshortfile)

// Response is the standard API response structure
// @Description Standard API response structure
type Response struct {
	Success bool        `json:"success" example:"true"`
	Message string      `json:"message,omitempty" example:"成功しました"`
	Data    interface{} `json:"data,omitempty" swaggertype:"object"`
	Error   string      `json:"error,omitempty" example:"エラーメッセージ"`
}

// ErrorResponse is the standard error response structure
// @Description Standard error response structure
type ErrorResponse struct {
	Success bool   `json:"success" example:"false"`
	Error   string `json:"error" example:"エラーが発生しました"`
}

func SuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(200, Response{
		Success: true,
		Data:    data,
	})
}

func SendErrorResponse(c *gin.Context, statusCode int, message string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error:   message,
	})
}

// ParseJSON parses JSON from an io.Reader into a struct
func ParseJSON(reader io.Reader, v interface{}) error {
	decoder := json.NewDecoder(reader)
	return decoder.Decode(v)
}
