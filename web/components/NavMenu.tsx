import Link from "next/link";
import NavLinks from "./NavLinks";

const NavMenu = () => {
  return (
    <header className="flex justify-between items-center px-5 h-14 bg-primary border-b border-border">
      <div className={`font-ibm text-3xl`}>
        <Link href="/">reddit-lite</Link>
      </div>
      <NavLinks />
    </header>
  );
};

export default NavMenu;
