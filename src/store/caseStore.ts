import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type KnifeRarity = 
  | 'common' 
  | 'uncommon' 
  | 'rare' 
  | 'epic' 
  | 'mythic' 
  | 'legendary' 
  | 'gold' 
  | 'titan' 
  | 'divine';

export interface Knife {
  id: string;
  name: string;
  rarity: KnifeRarity;
  image: string;
  price: number;
  fromCase: string;
}

export interface Case {
  id: string;
  name: string;
  price: number;
  image: string;
  isFree?: boolean;
}

interface CaseStore {
  inventory: Knife[];
  balance: number;
  addKnifeToInventory: (knife: Knife) => void;
  removeKnifeFromInventory: (knifeId: string) => void;
  updateBalance: (amount: number) => void;
  sellKnife: (knifeId: string) => void;
  cases: Case[];
  shopKnives: Knife[];
  buyKnife: (knife: Knife) => void;
}

// Helper to create initial cases
const createInitialCases = (): Case[] => [
  {
    id: 'free-case',
    name: 'Бесплатный кейс',
    price: 0,
    image: '/placeholder.svg',
    isFree: true
  },
  {
    id: 'basic-case',
    name: 'Базовый кейс',
    price: 199,
    image: '/placeholder.svg'
  },
  {
    id: 'premium-case',
    name: 'Премиум кейс',
    price: 699,
    image: '/placeholder.svg'
  }
];

// Helper to create shop knives
const createShopKnives = (): Knife[] => [
  {
    id: 'shop-knife-1',
    name: 'Керамбит | Градиент',
    rarity: 'rare',
    image: '/placeholder.svg',
    price: 799,
    fromCase: 'Магазин'
  },
  {
    id: 'shop-knife-2',
    name: 'Штык-нож | Автотроника',
    rarity: 'epic',
    image: '/placeholder.svg',
    price: 1499,
    fromCase: 'Магазин'
  },
  {
    id: 'shop-knife-3',
    name: 'Бабочка | Дамасская сталь',
    rarity: 'legendary',
    image: '/placeholder.svg',
    price: 5999,
    fromCase: 'Магазин'
  }
];

export const useCaseStore = create<CaseStore>()(
  persist(
    (set, get) => ({
      inventory: [],
      balance: 1000, // Starting balance
      cases: createInitialCases(),
      shopKnives: createShopKnives(),
      
      addKnifeToInventory: (knife) => {
        set((state) => ({
          inventory: [...state.inventory, knife]
        }));
      },
      
      removeKnifeFromInventory: (knifeId) => {
        set((state) => ({
          inventory: state.inventory.filter(knife => knife.id !== knifeId)
        }));
      },
      
      updateBalance: (amount) => {
        set((state) => ({
          balance: state.balance + amount
        }));
      },
      
      sellKnife: (knifeId) => {
        const { inventory } = get();
        const knife = inventory.find(k => k.id === knifeId);
        
        if (knife) {
          // Add knife's price to balance
          get().updateBalance(knife.price);
          // Remove knife from inventory
          get().removeKnifeFromInventory(knifeId);
        }
      },
      
      buyKnife: (knife) => {
        const { balance } = get();
        
        if (balance >= knife.price) {
          // Deduct price from balance
          get().updateBalance(-knife.price);
          
          // Add knife to inventory (create a copy to avoid modifications)
          const boughtKnife = {
            ...knife,
            id: `bought-${knife.id}-${Date.now()}`,
            fromShop: true
          };
          
          get().addKnifeToInventory(boughtKnife);
          return true;
        }
        
        return false;
      }
    }),
    {
      name: 'case-store'
    }
  )
);
