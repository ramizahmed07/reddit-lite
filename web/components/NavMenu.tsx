import Link from "next/link";

import NavLinks from "./NavLinks";

export default function NavMenu() {
  return (
    <header className="flex justify-between items-center  px-5 h-14 bg-primary border-b border-border">
      <div className={`font-ibm text-3xl`}>
        <Link href="/">reddit-lite</Link>
      </div>
      <div className="flex items-center justify-between">
        <NavLinks />
      </div>
    </header>
  );
}
