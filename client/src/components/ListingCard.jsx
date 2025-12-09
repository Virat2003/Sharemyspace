import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/ListingCard.css";
import Footer from "./Footer";

const ListingCard = ({
  listingId,
  _id,
  creator,
  listingPhotoPaths,
  city,
  state,
  country,
  category,
  type,
  price,
  startDate,
  endDate,
  totalPrice,
  booking,
  status,
}) => {
  /*Function for  slider for images */
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevSlide = () => {
    const len = listingPhotoPaths?.length || 1;
    setCurrentIndex((prevIndex) => (prevIndex - 1 + len) % len);
  };

  const goToNextSlide = () => {
    const len = listingPhotoPaths?.length || 1;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % len);
  };

  // support both prop names: `_id` (preferred) or `listingId` (legacy)
  const id = _id || listingId;

  return (
    <Link to={`/properties/${id}`} style={{ textDecoration: "none", color: "inherit" }}>
      <div className="listing-card">
        <div className="slider-container">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listingPhotoPaths?.map((photo, index) => (
              <div key={index} className="slide">
                <img
                  src={`http://localhost:3001/${photo.replace("public", "")}`}
                  alt={`photo ${index + 1}`}
                />
                <div
                  className="prev-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevSlide(e);
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className="next-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToNextSlide(e);
                  }}
                >
                  <ArrowForwardIos sx={{ fontSize: "15px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <h3>
          {" "}
          {city}, {state}, {country}{" "}
        </h3>
        <p>
          {" "}
          <h4>{category}</h4>{" "}
        </p>

        {!booking ? (
          <>
            <p>{type}</p>
            <p>
              <span>₹{price}</span> per night
            </p>
          </>
        ) : (
          <>
            <p>
              {startDate} - {endDate}
            </p>
            <p>
              <span>₹{totalPrice}</span> total
            </p>
            {typeof status !== "undefined" && (
              <div className={`status-badge status-${status}`}>
                {status}
              </div>
            )}
          </>
        )}
      </div>
    </Link>
  );
};

export default ListingCard;
