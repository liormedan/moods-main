import { type NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const { to, subject, message } = await request.json()

    // בדוק אם יש API key לפני יצירת Resend
    const resendApiKey = process.env.RESEND_API_KEY
    if (!resendApiKey) {
      return NextResponse.json(
        { error: "שירות שליחת המייל לא מוגדר. אנא צור קשר עם התמיכה." },
        { status: 503 }
      )
    }

    const resend = new Resend(resendApiKey)

    try {
      await resend.emails.send({
        from: "MOODS <onboarding@resend.dev>", // שנה לדומיין שלך אחרי אימות
        to: [to],
        subject: subject,
        text: message,
        html: `
          <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #0d9488;">הודעה מ-MOODS</h2>
            <div style="background: #f0fdfa; padding: 20px; border-radius: 8px; margin: 20px 0;">
              ${message
                .split("\n")
                .map((line: string) => `<p>${line}</p>`)
                .join("")}
            </div>
            <p style="color: #64748b; font-size: 14px;">
              הודעה זו נשלחה מאפליקציית MOODS לניהול מצבי רוח
            </p>
          </div>
        `,
      })

      console.log("[v0] Email sent successfully:", { to, subject })

      return NextResponse.json({
        success: true,
        message: "המייל נשלח בהצלחה",
      })
    } catch (emailError) {
      console.error("[v0] Resend error:", emailError)
      throw emailError
    }
  } catch (error) {
    console.error("[v0] Error sending email:", error)
    return NextResponse.json({ error: "שגיאה בשליחת המייל. אנא נסה שוב מאוחר יותר." }, { status: 500 })
  }
}
