import { Link } from "wouter";
import { CheckCircle } from "lucide-react";

export default function ThankYou() {
  return (
    <div className="text-center">
      <div className="w-32 h-32 mx-auto mb-6 bg-blush-100 rounded-full flex items-center justify-center">
        <CheckCircle className="text-blush-400" size={48} />
      </div>
      
      <h2 className="text-2xl font-semibold text-[#2e2424] mb-4">
        Your Harmony Has Been Received
      </h2>

      <p className="text-[#5a4c4c]/85 leading-relaxed mb-8 px-6">
        Thank you for sharing something meaningful.
        <br /><br />
        Your story is now being reviewed personally and shaped with care.
        <br /><br />
        You’ll receive your 30–45 second Soft Echo via email within 24 hours.
      </p>
      


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