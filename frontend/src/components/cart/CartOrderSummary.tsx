import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"
import { formatCurrency } from "@/constants/vehicleListing"
import type { CartItem } from "@/types/cart"

interface CartOrderSummaryProps {
  items: CartItem[]
}

const CartOrderSummary = ({ items }: CartOrderSummaryProps) => {
  const navigate = useNavigate()
  const itemTotal = items.reduce((sum, item) => sum + item.vehicle.price, 0)

  return (
    <aside className="rounded-xl bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900">Order Summary</h2>
      <div className="mt-5 border-t border-gray-200 pt-4 text-sm text-gray-700">
        <p>{items.length} Vehicle(s)</p>
        <div className="mt-4 space-y-3 border-t border-gray-200 pt-4">
          <div className="flex items-center justify-between">
            <span>Item Total</span>
            <span>₹ {formatCurrency(itemTotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Platform Fee</span>
            <span>₹ 0</span>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>₹ {formatCurrency(itemTotal)}</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <Button
          type="button"
          className="w-full bg-[#1976d2] text-white hover:bg-[#1769c0]"
          onClick={() => navigate("/checkout")}
          disabled={items.length === 0}
        >
          Proceed to Checkout
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full border-[#1976d2] text-[#1976d2] hover:bg-blue-50 hover:text-[#1976d2]"
          onClick={() => navigate("/vehicles/car")}
        >
          Continue Shopping
        </Button>
      </div>
    </aside>
  )
}

export default CartOrderSummary
