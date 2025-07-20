package main

import (
	"fmt"
	"log"
	"time"

	"github.com/joho/godotenv"
	"line-estimate-backend/services"
)

func main() {
	fmt.Println("=== PDF Upload Test (Local Environment) ===")

	// .envファイルを読み込み
	if err := godotenv.Load(); err != nil {
		log.Printf("Error loading .env file: %v\n", err)
	}

	// ダミーPDFコンテンツを作成（実際のPDFヘッダーを模倣）
	pdfContent := []byte("%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n184\n%%EOF")
	
	fmt.Printf("PDF content size: %d bytes\n", len(pdfContent))

	// Google Driveサービスを初期化
	driveService, err := services.NewDriveService()
	if err != nil {
		fmt.Printf("Error initializing Drive service: %v\n", err)
		return
	}

	fmt.Println("Drive service initialized successfully")

	// PDFをアップロード
	timestamp := time.Now().Format("20060102_150405")
	filename := fmt.Sprintf("test_pdf_local_%s.pdf", timestamp)

	fmt.Printf("Uploading PDF: %s\n", filename)

	uploadedFile, err := driveService.UploadFile(filename, "application/pdf", pdfContent)
	if err != nil {
		fmt.Printf("Error uploading PDF: %v\n", err)
		return
	}

	fmt.Printf("Success! PDF uploaded: %s (ID: %s)\n", uploadedFile.Name, uploadedFile.Id)
	fmt.Printf("URL: https://drive.google.com/file/d/%s/view\n", uploadedFile.Id)
}