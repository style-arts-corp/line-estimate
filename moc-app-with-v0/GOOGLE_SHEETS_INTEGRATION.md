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

## Usage

### Basic Usage

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

- **Google Sheets Integration**: Automatically fetches data from Google Sheets
- **Fallback to Mock Data**: If Google Sheets is unavailable, uses mock data
- **Sort Toggle**: Button to sort items by price (high to low)
- **Loading States**: Shows loading indicator while fetching data
- **Error Handling**: Graceful error handling with fallback

## Components

- `useCategories()`: Hook that manages data fetching and sorting
- `SortToggle`: Button component for toggling sort order
- `getCategories()`: Function to fetch data from Google Sheets or mock data
- `sortCategoriesDescending()`: Function to sort categories by price

## Data Flow

1. Component calls `useCategories()` hook
2. Hook calls `getCategories()` with current sort state
3. `getCategories()` tries to fetch from Google Sheets
4. If Google Sheets fails, falls back to mock data
5. Data is sorted if `sortDescending` is true
6. Component receives updated data and re-renders
