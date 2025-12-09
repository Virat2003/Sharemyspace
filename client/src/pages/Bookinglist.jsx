import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ListingCard from "../components/ListingCard";
import Loader from "../components/Loader";
import Navbar from "../components/Navbar";
import { setBookingList } from "../redux/state";
import "../styles/Bookinglist.css";
import Footer from "../components/Footer"

const Bookinglist = () => {
  const [loading, setLoading] = useState(true);
  const userId = useSelector((state) => state.user._id);
  const bookingList = useSelector((state) => state.user.bookingList);

  const dispatch = useDispatch();

  const getBookingList = async () => {
    try {
      const response = await fetch(
        `http://localhost:3001/users/${userId}/bookings`,
        {
          method: "GET",
        }
      );

      const data = await response.json();
      dispatch(setBookingList(data));
      setLoading(false);
    } catch (err) {
      console.log("Fetch Trip List failed!", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    getBookingList();
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Your Booking List</h1>
      <div className="list">
        {bookingList?.map((b) => {
          const { _id, listingId, startDate, endDate, totalPrice, status, booking = true } = b;
          if (!listingId) {
            return (
              <div key={_id} className="removed-listing">
                <h3>Listing removed</h3>
                <p>
                  {startDate} - {endDate}
                </p>
                <p>
                  <strong>₹{totalPrice}</strong>
                </p>
                <p>
                  <strong>Status:</strong> {status || "pending"}
                </p>
              </div>
            );
          }

          return (
            <ListingCard
              key={_id}
              _id={listingId._id}
              creator={listingId.creator}
              listingPhotoPaths={listingId.listingPhotoPaths}
              city={listingId.city}
              state={listingId.state}
              country={listingId.country}
              category={listingId.category}
              startDate={startDate}
              endDate={endDate}
              totalPrice={totalPrice}
              booking={booking}
              status={status}
            />
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default Bookinglist;
