export interface InfoStore {
    banks: Banks
    ghn: Ghn
    store: Store
  }
  
  export interface Banks {
    bin: string
    accountNumber: string
    accountName: string
  }
  
  export interface Ghn {
    token: string
    Client_id: string
    ShopID: string
  }
  
  export interface Store {
    name: string
    phone: string
    address: string
    infoPlus: string
  }
  