import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { caseStore, Knife, Case } from '../store/caseStore';
import { toast } from '../components/ui/use-toast';

export default function ShopPage() {
  const [shopKnives, setShopKnives] = useState<Knife[]>(caseStore.shopKnives);
  const [cases, setCases] = useState<Case[]>(caseStore.cases.filter(c => !c.isFree));
  const [balance, setBalance] = useState(caseStore.balance);
  const [selectedItem, setSelectedItem] = useState<Knife | null>(null);
  
  // Обновление состояния при изменениях
  useEffect(() => {
    const interval = setInterval(() => {
      setShopKnives(caseStore.shopKnives);
      setCases(caseStore.cases.filter(c => !c.isFree));
      setBalance(caseStore.balance);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleBuyKnife = (knife: Knife) => {
    if (balance < knife.price) {
      toast({
        title: "Недостаточно средств",
        description: `Необходимо ${knife.price} монет для покупки этого ножа`,
        variant: "destructive"
      });
      return;
    }
    
    const success = caseStore.buyKnife(knife);
    
    if (success) {
      toast({
        title: "Покупка успешна",
        description: `Вы приобрели "${knife.name}" за ${knife.price} монет`,
      });
      setSelectedItem(null);
    }
  };
  
  const rarityClass = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'border-gray-400 bg-gray-800';
      case 'uncommon': return 'border-blue-400 bg-blue-900';
      case 'rare': return 'border-purple-400 bg-purple-900';
      case 'epic': return 'border-pink-400 bg-pink-900';
      case 'mythic': return 'border-red-400 bg-red-900';
      case 'legendary': return 'border-orange-400 bg-orange-900';
      case 'gold': return 'border-amber-400 bg-amber-900';
      case 'titan': return 'border-lime-400 bg-lime-900';
      case 'divine': return 'border-emerald-400 bg-emerald-900';
      default: return 'border-gray-400 bg-gray-800';
    }
  };
  
  const translateRarity = (rarity: string): string => {
    switch (rarity) {
      case 'common': return 'Обычный';
      case 'uncommon': return 'Необычный';
      case 'rare': return 'Редкий';
      case 'epic': return 'Эпический';
      case 'mythic': return 'Мифический';
      case 'legendary': return 'Легендарный';
      case 'gold': return 'Золотой';
      case 'titan': return 'Титановый';
      case 'divine': return 'Божественный';
      default: return 'Неизвестный';
    }
  };
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Магазин</h1>
        <div className="bg-gray-800 py-2 px-4 rounded-full">
          <span className="text-yellow-400 font-semibold">{balance} монет</span>
        </div>
      </div>
      
      <div className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Кейсы</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cases.map((caseItem) => (
            <div key={caseItem.id} className="border border-gray-700 bg-gray-900 rounded-lg p-4 flex items-center space-x-4">
              <div className="h-16 w-16 bg-gray-800 rounded flex items-center justify-center">
                <img src={caseItem.image} alt={caseItem.name} className="h-12 w-12 object-contain" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold">{caseItem.name}</h3>
                <div className="flex justify-between mt-2">
                  <span className="font-semibold text-yellow-400">{caseItem.price} монет</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <h2 className="text-2xl font-semibold mb-4">Эксклюзивные ножи</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {shopKnives.map((knife) => (
            <div 
              key={knife.id} 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-transform hover:scale-105 ${rarityClass(knife.rarity)}`}
              onClick={() => setSelectedItem(knife)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                  <img src={knife.image} alt={knife.name} className="h-12 w-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{knife.name}</h3>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">{translateRarity(knife.rarity)}</span>
                    <span className="font-semibold text-yellow-400">{knife.price} монет</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg p-6 ${rarityClass(selectedItem.rarity)}`}>
            <h2 className="text-2xl font-bold mb-4">{selectedItem.name}</h2>
            
            <div className="flex justify-center my-6">
              <div className="h-32 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <img src={selectedItem.image} alt={selectedItem.name} className="h-24 w-24 object-contain" />
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Редкость:</span>
                <span>{translateRarity(selectedItem.rarity)}</span>
              </div>
              <div className="flex justify-between">
                <span>Цена:</span>
                <span className="text-yellow-400">{selectedItem.price} монет</span>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-400">
                <span>Примечание:</span>
                <span>Купленные ножи нельзя перепродать</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedItem(null)}
              >
                Закрыть
              </Button>
              
              <Button 
                variant="default" 
                className={`flex-1 ${balance >= selectedItem.price ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600'}`}
                disabled={balance < selectedItem.price}
                onClick={() => handleBuyKnife(selectedItem)}
              >
                Купить
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
