import { useEffect, useState } from "react"
import Post from "../components/Post"
import Client from "../services/api"

const challengesData = [
  { month: "January", startDate: "2025-01-01T00:00:00", endDate: "2025-01-31T23:59:59" },
  { month: "February", startDate: "2025-02-01T00:00:00", endDate: "2025-02-28T23:59:59" },
  { month: "March", startDate: "2025-03-01T00:00:00", endDate: "2025-03-31T23:59:59" },
  { month: "April", startDate: "2025-04-01T00:00:00", endDate: "2025-04-30T23:59:59" },
  { month: "May", startDate: "2025-05-01T00:00:00", endDate: "2025-05-31T23:59:59" },
  { month: "June", startDate: "2025-06-01T00:00:00", endDate: "2025-06-30T23:59:59" },
  { month: "July", startDate: "2025-07-01T00:00:00", endDate: "2025-07-31T23:59:59" },
  { month: "August", startDate: "2025-08-01T00:00:00", endDate: "2025-08-31T23:59:59" },
  { month: "September", startDate: "2025-09-01T00:00:00", endDate: "2025-09-30T23:59:59" },
  { month: "October", startDate: "2025-10-01T00:00:00", endDate: "2025-10-31T23:59:59" },
  { month: "November", startDate: "2025-11-01T00:00:00", endDate: "2025-11-30T23:59:59" },
  { month: "December", startDate: "2025-12-01T00:00:00", endDate: "2025-12-31T23:59:59" }
]

const Challenges = () => {
  const [challenges, setChallenges] = useState([])
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [winner, setWinner] = useState(null)
  const [timeLeft, setTimeLeft] = useState("")

  const getCurrentChallenge = () => {
    const now = new Date()
    return challengesData.find(c => new Date(c.startDate) <= now && now <= new Date(c.endDate)) || null
  }

  const sortChallengesByLikes = (posts) => {
    return [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))
  }

  const updateCountdown = () => {
    if (!currentChallenge) return
    const end = new Date(currentChallenge.endDate)
    const now = new Date()
    const diff = end - now
    if (diff <= 0) {
      setTimeLeft("Challenge ended")
      announceWinner()
      return
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
  }

  const announceWinner = () => {
    if (!challenges || challenges.length === 0) return
    const sorted = sortChallengesByLikes(challenges)
    setWinner(sorted[0])
  }

  useEffect(() => {
    const loadChallenges = async () => {
      try {
        const response = await Client.get("/posts")
        setChallenges(sortChallengesByLikes(response.data))
      } catch (error) {
        console.error("Error fetching challenges:", error)
      }
    }
    loadChallenges()
  }, [])

  useEffect(() => {
    const activeChallenge = getCurrentChallenge()
    setCurrentChallenge(activeChallenge)
    if (activeChallenge) {
      updateCountdown()
      const interval = setInterval(updateCountdown, 1000)
      return () => clearInterval(interval)
    }
  }, [currentChallenge])

  const handleAddChallenge = async e => {
    e.preventDefault()
    if (!description || !image) {
      alert("Please provide both image and description")
      return
    }

    const userId = localStorage.getItem("userId")
    const existing = challenges.find(c => c.owner?._id === userId)
    if (existing) return alert("You already added a post for this challenge")
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("image", image)
      formData.append("description", description)
      formData.append("challengeMonth", currentChallenge?.month || "")
      const response = await Client.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setChallenges(sortChallengesByLikes([response.data, ...challenges]))
      setDescription("")
      setImage(null)
      setLoading(false)
    } catch (error) {
      console.error("Error adding challenge:", error)
      setLoading(false)
    }
  }

  return (
    <div className="challenges-page">
      <h1>{currentChallenge ? currentChallenge.month + " Challenge" : "No Active Challenge"}</h1>
      {currentChallenge && <p>Time left: {timeLeft}</p>}
      {winner && (
        <div className="winner-card">
          <h2>Winner</h2>
          <p>{winner.description}</p>
          <img src={winner.image} alt="Winner" className="winner-img" />
          <p>{winner.likes?.length || 0} likes</p>
        </div>
      )}
      {currentChallenge && new Date() <= new Date(currentChallenge.endDate) && (
        <form className="add-challenge-form" onSubmit={handleAddChallenge}>
          <h3>Add Your Recipe</h3>
          <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Write a short description about your recipe"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Recipe"}
          </button>
        </form>
      )}
      <div className="challenges-list">
        {challenges.length > 0 ? (
          challenges.map(challenge => (
            <Post
              key={challenge._id}
              challenge={challenge}
              challenges={challenges}
              setChallenges={setChallenges}
            />
          ))
        ) : (
          <p>No challenges yet</p>
        )}
      </div>
    </div>
  )
}

export default Challenges
