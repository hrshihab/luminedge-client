"use client";
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { Schedule } from "@/app/types";
import { MdOutlinePersonOutline } from "react-icons/md";
import { getUserIdFromToken } from "@/app/helpers/jwt";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const BookingId = ({ params }: { params: { bookingId: string } }) => {
  console.log(params);

  const [value, onChange] = useState<Value>(new Date());
  const [testType, setTestType] = useState<string>("Paper Based");
  const [testSystem, setTestSystem] = useState<string>("Academic");
  const [scheduleData, setScheduleData] = useState<Schedule[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  console.log(userId);

  // Function to fetch schedule data based on selected date
  const fetchScheduleData = async (selectedDate: Date) => {
    try {
      const formattedDate = selectedDate.toLocaleDateString("en-CA");
      const response = await axios.get(
        `http://localhost:5000/api/v1/schedule/${formattedDate}`
      );
      setScheduleData(response.data.schedules);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  useEffect(() => {
    setUserId(getUserIdFromToken());
  }, [userId]);

  // Use useEffect to trigger fetch when 'value' (selected date) changes
  useEffect(() => {
    if (value instanceof Date) {
      fetchScheduleData(value);
    }
  }, [value]);
  const handleSlotSelect = (slotId: string) => {
    setSelectedSlotId(slotId);
  };

  const handleProceed = async () => {
    if (selectedSlotId) {
      try {
        console.log(selectedSlotId, testType, testSystem);
        // Make the API call to book the selected slot
        const response = await axios.post(
          `http://localhost:5000/api/v1/user/book-slot`,
          {
            slotId: selectedSlotId,
            userId,
            scheduleId: params.bookingId,
            status: "active",
            testType,
            testSystem,
          }
        );
        console.log("Booking successful:", response.data);
        alert("Slot booked successfully!"); // Optional: show confirmation to the user
      } catch (error) {
        console.error("Error booking slot:", error);
        alert("Failed to book the slot. Please try again."); // Optional: show error to the user
      }
    }
  };

  return (
    <div className="w-full mx-auto">
      <div className="flex flex-col items-start justify-center my-8">
        <h3 className="text-xl text-gray-800 font-semibold">
          Please Select Your
        </h3>
        <h1 className="text-3xl font-bold">Mock Test Date and Time</h1>
      </div>

      <div className="grid grid-cols-2 gap-28 mb-8">
        <div className="w-full flex flex-col items-start">
          <label htmlFor="testType">Test Type</label>
          <select
            className="select select-bordered bg-[#FACE39] text-black w-full"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="Paper Based">Paper Based</option>
            <option value="Computer Based">Computer Based</option>
          </select>
        </div>

        <div className="w-full flex flex-col items-start">
          <label htmlFor="testSystem">Test System</label>
          <select
            className="select select-bordered bg-[#FACE39] text-black w-full"
            value={testSystem}
            onChange={(e) => setTestSystem(e.target.value)}
          >
            <option value="Academic">Academic</option>
            <option value="General Training">General Training</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 mx-auto ">
        {/* Calendar Component */}
        <Calendar onChange={onChange} value={value} />

        {/* Display fetched schedule data */}
        <div className="mt-8 w-[90%] mx-auto ">
          {scheduleData.length > 0 ? (
            scheduleData.map((schedule, index) => (
              <div
                key={index}
                className="w-full  grid grid-cols-2 gap-4  mt-2 rounded"
              >
                {/* <p>Course ID: {schedule.courseId}</p>
        <p>Status: {schedule.status}</p>
        <p>Test Type: {schedule.testType}</p>
        <p>Test System: {schedule.testSystem}</p> */}
                {schedule.timeSlots.map((slot, slotIndex) => (
                  <div
                    key={slotIndex}
                    className={`mt-2 pl-4 py-2 w-[90%] rounded-lg ${
                      selectedSlotId === slot.slotId
                        ? "bg-yellow-300"
                        : "bg-gray-100"
                    } hover:bg-[#FACE39] cursor-pointer`}
                    onClick={() => handleSlotSelect(slot.slotId)}
                  >
                    <div className="grid grid-cols-2">
                      <div>
                        <h3 className=" text-sm font-semibold text-gray-800">
                          {slot.startTime.slice(0, 5)}
                          <p className="text-xs text-gray-500">Start</p>
                        </h3>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-800">
                          {slot.endTime.slice(0, 5)}
                          <p className="text-xs text-gray-500">End</p>
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3 text-xs">
                      <MdOutlinePersonOutline />
                      <p className="text-gray-800 mr-8">Available Seats</p>
                      {slot.slot}
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p>No schedules available for this date.</p>
          )}
        </div>
      </div>
      <div className="w-full flex justify-end mt-4">
        <button
          className="btn bg-[#FACE39] text-black hover:bg-white hover:border-2 hover:border-[#FACE39] hover:text-black rounded-full px-8 shadow-lg"
          disabled={!selectedSlotId} // Enable if a slot is selected
          onClick={handleProceed}
        >
          Proceed
        </button>
      </div>
    </div>
  );
};

export default BookingId;
