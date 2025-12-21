import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Stack,
  Typography
} from "@mui/material";

// admin panel added
const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await fetch(
        "http://localhost:3001/admin/bookings",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setBookings(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const res = await fetch(
        `http://localhost:3001/admin/bookings/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ status }),
        }
      );
      const updated = await res.json();
      setBookings((s) =>
        s.map((x) => (x._id === updated._id ? updated : x))
      );
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Bookings
      </Typography>

      <TableContainer sx={{ maxHeight: 500 }}>
        <Table stickyHeader>
          <TableHead
            sx={{
              backgroundColor: "#1976d2",
            }}>
            <TableRow>
              <TableCell><b>Space</b></TableCell>
              <TableCell><b>Customer</b></TableCell>
              <TableCell><b>Dates</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell align="center"><b>Action</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {bookings.map((b) => (
              <TableRow key={b._id} hover>
                <TableCell>
                  {b.listingId?.title || "—"}
                </TableCell>

                <TableCell>
                  {b.customerId?.firstName} {b.customerId?.lastName}
                </TableCell>

                <TableCell>
                  {b.startDate} - {b.endDate}
                </TableCell>

                <TableCell>
                  ₹{b.totalPrice}
                </TableCell>

                <TableCell sx={{ textTransform: "capitalize" }}>
                  {b.status}
                </TableCell>

                <TableCell align="center">
                  <Stack direction="row" spacing={1} justifyContent="center">
                    <Button
                      size="small"
                      variant="contained"
                      color="success"
                      onClick={() => updateStatus(b._id, "confirmed")}
                    >
                      Confirm
                    </Button>

                    <Button
                      size="small"
                      variant="contained"
                      color="error"
                      onClick={() => updateStatus(b._id, "rejected")}
                    >
                      Reject
                    </Button>

                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => updateStatus(b._id, "pending")}
                    >
                      Pending
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default AdminBookings;
