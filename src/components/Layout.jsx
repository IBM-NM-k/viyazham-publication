import { Outlet } from "react-router-dom";
import Header from "./Header";

// Every route renders inside this Layout. Header stays mounted once and
// never re-renders on navigation; <Outlet /> is where React Router injects
// whichever page component matches the current URL.
// A <Footer /> can be added here later without touching any page.
function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default Layout;
