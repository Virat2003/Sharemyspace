import "../styles/Footer.css";
import { LocationOn, LocalPhone, Email } from "@mui/icons-material"
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter } from "react-icons/fa";


const Footer = () => {
  return (
    <>
      <footer className="footer">

        {/* LEFT SECTION */}
        <div className="footer_left">
          <h2>ShareMySpace</h2>
          <p>
            ShareMySpace helps you find and list nearby parking spaces, rooms,
            halls, studios and more — with security, transparency, and ease.
          </p>

          {/* Social Icons */}
          <div className="footer_left_socials">
            <div className="footer_left_socials_icon"><FaFacebookF /></div>
            <div className="footer_left_socials_icon"><FaInstagram /></div>
            <div className="footer_left_socials_icon"><FaLinkedinIn /></div>
            <div className="footer_left_socials_icon"><FaTwitter /></div>
          </div>
        </div>

        {/* CENTER LINKS */}
        <div className="footer_center">
          <h3>About</h3>
          <ul>
            <a href="/"><li>Home</li></a>
            <a href="/about"><li>About Us</li></a>
            <a href="/spaces"><li>Spaces</li></a>
            <a href="/how-it-works"><li>How It Works</li></a>
            <a href="/contact"><li>Contact</li></a>
          </ul>
        </div>

        {/* RIGHT CONTACT SECTION */}
        <div className="footer_right">
          <h3>Contact Us</h3>

          <div className="footer_right_info">
          <p><strong><Email /></strong></p>
          <p className="email">sharemyspace@support.com</p>
          </div>

          <div className="footer_right_info">
            <p><strong><LocalPhone /></strong></p>
            <p>+91 12345 43210</p>
          </div>

          <div className="footer_right_info">
            <p><strong><LocationOn /></strong></p>
            <p>ABC, India</p>
          </div>
        </div>

      </footer>

      {/* COPYRIGHT BAR */}
      <div className="footer_bar">
        © {new Date().getFullYear()} ShareMySpace. All rights reserved.
      </div>
    </>
  );
};

export default Footer;


