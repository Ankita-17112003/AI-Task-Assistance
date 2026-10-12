function Loading() {
  return (
    <div
      className="d-flex align-items-center gap-3 mb-4"
      role="status"
      style={{ color: "#a78bfa" }}
    >
      <div
        className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0"
        style={{
          width: "34px",
          height: "34px",
          background: "#1a1a22",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        <i className="bi bi-stars"></i>
      </div>

      <div className="d-flex align-items-center gap-1">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="spinner-grow spinner-grow-sm"
            aria-hidden="true"
            style={{
              width: "0.5rem",
              height: "0.5rem",
              animationDelay: `${delay}ms`,
            }}
          ></span>
        ))}
        <span className="ms-2 small">AI is thinking...</span>
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

export default Loading;