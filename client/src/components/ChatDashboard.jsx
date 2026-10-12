import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import ChatForm from "./ChatForm";
import Loading from "./Loading";

const ACCENT = "#7c5cff";
const FONT_STACK =
  "'Inter', system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";
const BG_SIDEBAR = "#0b0b0f";

function ChatDashboard() {
  // theme management
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark",
  );

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const isDark = theme === "dark";

  const currentBg = isDark ? "#121217" : "#f8f9fc";
  const currentText = isDark ? "#f1f1f5" : "#212529";
  const currentBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.12)";
  const cardBg = isDark ? "#1a1a22" : "#ffffff";
  const cardHoverBg = isDark ? "#22222d" : "#f1f1f7";
  const mutedText = isDark ? "#8b8b99" : "#6c6c7a";
  const helperText = isDark ? "#6b6b78" : "#8a8a96";

  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (!toast.show) return;

    const timer = setTimeout(() => {
      setToast((prev) => ({ ...prev, show: false }));
    }, 3000);

    return () => clearTimeout(timer);
  }, [toast.show, toast.message]);

  const fetchChats = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/chats");
      setChats(response.data);
    } catch (err) {
      setError("Failed to load chat history.");
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  const handleNewChat = () => {
    setMessages([]);
    setPrompt("");
    setError("");
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);

    setMessages(
      chat.messages?.length
        ? chat.messages
        : [
            { role: "user", content: chat.prompt },
            { role: "assistant", content: chat.response },
          ],
    );

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!prompt.trim() || loading) return;

    const question = prompt.trim();

    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setPrompt("");
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/chat", {
        prompt: question,
        chatId: activeChat?._id || null,
      });

      setActiveChat((prev) => ({
        ...(prev || {}),
        _id: response.data.chatId,
      }));
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.response },
      ]);

      await fetchChats();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to get AI response. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await axios.delete(`http://localhost:5000/api/chats/${chatId}`);

      setChats((prev) => prev.filter((chat) => chat._id !== chatId));

      if (activeChat?._id === chatId) {
        setMessages([]);
        setPrompt("");
      }

      setError("");
      setToast({
        show: true,
        message: "Chat deleted successfully!",
        type: "success",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete chat");
      setToast({
        show: true,
        message: "Failed to delete chat.",
        type: "danger",
      });
    }
  };

  return (
    <div
      className={`d-flex vh-100 overflow-hidden ${
        isDark ? "text-light" : "text-dark"
      }`}
      style={{
        height: "100dvh",
        background: currentBg,
        color: currentText,
        "--bs-body-font-family": FONT_STACK,
        fontFamily: FONT_STACK,
        fontSize: "0.95rem",
        letterSpacing: "-0.005em",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Toast */}
      {toast.show && (
        <div
          className={`toast show position-fixed top-0 end-0 m-3 text-bg-${toast.type} border-0`}
          role="alert"
          style={{ zIndex: 2000, maxWidth: "calc(100vw - 1.5rem)" }}
        >
          <div className="d-flex align-items-center">
            <div className="toast-body">
              <i
                className={`bi ${
                  toast.type === "success"
                    ? "bi-check-circle-fill"
                    : "bi-exclamation-triangle-fill"
                } me-2`}
              ></i>
              {toast.message}
            </div>
            <button
              type="button"
              className="btn-close btn-close-white me-2 ms-auto"
              aria-label="Close"
              onClick={() => setToast((prev) => ({ ...prev, show: false }))}
            ></button>
          </div>
        </div>
      )}

      {/* Desktop sidebar (large screens and up) */}
      <div
        className="d-none d-lg-flex flex-shrink-0"
        style={{ width: "280px" }}
      >
        <Sidebar
          chats={chats}
          onNewChat={handleNewChat}
          onSelectChat={handleSelectChat}
          activeChatId={activeChat?._id}
          onDeleteChat={handleDeleteChat}
          theme={theme}
        />
      </div>

      {/* Mobile + tablet sidebar (offcanvas) */}
      <div
        className="offcanvas offcanvas-start d-lg-none border-0"
        tabIndex="-1"
        id="mobileSidebar"
        aria-label="Chat history"
        style={{
          width: "min(300px, 85vw)",
          background: BG_SIDEBAR,
        }}
      >
        <div className="offcanvas-body p-0 d-flex">
          <Sidebar
            chats={chats}
            onNewChat={handleNewChat}
            onSelectChat={handleSelectChat}
            onDeleteChat={handleDeleteChat}
            activeChatId={activeChat?._id}
            closeOnSelect
            theme={theme}
          />
        </div>
      </div>

      <main
        className="flex-grow-1 d-flex flex-column overflow-hidden"
        style={{ minWidth: 0 }}
      >
        {/* Top bar */}
        <header
          className="px-3 px-md-4 py-2 py-md-3 d-flex justify-content-between align-items-center gap-2 flex-shrink-0"
          style={{
            borderBottom: `1px solid ${currentBorder}`,
            background: currentBg,
          }}
        >
         
<div
  className="d-flex flex-row align-items-center gap-2"
  style={{ minWidth: 0, flex: 1 }}
>
  <button
    type="button"
    className="btn border-0 d-lg-none p-1 flex-shrink-0"
    data-bs-toggle="offcanvas"
    data-bs-target="#mobileSidebar"
    aria-controls="mobileSidebar"
    aria-label="Open chat history"
    style={{ color: currentText }}
  >
    <i className="bi bi-list fs-4"></i>
  </button>

  <h6
    className="mb-0 fw-semibold text-nowrap"
    style={{
      color: currentText,
      fontSize: "14px",
    }}
  >
    AI Text Assistant
  </h6>
</div>


          <div className="d-flex align-items-center gap-2 flex-shrink-0">
            <button
              type="button"
              className="btn btn-sm btn-outline-secondary rounded-pill px-3"
              aria-label={
                theme === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
              onClick={() =>
                setTheme((prev) => (prev === "dark" ? "light" : "dark"))
              }
            >
              <i
                className={`bi ${
                  theme === "dark" ? "bi-sun-fill" : "bi-moon-fill"
                } me-0 me-sm-2`}
              ></i>
              <span className="d-none d-sm-inline">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            </button>

            <button
              type="button"
              className="btn btn-sm d-lg-none rounded-pill px-3"
              style={{ background: ACCENT, color: "#fff", border: "none" }}
              onClick={handleNewChat}
            >
              <i className="bi bi-plus-lg me-0 me-sm-1"></i>
              <span className="d-none d-sm-inline">New</span>
            </button>
          </div>
        </header>

        {/* Messages */}
        <section className="flex-grow-1 overflow-auto" style={{ minHeight: 0 }}>
          <div
            className="container px-3 px-md-4 py-3 py-md-4"
            style={{ maxWidth: "820px" }}
          >
            {messages.length === 0 && (
              <div className="text-center py-3 py-md-4 mt-md-4">
                <div
                  className="d-inline-flex align-items-center justify-content-center mb-3 mb-md-4 rounded-4"
                  style={{
                    width: "60px",
                    height: "60px",
                    background:
                      "linear-gradient(135deg, #7c5cff 0%, #4f8cff 100%)",
                    boxShadow: "0 10px 40px rgba(124,92,255,0.35)",
                  }}
                >
                  <i className="bi bi-stars fs-2 text-white"></i>
                </div>

                <h1
                  className="fw-bold mb-2"
                  style={{
                    letterSpacing: "-0.03em",
                    fontSize: "clamp(1.6rem, 6vw, 2.5rem)",
                  }}
                >
                  What’s on your mind?
                </h1>

                <p
                  className="mb-0 mx-auto"
                  style={{ color: mutedText, maxWidth: "520px" }}
                >
                  Ask a question, learn something new, or get coding help —
                  running privately on your machine.
                </p>

                <div className="row g-2 g-md-3 text-start mt-3 mt-md-4">
                  {[
                    [
                      "bi-code-slash",
                      "Coding",
                      "Write a JavaScript function to debounce user input",
                    ],
                    [
                      "bi-mortarboard",
                      "Learning",
                      "Explain React hooks simply",
                    ],
                    [
                      "bi-bug",
                      "Debugging",
                      "How do I debug a Node.js application?",
                    ],
                    ["bi-pen", "Writing", "Help me write a professional email"],
                  ].map(([icon, title, question]) => (
                    <div className="col-12 col-sm-6" key={title}>
                      <button
                        type="button"
                        className="btn text-start w-100 h-100 p-3 rounded-4"
                        style={{
                          "--bs-btn-color": currentText,
                          "--bs-btn-hover-color": currentText,
                          "--bs-btn-active-color": currentText,
                          "--bs-btn-bg": cardBg,
                          "--bs-btn-hover-bg": cardHoverBg,
                          "--bs-btn-active-bg": cardHoverBg,
                          "--bs-btn-border-color": currentBorder,
                          "--bs-btn-hover-border-color": ACCENT,
                          "--bs-btn-active-border-color": ACCENT,
                        }}
                        onClick={() => setPrompt(question)}
                      >
                        <div className="d-flex align-items-center mb-2">
                          <span
                            className="d-inline-flex align-items-center justify-content-center rounded-3 me-2 flex-shrink-0"
                            style={{
                              width: "32px",
                              height: "32px",
                              background: "rgba(124,92,255,0.15)",
                              color: "#8b6cf5",
                            }}
                          >
                            <i className={`bi ${icon}`}></i>
                          </span>
                          <span className="fw-semibold">{title}</span>
                        </div>
                        <div
                          className="small"
                          style={{
                            color: mutedText,
                            overflowWrap: "anywhere",
                          }}
                        >
                          {question}
                        </div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`d-flex mb-3 mb-md-4 ${
                  message.role === "user"
                    ? "justify-content-end"
                    : "flex-column flex-sm-row justify-content-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div
                    className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 me-sm-3 mb-2 mb-sm-0"
                    style={{
                      width: "32px",
                      height: "32px",
                      background: cardBg,
                      border: `1px solid ${currentBorder}`,
                      color: "#8b6cf5",
                    }}
                  >
                    <i className="bi bi-stars"></i>
                  </div>
                )}

                <div
                  className={
                    message.role === "user"
                      ? "px-3 py-2 rounded-4 text-white"
                      : `pt-sm-1 ${isDark ? "text-light" : "text-dark"}`
                  }
                  style={{
                    minWidth: 0,
                    maxWidth: message.role === "user" ? "90%" : "100%",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                    lineHeight: 1.65,
                    textAlign: "justify",
                    textJustify: "inter-word",
                    hyphens: "auto",
                    ...(message.role === "user"
                      ? {
                          background:
                            "linear-gradient(135deg, #7c5cff 0%, #5b6cff 100%)",
                          borderBottomRightRadius: "6px",
                        }
                      : {}),
                  }}
                >
                  {message.content}
                </div>
              </div>
            ))}
            {loading && <Loading />}

            {error && (
              <div
                className="alert alert-danger d-flex align-items-center gap-2 rounded-4"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill flex-shrink-0"></i>
                <div style={{ minWidth: 0, overflowWrap: "anywhere" }}>
                  {error}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Input */}
        <footer
          className="px-3 pt-2 pt-md-3 flex-shrink-0"
          style={{
            background: currentBg,
            paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))",
          }}
        >
          <div className="container px-0" style={{ maxWidth: "820px" }}>
            <ChatForm
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={handleSubmit}
              loading={loading}
              theme={theme}
            />
            <p
              className="text-center mt-2 mb-0"
              style={{ color: helperText, fontSize: "0.75rem" }}
            >
              AI can make mistakes. Check important information.
            </p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default ChatDashboard;
