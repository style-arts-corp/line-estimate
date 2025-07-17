// Example usage in a component or page
import { useCategories } from "../hooks/use-categories";
import { SortToggle } from "../components/sort-toggle";

export default function ExampleUsage() {
  const { categories, loading, error, sortDescending, toggleSort } =
    useCategories();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">商品カテゴリー</h1>
        <SortToggle
          sortDescending={sortDescending}
          onToggle={toggleSort}
          loading={loading}
        />
      </div>

      <div className="grid gap-6">
        {categories.map((category) => (
          <div key={category.id} className="border rounded-lg p-4">
            <h2 className="text-lg font-semibold mb-3">{category.name}</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {category.items.map((item) => (
                <div key={item.id} className="p-2 border rounded">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-gray-600">
                    ¥{item.price.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
