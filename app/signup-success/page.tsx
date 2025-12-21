import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle2 } from "lucide-react"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">תודה שנרשמת!</CardTitle>
            <CardDescription>נותר לך רק צעד אחד אחרון</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-3 rounded-lg border p-4">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">בדוק את המייל שלך</p>
                <p className="text-sm text-muted-foreground">
                  שלחנו לך מייל עם קישור לאישור החשבון. לחץ על הקישור כדי להשלים את ההרשמה.
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="font-medium text-foreground">מה הלאה?</p>
              <ol className="list-decimal list-inside space-y-1 mr-4">
                <li>פתח את תיבת המייל שלך</li>
                <li>חפש מייל מ-Supabase</li>
                <li>לחץ על קישור האישור</li>
                <li>התחבר עם הסיסמה שיצרת</li>
              </ol>
            </div>

            <Button asChild className="w-full">
              <Link href="/login">חזרה לדף ההתחברות</Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground">לא קיבלת מייל? בדוק את תיקיית הספאם</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
