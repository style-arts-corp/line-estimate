.PHONY: build run test clean deps swagger

# Go parameters
GOCMD=go
GOBUILD=$(GOCMD) build
GOCLEAN=$(GOCMD) clean
GOTEST=$(GOCMD) test
GOGET=$(GOCMD) get
GOMOD=$(GOCMD) mod
BINARY_NAME=line-estimate-backend

# Build the application
build:
	$(GOBUILD) -o $(BINARY_NAME) -v

# Run the application
run:
	$(GOCMD) run main.go

# Run tests
test:
	$(GOTEST) -v ./...

# Clean build artifacts
clean:
	$(GOCLEAN)
	rm -f $(BINARY_NAME)

# Download dependencies
deps:
	$(GOMOD) download
	$(GOMOD) tidy

# Generate swagger documentation
swagger:
	swag init --parseDependency --parseInternal

# Install swagger if not installed
swagger-install:
	go install github.com/swaggo/swag/cmd/swag@latest

# Development mode with hot reload (requires air)
dev:
	air

# Format code
fmt:
	$(GOCMD) fmt ./...

# Lint code (requires golangci-lint)
lint:
	golangci-lint run

# Run with docker
docker-build:
	docker build -t $(BINARY_NAME) .

docker-run:
	docker run -p 18080:18080 $(BINARY_NAME)

# All-in-one command to setup and run
all: deps swagger build run