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

  // ✅ Fixed: Single isOwner function - NOT nested
  const isOwner = (owner) => {
    if (!userId || !owner) return false
    if (typeof owner === "string") return owner === userId
    if (typeof owner === "object" && owner._id)
      return String(owner._id) === userId
    if (typeof owner === "object" && owner.id)
      return String(owner.id) === userId
    return false
  }

  // ✅ All handlers are now at the correct scope level
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
    } catch (error) {
      console.error("Error deleting comment:", error)
      alert("Error deleting comment")
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
    } catch (error) {
      console.error("Error editing comment:", error)
      alert("Error editing comment")
    }
  }

  const startEditingReply = (reply) => {
    setEditingReplyId(reply._id)
    setEditingReplyText(reply.comment)
  }

  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return

    try {
      // ✅ Fixed: Use the correct endpoint
      const response = await Client.post(`/comment/${commentId}/reply`, {
        comment: replyText,
      })

      console.log("✅ Reply response:", response.data)

      // ✅ Get the populated reply from response or create one
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
    } catch (error) {
      console.error("Error adding reply:", error)
      alert("Error adding reply")
    }
  }

  const handleEditReply = async (commentId, replyId) => {
    if (!editingReplyText.trim()) return

    try {
      // ✅ Fixed: Use correct endpoint for editing reply
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
    } catch (error) {
      console.error("Error editing reply:", error)
      alert("Error editing reply")
    }
  }

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      // ✅ Fixed: Use correct endpoint for deleting reply
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
    } catch (error) {
      console.error("Error deleting reply:", error)
      alert("Error deleting reply")
    }
  }

  return (
    <div className="comments-container">
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
                />
                <button onClick={() => handleEditComment(c._id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </div>
            ) : (
              <>
                <p className="comment-text">{c.comment}</p>

                <div className="comment-actions">
                  {/* ✅ Reply button for all logged-in users */}
                  {currentUser && (
                    <button
                      onClick={() => {
                        setReplyingCommentId(c._id)
                        setReplyText("")
                      }}
                      className="reply-btn"
                    >
                      Reply
                    </button>
                  )}

                  {/* ✅ Edit/Delete only for comment owner */}
                  {isOwner(c.owner) && (
                    <>
                      <button onClick={() => startEditing(c)}>Edit</button>
                      <button onClick={() => handleDeleteComment(c._id)}>
                        Delete
                      </button>
                    </>
                  )}
                </div>

                {/* ✅ Reply input form */}
                {replyingCommentId === c._id && (
                  <div className="reply-form">
                    <input
                      type="text"
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write a reply..."
                    />
                    <button onClick={() => handleAddReply(c._id)}>
                      Post Reply
                    </button>
                    <button onClick={() => setReplyingCommentId(null)}>
                      Cancel
                    </button>
                  </div>
                )}

                {/* ✅ Display replies */}
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
                            />
                            <button
                              onClick={() => handleEditReply(c._id, r._id)}
                            >
                              Save
                            </button>
                            <button onClick={cancelEditingReply}>Cancel</button>
                          </div>
                        ) : (
                          <>
                            <p className="reply-text">{r.comment}</p>
                            {/* ✅ Edit/Delete only for reply owner */}
                            {isOwner(r.owner) && (
                              <div className="reply-actions">
                                <button onClick={() => startEditingReply(r)}>
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteReply(c._id, r._id)
                                  }
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
        <p>No comments yet</p>
      )}
    </div>
  )
}

export default Comments
