package handlers

import (
	"net/http"
	"os"
	"strconv"

	"line-estimate-backend/utils"

	"github.com/gin-gonic/gin"
)

// Category represents a category with items
type CategoryResponse struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Items    []Item `json:"items"`
	Hiragana string `json:"-"` // Internal field for sorting, not exposed in JSON
}

// Item represents an item within a category
type Item struct {
	ID       string `json:"id"`
	Name     string `json:"name"`
	Price    int    `json:"price"`
	Category string `json:"category"`
	Hiragana string `json:"-"` // Internal field for sorting, not exposed in JSON
}

// GetCategories godoc
// @Summary カテゴリー一覧を取得
// @Description 商品カテゴリーとアイテムの一覧を取得します
// @Tags Categories
// @Accept json
// @Produce json
// @Param sort query bool false "ひらがなでソートするかどうか"
// @Success 200 {object} utils.Response{data=map[string]interface{}}
// @Router /api/v1/categories [get]
func GetCategories(c *gin.Context) {
	// Check if sort parameter is provided
	sort := c.DefaultQuery("sort", "false") == "true"

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
		// Use mock data for development
		categories = getMockCategories()
	}

	if sort {
		// Create flat list of all items sorted by hiragana
		allItems := sortAllItemsByHiragana(categories)
		utils.SuccessResponse(c, gin.H{
			"items":  allItems,
			"source": getDataSource(useGoogleSheets),
			"sorted": sort,
		})
		return // End function execution here when sort=true
	}

	utils.SuccessResponse(c, gin.H{
		"categories": categories,
		"source":     getDataSource(useGoogleSheets),
		"sorted":     sort,
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
	url := "https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetID + "/values/categories_data!A1:F?key=" + apiKey

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

	// Skip header row (first row) for data processing
	dataRows := data.Values
	if len(dataRows) > 0 {
		dataRows = dataRows[1:] // Remove header row
	}

	// Transform data to categories
	categories := transformRowsToCategories(dataRows)

	return categories, nil
}

// transformRowsToCategories transforms Google Sheets rows to categories
func transformRowsToCategories(rows [][]string) []CategoryResponse {
	categoryMap := make(map[string]*CategoryResponse)

	for _, row := range rows {
		if len(row) < 6 { // Expecting 6 columns
			continue
		}

		categoryID := row[0]
		categoryName := row[1]
		itemID := row[2]
		itemName := row[3]
		itemNameHiragana := row[4]       // Column E - hiragana (for items)
		price, _ := strconv.Atoi(row[5]) // Parse price from column F

		// Get or create category
		if _, exists := categoryMap[categoryID]; !exists {
			categoryMap[categoryID] = &CategoryResponse{
				ID:       categoryID,
				Name:     categoryName,
				Items:    []Item{},
				Hiragana: categoryName, // Category name for reference (not used for sorting)
			}
		}

		// Add item to category
		categoryMap[categoryID].Items = append(categoryMap[categoryID].Items, Item{
			ID:       itemID,
			Name:     itemName,
			Price:    price,
			Category: categoryID,
			Hiragana: itemNameHiragana, // Use hiragana from column E
		})
	}

	// Convert map to slice
	categories := make([]CategoryResponse, 0, len(categoryMap))
	for _, category := range categoryMap {
		categories = append(categories, *category)
	}

	return categories
}

// sortAllItemsByHiragana collects all items from all categories and sorts them by hiragana
func sortAllItemsByHiragana(categories []CategoryResponse) []Item {
	// Collect all items from all categories
	var allItems []Item
	for _, category := range categories {
		allItems = append(allItems, category.Items...)
	}

	// Sort all items by hiragana using bubble sort
	for i := 0; i < len(allItems)-1; i++ {
		for j := i + 1; j < len(allItems); j++ {
			if allItems[i].Hiragana > allItems[j].Hiragana {
				allItems[i], allItems[j] = allItems[j], allItems[i]
			}
		}
	}

	return allItems
}

// getMockCategories returns mock data for development
func getMockCategories() []CategoryResponse {
	return []CategoryResponse{
		{
			ID:       "chairs",
			Name:     "椅子",
			Hiragana: "いす",
			Items: []Item{
				{ID: "pipe-chair", Name: "パイプ椅子", Price: 500, Category: "chairs", Hiragana: "ぱいぷいす"},
				{ID: "office-chair", Name: "オフィスチェア", Price: 800, Category: "chairs", Hiragana: "おふぃすちぇあ"},
				{ID: "sofa-1p", Name: "ソファー（1人掛け）", Price: 2000, Category: "chairs", Hiragana: "そふぁーひとりがけ"},
				{ID: "sofa-2p", Name: "ソファー（2人掛け）", Price: 3000, Category: "chairs", Hiragana: "そふぁーふたりがけ"},
				{ID: "sofa-3p", Name: "ソファー（3人掛け）", Price: 4000, Category: "chairs", Hiragana: "そふぁーさんにんがけ"},
			},
		},
		{
			ID:       "tables",
			Name:     "机・テーブル",
			Hiragana: "つくえてーぶる",
			Items: []Item{
				{ID: "work-desk", Name: "事務机", Price: 1500, Category: "tables", Hiragana: "じむづくえ"},
				{ID: "dining-table", Name: "ダイニングテーブル", Price: 2500, Category: "tables", Hiragana: "だいにんぐてーぶる"},
				{ID: "coffee-table", Name: "コーヒーテーブル", Price: 1000, Category: "tables", Hiragana: "こーひーてーぶる"},
				{ID: "side-table", Name: "サイドテーブル", Price: 700, Category: "tables", Hiragana: "さいどてーぶる"},
			},
		},
		{
			ID:       "cabinets",
			Name:     "タンス・収納",
			Hiragana: "たんすしゅうのう",
			Items: []Item{
				{ID: "clothes-cabinet", Name: "洋服タンス", Price: 3000, Category: "cabinets", Hiragana: "ようふくたんす"},
				{ID: "bookshelf", Name: "本棚", Price: 1500, Category: "cabinets", Hiragana: "ほんだな"},
				{ID: "tv-stand", Name: "テレビ台", Price: 2000, Category: "cabinets", Hiragana: "てれびだい"},
				{ID: "chest", Name: "引き出し（4段）", Price: 2500, Category: "cabinets", Hiragana: "ひきだしよんだん"},
			},
		},
		{
			ID:       "appliances",
			Name:     "家電製品",
			Hiragana: "かでんせいひん",
			Items: []Item{
				{ID: "tv", Name: "テレビ", Price: 3500, Category: "appliances", Hiragana: "てれび"},
				{ID: "refrigerator", Name: "冷蔵庫", Price: 5000, Category: "appliances", Hiragana: "れいぞうこ"},
				{ID: "washing-machine", Name: "洗濯機", Price: 4000, Category: "appliances", Hiragana: "せんたくき"},
				{ID: "microwave", Name: "電子レンジ", Price: 2000, Category: "appliances", Hiragana: "でんしれんじ"},
			},
		},
		{
			ID:       "beds",
			Name:     "ベッド・寝具",
			Hiragana: "べっどしんぐ",
			Items: []Item{
				{ID: "single-bed", Name: "シングルベッド", Price: 3000, Category: "beds", Hiragana: "しんぐるべっど"},
				{ID: "double-bed", Name: "ダブルベッド", Price: 4500, Category: "beds", Hiragana: "だぶるべっど"},
				{ID: "mattress", Name: "マットレス", Price: 2000, Category: "beds", Hiragana: "まっとれす"},
				{ID: "futon", Name: "布団", Price: 1500, Category: "beds", Hiragana: "ふとん"},
			},
		},
		{
			ID:       "other",
			Name:     "その他",
			Hiragana: "そのた",
			Items: []Item{
				{ID: "other-small", Name: "その他（小）", Price: 500, Category: "other", Hiragana: "そのたしょう"},
				{ID: "other-medium", Name: "その他（中）", Price: 1500, Category: "other", Hiragana: "そのたちゅう"},
				{ID: "other-large", Name: "その他（大）", Price: 3000, Category: "other", Hiragana: "そのただい"},
				{ID: "other-custom", Name: "その他（カスタム）", Price: 0, Category: "other", Hiragana: "そのたかすたむ"},
			},
		},
	}
}

// getDataSource returns the data source string for response
func getDataSource(useGoogleSheets bool) string {
	if useGoogleSheets {
		return "google_sheets"
	}
	return "mock_data"
}
