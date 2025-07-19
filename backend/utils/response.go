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

type Response struct {
	Success bool        `json:"success"`
	Message string      `json:"message,omitempty"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

func SuccessResponse(c *gin.Context, data interface{}) {
	c.JSON(200, Response{
		Success: true,
		Data:    data,
	})
}

func ErrorResponse(c *gin.Context, statusCode int, message string) {
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
