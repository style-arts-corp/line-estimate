package models

import (
	"time"
)

type User struct {
	Name      string     `json:"name" gorm:"not null"`
	Address   string     `json:"address"`
	Phone     string     `json:"phone"`
	Email      string `json:"email" gorm:"uniqueIndex;not null"`
	DisposeDate string `json:"dispose_date"` // Format: yyyy/mmdd
}
