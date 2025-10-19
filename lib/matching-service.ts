import { db } from "./firebase"
import { collection, query, where, getDocs, orderBy } from "firebase/firestore"
import type { Job, User } from "./types"

interface MatchedJob extends Job {
  matchScore: number
  matchReasons: string[]
}

export const matchingService = {
  // Calculate skill match percentage
  calculateSkillMatch(userSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 100
    const matchedSkills = userSkills.filter((skill) => jobSkills.includes(skill)).length
    return Math.round((matchedSkills / jobSkills.length) * 100)
  },

  // Get jobs matched to user based on parish and skills
  async getMatchedJobs(user: User): Promise<MatchedJob[]> {
    try {
      // Get all active jobs in user's parish
      const q = query(
        collection(db, "jobs"),
        where("parish", "==", user.parish),
        where("status", "==", "active"),
        orderBy("createdAt", "desc"),
      )

      const querySnapshot = await getDocs(q)
      const jobs = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Job[]

      // Score and rank jobs
      const matchedJobs: MatchedJob[] = jobs
        .map((job) => {
          const skillMatch = this.calculateSkillMatch(user.skills, job.requiredSkills)
          const matchReasons: string[] = []

          if (skillMatch === 100) {
            matchReasons.push("Perfect skill match")
          } else if (skillMatch >= 75) {
            matchReasons.push("Strong skill match")
          } else if (skillMatch >= 50) {
            matchReasons.push("Partial skill match")
          }

          matchReasons.push(`In your parish: ${job.parish}`)

          const matchScore = skillMatch
          return {
            ...job,
            matchScore,
            matchReasons,
          }
        })
        .sort((a, b) => b.matchScore - a.matchScore)

      return matchedJobs
    } catch (error) {
      console.error("Error getting matched jobs:", error)
      return []
    }
  },

  // Get users matched to a job
  async getMatchedUsers(job: Job): Promise<(User & { matchScore: number })[]> {
    try {
      // Get all users in the same parish
      const q = query(collection(db, "users"), where("parish", "==", job.parish))

      const querySnapshot = await getDocs(q)
      const users = querySnapshot.docs.map((doc) => doc.data()) as User[]

      // Score users based on skill match
      const matchedUsers = users
        .map((user) => {
          const skillMatch = this.calculateSkillMatch(user.skills, job.requiredSkills)
          return {
            ...user,
            matchScore: skillMatch,
          }
        })
        .filter((user) => user.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)

      return matchedUsers
    } catch (error) {
      console.error("Error getting matched users:", error)
      return []
    }
  },

  // Get recommended jobs for user
  async getRecommendedJobs(user: User, limit = 10): Promise<MatchedJob[]> {
    const matchedJobs = await this.getMatchedJobs(user)
    return matchedJobs.slice(0, limit)
  },
}
