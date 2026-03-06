import CategoryTable from "@/features/admin-categories/components/category-table";

export default function CategoriesPage() {

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Categories
      </h1>

      <CategoryTable />

    </div>
  );
}