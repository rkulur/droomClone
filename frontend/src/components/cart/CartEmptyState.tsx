import { useNavigate } from "react-router"
import { Button } from "@/components/ui/button"

const CartEmptyIllustration = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 120 120"
    className="mx-auto h-24 w-24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="82" cy="36" r="16" fill="#9FE870" />
    <circle cx="82" cy="36" r="11" fill="#FFD45A" />
    <path
      d="M28 28H37L42 73H85L91 40H46"
      stroke="#4C78E5"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M47 40V62M58 40V62M69 40V62M80 40V62"
      stroke="#4C78E5"
      strokeWidth="3.5"
      strokeLinecap="round"
    />
    <circle cx="49" cy="86" r="7" stroke="#4C78E5" strokeWidth="4" />
    <circle cx="78" cy="86" r="7" stroke="#4C78E5" strokeWidth="4" />
    <path d="M76 29H88" stroke="#FF7A8A" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

const CartEmptyState = () => {
  const navigate = useNavigate()

  return (
    <div className="flex min-h-[calc(100vh-220px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-[400px] text-center">
        <CartEmptyIllustration />
        <h1 className="mt-4 text-[20px] font-semibold text-[#111111]">Your Cart is Empty</h1>
        <p className="mt-2 text-sm leading-6 text-[#888888]">
          Looks Like you haven&apos;t added Anything to your cart yet
        </p>
        <Button
          type="button"
          onClick={() => navigate("/vehicles/car")}
          className="mt-6 h-auto rounded-[4px] bg-[#1976d2] px-8 py-[10px] text-white hover:bg-[#1769c0]"
        >
          Continue Shopping
        </Button>
      </div>
    </div>
  )
}

export default CartEmptyState
