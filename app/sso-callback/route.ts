import { auth } from "@clerk/nextjs/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { userId } = await auth()
  const requestUrl = new URL(request.url)
  const origin = requestUrl.origin

  if (userId) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.redirect(`${origin}/`)
}

