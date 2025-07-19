package models

import "time"

// PDFEstimate represents the estimate/quotation data structure for PDF generation
type PDFEstimate struct {
	EstimateNo   string           `json:"estimate_no"`
	IssueDate    time.Time        `json:"issue_date"`
	Customer     PDFCustomerInfo  `json:"customer"`
	Recipient    string           `json:"recipient"` // 佐藤 様
	Title        string           `json:"title"`
	Items        []PDFLineItem    `json:"items"`
	SubTotal     float64          `json:"sub_total"`
	TaxRate      float64          `json:"tax_rate"`
	Tax          float64          `json:"tax"`
	Total        float64          `json:"total"`
	Remarks      []string         `json:"remarks"`
	ValidPeriod  int              `json:"valid_period"` // days
	PaymentTerms string           `json:"payment_terms"`
	Issuer       PDFCompanyInfo   `json:"issuer"`
}

// PDFCustomerInfo represents customer information for PDF
type PDFCustomerInfo struct {
	CompanyName string `json:"company_name"`
	PostalCode  string `json:"postal_code"`
	Address     string `json:"address"`
	Tel         string `json:"tel"`
	Fax         string `json:"fax"`
}

// PDFLineItem represents each item in the estimate PDF
type PDFLineItem struct {
	Description string  `json:"description"`
	Quantity    float64 `json:"quantity"`
	Unit        string  `json:"unit"`
	UnitPrice   float64 `json:"unit_price"`
	Amount      float64 `json:"amount"`
}

// PDFCompanyInfo represents the issuing company information
type PDFCompanyInfo struct {
	CompanyName string `json:"company_name"`
	PostalCode  string `json:"postal_code"`
	Address     string `json:"address"`
	Tel         string `json:"tel"`
	Fax         string `json:"fax"`
	Seal        string `json:"seal"` // path to seal image
}