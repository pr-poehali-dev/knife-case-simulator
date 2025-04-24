import { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { toast } from '../components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { useCaseStore } from '../store/caseStore';

interface CaseModelProps {
  caseId: string;
  caseName: string;
  price: number;
  imageSrc?: string;
  isFree?: boolean;
}

const CaseModel = ({ caseId, caseName, price, imageSrc = '/placeholder.svg', isFree = false }: CaseModelProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOpening, setIsOpening] = useState(false);
  const [isRotating, setIsRotating] = useState(true);
  const { addKnifeToInventory, updateBalance } = useCaseStore();
  const navigate = useNavigate();
  
  const handleOpenCase = () => {
    const balance = useCaseStore.getState().balance;
    
    // Check if user has enough balance
    if (!isFree && balance < price) {
      toast({
        title: "Недостаточно средств",
        description: "Пополните баланс для открытия этого кейса",
        variant: "destructive",
      });
      return;
    }
    
    // Deduct price if not free
    if (!isFree) {
      updateBalance(-price);
    }
    
    // Start opening animation
    setIsRotating(false);
    setIsOpening(true);
    
    // After animation completes, generate reward
    setTimeout(() => {
      generateReward(caseId);
      setIsOpening(false);
      setIsRotating(true);
    }, 1500);
  };
  
  const rarityWeights = {
    common: isFree ? 80 : 60,
    uncommon: isFree ? 15 : 20,
    rare: isFree ? 4 : 10,
    epic: isFree ? 0.7 : 5,
    mythic: isFree ? 0.2 : 2.5,
    legendary: isFree ? 0.08 : 1.5,
    gold: isFree ? 0.01 : 0.5, 
    titan: isFree ? 0.005 : 0.3,
    divine: isFree ? 0.001 : 0.2
  };
  
  const generateReward = (caseId: string) => {
    // Generate random number between 0-100
    const rand = Math.random() * 100;
    
    // Determine the rarity based on weights
    let selectedRarity = 'common';
    let cumulative = 0;
    
    for (const [rarity, weight] of Object.entries(rarityWeights)) {
      cumulative += weight;
      if (rand <= cumulative) {
        selectedRarity = rarity;
        break;
      }
    }
    
    // Generate knife name based on rarity
    const knifeTypes = ['Штык-нож', 'Керамбит', 'Бабочка', 'Нож с лезвием-крюком', 'Тесак', 'Складной нож'];
    const knifeFinishes = ['Градиент', 'Кровавая паутина', 'Ночь', 'Мраморный градиент', 'Автотроника', 'Дамасская сталь'];
    
    const type = knifeTypes[Math.floor(Math.random() * knifeTypes.length)];
    const finish = knifeFinishes[Math.floor(Math.random() * knifeFinishes.length)];
    
    const knifeId = `knife-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const priceMultipliers = {
      common: 0.5,
      uncommon: 1,
      rare: 3,
      epic: 10,
      mythic: 30,
      legendary: 100,
      gold: 300,
      titan: 800,
      divine: 2000
    };
    
    // Calculate knife price based on case price and rarity
    const knifePrice = Math.round(price * priceMultipliers[selectedRarity as keyof typeof priceMultipliers]);
    
    const knife = {
      id: knifeId,
      name: `${type} | ${finish}`,
      rarity: selectedRarity,
      image: '/placeholder.svg',
      price: knifePrice,
      fromCase: caseName
    };
    
    // Add knife to inventory
    addKnifeToInventory(knife);
    
    // Show toast notification
    toast({
      title: `Вы получили ${knife.name}!`,
      description: `Редкость: ${selectedRarity}`,
      variant: "default",
      className: `border-2 rarity-${selectedRarity}`,
    });
  };
  
  return (
    <div className="relative w-full flex flex-col items-center justify-center" ref={containerRef}>
      <div 
        className={`w-64 h-64 relative cursor-pointer flex items-center justify-center 
          ${isRotating ? 'rotate-3d' : ''} 
          ${isOpening ? 'case-opening' : ''}`}
        onClick={() => containerRef.current?.focus()}
      >
        <div className="w-full h-full border-4 border-accent bg-card rounded-lg p-2 shadow-xl transform-style-preserve-3d flex items-center justify-center">
          <img 
            src={imageSrc} 
            alt={caseName} 
            className="w-full h-full object-contain"
          />
          <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
            <p className="font-bold text-lg bg-black/50 px-4 py-2 rounded-lg">Нажмите, чтобы открыть</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center gap-2">
        <h3 className="text-xl font-bold">{caseName}</h3>
        <p className="text-muted-foreground">
          {isFree ? 'Бесплатно' : `${price} ₽`}
        </p>
        <Button 
          onClick={handleOpenCase} 
          className="mt-2 w-full"
          disabled={isOpening}
        >
          {isOpening ? 'Открывается...' : 'Открыть кейс'}
        </Button>
      </div>
    </div>
  );
};

export default CaseModel;
