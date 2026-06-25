function LoadingScreen() {
  return (
    <div className="loading-screen" aria-hidden="true">
      <div className="loading-content">
        <h1 className="loading-title">
          <span className="text-gradient">Movie</span>
          <span>App</span>
        </h1>
        <div className="loading-bar" role="presentation">
          <div className="loading-bar-fill" />
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;
