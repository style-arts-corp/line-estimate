package models

// PDFEstimateRequest represents the request structure from frontend
type PDFEstimateRequest struct {
	Customer PDFRequestCustomer `json:"customer"`
	Items    []PDFRequestItem   `json:"items"`
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
