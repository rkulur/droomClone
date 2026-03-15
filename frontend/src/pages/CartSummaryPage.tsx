import CartEmptyState from "@/components/cart/CartEmptyState"
import CartItemsList from "@/components/cart/CartItemsList"
import CartOrderSummary from "@/components/cart/CartOrderSummary"
import { useCart } from "@/context/CartContext"

const CartSummaryPage = () => {
  const { items, removeItem } = useCart()

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {items.length === 0 ? (
        <CartEmptyState />
      ) : (
        <div className="px-horizontal mx-auto max-w-[1600px] py-10">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_380px]">
            <CartItemsList items={items} onRemove={removeItem} />
            <CartOrderSummary items={items} />
          </div>
        </div>
      )}
    </main>
  )
}

export default CartSummaryPage
