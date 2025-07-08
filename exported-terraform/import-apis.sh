#!/bin/bash

# 既存のAPIサービスをインポートするスクリプト

echo "=== 既存APIサービスのインポート ==="

# 主要なAPIサービスをインポート
apis=(
    "firebase.googleapis.com"
    "firestore.googleapis.com"
    "bigquery.googleapis.com"
    "logging.googleapis.com"
    "monitoring.googleapis.com"
    "cloudresourcemanager.googleapis.com"
    "storage.googleapis.com"
    "pubsub.googleapis.com"
)

for api in "${apis[@]}"; do
    resource_name=$(echo "$api" | sed 's/\./_/g')
    echo "Importing $api..."
    terraform import "module.apis.google_project_service.${resource_name}" "disposal-estimate/$api" || echo "Failed to import $api"
done

# ログシンクをインポート
echo "Importing log sinks..."
terraform import module.logging.google_logging_project_sink.a_default "disposal-estimate/sinks/_Default" || echo "Failed to import _Default sink"
terraform import module.logging.google_logging_project_sink.a_required "disposal-estimate/sinks/_Required" || echo "Failed to import _Required sink"

echo "=== 完了 ==="
echo "terraform plan で差分を確認してください"