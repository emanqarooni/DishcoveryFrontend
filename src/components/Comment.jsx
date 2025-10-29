import { useState } from "react"
import Client, { BASE_URL } from "../services/api"

const Comments = ({
  comments,
  challenge,
  challenges,
  setChallenges,
  currentUser,
}) => {
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState("")
  const [replyingCommentId, setReplyingCommentId] = useState(null)
  const [replyText, setReplyText] = useState("")
  const [editingReplyId, setEditingReplyId] = useState(null)
  const [editingReplyText, setEditingReplyText] = useState("")

  // ✅ Popup state
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const getCurrentUserId = () => {
    if (currentUser?.id) return String(currentUser.id)
    if (currentUser?._id) return String(currentUser._id)

    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user?.id) return String(user.id)
        if (user?._id) return String(user._id)
      } catch (e) {
        console.error("Error parsing user:", e)
      }
    }

    const userId = localStorage.getItem("userId")
    if (userId) return String(userId)
    return null
  }

  const userId = getCurrentUserId()

  const isOwner = (owner) => {
    if (!userId || !owner) return false
    if (typeof owner === "string") return owner === userId
    if (typeof owner === "object" && owner._id)
      return String(owner._id) === userId
    if (typeof owner === "object" && owner.id)
      return String(owner.id) === userId
    return false
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await Client.delete(`/comment/${commentId}`)
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.filter(
                (comment) => comment._id !== commentId
              ),
            }
          : c
      )
      setChallenges(updatedChallenges)
      setSuccess("Comment deleted successfully!")
    } catch (err) {
      console.error("Error deleting comment:", err)
      setError("Failed to delete comment.")
    }
  }

  const startEditing = (comment) => {
    setEditingCommentId(comment._id)
    setEditText(comment.comment)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditText("")
  }

  const cancelEditingReply = () => {
    setEditingReplyId(null)
    setEditingReplyText("")
  }

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return
    try {
      await Client.put(`/comment/${commentId}`, { comment: editText })
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.map((comment) =>
                comment._id === commentId
                  ? { ...comment, comment: editText }
                  : comment
              ),
            }
          : c
      )
      setChallenges(updatedChallenges)
      setEditingCommentId(null)
      setEditText("")
      setSuccess("Comment updated successfully!")
    } catch (err) {
      console.error("Error editing comment:", err)
      setError("Failed to edit comment.")
    }
  }

  const startEditingReply = (reply) => {
    setEditingReplyId(reply._id)
    setEditingReplyText(reply.comment)
  }

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return
    try {
      const response = await Client.post(`/comment/${commentId}/reply`, {
        comment: replyText,
      })

      const newReply = {
        _id:
          response.data.replies?.[response.data.replies.length - 1]?._id ||
          Date.now().toString(),
        comment: replyText,
        owner: {
          _id: currentUser?.id || currentUser?._id,
          username: currentUser?.username,
          image: currentUser?.image,
        },
        createdAt: new Date().toISOString(),
      }

      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      replies: [...(comment.replies || []), newReply],
                    }
                  : comment
              ),
            }
          : c
      )

      setChallenges(updatedChallenges)
      setReplyingCommentId(null)
      setReplyText("")
      setSuccess("Reply added successfully!")
    } catch (err) {
      console.error("Error adding reply:", err)
      setError("Failed to add reply.")
    }
  }

  const handleEditReply = async (commentId, replyId) => {
    if (!editingReplyText.trim()) return

    try {
      await Client.put(`/comment/${commentId}/reply/${replyId}`, {
        comment: editingReplyText,
      })
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      replies: comment.replies.map((reply) =>
                        reply._id === replyId
                          ? { ...reply, comment: editingReplyText }
                          : reply
                      ),
                    }
                  : comment
              ),
            }
          : c
      )
      setChallenges(updatedChallenges)
      setEditingReplyId(null)
      setEditingReplyText("")
      setSuccess("Reply updated successfully!")
    } catch (err) {
      console.error("Error editing reply:", err)
      setError("Failed to edit reply.")
    }
  }

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await Client.delete(`/comment/${commentId}/reply/${replyId}`)
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.map((comment) =>
                comment._id === commentId
                  ? {
                      ...comment,
                      replies: comment.replies.filter((r) => r._id !== replyId),
                    }
                  : comment
              ),
            }
          : c
      )
      setChallenges(updatedChallenges)
      setSuccess("Reply deleted successfully!")
    } catch (err) {
      console.error("Error deleting reply:", err)
      setError("Failed to delete reply.")
    }
  }

  return (
    <div className="comments-container">
      {/* ✅ Success & Error Popups */}
      {success && (
        <div className="popup popup-success">
          <div className="popup-content">
            <span className="popup-icon">✓</span>
            <span>{success}</span>
            <button onClick={() => setSuccess("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="popup popup-error">
          <div className="popup-content">
            <span className="popup-icon">⚠</span>
            <span>{error}</span>
            <button onClick={() => setError("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}

      {comments && comments.length > 0 ? (
        comments.map((c) => (
          <div key={c._id} className="comment-item">
            <div className="comment-header">
              <img
                src={
                  c.owner?.image
                    ? `${BASE_URL}${c.owner.image}`
                    : "/default-avatar.png"
                }
                alt="profile"
                className="comment-avatar"
              />
              <strong>{c.owner?.username || "User"}</strong>
            </div>

            {editingCommentId === c._id ? (
              <div className="edit-comment-form">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Edit your comment..."
                  className="comment-edit-input"
                />
                <div className="comment-edit-actions">
                  <button
                    onClick={() => handleEditComment(c._id)}
                    className="save-edit-btn"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEditing}
                    className="cancel-edit-btn"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <>
                <p className="comment-text">{c.comment}</p>

                <div className="comment-actions">
                  {currentUser && (
                    <button
                      onClick={() => {
                        setReplyingCommentId(c._id)
                        setReplyText("")
                      }}
                      className="reply-btn"
                    >
                      💬 Reply
                    </button>
                  )}

                  {isOwner(c.owner) && (
                    <div className="owner-actions">
                      <button
                        onClick={() => startEditing(c)}
                        className="edit-comment-btn"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteComment(c._id)}
                        className="delete-comment-btn"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>

                {replyingCommentId === c._id && (
                  <div className="reply-form">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                      className="reply-input"
                    />
                    <div className="reply-form-actions">
                      <button
                        onClick={() => handleAddReply(c._id)}
                        className="post-reply-btn"
                      >
                        Post Reply
                      </button>
                      <button
                        onClick={() => setReplyingCommentId(null)}
                        className="cancel-reply-btn"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {c.replies && c.replies.length > 0 && (
                  <div className="replies-container">
                    {c.replies.map((r) => (
                      <div key={r._id} className="reply-item">
                        <div className="reply-header">
                          <img
                            src={
                              r.owner?.image
                                ? `${BASE_URL}${r.owner.image}`
                                : "/default-avatar.png"
                            }
                            alt="profile"
                            className="reply-avatar"
                          />
                          <strong>{r.owner?.username || "User"}</strong>
                        </div>

                        {editingReplyId === r._id ? (
                          <div className="edit-reply-form">
                            <input
                              type="text"
                              value={editingReplyText}
                              onChange={(e) =>
                                setEditingReplyText(e.target.value)
                              }
                              placeholder="Edit your reply..."
                              className="reply-edit-input"
                            />
                            <div className="reply-edit-actions">
                              <button
                                onClick={() => handleEditReply(c._id, r._id)}
                                className="save-reply-btn"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditingReply}
                                className="cancel-reply-btn"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <p className="reply-text">{r.comment}</p>
                            {isOwner(r.owner) && (
                              <div className="reply-actions">
                                <button
                                  onClick={() => startEditingReply(r)}
                                  className="edit-reply-action-btn"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReply(c._id, r._id)
                                  }
                                  className="delete-reply-action-btn"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <p className="no-comments">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
}

export default Comments
