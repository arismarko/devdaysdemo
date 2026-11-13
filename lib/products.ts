export type Movie = {
  id: string;
  name: string;
  director: string;
  type: string;
  price: number;
  details: string;
  showtime: string;
  certificate: string;
  posterClass: string;
};

export const movies: Movie[] = [
  { id: "the-odyssey-imax", name: "The Odyssey", director: "Christopher Nolan", type: "IMAX 70mm · Epic", price: 28, details: "A mythic voyage across impossible seas, presented on the biggest screen.", showtime: "Fri 19:30", certificate: "12A", posterClass: "movie-poster-odyssey" },
  { id: "spider-man-brand-new-day", name: "Spider-Man: Brand New Day", director: "Destin Daniel Cretton", type: "IMAX with Laser · Action", price: 24, details: "Your friendly neighbourhood hero swings into a spectacular new chapter.", showtime: "Sat 20:15", certificate: "12A", posterClass: "movie-poster-spider-man" },
  { id: "the-room-next-door", name: "The Room Next Door", director: "Pedro Almodóvar", type: "IMAX Retrospective · Drama", price: 19, details: "Two old friends reunite in Almodóvar’s vivid English-language drama.", showtime: "Sun 18:00", certificate: "12A", posterClass: "movie-poster-room" },
  { id: "pain-and-glory", name: "Pain and Glory", director: "Pedro Almodóvar", type: "IMAX Retrospective · Drama", price: 18, details: "A filmmaker looks back at desire, memory, creativity, and the people he loved.", showtime: "Tue 20:00", certificate: "15", posterClass: "movie-poster-glory" },
  { id: "volver", name: "Volver", director: "Pedro Almodóvar", type: "IMAX Retrospective · Comedy drama", price: 18, details: "Secrets, resilience, and ghosts collide in a radiant family story.", showtime: "Wed 19:45", certificate: "15", posterClass: "movie-poster-volver" },
  { id: "all-about-my-mother", name: "All About My Mother", director: "Pedro Almodóvar", type: "IMAX Retrospective · Drama", price: 18, details: "An award-winning celebration of motherhood, performance, and found family.", showtime: "Thu 20:10", certificate: "15", posterClass: "movie-poster-mother" },
];

export const moviesById = new Map(movies.map((movie) => [movie.id, movie]));

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value);
