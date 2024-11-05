import React from "react";

export default function Testimonials() {
  return (
    <div className="mt-16" id="testimonials">
      <h2 className="text-3xl font-extrabold text-gray-900 text-start mb-6">
        What Our Users Say
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">
            "FlashAI has revolutionized my study routine. I've never felt more
            prepared for exams!"
          </p>
          <p className="font-semibold">- Sarah K., Medical Student</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">
            "The AI-generated flashcards are spot-on. It's like having a
            personal tutor!"
          </p>
          <p className="font-semibold">- Mike R., Law Student</p>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
          <p className="text-gray-600 mb-4">
            "I've cut my study time in half while retaining more information.
            FlashAI is a game-changer!"
          </p>
          <p className="font-semibold">- Emily T., Undergraduate</p>
        </div>
      </div>
    </div>
  );
}
