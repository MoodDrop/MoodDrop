import { Heart } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white border-b border-blush-100 px-6 py-4 sticky top-0 z-10">
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-1">
          <Heart className="text-blush-300 text-2xl" size={24} />
          <h1 className="text-2xl font-bold text-warm-gray-700">Hushed Haven</h1>
        </div>
        <p className="text-sm text-warm-gray-600 font-light">Your safe space to express</p>
      </div>
    </header>
  );
}
