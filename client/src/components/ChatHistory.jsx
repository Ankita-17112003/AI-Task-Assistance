
function ChatHistory({ chats, onRefresh }) {
  return (
    <div className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Chat History</h5>

        <button
          className="btn btn-outline-primary btn-sm"
          onClick={onRefresh}
        >
          Refresh
        </button>
      </div>

      {chats.length === 0 ? (
        <div className="alert alert-light border">
          No chat history yet. Ask your first question!
        </div>
      ) : (
        <div className="d-flex flex-column gap-3">
          {chats.map((chat) => (
            <div className="card border-0 shadow-sm" key={chat._id}>
              <div className="card-body">
                <p className="fw-semibold mb-2">
                  <span className="text-primary">Question:</span>{" "}
                  {chat.prompt}
                </p>

                <p className="text-secondary mb-2">
                  <span className="fw-semibold">AI Answer:</span>{" "}
                  {chat.response}
                </p>

                <small className="text-muted">
                  {new Date(chat.createdAt).toLocaleString()}
                </small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ChatHistory;
