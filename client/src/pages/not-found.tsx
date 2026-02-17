import React from "react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/80 border border-blush-100 rounded-2xl shadow-sm px-6 py-8 text-center">
        <div className="text-4xl mb-2">💧</div>

        <h1 className="text-xl font-semibold text-[#8B7355] mb-2">
          This space isn’t here.
        </h1>

        <p className="text-sm text-[#8B7355] mb-5 leading-relaxed">
          It may have moved, or it may never have existed.
          <br />
          Nothing is wrong. You’re still safe here.
        </p>

        <div className="flex flex-col items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-[#FDE1EA] text-[#8B7355] hover:bg-[#F9CADA] transition-colors"
          >
            Return to sanctuary →
          </Link>

        
        </div>
      </div>
    </div>
  );
}
