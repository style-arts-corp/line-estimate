# GCSバックエンドの設定（オプション）
# 状態ファイルをGCSで管理する場合はコメントを外してください
# terraform {
#   backend "gcs" {
#     bucket  = "disposal-estimate-terraform-state"
#     prefix  = "terraform/state"
#   }
# }