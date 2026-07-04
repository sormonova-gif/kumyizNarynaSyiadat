export interface Order {
  id: string;
  name: string;
  phone: string;
  address: string;
  volume: 1 | 2 | 5;
  quantity: number;
  comment?: string;
  totalPrice: number;
  timestamp: string;
  status: 'pending' | 'sent';
}

export interface MerchantConfig {
  whatsappPhone: string; // The merchant's phone number to receive WhatsApp orders
  pricePerLiter: number; // e.g., 150 som
}
