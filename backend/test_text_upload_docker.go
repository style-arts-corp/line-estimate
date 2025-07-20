package main

import (
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"line-estimate-backend/services"
)

func main() {
	fmt.Println("=== Text Upload Test (Docker Environment) ===")

	// .envファイルを読み込み
	if err := godotenv.Load(); err != nil {
		log.Printf("Error loading .env file: %v\n", err)
	}

	// テキストコンテンツを作成
	textContent := []byte("This is a test text file from Docker environment at " + time.Now().String())
	
	fmt.Printf("Text content size: %d bytes\n", len(textContent))

	// Google Driveサービスを初期化
	driveService, err := services.NewDriveService()
	if err != nil {
		fmt.Printf("Error initializing Drive service: %v\n", err)
		return
	}

	fmt.Println("Drive service initialized successfully")

	// テキストファイルをアップロード
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("test_text_docker_%s.txt", timestamp)

	fmt.Printf("Uploading text file: %s\n", filename)

	uploadedFile, err := driveService.UploadFile(filename, "text/plain", textContent)
	if err != nil {
		fmt.Printf("Error uploading text file: %v\n", err)
		return
	}

	fmt.Printf("Success! Text file uploaded: %s (ID: %s)\n", uploadedFile.Name, uploadedFile.Id)
	fmt.Printf("URL: https://drive.google.com/file/d/%s/view\n", uploadedFile.Id)
}