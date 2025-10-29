import { useState } from "react"
import Client, { BASE_URL } from "../services/api"
import Comments from "./Comment"

const Post = ({ challenge, challenges, setChallenges, user }) => {
  const [commentText, setCommentText] = useState("")
  const [showComments, setShowComments] = useState(true)

  const currentUser = user || JSON.parse(localStorage.getItem("user") || "null")

  // handle like وإعادة ترتيب
  const handleLike = async () => {
    try {
      const response = await Client.post(`/posts/${challenge._id}/like`)

      // التأكد من أن response.data يحتوي على الصورة
      const updatedPost = {
        ...response.data,
        image: response.data.image || challenge.image,
        owner: response.data.owner || challenge.owner,
        description: response.data.description || challenge.description,
        challengeMonth:
          response.data.challengeMonth || challenge.challengeMonth,
        comments: response.data.comments || challenge.comments,
      }

      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id ? updatedPost : c
      )

      // إعادة ترتيب بعد كل لايك
      const sorted = updatedChallenges.sort(
        (a, b) => (b.likes?.length || 0) - (a.likes?.length || 0)
      )
      setChallenges(sorted)
    } catch (error) {
      console.error("Error liking post:", error)
    }
  }

  // ✅ add comment handler - محدّث
  const handleAddComment = async (e) => {
    e.preventDefault()

    if (!currentUser) {
      alert("Please log in to comment")
      return
    }

    if (!commentText.trim()) return

    try {
      const response = await Client.post("/comment", {
        postId: challenge._id,
        comment: commentText,
      })

      console.log("✅ Comment response:", response.data)

      // إنشاء comment جديد مع بيانات المستخدم الكاملة
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

      const updatedChallenges = challenges.map((c) =>
        c._id === challenge._id
          ? { ...c, comments: [...(c.comments || []), newComment] }
          : c
      )

      setChallenges(updatedChallenges)
      setCommentText("")
      setShowComments(true)
    } catch (error) {
      console.error("Error adding comment:", error)
      alert("Error adding comment")
    }
  }

  return (
    <div className="post-card">
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
      <img
        src={`${BASE_URL}${challenge.image}`}
        alt="Recipe"
        className="post-image"
      />
      <p>{challenge.description}</p>
      <p>{challenge.likes?.length || 0} Likes</p>
      <button onClick={handleLike}>Like</button>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
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
