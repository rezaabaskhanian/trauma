import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function BreathingPage() {
  return (
    <div className="min-h-screen bg-[#F1F7F6] flex items-center justify-center p-6">

      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle>تمرین تنفس آرام</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">

          <div className="text-gray-500">
            ۴ ثانیه دم بگیر — ۴ ثانیه نگه دار — ۴ ثانیه بازدم
          </div>

          <div className="text-6xl">🫁</div>

          <Button className="bg-teal-600 hover:bg-teal-700 w-full">
            شروع تمرین
          </Button>

        </CardContent>
      </Card>

    </div>
  )
}
