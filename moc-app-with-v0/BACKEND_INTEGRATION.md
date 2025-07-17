# Flexible Data Source with Backend Integration

This implementation provides a flexible data source system where the Go backend decides between mock data (development) and Google Sheets (production) based on the environment configuration.

## Architecture

```
Frontend (Next.js) → Backend (Go) → Google Sheets API (Production) | Mock Data (Development)
```

The backend (`main.go`) controls the data source:

- **Development**: Uses pre-defined mock data
- **Production**: Fetches data from Google Sheets

## Backend Setup

1. **Configure environment variables in backend:**

   ```bash
   cd backend
   cp .env.example .env
   ```

   Edit `.env`:

   ```
   # For development (uses mock data)
   GO_ENV=development
   PORT=8080

   # For production (uses Google Sheets)
   # GO_ENV=production
   # GOOGLE_SHEETS_API_KEY=your_api_key_here
   # SPREADSHEET_ID=your_spreadsheet_id_here
   ```

2. **Start the backend server:**
   ```bash
   go run main.go
   ```

## Frontend Setup

1. **Configure environment variables in frontend:**

   ```bash
   cd moc-app-with-v0
   cp .env.example .env.local
   ```

   Edit `.env.local`:

   ```
   NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Google Sheets Setup (Production Only)

1. **Create a Google Sheets API key:**

   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Enable the Google Sheets API
   - Create an API key

2. **Set up your Google Sheets:**
   - Create a new Google Sheet
   - Format it with the following columns:
     - Column A: category_id (e.g., "chairs", "tables")
     - Column B: category_name (e.g., "椅子", "机・テーブル")
     - Column C: item_id (e.g., "pipe-chair", "work-desk")
     - Column D: item_name (e.g., "パイプ椅子", "事務机")
     - Column E: price (e.g., 500, 1500)

## API Endpoints

### GET /api/v1/categories

Fetches categories based on environment configuration.

**Parameters:**

- `sort` (optional): Set to "true" to sort items by price in descending order

**Response:**

```json
{
  "success": true,
  "data": {
    "categories": [...],
    "source": "google_sheets" | "mock_data",
    "sorted": true | false
  }
}
```

## Environment Control

The data source is controlled by the `GO_ENV` environment variable in the backend:

- `GO_ENV=development` → Uses mock data
- `GO_ENV=production` → Uses Google Sheets API

## Usage in Frontend

```tsx
import { useCategories } from "../hooks/use-categories";
import { SortToggle } from "../components/sort-toggle";

function YourComponent() {
  const { categories, loading, error, sortDescending, toggleSort } =
    useCategories();

  return (
    <div>
      <SortToggle
        sortDescending={sortDescending}
        onToggle={toggleSort}
        loading={loading}
      />

      {categories.map((category) => (
        <div key={category.id}>
          <h2>{category.name}</h2>
          {category.items.map((item) => (
            <div key={item.id}>
              {item.name} - ¥{item.price}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
```

## Features

- **Environment-based Data Source**: Backend decides between mock data and Google Sheets
- **Centralized Configuration**: All configuration handled in `main.go`
- **Sort Toggle**: Frontend can request sorted data via API parameter
- **Fallback System**: Graceful fallback to mock data if Google Sheets fails
- **Type Safety**: Full TypeScript support in frontend
- **Error Handling**: Proper error handling with meaningful responses

## Deployment

### Development

```bash
# Backend
GO_ENV=development go run main.go

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8080/api/v1 npm run dev
```

### Production

```bash
# Backend
GO_ENV=production \
GOOGLE_SHEETS_API_KEY=your_key \
SPREADSHEET_ID=your_id \
go run main.go

# Frontend
NEXT_PUBLIC_API_URL=https://your-backend-url.com/api/v1 npm run build
```
