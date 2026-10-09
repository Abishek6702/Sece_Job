import Sidebar from "./Sidebar";
import TopNavbar from "./TopNavbar";
import BottomBar from "./BottomBar";

const DashboardLayout = ({
  children,
  sidebarItems,
  activeTab,
  setActiveTab,
  userName,
  userRole,
  currentUserId,
  socket
}) => {
  return (
    <div className="flex h-screen bg-white font-sans overflow-hidden">
      <div className="hidden md:block">
        {/* Left Sidebar */}
        <Sidebar
          sidebarItems={sidebarItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>

      {/* Main Right Section */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top Navbar */}
        <TopNavbar
          userName={userName}
          userRole={userRole}
          onMessageClick={() => setActiveTab("messages")}
          currentUserId={currentUserId}
          socket={socket}
        />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-5 pb-24 md:pb-5">
          {children}
        </main>
      </div>
      
      {/* bottom Navbar */}

      <div className="md:hidden block">
        <BottomBar
          sidebarItems={sidebarItems}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
    </div>
  );
};

export default DashboardLayout;
