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
  const [editReplyText, setEditReplyText] = useState("")

  const getCurrentUserId = () => {
    if (currentUser?._id) return String(currentUser._id)
    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
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
    if (typeof owner === "object" && owner._id) return String(owner._id) === userId
    return false
  }

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return
    try {
      await Client.delete(`/comment/${commentId}`)
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? { ...c, comments: c.comments.filter((comment) => comment._id !== commentId) }
          : c
      )
      setChallenges(updatedChallenges)
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Error deleting comment")
    }
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
                comment._id === commentId ? { ...comment, comment: editText } : comment
              ),
            }
          : c
      )
      setChallenges(updatedChallenges)
      setEditingCommentId(null)
      setEditText("")
    } catch (error) {
      console.error("Error editing comment:", error)
      alert("Error editing comment")
    }
  }

  const handleDeleteReply = async (commentId, replyId) => {
    if (!window.confirm("Are you sure you want to delete this reply?")) return
    try {
      await Client.delete(`/comment/${commentId}/reply/${replyId}`)
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.map((comment) =>
                comment._id === commentId
                  ? { ...comment, replies: comment.replies.filter((r) => r._id !== replyId) }
                  : comment
              ),
            }
          : c
      )
      setChallenges(updatedChallenges)
    } catch (error) {
      console.error("Error deleting reply:", error)
      alert("Error deleting reply")
    }
  }

  const startEditing = (comment) => {
    setEditingCommentId(comment._id)
    setEditText(comment.comment)
  }

  const startEditingReply = (reply) => {
    setEditingReplyId(reply._id)
    setEditReplyText(reply.comment)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditText("")
  }

  const cancelEditingReply = () => {
    setEditingReplyId(null)
    setEditReplyText("")
  }

  return (
    <div className="comments-section">
      {comments && comments.length > 0 ? (
        comments.map((c) => (
          <div key={c._id} className="comment-item">
            <div className="comment-header">
              <img
                src={
                  c.owner?.image ? `${BASE_URL}${c.owner.image}` : "/default-avatar.png"
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
                />
                <button onClick={() => handleEditComment(c._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <>
                <p className="comment-text">{c.comment}</p>

                {isOwner(c.owner) && (
                  <div className="comment-actions">
                    <button onClick={() => startEditing(c)}>Edit</button>
                    <button onClick={() => handleDeleteComment(c._id)}>Delete</button>
                  </div>
                )}

                {c.replies &&
                  c.replies.map((r) => (
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
                            value={editReplyText}
                            onChange={(e) => setEditReplyText(e.target.value)}
                          />
                          <button onClick={() => handleEditReply(c._id, r._id)}>
                            Save
                          </button>
                          <button onClick={cancelEditingReply}>Cancel</button>
                        </div>
                      ) : (
                        <>
                          <p className="reply-text">{r.comment}</p>

                          {isOwner(r.owner) && (
                            <div className="reply-actions">
                              <button onClick={() => startEditingReply(r)}>Edit</button>
                              <button onClick={() => handleDeleteReply(c._id, r._id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
              </>
            )}
          </div>
        ))
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default Comments
