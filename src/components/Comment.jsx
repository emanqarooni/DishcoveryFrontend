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

  // ✅ الحصول على ID المستخدم الحالي
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

  const userId = getCurrentUserId()

  // ✅ التحقق من الملكية - محسّن
  const isOwner = (itemOwner) => {
    if (!userId || !itemOwner) {
      console.log("❌ No userId or itemOwner")
      return false
    }

    let ownerIdToCompare = null

    // إذا كان owner عبارة عن object
    if (typeof itemOwner === "object" && itemOwner !== null) {
      ownerIdToCompare = itemOwner._id || itemOwner.id
    }
    // إذا كان owner عبارة عن string
    else if (typeof itemOwner === "string") {
      ownerIdToCompare = itemOwner
    }

    const result = String(ownerIdToCompare) === String(userId)
    console.log(`🔍 Comparing: ${ownerIdToCompare} === ${userId} = ${result}`)
    return result
  }

  // ✅ حذف التعليق
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

  // ✅ تعديل التعليق
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

  // ✅ إضافة Reply جديد
  const handleAddReply = async (commentId) => {
    if (!replyText.trim()) return

    try {
      const { data } = await Client.post(`/comment/${commentId}/reply`, {
        comment: replyText,
      })

      console.log("✅ Reply response:", data)

      // إنشاء reply جديد مع بيانات المستخدم الكاملة
      const newReply = {
        _id: data.reply?._id || data._id || Date.now().toString(),
        comment: replyText,
        owner: {
          _id: currentUser._id,
          username: currentUser.username,
          image: currentUser.image,
        },
        createdAt: data.reply?.createdAt || new Date().toISOString(),
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

  // ✅ تعديل Reply
  const handleEditReply = async (commentId, replyId) => {
    if (!editReplyText.trim()) return

    try {
      await Client.put(`/comment/${commentId}/reply/${replyId}`, {
        comment: editReplyText,
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
                          ? { ...reply, comment: editReplyText }
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
      setEditReplyText("")
    } catch (error) {
      console.error("Error editing reply:", error)
      alert("Error editing reply")
    }
  }

  // ✅ حذف Reply
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

  const startEditing = (comment) => {
    setEditingCommentId(comment._id)
    setEditText(comment.comment)
  }

  const cancelEditing = () => {
    setEditingCommentId(null)
    setEditText("")
  }

  const startReply = (commentId) => {
    setReplyingCommentId(commentId)
    setReplyText("")
  }

  const cancelReply = () => {
    setReplyingCommentId(null)
    setReplyText("")
  }

  const startEditingReply = (reply) => {
    setEditingReplyId(reply._id)
    setEditReplyText(reply.comment)
  }

  const cancelEditingReply = () => {
    setEditingReplyId(null)
    setEditReplyText("")
  }

  return (
    <div className="comments-section">
      {comments && comments.length > 0 ? (
        comments.map((c) => {
          const commentOwner =
            typeof c.owner === "string"
              ? { _id: c.owner, username: "User", image: null }
              : c.owner

          // للتحقق من المشكلة
          console.log("📝 Comment ID:", c._id)
          console.log("👤 Comment owner:", c.owner)
          console.log("🔑 Current userId:", userId)
          console.log("✅ Is owner?", isOwner(c.owner))

          return (
            <div key={c._id} className="comment-item">
              <div className="comment-header">
                <img
                  src={
                    commentOwner?.image
                      ? `${BASE_URL}${commentOwner.image}`
                      : "/default-avatar.png"
                  }
                  alt="profile"
                  className="comment-avatar"
                />
                <strong>{commentOwner?.username || "User"}</strong>
              </div>

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
                  <p className="comment-text">{c.comment}</p>

                  {/* ✅ أزرار Edit/Delete تظهر فقط للمالك */}
                  {isOwner(c.owner) && (
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

                  {/* ✅ زر Reply */}
                  <button
                    onClick={() => startReply(c._id)}
                    className="reply-btn"
                  >
                    Reply
                  </button>

                  {/* ✅ نموذج إضافة Reply */}
                  {replyingCommentId === c._id && (
                    <div className="reply-form">
                      <input
                        type="text"
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a reply..."
                      />
                      <button onClick={() => handleAddReply(c._id)}>
                        Send
                      </button>
                      <button onClick={cancelReply}>Cancel</button>
                    </div>
                  )}

                  {/* ✅ عرض الـ Replies */}
                  {c.replies && c.replies.length > 0 && (
                    <div className="replies">
                      {c.replies.map((r) => {
                        const replyOwner =
                          typeof r.owner === "string"
                            ? { _id: r.owner, username: "User", image: null }
                            : r.owner

                        return (
                          <div key={r._id} className="reply-item">
                            <div className="reply-header">
                              <img
                                src={
                                  replyOwner?.image
                                    ? `${BASE_URL}${replyOwner.image}`
                                    : "/default-avatar.png"
                                }
                                alt="profile"
                                className="reply-avatar"
                              />
                              <strong>{replyOwner?.username || "User"}</strong>
                            </div>

                            {editingReplyId === r._id ? (
                              <div className="edit-reply-form">
                                <input
                                  type="text"
                                  value={editReplyText}
                                  onChange={(e) =>
                                    setEditReplyText(e.target.value)
                                  }
                                  className="edit-reply-input"
                                />
                                <div className="edit-reply-actions">
                                  <button
                                    onClick={() =>
                                      handleEditReply(c._id, r._id)
                                    }
                                    className="save-btn"
                                  >
                                    Save
                                  </button>
                                  <button
                                    onClick={cancelEditingReply}
                                    className="cancel-btn"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <>
                                <p className="reply-text">{r.comment}</p>

                                {/* ✅ أزرار Edit/Delete للـ Reply */}
                                {isOwner(r.owner) && (
                                  <div className="reply-actions">
                                    <button
                                      onClick={() => startEditingReply(r)}
                                      className="edit-btn"
                                    >
                                      Edit
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleDeleteReply(c._id, r._id)
                                      }
                                      className="delete-btn"
                                    >
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )
                      })}
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
