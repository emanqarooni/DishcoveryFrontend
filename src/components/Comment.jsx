const Comments = ({ comments }) => {
  return (
    <div className="comments-section">
      {comments && comments.length > 0 ? (
        comments.map(c => (
          <div key={c._id} className="comment">
            <p><strong>{c.owner?.username || "User"}:</strong> {c.comment}</p>
          </div>
        ))
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default Comments
