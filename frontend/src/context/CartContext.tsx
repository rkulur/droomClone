import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react"
import type { CartContextValue, CartItem, CartState } from "@/types/cart"
import type { VehicleListing } from "@/types/vehicle"

const CART_STORAGE_KEY = "droom_cart"

const CartContext = createContext<CartContextValue | undefined>(undefined)

const getInitialState = (): CartState => ({
  items: [],
  updatedAt: null,
})

const isCartState = (value: unknown): value is CartState => {
  if (!value || typeof value !== "object") {
    return false
  }

  const candidate = value as Partial<CartState>
  return Array.isArray(candidate.items)
}

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<CartState>(getInitialState)
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") {
      setIsHydrated(true)
      return
    }

    try {
      const rawState = window.localStorage.getItem(CART_STORAGE_KEY)

      if (!rawState) {
        setIsHydrated(true)
        return
      }

      const parsed = JSON.parse(rawState) as unknown

      if (isCartState(parsed)) {
        setState({
          items: parsed.items.filter(
            (item): item is CartItem =>
              Boolean(item) &&
              typeof item === "object" &&
              typeof item.addedAt === "string" &&
              Boolean(item.vehicle) &&
              typeof item.vehicle === "object" &&
              typeof item.vehicle.id === "string",
          ),
          updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : null,
        })
      } else {
        window.localStorage.removeItem(CART_STORAGE_KEY)
      }
    } catch {
      window.localStorage.removeItem(CART_STORAGE_KEY)
      setState(getInitialState())
    } finally {
      setIsHydrated(true)
    }
  }, [])

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return
    }

    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
    } catch {
      // Ignore persistence failures and keep in-memory cart usable.
    }
  }, [isHydrated, state])

  const addItem = useCallback((vehicle: VehicleListing) => {
    setState((current) => {
      if (current.items.some((item) => item.vehicle.id === vehicle.id)) {
        return current
      }

      return {
        items: [
          ...current.items,
          {
            vehicle,
            addedAt: new Date().toISOString(),
          },
        ],
        updatedAt: new Date().toISOString(),
      }
    })
  }, [])

  const removeItem = useCallback((vehicleId: string) => {
    setState((current) => ({
      items: current.items.filter((item) => item.vehicle.id !== vehicleId),
      updatedAt: new Date().toISOString(),
    }))
  }, [])

  const clearCart = useCallback(() => {
    setState({
      items: [],
      updatedAt: new Date().toISOString(),
    })
  }, [])

  const isInCart = useCallback(
    (vehicleId: string) => state.items.some((item) => item.vehicle.id === vehicleId),
    [state.items],
  )

  const value = useMemo<CartContextValue>(
    () => ({
      items: state.items,
      itemCount: state.items.length,
      addItem,
      removeItem,
      clearCart,
      isInCart,
    }),
    [addItem, clearCart, isInCart, removeItem, state.items],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export { CartContext }

export const useCart = () => {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used within CartProvider")
  }

  return context
}
