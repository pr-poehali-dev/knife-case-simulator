import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/button';
import { useCaseStore } from '../store/caseStore';

const Navbar = () => {
  const location = useLocation();
  const balance = useCaseStore(state => state.balance);
  
  return (
    <nav className="bg-card border-b border-border py-4 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Link to="/" className="text-2xl font-bold text-primary">КейсКрафт</Link>
        </div>
        
        <div className="flex items-center space-x-6">
          <Link to="/">
            <Button 
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              className="text-lg font-medium"
            >
              Кейсы
            </Button>
          </Link>
          
          <Link to="/inventory">
            <Button 
              variant={location.pathname === '/inventory' ? 'default' : 'ghost'}
              className="text-lg font-medium"
            >
              Инвентарь
            </Button>
          </Link>
          
          <Link to="/shop">
            <Button 
              variant={location.pathname === '/shop' ? 'default' : 'ghost'}
              className="text-lg font-medium"
            >
              Магазин
            </Button>
          </Link>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="px-4 py-2 rounded-md bg-muted flex items-center">
            <span className="text-lg font-bold text-primary">{balance} ₽</span>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
