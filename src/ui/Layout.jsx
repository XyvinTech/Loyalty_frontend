import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import useUiStore, { selectSidebarOpen } from "../store/ui";

// eslint-disable-next-line react/prop-types
const Layout = ({ children }) => {
  const sidebarOpen = useUiStore(selectSidebarOpen);
  const setSidebarOpen = useUiStore((state) => state.setSidebarOpen);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden">
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <main className="flex-1 pb-16">
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
        <footer className="fixed bottom-0 w-full bg-white text-gray-600 text-center py-4 shadow-md">
          <p className="text-sm">
            © {new Date().getFullYear()} CBS Loyalty. All rights reserved. |{" "}
            <a
              href="https://continuityoman.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-800 font-semibold hover:underline"
            >
              Continuity Oman
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
