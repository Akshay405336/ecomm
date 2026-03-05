import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* Page Title */}
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Revenue</p>
            <h2 className="text-xl font-bold">$12,340</h2>
          </div>
          <DollarSign className="text-gray-400" />
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Orders</p>
            <h2 className="text-xl font-bold">324</h2>
          </div>
          <ShoppingCart className="text-gray-400" />
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Customers</p>
            <h2 className="text-xl font-bold">1,245</h2>
          </div>
          <Users className="text-gray-400" />
        </div>

        <div className="bg-white p-5 rounded-lg shadow flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">Products</p>
            <h2 className="text-xl font-bold">86</h2>
          </div>
          <Package className="text-gray-400" />
        </div>

      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-lg font-semibold mb-4">
          Recent Orders
        </h2>

        <table className="w-full text-left">

          <thead>
            <tr className="border-b text-sm text-gray-500">
              <th className="py-2">Order ID</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Total</th>
            </tr>
          </thead>

          <tbody className="text-sm">

            <tr className="border-b">
              <td className="py-2">#1023</td>
              <td>John Doe</td>
              <td className="text-green-600">Completed</td>
              <td>$120</td>
            </tr>

            <tr className="border-b">
              <td className="py-2">#1022</td>
              <td>Jane Smith</td>
              <td className="text-yellow-600">Pending</td>
              <td>$89</td>
            </tr>

            <tr>
              <td className="py-2">#1021</td>
              <td>Michael Lee</td>
              <td className="text-red-500">Cancelled</td>
              <td>$45</td>
            </tr>

          </tbody>

        </table>

      </div>

    </div>
  );
}