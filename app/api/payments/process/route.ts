import { type NextRequest, NextResponse } from "next/server"
import { paymentService } from "@/lib/payment-service"
import { adminAuth } from "@/lib/firebase-admin"

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decodedToken = await adminAuth.verifyIdToken(token)

    const { gigId, amount, currency } = await request.json()

    const payment = await paymentService.processPayment(decodedToken.uid, gigId, amount, currency)

    return NextResponse.json({ success: true, payment }, { status: 200 })
  } catch (error) {
    console.error("Payment error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment processing failed" },
      { status: 400 },
    )
  }
}
