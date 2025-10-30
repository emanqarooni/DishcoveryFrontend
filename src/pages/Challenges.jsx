import { useEffect, useState } from "react"
import Post from "../components/Post"
import Client, { BASE_URL } from "../services/api"

//Predefined challenge months
const challengesData = [
  {
    month: "January",
    startDate: "2025-01-01T00:00:00",
    endDate: "2025-01-31T23:59:59",
  },
  {
    month: "February",
    startDate: "2025-02-01T00:00:00",
    endDate: "2025-02-28T23:59:59",
  },
  {
    month: "March",
    startDate: "2025-03-01T00:00:00",
    endDate: "2025-03-31T23:59:59",
  },
  {
    month: "April",
    startDate: "2025-04-01T00:00:00",
    endDate: "2025-04-30T23:59:59",
  },
  {
    month: "May",
    startDate: "2025-05-01T00:00:00",
    endDate: "2025-05-31T23:59:59",
  },
  {
    month: "June",
    startDate: "2025-06-01T00:00:00",
    endDate: "2025-06-30T23:59:59",
  },
  {
    month: "July",
    startDate: "2025-07-01T00:00:00",
    endDate: "2025-07-31T23:59:59",
  },
  {
    month: "August",
    startDate: "2025-08-01T00:00:00",
    endDate: "2025-08-31T23:59:59",
  },
  {
    month: "September",
    startDate: "2025-09-01T00:00:00",
    endDate: "2025-09-30T23:59:59",
  },
  {
    month: "October",
    startDate: "2025-10-01T00:00:00",
    endDate: "2025-10-31T23:59:59",
  },
  {
    month: "November",
    startDate: "2025-11-01T00:00:00",
    endDate: "2025-11-30T23:59:59",
  },
  {
    month: "December",
    startDate: "2025-12-01T00:00:00",
    endDate: "2025-12-31T23:59:59",
  },
]

const Challenges = ({ user }) => {
  const [challenges, setChallenges] = useState([])
  const [description, setDescription] = useState("")
  const [image, setImage] = useState(null)
  const [loading, setLoading] = useState(false)
  const [currentChallenge, setCurrentChallenge] = useState(null)
  const [winner, setWinner] = useState(null)
  const [timeLeft, setTimeLeft] = useState("")
  const [challengeEnded, setChallengeEnded] = useState(false)

  //  Popup states
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  //get current active challenge based on date
  const getCurrentChallenge = () => {
    const now = new Date()
    return (
      challengesData.find(
        (c) => new Date(c.startDate) <= now && now <= new Date(c.endDate)
      ) || null
    )
  }

  //sort posts by likes
  const sortChallengesByLikes = (posts) =>
    [...posts].sort((a, b) => (b.likes?.length || 0) - (a.likes?.length || 0))

  //update countdown timer
  const updateCountdown = () => {
    if (!currentChallenge) return
    const end = new Date(currentChallenge.endDate)
    const now = new Date()
    const diff = end - now
    if (diff <= 0) {
      setTimeLeft("Challenge ended")
      setChallengeEnded(true)
      return
    }
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    const seconds = Math.floor((diff / 1000) % 60)
    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`)
    setChallengeEnded(false)
  }

  //determine winner after challenge ends
  const announceWinner = () => {
    if (!challenges || challenges.length === 0) {
      setWinner(null)
      return
    }
    const currentMonthChallenges = challenges.filter(
      (c) => c.challengeMonth === currentChallenge?.month
    )
    if (currentMonthChallenges.length === 0) {
      setWinner(null)
      return
    }
    const sorted = sortChallengesByLikes(currentMonthChallenges)
    setWinner(sorted[0])
  }

  useEffect(() => {
    //load all posts from API
    const loadChallenges = async () => {
      try {
        const response = await Client.get("/posts")
        setChallenges(sortChallengesByLikes(response.data))
      } catch (err) {
        console.error("Error fetching challenges:", err)
        setError("Failed to load challenges")
        setTimeout(() => setError(""), 3000)
      }
    }
    if (user) loadChallenges()
  }, [user])

  useEffect(() => {
    //set current active challenge
    const activeChallenge = getCurrentChallenge()
    setCurrentChallenge(activeChallenge)
  }, [])

  useEffect(() => {
    // countdown interval
    if (!currentChallenge) return
    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [currentChallenge])

  // announce winner when challenge ends
  useEffect(() => {
    if (currentChallenge && challengeEnded) {
      announceWinner()
    }
  }, [challenges, challengeEnded, currentChallenge])

  //add new challenge post
  const handleAddChallenge = async (e) => {
    e.preventDefault()
    if (!description || !image) {
      setError("Please provide both image and description")
      setTimeout(() => setError(""), 3000)
      return
    }
    const userId = user?.id || user?._id
    const existing = challenges.find(
      (c) =>
        c.owner?._id === userId && c.challengeMonth === currentChallenge?.month
    )
    if (existing) {
      setError("You already added a post for this month's challenge")
      setTimeout(() => setError(""), 3000)
      return
    }
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("image", image)
      formData.append("description", description)
      formData.append("challengeMonth", currentChallenge?.month || "")
      const response = await Client.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      //add new post and sort by likes
      const newChallenges = sortChallengesByLikes([
        response.data,
        ...challenges,
      ])
      setChallenges(newChallenges)
      setDescription("")
      setImage(null)
      setSuccess("Challenge added successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      console.error("Error adding challenge:", err)
      setError("Error adding challenge")
      setTimeout(() => setError(""), 3000)
    } finally {
      setLoading(false)
    }
  }

  const currentMonthChallenges = challenges.filter(
    (c) => c.challengeMonth === currentChallenge?.month
  )

  return (
    <div className="challenges-page">
      {/* Popup messages */}
      <div>
        {/* Success Popup */}
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
        {/* Error Popup */}
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
      </div>
      <h1>
        {currentChallenge
          ? `${currentChallenge.month} Challenge`
          : "No Active Challenge"}
      </h1>
      {currentChallenge && <p>Time left: {timeLeft}</p>}

      {/* show winner card */}
      {challengeEnded && winner && (
        <div className="winner-card">
          <h2>
            :trophy: Winner of {currentChallenge.month} Challenge :trophy:
          </h2>
          <div className="winner-info">
            <strong>By: {winner.owner?.username || "User"}</strong>
          </div>
          <img
            src={`${BASE_URL}${winner.image}`}
            alt="Winner"
            className="winner-img"
          />
          <p>{winner.description}</p>
          <p>:heart: {winner.likes?.length || 0} likes</p>
        </div>
      )}

      {/* add challenge form */}
      {currentChallenge && !challengeEnded && (
        <form className="add-challenge-form" onSubmit={handleAddChallenge}>
          <h3>Add Your Recipe</h3>
          <div className="file-input-wrapper">
            <label className="file-input-label">
              <span className="file-input-text">
                :camera_with_flash: Choose Image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                className="file-input-hidden"
              />
            </label>
            {image && (
              <span className="file-selected-name">Selected: {image.name}</span>
            )}
          </div>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short description about your recipe"
          />
          <button type="submit" disabled={loading}>
            {loading ? "Uploading..." : "Add Recipe"}
          </button>
        </form>
      )}

      {/*display post for current month */}
      <div className="challenges-list">
        {currentMonthChallenges.length > 0 ? (
          currentMonthChallenges.map((challenge) => (
            <Post
              key={challenge._id}
              challenge={challenge}
              challenges={challenges}
              setChallenges={setChallenges}
              user={user}
            />
          ))
        ) : (
          <p>No challenges yet for this month</p>
        )}
      </div>
    </div>
  )
}

export default Challenges
