package models

import "time"

// PDFInstruction represents the instruction sheet data structure for PDF generation
type PDFInstruction struct {
	InstructionNo string            `json:"instruction_no"`
	IssueDate     time.Time         `json:"issue_date"`
	Contractor    PDFContractorInfo `json:"contractor"`   // 作業指示書 - 収集先
	Collector     PDFCollectorInfo  `json:"collector"`    // 控 - 収集先
	Items         []PDFWorkItem     `json:"items"`        // 作業内容
	Memo          string            `json:"memo"`         // メモ（印刷されません）
	WorkDetails   PDFWorkDetails    `json:"work_details"` // 作業詳細
}

// PDFContractorInfo represents contractor information for instruction sheet
type PDFContractorInfo struct {
	Recipient string `json:"recipient"` // 受付
	Name      string `json:"name"`      // 名称
	Address   string `json:"address"`   // 住所
	Person    string `json:"person"`    // 担当
	Tel       string `json:"tel"`       // TEL
}

// PDFCollectorInfo represents collector information for instruction sheet
type PDFCollectorInfo struct {
	Recipient string `json:"recipient"` // 受付
	Name      string `json:"name"`      // 名称
	Address   string `json:"address"`   // 住所
	Person    string `json:"person"`    // 担当
	Tel       string `json:"tel"`       // TEL
}

// PDFWorkItem represents each work item in the instruction sheet
type PDFWorkItem struct {
	Description string `json:"description"`
}

// PDFWorkDetails represents work execution details
type PDFWorkDetails struct {
	Contractor     string `json:"contractor"`       // 作業伝票
	Amount         string `json:"amount"`           // 集金額（税込）
	Manifest       string `json:"manifest"`         // マニフェスト
	ManifestType   string `json:"manifest_type"`    // Tポイント
	NoRecyclingFee bool   `json:"no_recycling_fee"` // リサイクル券無
	ExtraPoints    bool   `json:"extra_points"`     // 税抜@ ポイント
}
