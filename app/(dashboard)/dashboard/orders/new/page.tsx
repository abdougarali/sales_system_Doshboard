import OrderForm from '@/components/orders/OrderForm';

export default function NewOrderPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Create New Order</h1>
        <p className="mt-2 text-sm text-gray-600">Create a new customer order</p>
      </div>
      <OrderForm />
    </div>
  );
}
