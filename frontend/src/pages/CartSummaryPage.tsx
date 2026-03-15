import CartEmptyState from "@/components/cart/CartEmptyState"
import { useCart } from "@/context/CartContext"

const CartSummaryPage = () => {
  const { items } = useCart()

  return (
    <main className="min-h-screen bg-[#f5f5f5]">
      {items.length === 0 ? (
        <CartEmptyState />
      ) : (
        <div className="px-horizontal mx-auto max-w-[1600px] py-10">
          <div>TODO: filled cart</div>
        </div>
      )}
    </main>
  )
}

export default CartSummaryPage
