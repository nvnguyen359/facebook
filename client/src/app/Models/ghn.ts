export interface GHN {
    payment_type_id: number
    note: string
    required_note: string
    return_phone: string
    return_address: string
    return_district_id: any
    return_ward_code: string
    client_order_code: string
    from_name: string
    from_phone: string
    from_address: string
    from_ward_name: string
    from_district_name: string
    from_province_name: string
    to_name: string
    to_phone: string
    to_address: string
    to_ward_name: string
    to_district_name: string
    to_province_name: string
    cod_amount: number
    content: string
    weight: number
    length: number
    width: number
    height: number
    cod_failed_amount: number
    pick_station_id: number
    deliver_station_id: any
    insurance_value: number
    service_id: number
    service_type_id: number
    coupon: any
    pickup_time: number
    pick_shift: number[]
    items: Item[]
  }
  
  export interface Item {
    name: string
    code: string
    quantity: number
    price: number
    length: number
    width: number
    weight: number
    height: number
    category: Category
  }
  
  export interface Category {
    level1: string
  }
  