import { useEffect } from "react";
import ReactDOM from "react-dom";

const ModalWrapper = ({ children }) => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-start justify-center pt-10 overflow-y-auto">
      {children}
    </div>,
    document.body
  );
};

export default ModalWrapper;
