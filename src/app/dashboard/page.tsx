/**
 * v0 by Vercel.
 * @see https://v0.dev/t/SVwcZE9ZD9q
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="text-4xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200 w-full">
        Document Reader
      </header>
      <main className="grid lg:grid-cols-2 gap-6 items-start max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full">
        <div className="space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label className="text-lg font-medium text-gray-700 dark:text-gray-300" htmlFor="file-upload">
              Upload File
            </Label>
            <Input className="border-gray-300 dark:border-gray-700 w-full" id="file-upload" type="file" />
          </div>
          <div className="flex gap-2 justify-center">
            <Button className="bg-green-500 hover:bg-green-600 text-white">Read</Button>
            <Button className="bg-blue-500 hover:bg-blue-600 text-white">Summarize</Button>
          </div>
        </div>
        <div className="space-y-4">
          <div className="p-4 border rounded-md bg-white dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Text Output</h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">The text output will be displayed here...</p>
          </div>
          <div className="p-4 border rounded-md bg-white dark:bg-gray-800">
            <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Audio Output</h2>
            <audio className="mt-2 w-full" controls>
              <source src="/audio-file.mp3" type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
            <Button className="mt-2 bg-red-500 hover:bg-red-600 text-white">Download Audio</Button>
          </div>
        </div>
      </main>
      <footer className="mt-10 text-center text-gray-600 dark:text-gray-400 w-full">
        <p>© 2024 Document Reader. All rights reserved.</p>
      </footer>
    </div>
  )
}