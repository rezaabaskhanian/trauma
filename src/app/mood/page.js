import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MoodPage() {
  return (
    <div className="min-h-screen bg-[#F1F7F6] flex justify-center items-center p-6">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>امروز چه احساسی داری؟</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 text-center">

          <div className="flex justify-center gap-4 text-3xl">
            😞 😐 🙂 😄
          </div>

          <Button className="w-full bg-teal-600 hover:bg-teal-700">
            ثبت احساس
          </Button>

        </CardContent>
      </Card>
    </div>
  )
}
