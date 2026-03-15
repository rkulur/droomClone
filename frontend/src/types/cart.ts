import type { VehicleListing } from "@/types/vehicle"

export interface CartItem {
  vehicle: VehicleListing
  addedAt: string
}

export interface CartState {
  items: CartItem[]
  updatedAt: string | null
}

export interface CartContextValue {
  items: CartItem[]
  itemCount: number
  addItem: (vehicle: VehicleListing) => void
  removeItem: (vehicleId: string) => void
  clearCart: () => void
  isInCart: (vehicleId: string) => boolean
}
