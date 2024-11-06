export default function Testimonials() {
  return (
    <div className="mt-16" id="testimonials">
      <h2 className="mb-6 text-start text-3xl font-extrabold text-gray-900">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
          <p className="mb-4 text-gray-600">
            "FlashAI has revolutionized my study routine. I've never felt more
            prepared for exams!"
          </p>
          <p className="font-semibold">- Sarah K., Medical Student</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
          <p className="mb-4 text-gray-600">
            "The AI-generated flashcards are spot-on. It's like having a
            personal tutor!"
          </p>
          <p className="font-semibold">- Mike R., Law Student</p>
        </div>
        <div className="rounded-lg bg-gray-50 p-6 shadow-sm">
          <p className="mb-4 text-gray-600">
            "I've cut my study time in half while retaining more information.
            FlashAI is a game-changer!"
          </p>
          <p className="font-semibold">- Emily T., Undergraduate</p>
        </div>
      </div>
    </div>
  );
}
