import CartItemRow from "@/components/cart/CartItemRow"
import type { CartItem } from "@/types/cart"

interface CartItemsListProps {
  items: CartItem[]
  onRemove: (vehicleId: string) => void
}

const CartItemsList = ({ items, onRemove }: CartItemsListProps) => {
  const label = items.length === 1 ? "item" : "items"

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-gray-900">
        My Cart ({items.length} {label})
      </h1>
      <div className="space-y-3">
        {items.map((item) => (
          <CartItemRow key={item.vehicle.id} item={item} onRemove={onRemove} />
        ))}
      </div>
    </section>
  )
}

export default CartItemsList
