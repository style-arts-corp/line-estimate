# Build stage
FROM golang:1.21-alpine AS builder

WORKDIR /app

# Go modの依存関係をコピー
COPY go.mod go.sum ./
RUN go mod download

# ソースコードをコピー
COPY . .

# バイナリをビルド
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o main .

# Runtime stage
FROM alpine:latest

RUN apk --no-cache add ca-certificates tzdata
WORKDIR /root/

# ビルドしたバイナリをコピー
COPY --from=builder /app/main .

# 環境変数ファイルをコピー（オプション）
COPY --from=builder /app/.env* ./

EXPOSE 8080

CMD ["./main"] 