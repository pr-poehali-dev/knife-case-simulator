import { Link, useLocation } from 'react-router-dom';
import { caseStore } from '../store/caseStore';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const location = useLocation();
  const [balance, setBalance] = useState(caseStore.balance);
  
  // Обновление баланса
  useEffect(() => {
    const interval = setInterval(() => {
      setBalance(caseStore.balance);
    }, 500);
    
    return () => clearInterval(interval);
  }, []);
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  return (
    <nav className="bg-gray-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold">🔪 КейсМастер</span>
            <div className="hidden md:flex ml-10 space-x-6">
              <NavLink to="/" active={isActive("/")}>Главная</NavLink>
              <NavLink to="/inventory" active={isActive("/inventory")}>Инвентарь</NavLink>
              <NavLink to="/shop" active={isActive("/shop")}>Магазин</NavLink>
            </div>
          </div>
          
          <div className="flex items-center">
            <div className="bg-gray-800 py-2 px-4 rounded-full mr-4">
              <span className="text-yellow-400 font-semibold">{balance} монет</span>
            </div>
          </div>
        </div>
        
        <div className="md:hidden flex justify-around pb-4">
          <NavLink to="/" active={isActive("/")}>Главная</NavLink>
          <NavLink to="/inventory" active={isActive("/inventory")}>Инвентарь</NavLink>
          <NavLink to="/shop" active={isActive("/shop")}>Магазин</NavLink>
        </div>
      </div>
    </nav>
  );
}

interface NavLinkProps {
  to: string;
  active: boolean;
  children: React.ReactNode;
}

function NavLink({ to, active, children }: NavLinkProps) {
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium transition-colors hover:text-white ${
        active 
          ? 'text-white border-b-2 border-purple-500' 
          : 'text-gray-400 hover:text-gray-200'
      }`}
    >
      {children}
    </Link>
  );
}
