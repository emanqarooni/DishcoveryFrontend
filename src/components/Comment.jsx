import { useState } from "react"
import axios from "axios"

import Post from "./Post"

const Comments = ({ postId, comments, setComments }) => {
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")
  const token = localStorage.getItem("token")

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const response = await axios.post(
        `${API_URL}/comments`,
        { postId, comment: newComment },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments([response.data.comment, ...comments])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleEditComment = async (id) => {
    try {
      const response = await axios.put(
        `${API_URL}/comments/${id}`,
        { comment: editText },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setComments(comments.map((c) => (c._id === id ? response.data : c)))
      setEditingComment(null)
      setEditText("")
    } catch (error) {
      console.error("Error editing comment:", error)
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      await axios.delete(`${API_URL}/comments/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      setComments(comments.filter((c) => c._id !== id))
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  return (
    <div className="comments-section">
      <h4>Comments ({comments.length})</h4>
      <form onSubmit={handleAddComment} className="add-comment-form">
        <input
          type="text"
          placeholder="Add a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      <ul className="comments-list">
        {comments.length > 0 ? (
          comments.map((comment) => (
            <li key={comment._id} className="comment-item">
              <strong>{comment.owner?.username || "User"}:</strong>
              {editingComment === comment._id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleEditComment(comment._id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingComment(null)}>
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span> {comment.comment}</span>
                  <div className="comment-actions">
                    <button
                      onClick={() => {
                        setEditingComment(comment._id)
                        setEditText(comment.comment)
                      }}
                    >
                      Edit
                    </button>
                    <button onClick={() => handleDeleteComment(comment._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        ) : (
          <p>No comments yet</p>
        )}
      </ul>
    </div>
  )
}

export default Comments
