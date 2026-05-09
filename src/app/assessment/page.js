import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function AssessmentPage() {
  return (
    <div className="min-h-screen bg-[#F6FAFA] flex flex-col items-center pt-8 pb-20 px-4">
      {/* Title Section */}
      <Card className="max-w-xl w-full mb-8 border-0 shadow-lg">
        <CardHeader className="bg-teal-50 rounded-t-xl">
          <CardTitle className="text-lg text-teal-800 font-bold">تست ارزیابی تروما (PCL)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-5">
          <p className="text-gray-700 text-sm mb-2">
            تست PCL ابزاری برای سنجش شدت علائم تروما و استرس پس از حادثه است.<br />
            لطفاً به هر سؤال بر اساس تجربه هفته اخیر پاسخ دهید.
          </p>
          <Button className="bg-teal-600 hover:bg-teal-700 w-full font-bold mt-2">
            شروع تست
          </Button>
        </CardContent>
      </Card>

      {/* Sample Score Section */}
      <Card className="max-w-xl w-full mb-8 border-0 shadow">
        <CardHeader>
          <CardTitle className="text-md text-gray-800">نتیجه فعلی شما</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-3 text-teal-700">
            <span className="font-bold">امتیاز کل: </span>
            <span className="text-2xl font-bold">62</span>
          </div>
          <div className="text-xs text-gray-500">تفسیر: امتیاز بیشتر از 50؛ نیاز به بررسی تخصصی.</div>
          <Button variant="outline" className="w-full mt-3 border-teal-600 text-teal-700 hover:bg-teal-50">
            مشاهده جزئیات پاسخ‌ها
          </Button>
        </CardContent>
      </Card>

      {/* Guidance Section */}
      <Card className="max-w-xl w-full border-0 shadow">
        <CardHeader>
          <CardTitle className="text-md text-gray-800">راهنمای امتیازدهی</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="text-xs text-gray-600 list-disc space-y-1 pr-5">
            <li>امتیاز زیر 30: وضعیت مناسب، نیاز به اقدام خاص نیست.</li>
            <li>امتیاز 30 تا 50: مراقبت و مداخله توصیه می‌شود.</li>
            <li>امتیاز بالای 50: مداخله تخصصی و بررسی توسط درمانگر.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
