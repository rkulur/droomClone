import { useEffect, useRef, useState } from "react"
import { Check, ShoppingCart } from "lucide-react"
import { useCart } from "@/context/CartContext"
import type { VehicleDetail } from "@/types/vehicleDetail"

interface AddToCartButtonProps {
  vehicle: VehicleDetail
}

const AddToCartButton = ({ vehicle }: AddToCartButtonProps) => {
  const { addItem, isInCart } = useCart()
  const [showToast, setShowToast] = useState(false)
  const timeoutRef = useRef<number | null>(null)

  const added = isInCart(vehicle.id)

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  const handleAddToCart = () => {
    if (added) {
      return
    }

    addItem(vehicle)
    setShowToast(true)

    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = window.setTimeout(() => {
      setShowToast(false)
      timeoutRef.current = null
    }, 3000)
  }

  return (
    <>
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={added}
        className={`inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium text-white transition-colors ${
          added ? "cursor-not-allowed bg-emerald-600" : "bg-[#1976d2] hover:bg-[#1769c0]"
        }`}
      >
        {added ? <Check className="size-4" /> : <ShoppingCart className="size-4" />}
        {added ? "Added to Cart" : "Add to Cart"}
      </button>

      <div
        className={`fixed right-6 bottom-6 z-50 rounded-lg bg-emerald-600 px-4 py-3 text-sm font-medium text-white shadow-lg transition-all duration-300 ${
          showToast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-3 opacity-0"
        }`}
        role="status"
        aria-live="polite"
      >
        Added to cart successfully ✓
      </div>
    </>
  )
}

export default AddToCartButton
