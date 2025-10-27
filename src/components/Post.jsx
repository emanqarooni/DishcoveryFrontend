import { useState } from "react"
import Client from "../services/api"
import Comments from "./Comment"

const Post = ({ challenge, challenges, setChallenges }) => {
  const [liked, setLiked] = useState(challenge.likedByUser || false)
  const [likesCount, setLikesCount] = useState(challenge.likesCount || 0)
  const [comments, setComments] = useState(challenge.comments || [])

  const handleLike = async () => {
    try {
      const response = await Client.post(`/posts/${challenge._id}/like`)
      setLiked(response.data.likedByUser)
      setLikesCount(response.data.likesCount)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this challenge")) return
    try {
      await Client.delete(`/posts/${challenge._id}`)
      setChallenges(challenges.filter(item => item._id !== challenge._id))
    } catch (error) {
      console.error("Error deleting challenge:", error)
    }
  }

  return (
    <div className="post-card">
      <img src={`${challenge.image}`} alt="Challenge" className="post-img" />
      <div className="post-content">
        <p>{challenge.description}</p>
        <div className="post-actions">
          <button onClick={handleLike}>{liked ? "Unlike" : "Like"} ({likesCount})</button>
          <button onClick={handleDelete}>Delete</button>
        </div>
        <Comments postId={challenge._id} comments={comments} setComments={setComments} />
      </div>
    </div>
  )
}

export default Post
