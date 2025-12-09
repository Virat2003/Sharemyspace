import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Loader from "../components/Loader";
import Footer from "../components/Footer";
import "../styles/Bookinglist.css";
import "../styles/OwnerDashboard.css";

const OwnerDashboard = () => {
  const { ownerId } = useParams();
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(`http://localhost:3001/bookings/owner/${ownerId}`);
      const data = await res.json();
      setBookings(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch owner bookings", err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (bookingId, status) => {
    try {
      const res = await fetch(`http://localhost:3001/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const updated = await res.json();
      setBookings((prev) => prev.map((b) => (b._id === updated._id ? updated : b)));
    } catch (err) {
      console.error("Failed to update status", err.message);
    }
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <Navbar />
      <h1 className="title-list">Owner: Booking Requests</h1>
      <div className="owner-container">
        <div className="owner-list">
          {bookings.map((b) => (
            <div className="owner-card" key={b._id}>
              <div className="owner-card-left">
                {b.listingId && b.listingId.listingPhotoPaths?.length ? (
                  <img src={`http://localhost:3001/${b.listingId.listingPhotoPaths[0].replace("public", "")}`} alt="listing" />
                ) : (
                  <div style={{background:'#f0f0f0', width:'100%', height:'100%'}} />
                )}
              </div>

              <div className="owner-card-center">
                <h4>{b.listingId ? `${b.listingId.city}, ${b.listingId.state}` : 'Listing removed'}</h4>
                <div className="owner-meta">
                  <p><strong>Category:</strong> {b.listingId?.category || '-'}</p>
                  <p><strong>Dates:</strong> {b.startDate} - {b.endDate}</p>
                  <p><strong>Price:</strong> ₹{b.totalPrice}</p>
                </div>
              </div>

              <div className="owner-card-right">
                <div style={{textAlign:'right'}}>
                  <p style={{margin:0}}><strong>Customer</strong></p>
                  <p style={{margin:'6px 0 0 0'}}>{b.customerId ? b.customerId.name : 'Unknown'}</p>
                  <p style={{margin:'2px 0'}}>{b.customerId ? b.customerId.email : ''}</p>
                </div>

                <div style={{display:'flex', gap:8, alignItems:'center'}}>
                  <div className={`status-badge status-${b.status}`}>{b.status}</div>
                </div>

                <div className="owner-actions">
                  <button className="btn-confirm" onClick={() => updateStatus(b._id, "confirmed")}>Confirm</button>
                  <button className="btn-reject" onClick={() => updateStatus(b._id, "rejected")}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OwnerDashboard;
