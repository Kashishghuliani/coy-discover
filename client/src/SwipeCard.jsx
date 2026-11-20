
import { useRef, useState } from "react";

// Minimum horizontal distance required to trigger a swipe
const THRESHOLD = 110;


// SwipeCard component
// Handles dragging, swipe direction, and card exit animations
export default function SwipeCard({ profile, exit, onSwipe }) {

  // Store the initial pointer position when dragging starts
  const start = useRef(null);

  // Track the card's current drag position and active state
  const [drag, setDrag] = useState({
    x: 0,
    y: 0,
    active: false,
  });

  // Track whether the profile image loaded successfully
  const [imgOk, setImgOk] = useState(true);


  // Start dragging the profile card
  const handlePointerDown = (event) => {

    // Prevent dragging if the card is already exiting
    if (exit) return;

    // Capture pointer events so dragging continues smoothly
    event.currentTarget.setPointerCapture(event.pointerId);

    // Save the starting pointer coordinates
    start.current = {
      x: event.clientX,
      y: event.clientY,
    };

    // Initialize the drag position
    setDrag({
      x: 0,
      y: 0,
      active: true,
    });
  };


  // Update the card position while the user drags
  const handlePointerMove = (event) => {

    // Ignore movement if dragging has not started
    if (!start.current) return;

    // Calculate horizontal and vertical movement
    const deltaX = event.clientX - start.current.x;
    const deltaY = event.clientY - start.current.y;

    // Move the card horizontally and slightly vertically
    setDrag({
      x: deltaX,
      y: deltaY * 0.3,
      active: true,
    });
  };


  // Handle the end of a drag gesture
  const handlePointerUp = () => {

    // Ignore the event if no drag is in progress
    if (!start.current) return;

    // Clear the starting pointer position
    start.current = null;

    // Swipe right to like the profile
    if (drag.x > THRESHOLD) {
      onSwipe("like");
    }

    // Swipe left to pass the profile
    else if (drag.x < -THRESHOLD) {
      onSwipe("pass");
    }

    // Return the card to its original position
    else {
      setDrag({
        x: 0,
        y: 0,
        active: false,
      });
    }
  };


  // Calculate the card's horizontal exit position
  const x = exit
    ? (exit === "like" ? 1 : -1) * window.innerWidth * 1.2
    : drag.x;

  // Calculate card rotation based on swipe direction
  const rotation = exit
    ? (exit === "like" ? 18 : -18)
    : drag.x / 18;

  // Calculate swipe progress for the Like and Nope indicators
  const progress = Math.min(
    Math.abs(drag.x) / THRESHOLD,
    1
  );


  return (
    <article
      className="card top"

      // Apply horizontal movement, vertical movement, and rotation
      style={{
        transform: `translate(${x}px, ${drag.y}px) rotate(${rotation}deg)`,

        // Disable transition during dragging for smooth movement
        // Enable transition when the card returns or exits
        transition:
          drag.active && !exit
            ? "none"
            : "transform .28s cubic-bezier(.2,.8,.2,1)",
      }}

      // Pointer events support both mouse and touch interactions
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >

      {/* Display profile photo and information */}
      <CardBody
        profile={profile}
        imgOk={imgOk}
        setImgOk={setImgOk}
      />

      {/* Like indicator appears when swiping right */}
      <span
        className="stamp like"
        style={{
          opacity:
            exit === "like"
              ? 1
              : !exit && drag.x > 20
                ? progress
                : 0,
        }}
      >
        Yes!
      </span>

      {/* Pass indicator appears when swiping left */}
      <span
        className="stamp pass"
        style={{
          opacity:
            exit === "pass"
              ? 1
              : !exit && drag.x < -20
                ? progress
                : 0,
        }}
      >
        Nope
      </span>

    </article>
  );
}


// CardBody component
// Displays the profile image, details, bio, and interests
export function CardBody({
  profile,
  imgOk = true,
  setImgOk = () => {},
}) {

  return (
    <>

      {/* Display profile image if it loads successfully */}
      {imgOk ? (
        <img
          src={profile.photo}
          alt={profile.name}
          draggable={false}

          // Show the fallback if the image fails to load
          onError={() => setImgOk(false)}
        />
      ) : (

        // Fallback displaying the first letter of the user's name
        <div className="fallback" aria-hidden="true">
          {profile.name[0]}
        </div>

      )}


      {/* Profile information section */}
      <div className="info">

        {/* Name and age */}
        <h2>
          {profile.name}, <span>{profile.age}</span>
        </h2>

        {/* City, college, or location */}
        <p className="place">
          {profile.place}
        </p>

        {/* Short profile description */}
        <p className="bio">
          {profile.bio}
        </p>

        {/* List of profile interests */}
        <ul className="tags">
          {profile.interests.map((interest) => (
            <li key={interest}>
              {interest}
            </li>
          ))}
        </ul>

      </div>

    </>
  );
}
