
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { getFeed, swipe, resetDemo } from "./api.js";
import SwipeCard, { CardBody } from "./SwipeCard.jsx";

// Discover page component
export default function Discover({ onViewMatches }) {

  // Store profiles fetched from the backend
  const [cards, setCards] = useState(null);

  // Store API or swipe-related error messages
  const [error, setError] = useState("");

  // Track the direction in which the current card exits
  const [exit, setExit] = useState(null);

  // Store match details when two users like each other
  const [match, setMatch] = useState(null);

  // Prevent multiple swipes from being processed simultaneously
  const busy = useRef(false);


  // Fetch available profiles from the backend
  const load = useCallback(() => {
    setError("");

    getFeed()
      .then((data) => {
        setCards(data.profiles);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, []);


  // Load profiles when the Discover component first mounts
  useEffect(() => {
    load();
  }, [load]);


  // Handle like and pass actions
  const handleSwipe = useCallback(
    (action) => {

      // Ignore additional swipes while one is already processing
      if (busy.current || !cards?.length) return;

      busy.current = true;

      // Get the profile currently displayed
      const profile = cards[0];

      // Trigger the card exit animation
      setExit(action);

      // Send the swipe request to the backend immediately
      // The request runs while the card animation is playing
      const request = swipe(profile.id, action);

      // Wait for the exit animation before removing the card
      setTimeout(async () => {

        // Remove the current profile from the frontend feed
        setCards((currentCards) => currentCards.slice(1));

        // Reset the animation state
        setExit(null);

        try {
          // Wait for the backend to confirm the swipe
          const result = await request;

          // Show the match popup only if the backend confirms a mutual like
          if (result.match) {
            setMatch(result.profile);
          }

        } catch (err) {
          // Display an error if the swipe could not be saved
          setError("That swipe didn't save 😬 check your connection.");

        } finally {
          // Allow the next swipe
          busy.current = false;
        }

      }, 280);
    },
    [cards]
  );


  // Support keyboard controls:
  // Right Arrow = Like
  // Left Arrow = Pass
  useEffect(() => {

    const handleKeyDown = (event) => {

      // Disable keyboard swiping while the match popup is open
      if (match) return;

      if (event.key === "ArrowRight") {
        handleSwipe("like");
      }

      if (event.key === "ArrowLeft") {
        handleSwipe("pass");
      }
    };

    // Register the keyboard event listener
    window.addEventListener("keydown", handleKeyDown);

    // Remove the listener when the component updates or unmounts
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };

  }, [handleSwipe, match]);


  // Show an error screen if profiles could not be loaded
  if (error && !cards) {
    return (
      <div className="empty">
        <h2>Profiles didn't load 😵</h2>
        <p>{error}</p>

        <button className="btn" onClick={load}>
          Try again
        </button>
      </div>
    );
  }


  // Show a loading message while waiting for profiles
  if (!cards) {
    return (
      <div className="empty">
        <p>finding your people… 👀</p>
      </div>
    );
  }


  // Get the current profile and the next profile in the feed
  const [top, next] = cards;


  return (
    <div className="discover">

      {/* Display swipe errors without leaving the Discover page */}
      {error && (
        <p className="toast" role="alert">
          {error}
        </p>
      )}


      {/* Display an empty state when all profiles have been viewed */}
      {!top ? (
        <div className="empty">

          <h2>you've seen everyone 👀</h2>

          <p>
            go touch grass, check your matches, or come back when more people join.
          </p>

          {/* Navigate to the Matches page */}
          <button className="btn" onClick={onViewMatches}>
            See my matches 💘
          </button>

          {/* Reset the demo and load profiles again */}
          <button
            className="btn ghost"
            onClick={async () => {
              try {
                await resetDemo();
                load();
              } catch (err) {
                setError(err.message);
              }
            }}
          >
            Run it back (reset demo)
          </button>

        </div>
      ) : (
        <>

          {/* Profile card stack */}
          <div className="stack">

            {/* Show the next profile behind the current profile */}
            {next && (
              <article className="card behind" aria-hidden="true">
                <CardBody profile={next} />
              </article>
            )}

            {/* Main profile card with swipe animation */}
            <SwipeCard
              key={top.id}
              profile={top}
              exit={exit}
              onSwipe={handleSwipe}
            />

          </div>


          {/* Like and pass buttons */}
          <div className="actions">

            <button
              className="round pass"
              aria-label={`Pass on ${top.name}`}
              onClick={() => handleSwipe("pass")}
              disabled={busy.current}
            >
              ✕
            </button>

            <button
              className="round like"
              aria-label={`Like ${top.name}`}
              onClick={() => handleSwipe("like")}
              disabled={busy.current}
            >
              ♥
            </button>

          </div>

        </>
      )}


      {/* Match popup appears only after a mutual like */}
      {match && (
        <div
          className="match"
          role="dialog"
          aria-modal="true"
          aria-label="It's a match"
        >

          <h2>It's a match! 🎉</h2>

          <p>
            you + {match.name} both swiped right. unhinged (in a good way).
          </p>

          <img src={match.photo} alt={match.name} />

          {/* Open the Matches page */}
          <button
            className="btn"
            onClick={() => {
              setMatch(null);
              onViewMatches();
            }}
          >
            View matches
          </button>

          {/* Close the popup and continue discovering */}
          <button
            className="btn ghost"
            onClick={() => setMatch(null)}
          >
            Keep swiping 🔥
          </button>

        </div>
      )}

    </div>
  );
}
