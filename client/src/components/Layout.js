import { Outlet } from "react-router-dom";
import Nav from "./nav-component";

const Layout = () => {
  return (
    <>
      <Nav />
      <Outlet />
    </>
  );
};

export default Layout;
