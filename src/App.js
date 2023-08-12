import React, { useCallback, useEffect, useState } from "react";

import MoviesList from "./components/MoviesList";
import "./App.css";
import AddMovie from "./components/AddMovie";
// const dummyMovies = [
//   {
//     id: 1,
//     title: "Some Dummy Movie",
//     openingText: "This is the opening text of the movie",
//     releaseDate: "2021-05-18",
//   },
//   {
//     id: 2,
//     title: "Some Dummy Movie 2",
//     openingText: "This is the second opening text of the movie",
//     releaseDate: "2021-05-19",
//   },
// ];
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(null);
  const [movies, setMovies] = useState([]);
  const getMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setHasError(null);
    try {
      const response = await fetch(
        "https://react-http-2c057-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );

      if (!response.ok) {
        throw new Error("Something went wrong!");
      }

      const data = await response.json();

      const loadedMovies = [];
      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releaseDate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      console.log(error);
      setHasError(error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log("use effect running!");
    getMoviesHandler();
  }, [getMoviesHandler]);

  const addMovieHandler = async (film) => {
    const response = await fetch(
      "https://react-http-2c057-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(film),
      }
    );

    getMoviesHandler();
    console.log(response);
  };

  let content = <p>Found no movie</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (isLoading) {
    content = <p>loading...</p>;
  }
  if (hasError) {
    content = <p>{hasError.message}</p>;
  }

  return (
    <React.Fragment>
      <section>
        <AddMovie onAddMovie={addMovieHandler} />
      </section>
      <section>
        <button onClick={getMoviesHandler}>Fetch Movies</button>
      </section>
      <section>{content}</section>
    </React.Fragment>
  );
}

export default App;
