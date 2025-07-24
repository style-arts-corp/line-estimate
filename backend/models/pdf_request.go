package models

// PDFEstimateRequest represents the request structure from frontend
type PDFEstimateRequest struct {
	Customer PDFRequestCustomer `json:"customer"`
	Items    []PDFRequestItem   `json:"items"`
	Images   []PDFImage         `json:"images"`
}

// PDFRequestCustomer represents customer information from frontend
type PDFRequestCustomer struct {
	Name         string `json:"name"`
	Address      string `json:"address"`
	Phone        string `json:"phone"`
	Email        string `json:"email"`
	DisposalDate string `json:"disposalDate"`
}

// PDFRequestItem represents each item from frontend
type PDFRequestItem struct {
	ID          string  `json:"id"`
	Quantity    float64 `json:"quantity"`
	CustomPrice float64 `json:"customPrice"`
	Amount      float64 `json:"amount"`
}

// PDFImage represents image data from frontend
type PDFImage struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	Data string `json:"data"` // base64 encoded image data
}
