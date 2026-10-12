
function ChatResponse({ answer, error }) {
  if (error) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        {error}
      </div>
    );
  }

  if (!answer) return null;

  return (
    <div className="card mt-4 border-0 shadow-sm">
      <div className="card-header bg-primary text-white fw-semibold">
        AI Response
      </div>

      <div className="card-body">
        <p className="mb-0 response-text">{answer}</p>
      </div>
    </div>
  );
}

export default ChatResponse;
