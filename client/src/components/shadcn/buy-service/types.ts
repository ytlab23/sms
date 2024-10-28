export interface Country {
    name: string;
    iso: string;
    prefix: string;
  }
  
  export interface Service {
    name: string;
    category: string;
    quantity: number;
    price: number;
    main: boolean;
    isIncluded: boolean;
  }
  
  export interface Operator {
    name: string;
    cost: number;
    count: number;
    rate?: number;
  }
  
  export interface Favorites {
    countries: Record<string, boolean>;
    services: Record<string, boolean>;
  }
  
  export interface PricingData {
    [key: string]: number | null;
  }