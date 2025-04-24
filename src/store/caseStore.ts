import { create } from '@tanstack/react-query';

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

// Простая замена Zustand с использованием localStorage
class CaseStoreManager {
  private storage: Storage = localStorage;
  private storeKey = 'case-store';

  private state = {
    inventory: [] as Knife[],
    balance: 1000, // Начальный баланс
    cases: this.createInitialCases(),
    shopKnives: this.createShopKnives(),
  };

  constructor() {
    // Загрузка состояния из localStorage при инициализации
    const savedState = this.storage.getItem(this.storeKey);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        this.state = {...this.state, ...parsed};
      } catch (e) {
        console.error('Failed to parse stored state', e);
      }
    }
  }

  // Сохранение состояния в localStorage
  private saveState() {
    this.storage.setItem(this.storeKey, JSON.stringify(this.state));
  }

  // Геттеры для доступа к состоянию
  get inventory() { return this.state.inventory; }
  get balance() { return this.state.balance; }
  get cases() { return this.state.cases; }
  get shopKnives() { return this.state.shopKnives; }

  // Методы для изменения состояния
  addKnifeToInventory(knife: Knife) {
    this.state.inventory = [...this.state.inventory, knife];
    this.saveState();
  }

  removeKnifeFromInventory(knifeId: string) {
    this.state.inventory = this.state.inventory.filter(knife => knife.id !== knifeId);
    this.saveState();
  }

  updateBalance(amount: number) {
    this.state.balance += amount;
    this.saveState();
  }

  sellKnife(knifeId: string) {
    const knife = this.state.inventory.find(k => k.id === knifeId);
    if (knife) {
      // Добавить цену ножа к балансу
      this.updateBalance(knife.price);
      // Удалить нож из инвентаря
      this.removeKnifeFromInventory(knifeId);
    }
  }

  buyKnife(knife: Knife) {
    if (this.state.balance >= knife.price) {
      // Вычесть цену из баланса
      this.updateBalance(-knife.price);
      
      // Добавить нож в инвентарь
      const boughtKnife = {
        ...knife,
        id: `bought-${knife.id}-${Date.now()}`,
        fromShop: true
      };
      
      this.addKnifeToInventory(boughtKnife);
      return true;
    }
    
    return false;
  }

  // Вспомогательные методы для создания начальных данных
  private createInitialCases(): Case[] {
    return [
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
  }

  private createShopKnives(): Knife[] {
    return [
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
  }
}

// Создаем и экспортируем синглтон хранилища
export const caseStore = new CaseStoreManager();
