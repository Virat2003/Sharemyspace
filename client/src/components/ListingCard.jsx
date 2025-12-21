import ArrowBackIosNew from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  // const ignoreNavRef = useRef(false);

  const handleCardClick = (e) => {
    // debug: log click target and whether it's inside slider
    try {
      const insideSlider = !!(e?.target && e.target.closest && e.target.closest('.slider-container'));
      // eslint-disable-next-line no-console
      console.debug('ListingCard click:', { target: e?.target, insideSlider });
      if (insideSlider) return;
    } catch (err) {
      // ignore
    }
    // if (ignoreNavRef.current) {
    //   // reset flag and do not navigate
    //   ignoreNavRef.current = false;
    //   return;
    // }
    navigate(`/properties/${id}`);
  };

  return (
    <div onClick={handleCardClick} style={{ textDecoration: "none", color: "inherit", cursor: 'pointer' }}>
      <div className="listing-card">
        <div className="slider-container">
          <div
            className="slider"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {listingPhotoPaths?.map((photo, index) => (
              <div
                key={index}
                className="slide"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // ignoreNavRef.current = true;
                  goToNextSlide();
                }}
              >
                <img
                  src={`http://localhost:3001/${photo.replace("public", "")}`}
                  alt={`photo ${index + 1}`}
                  onClick={(e) => {
                    e.preventDefault();
                    // e.stopPropagation();
                    // ignoreNavRef.current = true;
                    // goToNextSlide();
                    navigate(`/properties/${id}`);
                  }}
                  style={{ cursor: 'pointer' }}
                />
                <div
                  className="prev-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // ignoreNavRef.current = true;
                    goToPrevSlide();
                  }}
                >
                  <ArrowBackIosNew sx={{ fontSize: "15px" }} />
                </div>
                <div
                  className="next-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    // ignoreNavRef.current = true;
                    goToNextSlide();
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
    </div>
  );
};

export default ListingCard;
