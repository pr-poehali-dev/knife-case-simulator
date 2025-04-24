import { useEffect, useState } from 'react';
import CaseModel from '../components/CaseModel';
import { caseStore } from '../store/caseStore';

export default function HomePage() {
  const [cases, setCases] = useState(caseStore.cases);
  const [balance, setBalance] = useState(caseStore.balance);
  
  // Обновление состояния при изменениях
  useEffect(() => {
    const interval = setInterval(() => {
      setCases(caseStore.cases);
      setBalance(caseStore.balance);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Открывай Кейсы</h1>
        <div className="bg-gray-800 py-2 px-4 rounded-full">
          <span className="text-yellow-400 font-semibold">{balance} монет</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {cases.map((caseItem) => (
          <div key={caseItem.id} className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col items-center">
            <CaseModel 
              caseId={caseItem.id} 
              caseName={caseItem.name} 
              price={caseItem.price} 
              isFree={caseItem.isFree}
            />
          </div>
        ))}
      </div>
      
      <div className="mt-12 p-6 bg-gray-900 rounded-lg">
        <h2 className="text-2xl font-bold mb-4">О шансах выпадения</h2>
        <p className="mb-4">Шансы выпадения предметов зависят от типа кейса:</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-gray-700 rounded p-4">
            <h3 className="font-bold text-lg mb-2">Бесплатный кейс</h3>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-400">Обычный: 70%</li>
              <li className="text-blue-400">Необычный: 20%</li>
              <li className="text-purple-400">Редкий: 7%</li>
              <li className="text-pink-400">Эпический: 2%</li>
              <li className="text-red-400">Мифический: 0.8%</li>
              <li className="text-orange-400">Легендарный: 0.15%</li>
              <li className="text-amber-400">Золотой: 0.04%</li>
              <li className="text-lime-400">Титановый: 0.007%</li>
              <li className="text-emerald-400">Божественный: 0.003%</li>
            </ul>
          </div>
          
          <div className="border border-gray-700 rounded p-4">
            <h3 className="font-bold text-lg mb-2">Базовый кейс</h3>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-400">Обычный: 45%</li>
              <li className="text-blue-400">Необычный: 30%</li>
              <li className="text-purple-400">Редкий: 15%</li>
              <li className="text-pink-400">Эпический: 6%</li>
              <li className="text-red-400">Мифический: 3%</li>
              <li className="text-orange-400">Легендарный: 0.7%</li>
              <li className="text-amber-400">Золотой: 0.2%</li>
              <li className="text-lime-400">Титановый: 0.09%</li>
              <li className="text-emerald-400">Божественный: 0.01%</li>
            </ul>
          </div>
          
          <div className="border border-gray-700 rounded p-4">
            <h3 className="font-bold text-lg mb-2">Премиум кейс</h3>
            <ul className="space-y-1 text-sm">
              <li className="text-gray-400">Обычный: 25%</li>
              <li className="text-blue-400">Необычный: 30%</li>
              <li className="text-purple-400">Редкий: 25%</li>
              <li className="text-pink-400">Эпический: 12%</li>
              <li className="text-red-400">Мифический: 5%</li>
              <li className="text-orange-400">Легендарный: 2%</li>
              <li className="text-amber-400">Золотой: 0.7%</li>
              <li className="text-lime-400">Титановый: 0.2%</li>
              <li className="text-emerald-400">Божественный: 0.1%</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
