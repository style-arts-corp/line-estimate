package services

import (
	"bytes"
	"context"
	"fmt"
	"os"
	"strings"

	"golang.org/x/oauth2/google"
	"google.golang.org/api/drive/v3"
	"google.golang.org/api/option"
)

type DriveService struct {
	service *drive.Service
	ctx     context.Context
}

func NewDriveService() (*DriveService, error) {
	ctx := context.Background()

	// サービスアカウントキーの環境変数から取得
	serviceAccountKey := os.Getenv("GOOGLE_SERVICE_ACCOUNT_KEY")
	if serviceAccountKey == "" {
		return nil, fmt.Errorf("GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set")
	}

	var jsonCredentials []byte
	var err error

	// ファイルパスかJSONかを判定
	if strings.HasPrefix(serviceAccountKey, "{") {
		// JSON文字列の場合
		jsonCredentials = []byte(serviceAccountKey)
	} else {
		// ファイルパスの場合
		jsonCredentials, err = os.ReadFile(serviceAccountKey)
		if err != nil {
			return nil, fmt.Errorf("unable to read service account key file: %v", err)
		}
	}

	// サービスアカウントの認証情報を作成
	config, err := google.JWTConfigFromJSON(jsonCredentials, drive.DriveScope)
	if err != nil {
		return nil, fmt.Errorf("unable to parse service account key: %v", err)
	}

	// 認証済みHTTPクライアントを作成
	client := config.Client(ctx)

	// Google Driveサービスを初期化
	srv, err := drive.NewService(ctx, option.WithHTTPClient(client))
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve Drive service: %v", err)
	}

	return &DriveService{
		service: srv,
		ctx:     ctx,
	}, nil
}

// UploadFile uploads a file to Google Drive
func (ds *DriveService) UploadFile(fileName string, mimeType string, data []byte) (*drive.File, error) {
	// PDFフォルダIDを環境変数から取得（オプション）
	folderID := os.Getenv("GOOGLE_DRIVE_FOLDER_ID")

	// ファイルメタデータを作成
	driveFile := &drive.File{
		Name: fileName,
	}

	// フォルダIDが指定されている場合、そのフォルダに保存
	if folderID != "" {
		driveFile.Parents = []string{folderID}
	}

	// ファイルをアップロード
	uploadedFile, err := ds.service.Files.Create(driveFile).
		Media(bytes.NewReader(data)).
		Do()
	if err != nil {
		return nil, fmt.Errorf("unable to upload file: %v", err)
	}

	return uploadedFile, nil
}

// ListFiles lists files in Google Drive
func (ds *DriveService) ListFiles(pageSize int64) ([]*drive.File, error) {
	r, err := ds.service.Files.List().
		PageSize(pageSize).
		Fields("nextPageToken, files(id, name, mimeType, createdTime)").
		Do()
	if err != nil {
		return nil, fmt.Errorf("unable to retrieve files: %v", err)
	}

	return r.Files, nil
}

// DeleteFile deletes a file from Google Drive
func (ds *DriveService) DeleteFile(fileID string) error {
	err := ds.service.Files.Delete(fileID).Do()
	if err != nil {
		return fmt.Errorf("unable to delete file: %v", err)
	}
	return nil
}

// GetFileInfo gets file information by ID
func (ds *DriveService) GetFileInfo(fileID string) (*drive.File, error) {
	file, err := ds.service.Files.Get(fileID).
		Fields("id, name, mimeType, size, createdTime, modifiedTime").
		Do()
	if err != nil {
		return nil, fmt.Errorf("unable to get file info: %v", err)
	}
	return file, nil
}

// CreateFolder creates a new folder in Google Drive
func (ds *DriveService) CreateFolder(folderName string, parentFolderID string) (*drive.File, error) {
	folder := &drive.File{
		Name:     folderName,
		MimeType: "application/vnd.google-apps.folder",
	}

	// 親フォルダが指定されている場合
	if parentFolderID != "" {
		folder.Parents = []string{parentFolderID}
	}

	createdFolder, err := ds.service.Files.Create(folder).Do()
	if err != nil {
		return nil, fmt.Errorf("unable to create folder: %v", err)
	}

	return createdFolder, nil
}