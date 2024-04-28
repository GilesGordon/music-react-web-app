import { Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import "./index.css"
// import Nav from "react-bootstrap/Nav";
function Nav() {
  const { pathname } = useLocation();
 return (
   <nav className="">
    <Navbar>
        <Link className={`nav-link ${pathname.includes("Home") ? "active" : ""}`} to="/Home">Home</Link>
        <Link className={`nav-link ${pathname.includes("Search") ? "active" : ""}`} to="/Search">Search</Link>
     </Navbar>
   </nav>
 );
}
export default Nav;