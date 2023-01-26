import "./App.css";
import banner from "./assets/banner.png";

function ErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="App">
      <header>
        <img alt="banner.png" src={banner}></img>
      </header>

      <h1>An error occurred!</h1>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

export default ErrorFallback;
