export interface WeighStation {
    id: number
    carNumber: string
    customerName: string
    weight1: any
    weight2: any
    cargoVolume: any
    tare: string
    customerId: string
    numberOfContainers: string
    note: any
    userId: any
    createdAt: any
    updatedAt: any
    isActive: boolean
    ieGoods: string
    tareKg: number
    price: number
    productName: string
    unit: string
    exchangeRate:any
  }
  export interface WeighingSlip extends WeighStation{
    PAGESIZE:any;
    TENCONGTY:any;
    DIACHI:any;
    PHONE:any;
    hide:any;
    BANGCHU:any;
    NGAY:any;
    payVolume:any,
    createdAt1: any
    updatedAt1: any,
    actualVolume:any
  }