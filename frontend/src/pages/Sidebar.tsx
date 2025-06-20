// components/Sidebar.tsx
import React from "react";
import { LogOut, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg p-6 flex flex-col justify-between z-10">
      <div>
        <h2 className="text-2xl font-bold text-blue-600 mb-10">Admin Panel</h2>
        <nav className="space-y-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="flex items-center gap-3 text-gray-700 hover:text-blue-600 transition px-3 py-2 rounded-md hover:bg-blue-50 w-full text-left"
          >
            <Users size={20} />
            <span className="text-sm font-medium">Quản lý người dùng</span>
          </button>
        </nav>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-500 hover:text-red-700 transition px-3 py-2 rounded-md hover:bg-red-50"
      >
        <LogOut size={18} />
        <span className="text-sm">Đăng xuất</span>
      </button>
    </aside>
  );
};

export default Sidebar;
