package handlers

import (
	"fmt"
	"net/http"
	"os"
	"strconv"
	"strings"

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
}

// GetCategories handles fetching categories based on environment
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
			// categories = getMockCategories()
			categories, err = fetchCategoriesFromGoogleSheets()
		}
	} else {
		// Use mock data for development
		categories = getMockCategories()
	}

	if sort {
		sortCategoriesInHiraganaOrder(categories)
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

	// Debug: Print configuration
	fmt.Printf("DEBUG: API Key: %s\n", apiKey)
	fmt.Printf("DEBUG: Spreadsheet ID: %s\n", spreadsheetID)

	if apiKey == "" || spreadsheetID == "" {
		return nil, gin.Error{
			Err:  nil,
			Type: gin.ErrorTypePublic,
			Meta: "Google Sheets API key or Spreadsheet ID not configured",
		}
	}

	// Make HTTP request to Google Sheets API
	url := "https://sheets.googleapis.com/v4/spreadsheets/" + spreadsheetID + "/values/categories_data!A1:F?key=" + apiKey
	fmt.Printf("DEBUG: Request URL: %s\n", url)

	resp, err := http.Get(url)
	if err != nil {
		fmt.Printf("DEBUG: HTTP request error: %v\n", err)
		return nil, err
	}
	defer resp.Body.Close()

	fmt.Printf("DEBUG: HTTP Status: %d\n", resp.StatusCode)

	if resp.StatusCode != http.StatusOK {
		// Read response body for error details
		body := make([]byte, 1024)
		n, _ := resp.Body.Read(body)
		fmt.Printf("DEBUG: Error response body: %s\n", string(body[:n]))

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
		fmt.Printf("DEBUG: JSON parse error: %v\n", err)
		return nil, err
	}

	fmt.Printf("DEBUG: Received %d rows from Google Sheets\n", len(data.Values))
	if len(data.Values) > 0 {
		fmt.Printf("DEBUG: Headers: %v\n", data.Values[0])
		if len(data.Values) > 1 {
			fmt.Printf("DEBUG: First data row example: %v\n", data.Values[1])
			fmt.Printf("DEBUG: Column mapping - F(price): %s\n", data.Values[1][5])
		}
	}

	// Skip header row (first row) for data processing
	dataRows := data.Values
	if len(dataRows) > 0 {
		dataRows = dataRows[1:] // Remove header row
	}

	// Transform data to categories
	categories := transformRowsToCategories(dataRows)
	fmt.Printf("DEBUG: Transformed to %d categories\n", len(categories))

	return categories, nil
}

// transformRowsToCategories transforms Google Sheets rows to categories
func transformRowsToCategories(rows [][]string) []CategoryResponse {
	categoryMap := make(map[string]*CategoryResponse)
	categoryHiraganaMap := make(map[string]string) // Track hiragana for each category

	for _, row := range rows {
		if len(row) < 6 { // Expecting 6 columns
			continue
		}

		categoryID := row[0]
		categoryName := row[1]
		itemID := row[2]
		itemName := row[3]
		// itemNameHiragana := row[4] // Column E - hiragana (for items)
		price, _ := strconv.Atoi(row[5]) // Parse price from column F

		// Extract category hiragana from category name using our conversion function
		if _, exists := categoryHiraganaMap[categoryID]; !exists {
			categoryHiragana := convertToHiragana(categoryName)
			categoryHiraganaMap[categoryID] = categoryHiragana
		}

		// Get or create category
		if _, exists := categoryMap[categoryID]; !exists {
			categoryMap[categoryID] = &CategoryResponse{
				ID:       categoryID,
				Name:     categoryName,
				Items:    []Item{},
				Hiragana: categoryHiraganaMap[categoryID],
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

	// Sort by Japanese hiragana order using stored hiragana
	sortCategoriesInHiraganaOrder(categories)

	return categories
}

// sortCategoriesInHiraganaOrder sorts categories by Japanese hiragana reading order
func sortCategoriesInHiraganaOrder(categories []CategoryResponse) {
	// Debug: Print hiragana values before sorting
	fmt.Printf("DEBUG: Before hiragana sorting:\n")
	for i, cat := range categories {
		fmt.Printf("  %d. %s -> '%s'\n", i+1, cat.Name, cat.Hiragana)
	}

	// Sort by hiragana reading using stored hiragana field
	for i := 0; i < len(categories)-1; i++ {
		for j := i + 1; j < len(categories); j++ {
			if categories[i].Hiragana > categories[j].Hiragana {
				categories[i], categories[j] = categories[j], categories[i]
			}
		}
	}

	// Debug: Print hiragana values after sorting
	fmt.Printf("DEBUG: After hiragana sorting:\n")
	for i, cat := range categories {
		fmt.Printf("  %d. %s -> '%s'\n", i+1, cat.Name, cat.Hiragana)
	}
}

// convertToHiragana converts Japanese text (kanji/katakana) to hiragana for sorting
func convertToHiragana(text string) string {
	// Convert katakana to hiragana
	hiraganaText := katakanaToHiragana(text)

	// Remove dots and special characters that might affect sorting
	result := strings.ReplaceAll(hiraganaText, "・", "")
	result = strings.ReplaceAll(result, "（", "")
	result = strings.ReplaceAll(result, "）", "")

	fmt.Printf("DEBUG: Converted '%s' -> '%s'\n", text, result)
	return result
}

// katakanaToHiragana converts katakana characters to hiragana
func katakanaToHiragana(text string) string {
	// Katakana to Hiragana mapping
	katakanaMap := map[rune]rune{
		'ア': 'あ', 'イ': 'い', 'ウ': 'う', 'エ': 'え', 'オ': 'お',
		'カ': 'か', 'キ': 'き', 'ク': 'く', 'ケ': 'け', 'コ': 'こ',
		'サ': 'さ', 'シ': 'し', 'ス': 'す', 'セ': 'せ', 'ソ': 'そ',
		'タ': 'た', 'チ': 'ち', 'ツ': 'つ', 'テ': 'て', 'ト': 'と',
		'ナ': 'な', 'ニ': 'に', 'ヌ': 'ぬ', 'ネ': 'ね', 'ノ': 'の',
		'ハ': 'は', 'ヒ': 'ひ', 'フ': 'ふ', 'ヘ': 'へ', 'ホ': 'ほ',
		'マ': 'ま', 'ミ': 'み', 'ム': 'む', 'メ': 'め', 'モ': 'も',
		'ヤ': 'や', 'ユ': 'ゆ', 'ヨ': 'よ',
		'ラ': 'ら', 'リ': 'り', 'ル': 'る', 'レ': 'れ', 'ロ': 'ろ',
		'ワ': 'わ', 'ヲ': 'を', 'ン': 'ん',
		'ガ': 'が', 'ギ': 'ぎ', 'グ': 'ぐ', 'ゲ': 'げ', 'ゴ': 'ご',
		'ザ': 'ざ', 'ジ': 'じ', 'ズ': 'ず', 'ゼ': 'ぜ', 'ゾ': 'ぞ',
		'ダ': 'だ', 'ヂ': 'ぢ', 'ヅ': 'づ', 'デ': 'で', 'ド': 'ど',
		'バ': 'ば', 'ビ': 'び', 'ブ': 'ぶ', 'ベ': 'べ', 'ボ': 'ぼ',
		'パ': 'ぱ', 'ピ': 'ぴ', 'プ': 'ぷ', 'ペ': 'ぺ', 'ポ': 'ぽ',
		'ャ': 'ゃ', 'ュ': 'ゅ', 'ョ': 'ょ',
		'ッ': 'っ',
		'ー': 'ー', // Long vowel mark stays the same
	}

	result := make([]rune, 0, len(text))
	for _, r := range text {
		if hiragana, exists := katakanaMap[r]; exists {
			result = append(result, hiragana)
		} else {
			result = append(result, r)
		}
	}

	return string(result)
}

// getMockCategories returns mock data for development
func getMockCategories() []CategoryResponse {
	return []CategoryResponse{
		{
			ID:       "chairs",
			Name:     "椅子",
			Hiragana: "いす",
			Items: []Item{
				{ID: "pipe-chair", Name: "パイプ椅子", Price: 500, Category: "chairs"},
				{ID: "office-chair", Name: "オフィスチェア", Price: 800, Category: "chairs"},
				{ID: "sofa-1p", Name: "ソファー（1人掛け）", Price: 2000, Category: "chairs"},
				{ID: "sofa-2p", Name: "ソファー（2人掛け）", Price: 3000, Category: "chairs"},
				{ID: "sofa-3p", Name: "ソファー（3人掛け）", Price: 4000, Category: "chairs"},
			},
		},
		{
			ID:       "tables",
			Name:     "机・テーブル",
			Hiragana: "つくえてーぶる",
			Items: []Item{
				{ID: "work-desk", Name: "事務机", Price: 1500, Category: "tables"},
				{ID: "dining-table", Name: "ダイニングテーブル", Price: 2500, Category: "tables"},
				{ID: "coffee-table", Name: "コーヒーテーブル", Price: 1000, Category: "tables"},
				{ID: "side-table", Name: "サイドテーブル", Price: 700, Category: "tables"},
			},
		},
		{
			ID:       "cabinets",
			Name:     "タンス・収納",
			Hiragana: "たんすしゅうのう",
			Items: []Item{
				{ID: "clothes-cabinet", Name: "洋服タンス", Price: 3000, Category: "cabinets"},
				{ID: "bookshelf", Name: "本棚", Price: 1500, Category: "cabinets"},
				{ID: "tv-stand", Name: "テレビ台", Price: 2000, Category: "cabinets"},
				{ID: "chest", Name: "引き出し（4段）", Price: 2500, Category: "cabinets"},
			},
		},
		{
			ID:       "appliances",
			Name:     "家電製品",
			Hiragana: "かでんせいひん",
			Items: []Item{
				{ID: "tv", Name: "テレビ", Price: 3500, Category: "appliances"},
				{ID: "refrigerator", Name: "冷蔵庫", Price: 5000, Category: "appliances"},
				{ID: "washing-machine", Name: "洗濯機", Price: 4000, Category: "appliances"},
				{ID: "microwave", Name: "電子レンジ", Price: 2000, Category: "appliances"},
			},
		},
		{
			ID:       "beds",
			Name:     "ベッド・寝具",
			Hiragana: "べっどしんぐ",
			Items: []Item{
				{ID: "single-bed", Name: "シングルベッド", Price: 3000, Category: "beds"},
				{ID: "double-bed", Name: "ダブルベッド", Price: 4500, Category: "beds"},
				{ID: "mattress", Name: "マットレス", Price: 2000, Category: "beds"},
				{ID: "futon", Name: "布団", Price: 1500, Category: "beds"},
			},
		},
		{
			ID:       "other",
			Name:     "その他",
			Hiragana: "そのた",
			Items: []Item{
				{ID: "other-small", Name: "その他（小）", Price: 500, Category: "other"},
				{ID: "other-medium", Name: "その他（中）", Price: 1500, Category: "other"},
				{ID: "other-large", Name: "その他（大）", Price: 3000, Category: "other"},
				{ID: "other-custom", Name: "その他（カスタム）", Price: 0, Category: "other"},
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
