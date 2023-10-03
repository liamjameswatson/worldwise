import { useParams, useSearchParams } from "react-router-dom";
import styles from "./City.module.css";
import { useEffect, useState } from "react";
import { useCities } from "../contexts/CitiesContext";

import BackButton from "./BackButton";
import Spinner from "./Spinner";

const formatDate = (date) =>
  new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    weekday: "long",
  }).format(new Date(date));

const flagemojiToPNG = async (flag) => {
  const countryCode = Array.from(flag, (codeUnit) => codeUnit.codePointAt())
    .map((char) => String.fromCharCode(char - 127397).toLowerCase())
    .join("");

  const imageUrl = `https://flagcdn.com/24x18/${countryCode}.png`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(<img src={imageUrl} alt="flag" />);
    };
    img.onerror = () => {
      reject(new Error("Failed to load flag image"));
    };
    img.src = imageUrl;
  });
};

function City() {
  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCities();
  const [flagImage, setFlagImage] = useState(null); // State to hold the resolved flag image

  useEffect(() => {
    getCity(id);
  }, [id, getCity]);

  const { cityName, emoji, date, notes } = currentCity;

  useEffect(() => {
    if (emoji) {
      // Fetch the flag image when emoji is available
      flagemojiToPNG(emoji)
        .then((imageElement) => {
          setFlagImage(imageElement);
        })
        .catch((error) => {
          console.error("Error loading flag image:", error);
        });
    }
  }, [emoji]);

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
        <span>{flagImage}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>
      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;


