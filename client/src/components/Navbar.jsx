import Menu from '@mui/icons-material/Menu';
import Person from '@mui/icons-material/Person';
import Search from '@mui/icons-material/Search';
import { IconButton } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link,useNavigate } from "react-router-dom";
import { setLogout } from "../redux/state";
import "../styles/Navbar.css";
import "../styles/variables.css";


const Navbar = () => {
  const [dropdownMenu, setDropdownMenu] = useState(false);

  const user = useSelector((state) => state.user);

  const dispatch = useDispatch();

  const [search, setSearch] = useState("");

  const navigate = useNavigate()

  return (
    <div className="navbar">
      <Link to="/">
        <img src="/assests/logo.png" alt="logo" />
      </Link>

      <div className="navbar_search">
        <input
          type="text"
          placeholder="Search.."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton disabled={search === ""}>
          <Search sx={{ color: "var(--pinkred)" }} onClick={() => {navigate(`/properties/search/${search}`)}} />
        </IconButton>
      </div>

      <div className="navbar_right">
        {user ? (
          <Link to="/create-listing" className="host">
            Become Host
          </Link>
        ) : (
          <Link to="/login" className="host">
            Become A Host
          </Link>
        )}

        <button
          className="navbar_right_account"
          onClick={() => setDropdownMenu(!dropdownMenu)}
        >
          <Menu sx={{ color: "var(--darkgrey)" }} />
          {!user ? (
            <Person sx={{ color: "var(--darkgrey)" }} />
          ) : (
            <img
              src={`http://localhost:3001/${user.profileImagePath.replace(
                "public",
                ""
              )}`}
              alt="profile photo"
              style={{ objectFit: "cover", borderRadius: "50%" }}
            />
          )}
        </button>

        {dropdownMenu && !user && (
          <div className="navbar_right_accountmenu">
            <Link to="/login">Log In</Link>
            <Link to="/register">Sign Up</Link>
          </div>
        )}

        {dropdownMenu && user && (
          <div className="navbar_right_accountmenu">
            <Link
              to={`/users/${user._id}/bookings`}
              onClick={() => setDropdownMenu(false)}
            >
              Bookings
            </Link>
            <Link
              to={`/owners/${user._id}/bookings`}
              onClick={() => setDropdownMenu(false)}
            >
              Owner Dashboard
            </Link>
            <Link
              to={`/users/${user._id}/properties`}
              onClick={() => setDropdownMenu(false)}
            >
              My SpaceList
            </Link>
            <Link to="/create-listing" onClick={() => setDropdownMenu(false)}>
              Create Listing
            </Link>

            <Link
              to="/login"
              onClick={() => {
                dispatch(setLogout());
                setDropdownMenu(false);
              }}
            >
              Log Out
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};
export default Navbar;
