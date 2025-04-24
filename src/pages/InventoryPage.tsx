import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';
import { caseStore, Knife } from '../store/caseStore';
import { toast } from '../components/ui/use-toast';

export default function InventoryPage() {
  const [inventory, setInventory] = useState<Knife[]>(caseStore.inventory);
  const [balance, setBalance] = useState(caseStore.balance);
  const [selectedKnife, setSelectedKnife] = useState<Knife | null>(null);
  
  // Обновление состояния при изменениях
  useEffect(() => {
    const interval = setInterval(() => {
      setInventory(caseStore.inventory);
      setBalance(caseStore.balance);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleSellKnife = (knife: Knife) => {
    caseStore.sellKnife(knife.id);
    setSelectedKnife(null);
    
    toast({
      title: "Нож продан",
      description: `Вы получили ${knife.price} монет за "${knife.name}"`,
    });
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
        <h1 className="text-3xl font-bold">Инвентарь</h1>
        <div className="bg-gray-800 py-2 px-4 rounded-full">
          <span className="text-yellow-400 font-semibold">{balance} монет</span>
        </div>
      </div>
      
      {inventory.length === 0 ? (
        <div className="text-center py-20 bg-gray-900 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-400">Ваш инвентарь пуст</h2>
          <p className="mt-2 text-gray-500">Откройте несколько кейсов, чтобы получить предметы</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((knife) => (
            <div 
              key={knife.id} 
              className={`border-2 rounded-lg p-4 cursor-pointer transition-transform hover:scale-105 ${rarityClass(knife.rarity)}`}
              onClick={() => setSelectedKnife(knife)}
            >
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-gray-700 rounded flex items-center justify-center overflow-hidden">
                  <img src={knife.image} alt={knife.name} className="h-12 w-12 object-contain" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">{knife.name}</h3>
                  <p className="text-sm opacity-70">Из кейса: {knife.fromCase}</p>
                  <div className="flex justify-between mt-2">
                    <span className="text-sm">{translateRarity(knife.rarity)}</span>
                    <span className="font-semibold text-yellow-400">{knife.price} монет</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {selectedKnife && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className={`max-w-md w-full rounded-lg p-6 ${rarityClass(selectedKnife.rarity)}`}>
            <h2 className="text-2xl font-bold mb-4">{selectedKnife.name}</h2>
            
            <div className="flex justify-center my-6">
              <div className="h-32 w-32 bg-gray-800 rounded-lg flex items-center justify-center">
                <img src={selectedKnife.image} alt={selectedKnife.name} className="h-24 w-24 object-contain" />
              </div>
            </div>
            
            <div className="space-y-2 mb-6">
              <div className="flex justify-between">
                <span>Редкость:</span>
                <span>{translateRarity(selectedKnife.rarity)}</span>
              </div>
              <div className="flex justify-between">
                <span>Цена:</span>
                <span className="text-yellow-400">{selectedKnife.price} монет</span>
              </div>
              <div className="flex justify-between">
                <span>Из кейса:</span>
                <span>{selectedKnife.fromCase}</span>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setSelectedKnife(null)}
              >
                Закрыть
              </Button>
              
              {!selectedKnife.fromShop && (
                <Button 
                  variant="default" 
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleSellKnife(selectedKnife)}
                >
                  Продать
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
