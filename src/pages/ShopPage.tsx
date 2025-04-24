import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useCaseStore, Knife } from '../store/caseStore';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { toast } from '../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

const ShopPage = () => {
  const { shopKnives, cases, buyKnife, balance } = useCaseStore();
  const [selectedItem, setSelectedItem] = useState<Knife | null>(null);
  const [open, setOpen] = useState(false);
  
  const handleBuyKnife = () => {
    if (selectedItem) {
      if (balance < selectedItem.price) {
        toast({
          title: "Недостаточно средств",
          description: "Пополните баланс для покупки",
          variant: "destructive",
        });
        return;
      }
      
      const success = useCaseStore.getState().buyKnife(selectedItem);
      
      if (success) {
        toast({
          title: "Нож куплен",
          description: `Вы купили ${selectedItem.name} за ${selectedItem.price} ₽`,
        });
        setOpen(false);
      }
    }
  };
  
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
          <h1 className="text-4xl font-bold mb-8 text-center">Магазин</h1>
          
          <Tabs defaultValue="knives" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="knives">Ножи</TabsTrigger>
              <TabsTrigger value="cases">Кейсы</TabsTrigger>
            </TabsList>
            
            <TabsContent value="knives">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {shopKnives.map((knife) => (
                  <div 
                    key={knife.id}
                    className={`bg-card border-2 rounded-lg overflow-hidden shadow-lg transition-transform hover:scale-105 cursor-pointer rarity-${knife.rarity} ${knife.rarity !== 'common' && knife.rarity !== 'uncommon' ? 'glow-effect' : ''}`}
                    onClick={() => {
                      setSelectedItem(knife);
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
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="cases">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {cases.filter(c => !c.isFree).map((caseItem) => (
                  <div 
                    key={caseItem.id}
                    className="bg-card rounded-lg overflow-hidden shadow-lg flex flex-col"
                  >
                    <div className="p-6 flex-1">
                      <div className="h-48 flex items-center justify-center mb-4">
                        <img 
                          src={caseItem.image} 
                          alt={caseItem.name} 
                          className="h-full object-contain"
                        />
                      </div>
                      
                      <h3 className="text-xl font-bold text-center">{caseItem.name}</h3>
                      
                      <div className="mt-4 text-center">
                        <p className="text-lg font-bold">{caseItem.price} ₽</p>
                      </div>
                      
                      <Button 
                        className="w-full mt-4"
                        onClick={() => window.location.href = '/'}
                      >
                        Перейти к открытию
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
              {selectedItem && (
                <>
                  <DialogHeader>
                    <DialogTitle>{selectedItem.name}</DialogTitle>
                    <DialogDescription>
                      Редкость: {rarityNames[selectedItem.rarity]}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <div className="flex justify-center py-4">
                    <div className={`p-6 rounded-lg rarity-${selectedItem.rarity} ${selectedItem.rarity !== 'common' && selectedItem.rarity !== 'uncommon' ? 'glow-effect' : ''}`}>
                      <img 
                        src={selectedItem.image} 
                        alt={selectedItem.name} 
                        className="h-48 object-contain"
                      />
                    </div>
                  </div>
                  
                  <div className="py-4 text-center">
                    <p className="text-sm text-muted-foreground">Купленные в магазине ножи нельзя продать</p>
                    <p className="text-lg font-bold mt-2">Цена: {selectedItem.price} ₽</p>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      onClick={handleBuyKnife} 
                      className="w-full"
                      disabled={balance < selectedItem.price}
                    >
                      {balance < selectedItem.price ? 'Недостаточно средств' : `Купить за ${selectedItem.price} ₽`}
                    </Button>
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

export default ShopPage;
