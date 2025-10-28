import { useState } from "react"
import Client from "../services/api"

const Comments = ({ comments, challenge, challenges, setChallenges, currentUser }) => {
  const [editingCommentId, setEditingCommentId] = useState(null)
  const [editText, setEditText] = useState("")

  // delete comment
  const handleDelete = async (id) => {
    try {
      await Client.delete(`/comment/${id}`)

      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? { ...c, comments: c.comments.filter((comment) => comment._id !== id) }
          : c
      )

      setChallenges(updatedChallenges)
    } catch (error) {
      console.error("Error deleting comment:", error)
    }
  }

  // start edit
  const startEdit = (id, text) => {
    setEditingCommentId(id)
    setEditText(text)
  }

  // save edit
  const handleEdit = async (id) => {
    try {
      const response = await Client.put(`/comment/${id}`, { comment: editText })
      const updatedComment = response.data.comment

      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? {
              ...c,
              comments: c.comments.map((comment) =>
                comment._id === id ? updatedComment : comment
              ),
            }
          : c
      )

      setChallenges(updatedChallenges)
      setEditingCommentId(null)
    } catch (error) {
      console.error("Error editing comment:", error)
    }
  }

  return (
    <div className="comments-section">
      {comments && comments.length > 0 ? (
        comments.map((c) => (
          <div key={c._id} className="comment">
            <p>
              <strong>{c.owner?.username || "User"}:</strong>
            </p>

            {editingCommentId === c._id ? (
              <>
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button onClick={() => handleEdit(c._id)}>Save</button>
                <button onClick={() => setEditingCommentId(null)}>✖ Cancel</button>
              </>
            ) : (
              <p>{c.comment}</p>
            )}

            {currentUser &&
              (c.owner?._id === currentUser._id || c.owner === currentUser._id) && (
                <div>
                  <button onClick={() => startEdit(c._id, c.comment)}>Edit</button>
                  <button onClick={() => handleDelete(c._id)}>Delete</button>
                </div>
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

