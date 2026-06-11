import nextDynamic from "next/dynamic";
const Navbar = nextDynamic(() => import("./Navbar"), { ssr: false });
export default Navbar;
