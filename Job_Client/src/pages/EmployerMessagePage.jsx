import React, { useState, useEffect } from "react";
import EmployerConversationList from "../components/EmployerConversationList";
import { EmployerMessageProvider } from "../components/EmployerMessageContext";
import EmployerMessageDetail from "../components/EmployerMessageDetail";
import { Route, Routes, useParams, useLocation } from "react-router-dom";

const EmployerMessagePage = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const location = useLocation();
  const { userId } = useParams(); // Get userId from URL to control views

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const showConversationList = !isMobile || (isMobile && !location.pathname.includes("/employermessages/"));
  const showMessageDetail = !isMobile || (isMobile && location.pathname.includes("/employermessages/"));

  return (
    <EmployerMessageProvider>
      <div className="w-full h-[85vh] flex gap-4">
        {showConversationList && (
          <div className={isMobile ? "w-full" : "w-[30%]"}>
            <EmployerConversationList isMobile={isMobile} />
          </div>
        )}
        {showMessageDetail && (
          <div className={isMobile ? "w-full" : "bg-white w-[70%] rounded-xl"}>
            <Routes>
              <Route
                path=":userId"
                element={
                  <EmployerMessageDetail
                    isMobile={isMobile}
                    onBack={() => window.history.back()}
                  />
                }
              />
              <Route
                path=""
                element={
                  !isMobile ? (
                    <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center">
                      <div className="text-4xl mb-2">👋</div>
                      <p className="text-lg">Select a conversation to start messaging</p>
                    </div>
                  ) : null
                }
              />
            </Routes>
          </div>
        )}
      </div>
    </EmployerMessageProvider>
  );
};

export default EmployerMessagePage;
