import { Link } from "wouter";
import { Bird } from "lucide-react";
import ComfortCorner from "@/components/comfort-corner";

export default function Home() {
  return (
    <div className="text-center mb-8">
      {/* Welcome illustration */}
      <div className="w-32 h-32 mx-auto mb-6 bg-blush-100 rounded-full flex items-center justify-center">
        <Bird className="text-blush-300 text-4xl" size={48} />
      </div>
      
      <h2 className="text-2xl font-semibold text-warm-gray-700 mb-4">Welcome to Your Safe Space</h2>
      <p className="text-warm-gray-600 leading-relaxed mb-8 px-4">
        Share your emotions freely and anonymously. Whether you're feeling joy, excitement, sadness, anger, or anything in between - 
        your voice matters, and this is your judgment-free zone for all feelings.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
        <Link href="/vent">
          <button 
            className="bg-blush-300 hover:bg-blush-400 text-white font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-start-venting"
          >
            <span className="mr-2">💭</span>
            Share Your Feelings
          </button>
        </Link>
        <Link href="/comfort">
          <button 
            className="bg-cream-200 hover:bg-cream-300 text-warm-gray-700 font-medium px-8 py-4 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            data-testid="button-comfort-corner"
          >
            <span className="mr-2">🤗</span>
            Need Comfort?
          </button>
        </Link>
      </div>

      {/* Comfort Corner */}
      <div className="mt-8">
        <ComfortCorner />
      </div>
    </div>
  );
}
