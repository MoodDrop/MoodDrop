import React from "react";
import { Link } from "wouter";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white/80 border border-blush-100 rounded-2xl shadow-sm px-6 py-8 text-center">
        <div className="text-4xl mb-2">⚠️</div>
        <h1 className="text-xl font-semibold text-[#8B7355] mb-2">
          404 Page Not Found
        </h1>
        <p className="text-sm text-[#8B7355] mb-4 leading-relaxed">
          Looks like this page hasn&apos;t been added to MoodDrop yet.
          It might be a broken link or something that&apos;s still in progress.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-4 py-2 rounded-full text-sm font-medium bg-[#FDE1EA] text-[#8B7355] hover:bg-[#F9CADA] transition-colors"
        >
          💧 Back to Home
        </Link>
      </div>
    </div>
  );
}
