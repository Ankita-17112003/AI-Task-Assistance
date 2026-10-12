import Swal from "sweetalert2";
const ACCENT = "#7c5cff";
const BORDER = "rgba(255,255,255,0.08)";

function Sidebar({
  chats = [],
  onNewChat,
  onSelectChat,
  onDeleteChat,
  activeChatId,
  closeOnSelect = false,
  theme = "dark",
}) {
  const isDark = theme === "dark";
  const dismiss = closeOnSelect ? "offcanvas" : undefined;

  return (
    <aside
      className="d-flex flex-column flex-grow-1 p-3 text-light"
      style={{
        background: isDark ? "#0b0b0f" : "#f1f3f8",
        color: isDark ? "#f1f1f5" : "#212529",
        borderRight: `1px solid ${BORDER}`,
        minWidth: 0,
      }}
    >
      {/* Logo */}
      <div className="d-flex align-items-center gap-2 mb-4 px-1">
        <div
          className="d-flex align-items-center justify-content-center rounded-3"
          style={{
            width: "36px",
            height: "36px",
            background: "linear-gradient(135deg, #7c5cff 0%, #4f8cff 100%)",
          }}
        >
          <i className="bi bi-stars text-white"></i>
        </div>
        <div className="lh-sm">
          <div
            className="fw-bold"
            style={{
              color: isDark ? "#f1f1f5" : "#212529",
            }}
          >
            AI Text Assistant
          </div>
        </div>
      </div>

      {/* New Chat */}
      <button
        type="button"
        className="btn text-start mb-4 rounded-3 py-2 fw-semibold"
        style={{
          "--bs-btn-color": "#fff",
          "--bs-btn-bg": ACCENT,
          "--bs-btn-border-color": ACCENT,
          "--bs-btn-hover-color": "#fff",
          "--bs-btn-hover-bg": "#6a49f0",
          "--bs-btn-hover-border-color": "#6a49f0",
          "--bs-btn-active-bg": "#6a49f0",
          "--bs-btn-active-border-color": "#6a49f0",
        }}
        onClick={onNewChat}
        data-bs-dismiss={dismiss}
      >
        <i className="bi bi-plus-lg me-2"></i>
        New Chat
      </button>

      {/* History Heading */}
      <div
        className="small fw-semibold mb-2 px-1"
        style={{ color: "#6b6b78", letterSpacing: "0.08em" }}
      >
        YOUR CHATS
      </div>

      {/* Chat History */}
      <div
        className="d-flex flex-column gap-1 overflow-auto flex-grow-1"
        style={{ minHeight: 0 }}
      >
        {chats.length === 0 ? (
          <p className="small mt-2 px-1" style={{ color: "#6b6b78" }}>
            No chat history yet.
          </p>
        ) : (
          chats.map((chat) => {
            const isActive = activeChatId === chat._id;

            return (
              <div
                key={chat._id}
                className="d-flex align-items-center gap-1 rounded-3"
                style={{
                  background: isActive
                    ? "rgba(124,92,255,0.18)"
                    : "transparent",
                  boxShadow: isActive ? `inset 3px 0 0 ${ACCENT}` : "none",
                }}
              >
                {/* Chat Select Button */}
                <button
                  type="button"
                  className="btn border-0 text-start text-truncate rounded-3 py-2 flex-grow-1"
                  style={{
                    minWidth: 0,
                    "--bs-btn-color": isActive ? "#fff" : "#a1a1aa",
                    "--bs-btn-bg": "transparent",
                    "--bs-btn-hover-color": "#fff",
                    "--bs-btn-hover-bg": "rgba(255,255,255,0.06)",
                  }}
                  onClick={() => onSelectChat(chat)}
                  title={chat.prompt}
                  data-bs-dismiss={dismiss}
                >
                  <i className="bi bi-chat-left-text me-2"></i>
                  {chat.prompt}
                </button>

                {/* Delete Button */}
                <button
                  type="button"
                  className="btn btn-sm border-0 flex-shrink-0"
                  title="Delete chat"
                  aria-label="Delete chat"
                  style={{
                    color: "#a1a1aa",
                    background: "transparent",
                  }}
                  onClick={async (e) => {
                    e.stopPropagation();

                    const result = await Swal.fire({
                      title: "Delete this chat?",
                      text: "You won't be able to recover this chat!",
                      icon: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#dc3545",
                      cancelButtonColor: "#6c757d",
                      confirmButtonText: "Yes, delete it!",
                      cancelButtonText: "Cancel",
                      background: "#1e1e2f",
                      color: "#ffffff",
                    });

                    if (result.isConfirmed) {
                      onDeleteChat(chat._id);
                    }
                  }}
                >
                  <i className="bi bi-trash3"></i>
                </button>
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        className="pt-3 mt-3 d-flex align-items-center gap-2"
        style={{ borderTop: `1px solid ${BORDER}` }}
      >
        <div
          className="d-flex align-items-center justify-content-center rounded-3 flex-shrink-0"
          style={{
            width: "38px",
            height: "38px",
            background: "#1a1a22",
            border: `1px solid ${BORDER}`,
            color: "#a78bfa",
          }}
        >
          <i className="bi bi-robot"></i>
        </div>

        <div className="lh-sm">
          <div
            className="fw-semibold small"
            style={{
              color: isDark ? "#f1f1f5" : "#212529",
            }}
          >
            Ollama · Llama 3.2
          </div>
         
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
