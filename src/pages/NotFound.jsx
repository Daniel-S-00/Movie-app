import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main>
      <div className="pattern" />
      <div className="wrapper flex min-h-[60vh] flex-col items-center justify-center text-center">
        <h1 className="mb-2 text-7xl font-bold text-white sm:text-8xl">404</h1>
        <h2 className="mb-4 text-2xl font-semibold text-light-200 sm:text-3xl">
          Page not found
        </h2>
        <p className="mb-6 max-w-md text-light-200">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="rounded-lg bg-light-100/10 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-light-100/20 focus:outline-none focus:ring-2 focus:ring-light-100/40"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}

export default NotFound;
