import { useState } from "react"
import Client, { BASE_URL } from "../services/api"
import Comments from "./Comment"

const Post = ({ challenge, challenges, setChallenges, user }) => {
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(true)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  const currentUser = user || JSON.parse(localStorage.getItem("user") || "null")

  // Handle  post like and update likes count
  const handleLike = async () => {
    try {
      const response = await Client.post(`/posts/${challenge._id}/like`)

      //merge update post data
      const updatedPost = {
        ...response.data,
        image: response.data.image || challenge.image,
        owner: response.data.owner || challenge.owner,
        description: response.data.description || challenge.description,
        challengeMonth:
          response.data.challengeMonth || challenge.challengeMonth,
        comments: response.data.comments || challenge.comments,
      }

      //update challenges array with new likes
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id ? updatedPost : c
      )

      //sort challenges by likes
      const sorted = updatedChallenges.sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      )
      setChallenges(sorted)
      setSuccess("You liked this post!")
    } catch (err) {
      console.error("Error liking post:", err)
      setError("Failed to like post.")
    }
  }

  // Add new Comment
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!currentUser) {
      setError("Please log in to comment.")
      return
    }
    if (!commentText.trim()) return
    try {
      const response = await Client.post("/comment", {
        postId: challenge._id,
        comment: commentText,
      })

      //create new comment object
      const newComment = {
        _id:
          response.data.comment?._id ||
          response.data._id ||
          Date.now().toString(),
        comment: commentText,
        owner: {
          _id: currentUser.id || currentUser._id,
          username: currentUser.username,
          image: currentUser.image,
        },
        replies: [],
        createdAt: response.data.comment?.createdAt || new Date().toISOString(),
      }

      //update challenges with new comment
      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? { ...c, comments: [...(c.comments || []), newComment] }
          : c
      )
      setChallenges(updatedChallenges)
      setCommentText("")
      setShowComments(true)
      setSuccess("Comment added successfully!")
    } catch (err) {
      console.error("Error adding comment:", err)
      setError("Failed to add comment.")
    }
  }

  return (
    <div className="post-card">
      {/* Success & Error Popups */}
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
            <span className="popup-icon">:warning:</span>
            <span>{error}</span>
            <button onClick={() => setError("")} className="popup-close">
              ×
            </button>
          </div>
        </div>
      )}
      {/* Owner Info */}
      {challenge.owner && (
        <div className="post-owner">
          <img
            src={
              challenge.owner.image
                ? `${BASE_URL}${challenge.owner.image}`
                : "/default-avatar.png"
            }
            alt={challenge.owner.username || "User"}
            className="owner-avatar"
          />
          <span className="owner-name">
            by {challenge.owner.username || "User"}
          </span>
        </div>
      )}

      {/* post image and description */}
      <img
        src={`${BASE_URL}${challenge.image}`}
        alt="Recipe"
        className="post-image"
      />
      <p>{challenge.description}</p>
      <p>{challenge.likes?.length || 0} Likes</p>
      <button onClick={handleLike}>Like</button>

      {/* add comment form */}
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>

      {/* display comments */}
      {showComments && (
        <Comments
          comments={challenge.comments}
          challenge={challenge}
          challenges={challenges}
          setChallenges={setChallenges}
          currentUser={currentUser}
        />
      )}
    </div>
  )
}

export default Post
