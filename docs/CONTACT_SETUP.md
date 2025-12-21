# הגדרת מערכת קשר - מיילים ו-WhatsApp

## שליחת מיילים

כדי לאפשר שליחת מיילים אמיתית, יש להגדיר שירות שליחת מייל. מומלץ להשתמש ב-Resend:

### התקנה:
\`\`\`bash
npm install resend
\`\`\`

### הוספת API Key:
1. הירשם ל-Resend: https://resend.com
2. קבל API Key
3. הוסף ל-Environment Variables של Vercel:
   \`\`\`
   RESEND_API_KEY=re_xxxxxxxxxxxxx
   \`\`\`

### עדכון הקוד ב-`app/api/send-email/route.ts`:
הסר את ההערה מהקוד ב-TODO והוסף:
\`\`\`typescript
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)
await resend.emails.send({
  from: 'MOODS <noreply@yourdomain.com>',
  to: [to],
  subject: subject,
  text: message,
})
\`\`\`

## WhatsApp Business API

כדי לשלוח הודעות WhatsApp אוטומטיות (לא רק לפתוח את האפליקציה):

### דרישות:
1. חשבון WhatsApp Business
2. גישה ל-WhatsApp Business API דרך Meta

### שלבים:
1. הירשם ל-Meta for Developers: https://developers.facebook.com
2. צור אפליקציה חדשה והוסף WhatsApp
3. קבל Phone Number ID ו-Access Token
4. הוסף ל-Environment Variables:
   \`\`\`
   WHATSAPP_PHONE_ID=your_phone_id
   WHATSAPP_TOKEN=your_access_token
   \`\`\`

### עדכון הקוד ב-`app/api/send-whatsapp/route.ts`:
הסר את ההערה מהקוד ב-TODO.

## מצב דמו (נוכחי)

במצב הנוכחי:
- **מייל**: מדפיס ללוג אבל לא שולח באמת
- **WhatsApp**: פותח את WhatsApp Web עם הודעה מוכנה, אבל המשתמש צריך ללחוץ "שלח"

זה מתאים לפיתוח ודמו. לסביבת ייצור, יש להוסיף את האינטגרציות האמיתיות.
