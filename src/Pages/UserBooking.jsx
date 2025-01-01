import  { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const UserBooking = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    checkIn: new Date(),
    checkOut: new Date(),
    guests: 1,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]:  value });
  };

  const handleDateChange = (date, type) => {
    setFormData({ ...formData, [type]: date });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate booking submission logic
    if (formData.name && formData.email) {
      setMessage('Booking confirmed!');
      setError(false);
    } else {
      setMessage('Please fill in all fields.');
      setError(true);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Book Your Stay</h2>
      {message && (
        <div className={`p-4 mb-4 text-white rounded ${error ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="name">Full Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="checkIn">Check-In Date</label>
          <DatePicker
            selected={formData.checkIn}
            onChange={(date) => handleDateChange(date, 'checkIn')}
            dateFormat=" yyyy/MM/dd"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="checkOut">Check-Out Date</label>
          <DatePicker
            selected={formData.checkOut}
            onChange={(date) => handleDateChange(date, 'checkOut')}
            dateFormat="yyyy/MM/dd"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="guests">Number of Guests</label>
          <input
            type="number"
            name="guests"
            id="guests"
            min="1"
            value={formData.guests}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600">Book Now</button>
      </form>
    </div>
  );
};

export default UserBooking;