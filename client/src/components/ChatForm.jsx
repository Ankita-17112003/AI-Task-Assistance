const ACCENT = "#7c5cff";

function ChatForm({ prompt, setPrompt, onSubmit, loading, theme = "dark" }) {
  const isDark = theme === "dark";

  return (
    <form onSubmit={onSubmit} className="w-100">
      <style>
        {`
      #prompt::placeholder {
        color: ${isDark ? "#b5b5c5" : "#6c757d"} !important;
        opacity: 1 !important;
      }
      .chat-send-btn {
        width: 44px;
        height: 44px;
      }
      @media (max-width: 575.98px) {
        .chat-send-btn {
          width: 38px !important;
          height: 38px !important;
        }
      }
    `}
      </style>

      <label htmlFor="prompt" className="visually-hidden">
        Your Question
      </label>

      <div
        className="d-flex align-items-end gap-2 p-1 p-sm-2 rounded-4 w-100"
        style={{
          background: isDark ? "#1a1a22" : "#f1f3f8",
          border: `1px solid ${
            isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.12)"
          }`,
          minWidth: 0,
        }}
      >
        <textarea
          id="prompt"
          className="form-control border-0 shadow-none px-2 py-1 py-sm-2"
          rows="1"
          placeholder="Ask me anything..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          disabled={loading}
          style={{
            background: "transparent",
            color: isDark ? "#f1f1f5" : "#212529",
            resize: "none",
            minWidth: 0,
            fontSize: "1rem",
            lineHeight: 1.5,
            maxHeight: "30dvh",
            overflowY: "auto",
            fieldSizing: "content",
            opacity: loading ? 0.7 : 1,
          }}
        />

        <button
          type="submit"
          className="btn chat-send-btn rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 p-0"
          disabled={loading || !prompt.trim()}
          aria-label={loading ? "Generating" : "Ask AI"}
          style={{
            "--bs-btn-color": "#fff",
            "--bs-btn-bg": ACCENT,
            "--bs-btn-border-color": ACCENT,
            "--bs-btn-hover-color": "#fff",
            "--bs-btn-hover-bg": "#6a49f0",
            "--bs-btn-hover-border-color": "#6a49f0",
            "--bs-btn-active-color": "#fff",
            "--bs-btn-active-bg": "#6a49f0",
            "--bs-btn-active-border-color": "#6a49f0",
            "--bs-btn-disabled-color": isDark ? "#8b8b99" : "#9a9aa8",
            "--bs-btn-disabled-bg": isDark ? "#2a2a35" : "#dcdce6",
            "--bs-btn-disabled-border-color": isDark ? "#2a2a35" : "#dcdce6",
          }}
        >
          {loading ? (
            <span
              className="spinner-border spinner-border-sm"
              aria-hidden="true"
            ></span>
          ) : (
            <i className="bi bi-arrow-up fs-5"></i>
          )}
        </button>
      </div>
    </form>
  );
}

export default ChatForm;