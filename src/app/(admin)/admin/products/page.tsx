import ProductsTable from "@/features/admin-products/components/products-table"

export default function ProductsPage() {

  return (
    <div className="space-y-6">

      <h1 className="text-2xl font-bold">
        Products
      </h1>

      <ProductsTable />

    </div>
  )

}