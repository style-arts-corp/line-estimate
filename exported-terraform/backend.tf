# GCSバックエンドの設定
# 状態ファイルをGCSで管理する場合は以下のコメントを外してください
# 事前にバケットを作成する必要があります：
# gsutil mb -p disposal-estimate gs://disposal-estimate-terraform-state
#
terraform {
  backend "gcs" {
    bucket  = "disposal-estimate-terraform-state"
    prefix  = "terraform/state"
  }
}