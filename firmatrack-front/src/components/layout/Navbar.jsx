import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white border-b shadow-sm px-8 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-10">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">
            FirmaTrack
          </h1>

          <div className="flex gap-8 text-sm font-medium">
            <NavLink 
              to="/cheptel"
              className={({ isActive }) =>
                isActive 
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1" 
                  : "text-gray-600 hover:text-gray-900 transition"
              }
            >
              Cheptel (Animaux)
            </NavLink>

            <NavLink 
              to="/production-lait"
              className={({ isActive }) =>
                isActive 
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1" 
                  : "text-gray-600 hover:text-gray-900 transition"
              }
            >
              Production Lait
            </NavLink>

            <NavLink 
              to="/lots"
              className={({ isActive }) =>
                isActive 
                  ? "text-blue-600 border-b-2 border-blue-600 pb-1" 
                  : "text-gray-600 hover:text-gray-900 transition"
              }
            >
              Lots
            </NavLink>
          </div>
        </div>

        <div className="text-sm text-gray-500">
          Ferme El Baraka • Connecté
        </div>
      </div>
    </nav>
  );
};

export default Navbar;