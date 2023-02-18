import { FC } from "react";
import Navbar from "../Navbar/Navbar";

const Layout: FC<LayoutProps> = ({ children }) => {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
};

interface LayoutProps {
  children: JSX.Element;
}

export default Layout;
