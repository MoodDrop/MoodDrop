import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
        <CheckCircle className="text-green-500 text-4xl" size={48} />
      </div>
      
      <h2 className="text-2xl font-semibold text-warm-gray-700 mb-4">Thank You for Sharing</h2>
      <p className="text-warm-gray-600 leading-relaxed mb-8 px-4">
        Your voice has been heard. Taking the step to express yourself takes courage, and we're proud of you for reaching out.
      </p>
      
      <div className="bg-blush-50 rounded-2xl p-6 mb-6">
        <h3 className="font-semibold text-warm-gray-700 mb-3">Remember:</h3>
        <ul className="text-sm text-warm-gray-600 space-y-2 text-left">
          <li>• You're not alone in this journey</li>
          <li>• Your feelings are valid and important</li>
          <li>• This is a step toward healing</li>
          <li>• You can return anytime you need to express yourself</li>
        </ul>
      </div>

      <Link href="/">
        <button 
          className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-6 py-3 rounded-full transition-all duration-300"
          data-testid="button-return-home"
        >
          Return Home
        </button>
      </Link>
    </div>
  );
}
