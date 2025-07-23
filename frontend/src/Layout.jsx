import { Navbar } from "./components/Header/Navbar";
import { Footer } from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default Layout;
