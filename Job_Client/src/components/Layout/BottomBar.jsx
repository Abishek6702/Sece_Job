import { LayoutDashboard, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BottomBar = ({ activeTab, setActiveTab, sidebarItems }) => {
  const navigate = useNavigate();


  const iconButtonClass = (isActive) =>
    `w-12 h-12 flex items-center justify-center rounded-full cursor-pointer transition-all duration-200 ${
      isActive
        ? "bg-white/15 text-white"
        : "text-[#c5c6c8] hover:bg-white/10 hover:text-white"
    }`;

  return (
    <div className=" fixed bottom-4 left-4 right-4 bg-[#2e3137] rounded-2xl shadow-xl flex justify-around items-center py-2 px-2 z-50">
      {/* Dashboard */}
      <div
        className={iconButtonClass(activeTab === "dashboard")}
        onClick={() => setActiveTab("dashboard")}
        title="Dashboard"
      >
        <LayoutDashboard size={24} strokeWidth={2} />
      </div>

      {/* Sidebar Items */}
      {sidebarItems.slice(0, 4).map((item, index) => {
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
  );
};

export default BottomBar;
