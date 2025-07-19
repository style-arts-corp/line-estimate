package handlers

import (
	"net/http"
	"os"
	"strconv"

	"github.com/gin-gonic/gin"
	"line-estimate-backend/utils"
)

// Category represents a category with items
type CategoryResponse struct {
	ID    string `json:"id"`
	Name  string `json:"name"`
	Items []Item `json:"items"`
}

// Item represents an item within a category
type Item struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Category string `json:"category"`
}

// GetCategories handles fetching categories based on environment
func GetCategories(c *gin.Context) {
	// Check if sort parameter is provided
	sortDesc := c.DefaultQuery("sort", "false") == "true"

	// Determine data source based on environment
	env := os.Getenv("GO_ENV")
	useGoogleSheets := env == "production"

	var categories []CategoryResponse
	var err error

	if useGoogleSheets {
		categories, err = fetchCategoriesFromGoogleSheets()
		if err != nil {
			// Log error but fallback to mock data
			utils.Logger.Printf("Google Sheets fetch failed, falling back to mock data: %v", err)
			categories = getMockCategories()
		}
	} else {
		categories = getMockCategories()
	}

	// Sort if requested
	if sortDesc {
		categories = sortCategoriesDescending(categories)
	}

	utils.SuccessResponse(c, gin.H{
		"categories": categories,
		"source":     getDataSource(useGoogleSheets),
		"sorted":     sortDesc,
	})
}

// fetchCategoriesFromGoogleSheets fetches data from Google Sheets
func fetchCategoriesFromGoogleSheets() ([]CategoryResponse, error) {
	// Get API key and spreadsheet ID from environment
	apiKey := os.Getenv("GOOGLE_SHEETS_API_KEY")
	spreadsheetID := os.Getenv("SPREADSHEET_ID")

	if apiKey == "" || spreadsheetID == "" {
		return nil, gin.Error{
			Err:  nil,
			Type: gin.ErrorTypePublic,
			Meta: "Google Sheets API key or Spreadsheet ID not configured",
		}
	}

	// Make HTTP request to Google Sheets API
	url := "https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetID + "/values/Sheet1!A2:E?key=" + apiKey

	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, gin.Error{
			Err:  nil,
			Type: gin.ErrorTypePublic,
			Meta: "HTTP error: " + strconv.Itoa(resp.StatusCode),
		}
	}

	// Parse JSON response
	var data struct {
		Values [][]string `json:"values"`
	}

	if err := utils.ParseJSON(resp.Body, &data); err != nil {
		return nil, err
	}

	// Transform data to categories
	return transformRowsToCategories(data.Values), nil
}

// transformRowsToCategories transforms Google Sheets rows to categories
func transformRowsToCategories(rows [][]string) []CategoryResponse {
	categoryMap := make(map[string]*CategoryResponse)

	for _, row := range rows {
		if len(row) < 5 {
			continue
		}

		categoryID := row[0]
		categoryName := row[1]
		itemID := row[2]
		itemName := row[3]
		price, _ := strconv.Atoi(row[4])

		// Get or create category
		if _, exists := categoryMap[categoryID]; !exists {
			categoryMap[categoryID] = &CategoryResponse{
				ID:    categoryID,
				Name:  categoryName,
				Items: []Item{},
			}
		}

		// Add item to category
		categoryMap[categoryID].Items = append(categoryMap[categoryID].Items, Item{
			ID:       itemID,
			Name:     itemName,
			Price:    price,
			Category: categoryID,
		})
	}

	// Convert map to slice
	categories := make([]CategoryResponse, 0, len(categoryMap))
	for _, category := range categoryMap {
		categories = append(categories, *category)
	}

	return categories
}

// getMockCategories returns mock data for development
func getMockCategories() []CategoryResponse {
	return []CategoryResponse{
		{
			ID:   "chairs",
			Name: "椅子",
			Items: []Item{
				{ID: "pipe-chair", Name: "パイプ椅子", Price: 500, Category: "chairs"},
				{ID: "office-chair", Name: "オフィスチェア", Price: 800, Category: "chairs"},
				{ID: "sofa-1p", Name: "ソファー（1人掛け）", Price: 2000, Category: "chairs"},
				{ID: "sofa-2p", Name: "ソファー（2人掛け）", Price: 3000, Category: "chairs"},
				{ID: "sofa-3p", Name: "ソファー（3人掛け）", Price: 4000, Category: "chairs"},
			},
		},
		{
			ID:   "tables",
			Name: "机・テーブル",
			Items: []Item{
				{ID: "work-desk", Name: "事務机", Price: 1500, Category: "tables"},
				{ID: "dining-table", Name: "ダイニングテーブル", Price: 2500, Category: "tables"},
				{ID: "coffee-table", Name: "コーヒーテーブル", Price: 1000, Category: "tables"},
				{ID: "side-table", Name: "サイドテーブル", Price: 700, Category: "tables"},
			},
		},
		{
			ID:   "cabinets",
			Name: "タンス・収納",
			Items: []Item{
				{ID: "clothes-cabinet", Name: "洋服タンス", Price: 3000, Category: "cabinets"},
				{ID: "bookshelf", Name: "本棚", Price: 1500, Category: "cabinets"},
				{ID: "tv-stand", Name: "テレビ台", Price: 2000, Category: "cabinets"},
				{ID: "chest", Name: "引き出し（4段）", Price: 2500, Category: "cabinets"},
			},
		},
		{
			ID:   "appliances",
			Name: "家電製品",
			Items: []Item{
				{ID: "tv", Name: "テレビ", Price: 3500, Category: "appliances"},
				{ID: "refrigerator", Name: "冷蔵庫", Price: 5000, Category: "appliances"},
				{ID: "washing-machine", Name: "洗濯機", Price: 4000, Category: "appliances"},
				{ID: "microwave", Name: "電子レンジ", Price: 2000, Category: "appliances"},
			},
		},
		{
			ID:   "beds",
			Name: "ベッド・寝具",
			Items: []Item{
				{ID: "single-bed", Name: "シングルベッド", Price: 3000, Category: "beds"},
				{ID: "double-bed", Name: "ダブルベッド", Price: 4500, Category: "beds"},
				{ID: "mattress", Name: "マットレス", Price: 2000, Category: "beds"},
				{ID: "futon", Name: "布団", Price: 1500, Category: "beds"},
			},
		},
		{
			ID:   "other",
			Name: "その他",
			Items: []Item{
				{ID: "other-small", Name: "その他（小）", Price: 500, Category: "other"},
				{ID: "other-medium", Name: "その他（中）", Price: 1500, Category: "other"},
				{ID: "other-large", Name: "その他（大）", Price: 3000, Category: "other"},
				{ID: "other-custom", Name: "その他（カスタム）", Price: 0, Category: "other"},
			},
		},
	}
}

// sortCategoriesDescending sorts items within each category by price (high to low)
func sortCategoriesDescending(categories []CategoryResponse) []CategoryResponse {
	result := make([]CategoryResponse, len(categories))

	for i, category := range categories {
		result[i] = CategoryResponse{
			ID:    category.ID,
			Name:  category.Name,
			Items: make([]Item, len(category.Items)),
		}

		copy(result[i].Items, category.Items)

		// Sort items by price (descending)
		for j := 0; j < len(result[i].Items)-1; j++ {
			for k := j + 1; k < len(result[i].Items); k++ {
				if result[i].Items[j].Price < result[i].Items[k].Price {
					result[i].Items[j], result[i].Items[k] = result[i].Items[k], result[i].Items[j]
				}
			}
		}
	}

	return result
}

// getDataSource returns the data source string for response
func getDataSource(useGoogleSheets bool) string {
	if useGoogleSheets {
		return "google_sheets"
	}
	return "mock_data"
}
