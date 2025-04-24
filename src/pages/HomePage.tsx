import Navbar from '../components/Navbar';
import CaseModel from '../components/CaseModel';
import { useCaseStore } from '../store/caseStore';

const HomePage = () => {
  const cases = useCaseStore(state => state.cases);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <div className="flex-1 py-10">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold mb-8 text-center">Открывай кейсы и выигрывай ножи</h1>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cases.map((caseItem) => (
              <div 
                key={caseItem.id}
                className="bg-card rounded-lg p-6 shadow-lg"
              >
                <CaseModel 
                  caseId={caseItem.id}
                  caseName={caseItem.name}
                  price={caseItem.price}
                  imageSrc={caseItem.image}
                  isFree={caseItem.isFree}
                />
              </div>
            ))}
          </div>
          
          <div className="mt-16 max-w-4xl mx-auto bg-card rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Редкости ножей:</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: 'Обычный', rarity: 'common' },
                { name: 'Необычный', rarity: 'uncommon' },
                { name: 'Редкий', rarity: 'rare' },
                { name: 'Эпический', rarity: 'epic' },
                { name: 'Мифический', rarity: 'mythic' },
                { name: 'Легендарный', rarity: 'legendary' },
                { name: 'Золотой', rarity: 'gold' },
                { name: 'Титан', rarity: 'titan' },
                { name: 'Божественный', rarity: 'divine' }
              ].map((rarityInfo) => (
                <div 
                  key={rarityInfo.rarity}
                  className={`p-3 rounded-md flex items-center justify-between rarity-${rarityInfo.rarity} ${rarityInfo.rarity !== 'common' && rarityInfo.rarity !== 'uncommon' ? 'glow-effect' : ''}`}
                >
                  <span className="font-medium">{rarityInfo.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
