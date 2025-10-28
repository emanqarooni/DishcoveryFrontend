import { useState } from "react"
import Client from "../services/api"

const Comments = ({ comments, challenge, challenges, setChallenges, currentUser }) => {
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState("")

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
          ? { ...c, comments: c.comments.filter(comment => comment._id !== commentId) }
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
    const updatedChallenges = challenges.map(c =>
      c._id === challenge._id
        ? {
            ...c,
            comments: c.comments.map(comment =>
              comment._id === commentId ? { ...comment, comment: editText } : comment
            )
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


  const userId = getCurrentUserId()

  console.log("Current userId:", userId)
  console.log("Comments:", comments)

  return (
    <div className="comments-section">
      {comments && comments.length > 0 ? (
        comments.map(c => {
        console.log("Comment owner ID:", c.owner?._id, "Current user ID:", userId)

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
                    <button onClick={() => handleEditComment(c._id)} className="save-btn">
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
                  {userId && c.owner?._id && c.owner._id === userId && (
                    <div className="comment-actions">
                      <button onClick={() => startEditing(c)} className="edit-btn">
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(c._id)} className="delete-btn">
                        Delete
                      </button>
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
