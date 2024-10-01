import { OrderDetails } from "./orderDetails"

export interface Order {
    id: number
    customerId: string
    name: string
    status: string
    wage: number
    discount: number
    shippingFee: string
    quantity: number
    intoMney: number
    pay: number,
    createdAt: Date
    updatedAt: Date
  }
