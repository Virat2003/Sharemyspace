import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/SpaceDetails.css";
import { enUS } from "date-fns/locale";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Footer from "../components/Footer";


const SpaceDetails = () => {
  const { listingId } = useParams();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);

  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const getListingDetails = async () => {
    try {
      const res = await fetch(`http://localhost:3001/properties/${listingId}`);
      const data = await res.json();
      setListing(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch listing:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    getListingDetails();
  }, [listingId]);

  const handleSelect = (ranges) => {
    setDateRange([ranges.selection]);
  };

  const start = new Date(dateRange[0].startDate);
  const end = new Date(dateRange[0].endDate);
  const dayCount = Math.round((end - start) / (1000 * 60 * 60 * 24)) || 1;

  /* submit booking */
  const customerId = useSelector((state) => state?.user?._id);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const bookingForm = {
        customerId,
        listingId,
        hostId: listing.creator._id,
        startDate: dateRange[0].startDate.toDateString(),
        endDate: dateRange[0].endDate.toDateString(),
        totalPrice: listing.price * dayCount,
      };

      const response = await fetch("http://localhost:3001/bookings/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingForm),
      });

      if (response.ok) {
        navigate(`/users/${customerId}/bookings`);
      }
    } catch (err) {
      console.log("Submit Booking Failed.", err.message);
    }
  };

 

  return loading ? (
  <Loader />
  ) : (
    <>
      <Navbar />
      <div className="details-container">
        {/* left section */}
        <div className="details-left">
          <h1 className="listing-title">{listing.title}</h1>

          <div className="listing-location">
            <span>
              {listing.type} •{" "}
              <b className="bold">
                {listing.city}, {listing.state}, {listing.country}
              </b>
            </span>
          </div>

          {/* image grid */}
          <div className="listing-gallery">
            {listing.listingPhotoPaths?.map((img, idx) => (
              <img
                key={idx}
                src={`http://localhost:3001/${img.replace("public", "")}`}
                alt={listing.title}
              />
            ))}
          </div>

          {/* host info */}
          <div className="host-info">
            <img
              src={
                listing.creator?.profileImagePath
                  ? `http://localhost:3001/${listing.creator.profileImagePath.replace(
                      "public",
                      ""
                    )}`
                  : "/default-profile.png"
              }
              alt="Host"
            />
            <div>
              <h3>
                Hosted by {listing.creator?.firstName}{" "}
                {listing.creator?.lastName || ""}
              </h3>
              <p>Verified Host</p>
            </div>
          </div>

          {/* description */}
          <div className="listing-section">
            <h2>Description</h2>
            <p>{listing.description}</p>
          </div>

          {/* highlight */}
          <div className="listing-section">
            <h2>{listing.highlight}</h2>
            <p>{listing.highlightDesc}</p>
          </div>
        </div>

        {/* right sidebar */}
        <div className="details-right">
          <div className="booking-card">
            <h2>Booking: </h2>
            <p className="price">
              ₹{listing.price} <span>/ Day</span>
            </p>

            <DateRange
              ranges={dateRange}
              onChange={handleSelect}
              locale={enUS}
              moveRangeOnFirstSelection={false}
            />

            <div className="booking-summary">
              <p>
                <strong>Check-in:</strong>{" "}
                {dateRange[0].startDate.toDateString()}
              </p>
              <p>
                <strong>Check-out:</strong>{" "}
                {dateRange[0].endDate.toDateString()}
              </p>
              <p>
                <strong>Days:</strong> {dayCount}
              </p>
              <p className="total">
                <strong>Total:</strong> ₹{listing.price * dayCount}
              </p>
            </div>

            <button className="book-btn" onClick={handleSubmit}>
              Confirm Booking
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default SpaceDetails;
