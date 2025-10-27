import { useEffect, useState } from "react"
import Post from "../components/Post"
import Client from "../services/api.js"


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
  { month: "December", startDate: "2025-12-01T00:00:00", endDate: "2025-12-31T23:59:59" },
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

}

export default Challenges
