
import { useEffect, useState } from "react";

import { getMatches } from "./api.js";

// Matches page component
export default function Matches({ onDiscover }) {

  // Store the list of mutual matches
  const [matches, setMatches] = useState(null);

  // Store API error messages
  const [error, setError] = useState("");


  // Fetch matches from the backend when the component mounts
  useEffect(() => {

    getMatches()
      .then((data) => {
        // Update the matches list with the API response
        setMatches(data.matches);
      })
      .catch((err) => {
        // Handle errors if the matches request fails
        setError(err.message);
      });

  }, []);


  // Display an error message if matches could not be loaded
  if (error) {
    return (
      <div className="empty">
        <h2>Matches didn't load 😵</h2>
        <p>{error}</p>

        <button className="btn" onClick={onDiscover}>
          Back to Discover 🔥
        </button>
      </div>
    );
  }


  // Display a loading message while fetching matches
  if (!matches) {
    return (
      <div className="empty">
        <p>loading the tea… ☕</p>
      </div>
    );
  }


  // Display an empty state when there are no mutual matches
  if (!matches.length) {
    return (
      <div className="empty">

        <h2>no matches yet 🫠</h2>

        <p>
          matches show up here when you both swipe right.
          no peeking, that's the rule.
        </p>

        {/* Navigate back to Discover to find more profiles */}
        <button className="btn" onClick={onDiscover}>
          Go swipe 🔥
        </button>

      </div>
    );
  }


  // Display all mutual matches
  return (
    <ul className="matches">

      {matches.map((match) => (
        <li key={match.id}>

          {/* Profile photo */}
          <img
            src={match.photo}
            alt={`${match.name}'s profile`}
          />

          {/* Match information */}
          <div>
            <strong>
              {match.name}, {match.age}
            </strong>

            <span>{match.place}</span>
          </div>

        </li>
      ))}

    </ul>
  );
}
