import { useState } from "react"
import Client from "../services/api"
import Comments from "./Comment"

const Post = ({ challenge, challenges, setChallenges }) => {
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(true)
  const handleLike = async () => {
    try {
      const response = await Client.post(`/posts/${challenge._id}/like`)
      const updatedChallenges = challenges.map(c => c._id === challenge._id ? response.data : c)
      updatedChallenges.sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
      setChallenges(updatedChallenges)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }
  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    try {
      const response = await Client.post(`/posts/${challenge._id}/comments`, { text: commentText })
      const updatedChallenges = challenges.map(c => c._id === challenge._id ? { ...c, comments: response.data.comments } : c)
      setChallenges(updatedChallenges)
      setCommentText("")
      setShowComments(true)
    } catch (error) {
      console.error("Error adding comment:", error)
    }
  }
  return (
    <div className="post-card">
      <img src={challenge.image} alt="Recipe" />
      <p>{challenge.description}</p>
      <p>{challenge.likes?.length || 0} Likes</p>
      <button onClick={handleLike}>Like</button>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={e => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      {showComments && <Comments comments={challenge.comments} />}
    </div>
  )
}

export default Post
