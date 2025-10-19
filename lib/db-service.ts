import { db, hasRequiredEnvVars } from "./firebase"
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  updateDoc,
  deleteDoc,
  addDoc,
  Timestamp,
} from "firebase/firestore"
import type { User, Job, MicroGig, JobApplication, AnalyticsData, Issue } from "./types"
import { demoDataService } from "./demo-data"

const useFirebase = hasRequiredEnvVars && db !== null

// User Services
export const userService = {
  async createUser(userId: string, userData: Partial<User>) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: User creation simulated")
      return
    }
    const userRef = doc(db, "users", userId)
    await setDoc(userRef, {
      ...userData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })
  },

  async getUser(userId: string) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: User fetch simulated")
      return null
    }
    const userRef = doc(db, "users", userId)
    const userSnap = await getDoc(userRef)
    return userSnap.exists() ? userSnap.data() : null
  },

  async updateUser(userId: string, updates: Partial<User>) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: User update simulated")
      return
    }
    const userRef = doc(db, "users", userId)
    await updateDoc(userRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  },

  async getUsersByParish(parish: string) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: Users by parish simulated")
      return []
    }
    const q = query(collection(db, "users"), where("parish", "==", parish))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },
}

// Job Services
export const jobService = {
  async createJob(jobData: Partial<Job>) {
    if (!useFirebase) {
      return await demoDataService.createJob(jobData)
    }
    const jobsRef = collection(db, "jobs")
    const docRef = await addDoc(jobsRef, {
      ...jobData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      applications: 0,
    })
    return docRef.id
  },

  async getJob(jobId: string) {
    if (!useFirebase) {
      return await demoDataService.getJob(jobId)
    }
    const jobRef = doc(db, "jobs", jobId)
    const jobSnap = await getDoc(jobRef)
    return jobSnap.exists() ? jobSnap.data() : null
  },

  async getActiveJobs(parish?: string) {
    if (!useFirebase) {
      return await demoDataService.getJobs(parish)
    }
    let q
    if (parish) {
      q = query(
        collection(db, "jobs"),
        where("status", "==", "active"),
        where("parish", "==", parish),
        orderBy("createdAt", "desc"),
      )
    } else {
      q = query(collection(db, "jobs"), where("status", "==", "active"), orderBy("createdAt", "desc"))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async updateJob(jobId: string, updates: Partial<Job>) {
    if (!useFirebase) {
      return await demoDataService.updateJob(jobId, updates)
    }
    const jobRef = doc(db, "jobs", jobId)
    await updateDoc(jobRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    })
  },

  async deleteJob(jobId: string) {
    if (!useFirebase) {
      return await demoDataService.deleteJob(jobId)
    }
    const jobRef = doc(db, "jobs", jobId)
    await deleteDoc(jobRef)
  },

  markJobCompleted: async (jobId: string) => {
    if (!useFirebase) {
      return await demoDataService.updateJob(jobId, { status: "filled" })
    }
    const jobRef = doc(db, "jobs", jobId)
    await updateDoc(jobRef, {
      status: "filled",
      updatedAt: Timestamp.now(),
    })
  },

  removeInactiveJob: async (jobId: string) => {
    if (!useFirebase) {
      return await demoDataService.deleteJob(jobId)
    }
    const jobRef = doc(db, "jobs", jobId)
    await deleteDoc(jobRef)
  },
}

// Micro-Gig Services
export const gigService = {
  async createGig(gigData: Partial<MicroGig>) {
    if (!useFirebase) {
      return await demoDataService.createGig(gigData)
    }
    const gigsRef = collection(db, "microGigs")
    const docRef = await addDoc(gigsRef, {
      ...gigData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      acceptedCount: 0,
    })
    return docRef.id
  },

  async getGig(gigId: string) {
    if (!useFirebase) {
      return await demoDataService.getGig(gigId)
    }
    const gigRef = doc(db, "microGigs", gigId)
    const gigSnap = await getDoc(gigRef)
    return gigSnap.exists() ? gigSnap.data() : null
  },

  async getAvailableGigs(parish?: string) {
    if (!useFirebase) {
      return await demoDataService.getGigs(parish)
    }
    let q
    if (parish) {
      q = query(
        collection(db, "microGigs"),
        where("status", "==", "active"),
        where("parish", "==", parish),
        orderBy("deadline", "asc"),
      )
    } else {
      q = query(collection(db, "microGigs"), where("status", "==", "active"), orderBy("deadline", "asc"))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async acceptGig(gigId: string, userId: string) {
    if (!useFirebase) {
      return await demoDataService.acceptGig(gigId, userId)
    }
    const acceptanceRef = collection(db, "gigAcceptances")
    const docRef = await addDoc(acceptanceRef, {
      gigId,
      userId,
      status: "accepted",
      acceptedAt: Timestamp.now(),
      paymentStatus: "pending",
    })

    // Update gig accepted count
    const gigRef = doc(db, "microGigs", gigId)
    const gigSnap = await getDoc(gigRef)
    if (gigSnap.exists()) {
      const currentCount = gigSnap.data().acceptedCount || 0
      await updateDoc(gigRef, {
        acceptedCount: currentCount + 1,
      })
    }

    return docRef.id
  },

  async completeGig(acceptanceId: string) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: Gig completion simulated")
      return
    }
    const acceptanceRef = doc(db, "gigAcceptances", acceptanceId)
    await updateDoc(acceptanceRef, {
      status: "completed",
      completedAt: Timestamp.now(),
      paymentStatus: "processing",
    })
  },
}

// Job Application Services
export const applicationService = {
  async createApplication(appData: Partial<JobApplication>) {
    if (!useFirebase) {
      return await demoDataService.createApplication(appData)
    }
    const appsRef = collection(db, "jobApplications")
    const docRef = await addDoc(appsRef, {
      ...appData,
      appliedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    })

    // Increment job application count
    if (appData.jobId) {
      const jobRef = doc(db, "jobs", appData.jobId)
      const jobSnap = await getDoc(jobRef)
      if (jobSnap.exists()) {
        const currentCount = jobSnap.data().applications || 0
        await updateDoc(jobRef, {
          applications: currentCount + 1,
        })
      }
    }

    return docRef.id
  },

  async getUserApplications(userId: string) {
    if (!useFirebase) {
      return await demoDataService.getUserApplications(userId)
    }
    const q = query(collection(db, "jobApplications"), where("userId", "==", userId), orderBy("appliedAt", "desc"))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async updateApplicationStatus(appId: string, status: string) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: Application status update simulated")
      return
    }
    const appRef = doc(db, "jobApplications", appId)
    await updateDoc(appRef, {
      status,
      updatedAt: Timestamp.now(),
    })
  },
}

// Analytics Services
export const analyticsService = {
  async recordAnalytics(data: Partial<AnalyticsData>) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: Analytics recording simulated")
      return
    }
    const analyticsRef = collection(db, "analytics")
    await addDoc(analyticsRef, {
      ...data,
      date: Timestamp.now(),
    })
  },

  async getAnalytics(days = 30) {
    if (!useFirebase) {
      console.log("[v0] Demo mode: Analytics fetch simulated")
      return []
    }
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const q = query(
      collection(db, "analytics"),
      where("date", ">=", Timestamp.fromDate(startDate)),
      orderBy("date", "desc"),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => doc.data())
  },
}

// Issue Services
export const issueService = {
  async createIssue(issueData: Partial<Issue>) {
    if (!useFirebase) {
      return await demoDataService.createIssue(issueData)
    }
    const issuesRef = collection(db, "issues")
    const docRef = await addDoc(issuesRef, {
      ...issueData,
      reportedAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      upvotes: 0,
      status: "reported",
    })
    return docRef.id
  },

  async getIssues(parish?: string) {
    if (!useFirebase) {
      return await demoDataService.getIssues(parish)
    }
    let q
    if (parish) {
      q = query(
        collection(db, "issues"),
        where("parish", "==", parish),
        orderBy("upvotes", "desc"),
        orderBy("reportedAt", "desc"),
      )
    } else {
      q = query(collection(db, "issues"), orderBy("upvotes", "desc"), orderBy("reportedAt", "desc"))
    }
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  },

  async updateIssueStatus(issueId: string, status: string) {
    if (!useFirebase) {
      return await demoDataService.updateIssue(issueId, { status })
    }
    const issueRef = doc(db, "issues", issueId)
    await updateDoc(issueRef, {
      status,
      updatedAt: Timestamp.now(),
    })
  },

  async upvoteIssue(issueId: string) {
    if (!useFirebase) {
      return await demoDataService.upvoteIssue(issueId)
    }
    const issueRef = doc(db, "issues", issueId)
    const issueSnap = await getDoc(issueRef)
    if (issueSnap.exists()) {
      const currentUpvotes = issueSnap.data().upvotes || 0
      await updateDoc(issueRef, {
        upvotes: currentUpvotes + 1,
      })
    }
  },

  async deleteIssue(issueId: string) {
    if (!useFirebase) {
      return await demoDataService.deleteIssue(issueId)
    }
    const issueRef = doc(db, "issues", issueId)
    await deleteDoc(issueRef)
  },
}
