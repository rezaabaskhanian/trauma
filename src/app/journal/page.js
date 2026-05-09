import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function JournalPage() {
  return (
    <div className="min-h-screen bg-[#F1F7F6] flex justify-center p-6">
      <Card className="w-full max-w-2xl shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-xl">دفترچه احساسات</CardTitle>
          <p className="text-sm text-gray-500">
            احساسات و افکار امروزت را بنویس
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <textarea
            placeholder="امروز چه اتفاقی افتاد؟ چه احساسی داشتی؟"
            className="w-full h-40 p-3 border rounded-md outline-none focus:ring-2 focus:ring-teal-500 resize-none"
          />

          <Button className="w-full bg-teal-600 hover:bg-teal-700">
            ذخیره یادداشت
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
