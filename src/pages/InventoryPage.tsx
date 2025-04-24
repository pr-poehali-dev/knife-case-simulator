import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCaseStore, Knife } from '../store/caseStore';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../components/ui/dialog';

const InventoryPage = () => {
  const { inventory, sellKnife } = useCaseStore();
  const [selectedKnife, setSelectedKnife] = useState<Knife | null>(null);
  const [open, setOpen] = useState(false);
  
  const handleSellKnife = () => {
    if (selectedKnife) {
      sellKnife(selectedKnife.id);
      toast({
        title: "Нож продан",
        description: `Вы продали ${selectedKnife.name} за ${selectedKnife.price} ₽`,
      });
      setOpen(false);
    }
  };
  
  const rarityOrder: Record<string, number> = {
    'common': 1,
    'uncommon': 2,
    'rare': 3,
    'epic': 4,
    'mythic': 5,
    'legendary': 6,
    'gold': 7,
    'titan': 8,
    'divine': 9
  };
  
  // Sort inventory by rarity (highest first)
  const sortedInventory = [...inventory].sort((a, b) => 
    rarityOrder[b.rarity] - rarityOrder[a.rarity]
  );
  
  const rarityNames: Record<string, string> = {
    'common': 'Обычный',
    'uncommon': 'Необычный',
    'rare': 'Редкий',
    'epic': 'Эпический',
    'mythic': 'Мифический',
    'legendary': 'Легендарный',
    'gold': 'Золотой',
    'titan': 'Титан',
    'divine': 'Божественный'
  };
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Ваш инвентарь</h1>
          
          {inventory.length === 0 ? (
            <div className="text-center py-16 bg-card rounded-lg">
              <p className="text-xl text-muted-foreground">Ваш инвентарь пуст. Откройте кейсы, чтобы получить ножи!</p>
              <Button className="mt-4" onClick={() => window.location.href = '/'}>
                Перейти к кейсам
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sortedInventory.map((knife) => (
                <div 
                  key={knife.id}
                  className={`bg-card border-2 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer rarity-${knife.rarity} ${knife.rarity !== 'common' && knife.rarity !== 'uncommon' ? 'glow-effect' : ''}`}
                  onClick={() => {
                    setSelectedKnife(knife);
                    setOpen(true);
                  }}
                >
                  <div className="p-4">
                    <div className="relative h-48 flex items-center justify-center mb-4">
                      <img 
                        src={knife.image} 
                        alt={knife.name} 
                        className="h-full object-contain"
                      />
                    </div>
                    
                    <h3 className="text-lg font-bold truncate">{knife.name}</h3>
                    
                    <div className="flex justify-between items-center mt-2">
                      <span className={`px-2 py-1 rounded text-sm font-medium bg-opacity-20 rarity-${knife.rarity}`}>
                        {rarityNames[knife.rarity]}
                      </span>
                      <span className="font-bold">{knife.price} ₽</span>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mt-2 truncate">
                      Из кейса: {knife.fromCase}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              {selectedKnife && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedKnife.name}</DialogTitle>
                    <DialogDescription>
                      Редкость: {rarityNames[selectedKnife.rarity]}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex justify-center py-4">
                    <div className={`p-6 rounded-lg rarity-${selectedKnife.rarity} ${selectedKnife.rarity !== 'common' && selectedKnife.rarity !== 'uncommon' ? 'glow-effect' : ''}`}>
                      <img 
                        src={selectedKnife.image} 
                        alt={selectedKnife.name} 
                        className="h-48 object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div>
                      <p className="text-sm font-medium">Цена продажи:</p>
                      <p className="text-lg font-bold">{selectedKnife.price} ₽</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Получен из:</p>
                      <p className="text-lg">{selectedKnife.fromCase}</p>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    {'fromShop' in selectedKnife ? (
                      <p className="text-muted-foreground">Этот нож нельзя продать, так как он куплен в магазине</p>
                    ) : (
                      <Button onClick={handleSellKnife} className="w-full">
                        Продать за {selectedKnife.price} ₽
                      </Button>
                    )}
                  </DialogFooter>
                </>
              )}
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default InventoryPage;
