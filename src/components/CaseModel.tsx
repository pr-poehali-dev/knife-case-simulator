import { useEffect, useRef, useState } from 'react';
import { Button } from './ui/button';
import { toast } from './ui/use-toast';
import { caseStore, Knife, KnifeRarity } from '../store/caseStore';

interface CaseModelProps {
  caseId: string;
  caseName: string;
  price: number;
  isFree?: boolean;
}

export default function CaseModel({ caseId, caseName, price, isFree = false }: CaseModelProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isRotating, setIsRotating] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [rotationZ, setRotationZ] = useState(0);
  
  useEffect(() => {
    if (isRotating) {
      const interval = setInterval(() => {
        setRotationY((prev) => prev + 1);
      }, 50);
      
      return () => clearInterval(interval);
    }
  }, [isRotating]);
  
  const handleMouseDown = () => {
    setIsRotating(true);
  };
  
  const handleMouseUp = () => {
    setIsRotating(false);
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isRotating || !containerRef.current) return;
    
    const { clientX, clientY } = e;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    
    const moveX = (clientY - centerY) / 5;
    const moveY = (clientX - centerX) / 5;
    
    setRotationX(-moveX);
    setRotationY(moveY);
  };
  
  const openCase = () => {
    if (isOpening) return;
    
    // Проверка баланса
    if (!isFree && caseStore.balance < price) {
      toast({
        title: "Недостаточно средств",
        description: `Необходимо ${price} монет для открытия этого кейса`,
        variant: "destructive"
      });
      return;
    }
    
    // Уменьшение баланса
    if (!isFree) {
      caseStore.updateBalance(-price);
    }
    
    setIsOpening(true);
    
    // Анимация открытия
    let counter = 0;
    const openingInterval = setInterval(() => {
      counter++;
      setRotationZ(counter * 5);
      
      if (counter >= 36) {
        clearInterval(openingInterval);
        setTimeout(() => {
          const knife = generateRandomKnife(caseId, caseName, isFree);
          caseStore.addKnifeToInventory(knife);
          
          toast({
            title: "Поздравляем!",
            description: `Вы получили: ${knife.name} (${translateRarity(knife.rarity)})`,
            variant: "default",
            className: `bg-opacity-90 bg-${getRarityColor(knife.rarity)}-500`
          });
          
          setIsOpening(false);
          setRotationZ(0);
        }, 500);
      }
    }, 20);
  };
  
  const caseStyle = {
    transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) rotateZ(${rotationZ}deg)`,
    transition: isRotating ? 'none' : 'transform 0.5s ease-out',
  };
  
  return (
    <div className="flex flex-col items-center justify-center gap-4 p-4">
      <h2 className="text-xl font-bold">{caseName}</h2>
      <div
        ref={containerRef}
        className="relative w-64 h-64 perspective-1000 cursor-pointer"
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div
          className="w-full h-full bg-gradient-to-b from-gray-700 to-gray-900 rounded-md shadow-xl flex items-center justify-center"
          style={caseStyle}
        >
          <div className="case-lid absolute inset-0 bg-gradient-to-r from-purple-500 to-blue-600 rounded-md opacity-80">
            <div className="case-lock absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-yellow-500 rounded-full shadow-inner flex items-center justify-center">
              <span className="text-xs">🔒</span>
            </div>
          </div>
          <div className="case-body absolute inset-0 border-4 border-gray-800 rounded-md transform translate-z-2"></div>
        </div>
      </div>
      
      <Button 
        variant="default" 
        className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600"
        disabled={isOpening}
        onClick={openCase}
      >
        {isFree ? "Открыть бесплатно" : `Открыть за ${price} монет`}
      </Button>
    </div>
  );
}

// Вспомогательные функции
function generateRandomKnife(caseId: string, caseName: string, isFree: boolean): Knife {
  // Определение шансов выпадения разных редкостей в зависимости от типа кейса
  let rarityChances: Record<KnifeRarity, number>;
  
  if (isFree) {
    rarityChances = {
      common: 70,
      uncommon: 20,
      rare: 7,
      epic: 2,
      mythic: 0.8,
      legendary: 0.15,
      gold: 0.04,
      titan: 0.007,
      divine: 0.003
    };
  } else if (caseId === 'basic-case') {
    rarityChances = {
      common: 45,
      uncommon: 30,
      rare: 15,
      epic: 6,
      mythic: 3,
      legendary: 0.7,
      gold: 0.2,
      titan: 0.09,
      divine: 0.01
    };
  } else {
    // premium case
    rarityChances = {
      common: 25,
      uncommon: 30,
      rare: 25,
      epic: 12,
      mythic: 5,
      legendary: 2,
      gold: 0.7,
      titan: 0.2,
      divine: 0.1
    };
  }
  
  // Генерация случайной редкости
  const randomNum = Math.random() * 100;
  let accumulatedChance = 0;
  let selectedRarity: KnifeRarity = 'common';
  
  for (const [rarity, chance] of Object.entries(rarityChances)) {
    accumulatedChance += chance;
    if (randomNum <= accumulatedChance) {
      selectedRarity = rarity as KnifeRarity;
      break;
    }
  }
  
  // Генерация цены на основе редкости
  const basePrices: Record<KnifeRarity, number> = {
    common: 50,
    uncommon: 150,
    rare: 450,
    epic: 1200,
    mythic: 3000,
    legendary: 7500,
    gold: 15000,
    titan: 30000,
    divine: 100000
  };
  
  const basePrice = basePrices[selectedRarity];
  const randomFactor = 0.8 + Math.random() * 0.4; // Random factor between 0.8 and 1.2
  const price = Math.round(basePrice * randomFactor);
  
  // Генерация имени ножа
  const knifeTypes = ['Керамбит', 'Штык-нож', 'Бабочка', 'Охотничий нож', 'Складной нож', 'Кинжал', 'Тесак'];
  const knifePatterns = [
    'Градиент', 'Сажа', 'Мраморный узор', 'Кровавая паутина', 'Автотроника', 
    'Ночь', 'Дамасская сталь', 'Тигр', 'Волны', 'Ультрафиолет', 'Расцветка'
  ];
  
  const knifeType = knifeTypes[Math.floor(Math.random() * knifeTypes.length)];
  const knifePattern = knifePatterns[Math.floor(Math.random() * knifePatterns.length)];
  
  return {
    id: `${caseId}-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
    name: `${knifeType} | ${knifePattern}`,
    rarity: selectedRarity,
    image: '/placeholder.svg',
    price,
    fromCase: caseName
  };
}

function getRarityColor(rarity: KnifeRarity): string {
  switch (rarity) {
    case 'common': return 'gray';
    case 'uncommon': return 'blue';
    case 'rare': return 'purple';
    case 'epic': return 'pink';
    case 'mythic': return 'red';
    case 'legendary': return 'orange';
    case 'gold': return 'amber';
    case 'titan': return 'lime';
    case 'divine': return 'emerald';
    default: return 'gray';
  }
}

function translateRarity(rarity: KnifeRarity): string {
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
}
