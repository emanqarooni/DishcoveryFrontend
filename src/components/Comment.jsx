import { useState } from "react"
import Client from "../services/api"

const Comments = ({ postId, comments, setComments }) => {
  const [newComment, setNewComment] = useState("")
  const [editingComment, setEditingComment] = useState(null)
  const [editText, setEditText] = useState("")

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!newComment.trim()) return
    try {
      const response = await Client.post("/comments",{ postId, comment: newComment })
      setComments([response.data.comment, ...comments])
      setNewComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }

  const handleEditComment = async (id) => {
    try {
      const response = await Client.put(`/comments/${id}`,{comment:editText})
      setComments(comments.map(c => (c._id === id ? response.data : c)))
      setEditingComment(null)
      setEditText("")
    } catch (error) {
      console.error("Error editing comment:", error)
    }
  }

  const handleDeleteComment = async (id) => {
    try {
      await Client.delete(`/comments/${id}`)
      setComments(comments.filter(c => c._id !== id))
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
          onChange={e => setNewComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      <ul className="comments-list">
        {comments.length > 0 ? (
          comments.map(comment => (
            <li key={comment._id} className="comment-item">
              <strong>{comment.owner?.username || "User"}:</strong>
              {editingComment === comment._id ? (
                <>
                  <input
                    type="text"
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                  />
                  <button onClick={() => handleEditComment(comment._id)}>Save</button>
                  <button onClick={() => setEditingComment(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <span> {comment.comment}</span>
                  <div className="comment-actions">
                    <button onClick={() => { setEditingComment(comment._id); setEditText(comment.comment) }}>Edit</button>
                    <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
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
