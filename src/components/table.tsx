"use client";
import axios from "axios";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const Table = ({ userId }: { userId: string }) => {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    // Fetch bookings when the component mounts
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/v1/user/bookings/${userId}`
        );
        setBookings(response.data.bookings);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    fetchBookings();
  }, [userId]);

  // Function to delete a booking
  const onDeleteBooking = async (bookingId: string) => {
    try {
      await axios.delete(`http://localhost:5000/api/v1/bookings/${bookingId}`);
      // Update the bookings list after deletion
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking._id !== bookingId)
      );
      toast.success("Booking deleted successfully");
    } catch (error) {
      console.error("Error deleting booking:", error);
    }
  };

  return (
    <table className="table">
      {/* head */}
      <thead>
        <tr>
          <th></th>
          <th>Name</th>
          <th>Date</th>
          <th>Start Time</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Row mapping */}
        {bookings.map((booking: any, index: number) => (
          <tr key={booking._id}>
            <td>{index + 1}</td>
            <td>IELTS</td>
            <td>{booking.bookingDate}</td>
            <td>{booking.startTime.slice(0, 5)}</td>
            <td>{booking.status}</td>

            {/* Re-schedule Button */}
            <td>
              <button
                disabled={booking.status !== "active"}
                onClick={() => onDeleteBooking(booking._id)} // Call delete function
                className={`px-4 py-2 rounded ${
                  booking.status === "active"
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                Re-schedule
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
