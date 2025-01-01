import './Home.css'; // Import the CSS for styling the component
import { useNavigate } from "react-router-dom"; // Import useNavigate hook from React Router for navigation

const Home = () => {
  const navigate = useNavigate(); // Initialize the navigate function for programmatic navigation

  // Function to handle card click and navigate to the guest rooms page
  const handleCardClick = () => {
    navigate("/guestrooms"); // Navigate to the "/guestrooms" route
  };

  return (
    <div className="home"> {/* Main container for the home page */}
      {/* Hero Section */}
      <header className="hero-section"> {/* Hero section at the top */}
        <div className="text-container"> {/* Container for the hero text */}
          <h1 className="hero-heading">Guest Room Booking</h1> {/* Main heading */}
          <p className="hero-subheading"> {/* Subheading for a brief description */}
            Amplify Your Experience - Book your dream guesthouse in a few clicks.
          </p>
      
        </div>
        <div className="image-container"> {/* Container for the hero image */}
          <img
            src="/src/assets/brian-babb-XbwHrt87mQ0-unsplash.jpg"
            alt="Luxurious guesthouse scenery" // Accessible alternative text for the image
            className="hero-image"
          />
        </div>
      </header>

      {/* Guest Houses Section */}
      <div className="guest-houses-section"> {/* Section for displaying guest houses */}
        <h2 className="section-title">Explore Our Guest Houses</h2> {/* Section title */}
        <section className="guest-houses-grid"> {/* Grid layout for guest house cards */}
          {[
            // Array of guest house details
            {
              imgSrc: "/src/assets/daniel-barnes-PyFzygP2eNg-unsplash.jpg",
              title: "StayNest Guest House",
            },
            {
              imgSrc: "/src/assets/matt-jones-xpDHTc-pkog-unsplash.jpg",
              title: "Cozy Corner Guest House",
            },
            {
              imgSrc: "/src/assets/ben-eaton-na4mEdwR7uA-unsplash.jpg",
              title: "Dream Den Guest House",
            },
            {
              imgSrc: "/src/assets/abby-rurenko-uOYak90r4L0-unsplash.jpg",
              title: "Rest Realm Guest House",
            },
            {
              imgSrc: "/src/assets/jan-jakub-nanista-z9hvkSDWMIM-unsplash.jpg",
              title: "Nest Nook Guest House",
            },
            {
              imgSrc: "/src/assets/loris-boulinguez-S0VYuu8cw80-unsplash.jpg",
              title: "Haven Hub Guest House",
            },
          ].map((house, index) => (
            <div
              className="guest-house-card" // Individual guest house card
              key={index} // Unique key for each card
              onClick={handleCardClick} // Navigate to guest room details on click
            >
              <img
                src={house.imgSrc} // Image source for the guest house
                alt={house.title || "Guest House"} // Accessible alternative text
                className="guest-house-image"
              />
              <h3 className="guest-house-title">{house.title}</h3> {/* Title of the guest house */}
            </div>
          ))}
        </section>
      </div>

      {/* Footer Section */}
      <footer className="footer"> {/* Footer section at the bottom */}
        <p>&copy; {new Date().getFullYear()} Guest Houses. All rights reserved.</p> {/* Copyright information */}
      </footer>
    </div>
  );
};

export default Home; // Export the Home component as default
