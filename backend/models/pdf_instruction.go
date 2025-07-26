package models

import "time"

// PDFInstruction represents the instruction sheet data structure for PDF generation
type PDFInstruction struct {
	InstructionNo   string            `json:"instruction_no"`
	IssueDate       time.Time         `json:"issue_date"`
	CollectionDate  string            `json:"collection_date"`  // 収集日
	AcceptanceCheck bool              `json:"acceptance_check"` // 受付チェック
	AcceptedBy      string            `json:"accepted_by"`      // 受付者
	Contractor      PDFContractorInfo `json:"contractor"`       // 作業指示書 - 収集先
	Collector       PDFCollectorInfo  `json:"collector"`        // 控 - 収集先
	Items           []PDFWorkItem     `json:"items"`            // 作業内容
	Memo            string            `json:"memo"`             // メモ（印刷されません）
	WorkDetails     PDFWorkDetails    `json:"work_details"`     // 作業詳細
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
	WorkSlip          string `json:"work_slip"`           // 作業伝票
	CollectionAmount  string `json:"collection_amount"`   // 集金額（税込）
	Weight            string `json:"weight"`              // 計量
	Manifest          string `json:"manifest"`            // マニフェスト
	TPoint            string `json:"t_point"`             // Tポイント
	TaxExcludedRate   string `json:"tax_excluded_rate"`   // 税抜@
	RecyclingTicket   string `json:"recycling_ticket"`    // リサイクル券
	RecyclingTicketNo bool   `json:"recycling_ticket_no"` // リサイクル券 無
	Points            string `json:"points"`              // ポイント
}
