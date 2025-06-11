package models

import (
	"time"
)

type Estimate struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"user_id" gorm:"not null"`
	Title       string    `json:"title" gorm:"not null"`
	Description string    `json:"description"`
	TotalLines  int       `json:"total_lines"`
	HourlyRate  float64   `json:"hourly_rate"`
	TotalCost   float64   `json:"total_cost"`
	Status      string    `json:"status" gorm:"default:'draft'"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	User        User      `json:"user" gorm:"foreignKey:UserID"`
}

type CreateEstimateRequest struct {
	Title       string  `json:"title" binding:"required"`
	Description string  `json:"description"`
	TotalLines  int     `json:"total_lines" binding:"required,min=1"`
	HourlyRate  float64 `json:"hourly_rate" binding:"required,min=0"`
}

type UpdateEstimateRequest struct {
	Title       string  `json:"title"`
	Description string  `json:"description"`
	TotalLines  int     `json:"total_lines" binding:"min=1"`
	HourlyRate  float64 `json:"hourly_rate" binding:"min=0"`
	Status      string  `json:"status"`
}
