import { LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab, sidebarItems }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("carvion-key");
    navigate("/");
  };

  const iconButtonClass = (isActive) =>
    `w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-white/15 text-white"
        : "text-[#c5c6c8] hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className="w-20 h-[calc(100vh-2rem)] bg-[#2e3137] flex flex-col items-center py-6 rounded-2xl ml-4 my-4 shadow-xl relative z-10 shrink-0">
      {/* Top Icons */}
      <div className="flex flex-col items-center gap-4">
        {/* Dashboard */}
        <div
          className={iconButtonClass(activeTab === "dashboard")}
          onClick={() => setActiveTab("dashboard")}
          title="Dashboard"
        >
          <LayoutDashboard size={24} strokeWidth={2} />
        </div>

        {/* Sidebar Items */}
        {sidebarItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <div
              key={index}
              className={iconButtonClass(isActive)}
              onClick={() => setActiveTab(item.id)}
              title={item.label}
            >
              <Icon size={24} strokeWidth={2} />
            </div>
          );
        })}
      </div>

      {/* Logout - Always at bottom */}
      <div
        className={`${iconButtonClass(false)} mt-auto`}
        onClick={handleLogout}
        title="Logout"
      >
        <LogOut size={24} strokeWidth={2} />
      </div>
    </div>
  );
};

export default Sidebar;
