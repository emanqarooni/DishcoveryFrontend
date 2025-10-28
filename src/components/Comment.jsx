import { useState } from "react"
import Client from "../services/api"

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

  const getCurrentUserId = () => {
    if (currentUser?._id) return currentUser._id

    const userStr = localStorage.getItem("user")
    if (userStr) {
      try {
        const user = JSON.parse(userStr)
        if (user?._id) return user._id
      } catch (e) {
        console.error("Error parsing user:", e)
      }
    }

    const userId = localStorage.getItem("userId")
    if (userId) return userId

    return null
  }

  // Delete comment
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return

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
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Error deleting comment")
    }
  }

  // Start editing
  const startEditing = (comment) => {
    setEditingCommentId(comment._id)
    setEditText(comment.comment)
  }

  // Cancel editing
  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditText("")
  }

  // Save edit
  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return

    try {
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
    } catch (error) {
      console.error("Error editing comment:", error)
      alert("Error editing comment")
    }
  }

  // Start replying
  const startReply = (commentId) => {
    setReplyingCommentId(commentId)
    setReplyText("")
  }

  const cancelReply = () => {
    setReplyingCommentId(null)
    setReplyText("")
  }

  // Add reply
 const handleAddReply = async (commentId) => {
  if (!replyText.trim()) return

  try {
    const { data } = await Client.post(`/comment/${commentId}/reply`, {
      comment: replyText,
    })

    const updatedChallenges = challenges.map((c) =>
      c._id === challenge._id
        ? {
            ...c,
            comments: c.comments.map((comment) =>
              comment._id === commentId
                ? { ...comment, replies: data.replies } // replies من السيرفر
                : comment
            ),
          }
        : c
    )

    setChallenges(updatedChallenges)
    setReplyingCommentId(null)
    setReplyText("")
  } catch (error) {
    console.error("Error adding reply:", error)
    alert("Error adding reply")
  }
}

  const userId = getCurrentUserId()

  return (
    <div className="comments-section">
      {comments && comments.length > 0 ? (
        comments.map((c) => {
          console.log("userId:", userId, "comment owner:", c.owner)

          return (
            <div key={c._id} className="comment">
              {editingCommentId === c._id ? (
                <div className="edit-comment-form">
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    className="edit-comment-input"
                  />
                  <div className="edit-comment-actions">
                    <button
                      onClick={() => handleEditComment(c._id)}
                      className="save-btn"
                    >
                      Save
                    </button>
                    <button onClick={cancelEditing} className="cancel-btn">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p>
                    <strong>{c.owner?.username || "User"}:</strong> {c.comment}
                  </p>

                  {userId &&
                    ((typeof c.owner === "string" && c.owner === userId) ||
                      (typeof c.owner === "object" &&
                        (c.owner._id === userId || c.owner === userId))) && (
                      <div className="comment-actions">
                        <button
                          onClick={() => startEditing(c)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteComment(c._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    )}

                  <button
                    onClick={() => startReply(c._id)}
                    className="reply-btn"
                  >
                    Reply
                  </button>
                  {replyingCommentId === c._id && (
                    <div className="reply-form">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                      />
                      <button onClick={() => handleAddReply(c._id)}>Send</button>
                      <button onClick={cancelReply}>Cancel</button>
                    </div>
                  )}
                  {c.replies && c.replies.length > 0 && (
                    <div className="replies">
                      {c.replies.map((r) => (
                        <p key={r._id}>
                          <strong>{r.owner?.username || "User"}:</strong> {r.comment}
                        </p>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )
        })
      ) : (
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default Comments
