import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="bg-blush-50 px-6 py-8 mt-auto">
      <div className="text-center mb-6">
        <Link href="/admin">
          <button className="text-blush-400 hover:text-blush-500 text-sm underline" data-testid="link-admin">
            Admin Access
          </button>
        </Link>
      </div>

      {/* Legal Disclaimer */}
      <div className="bg-white rounded-2xl p-6 mb-4 shadow-sm">
        <h3 className="font-semibold text-warm-gray-700 mb-3 text-sm">⚖️ Important Disclaimer</h3>
        <p className="text-xs text-warm-gray-600 leading-relaxed mb-3">
          Hushed Haven is not a substitute for professional medical advice, diagnosis, or treatment. 
          This platform provides a space for expression but does not offer therapeutic support or crisis intervention.
        </p>
        <p className="text-xs text-warm-gray-600 leading-relaxed">
          If you're experiencing thoughts of self-harm or are in crisis, please contact emergency services 
          or a crisis helpline immediately.
        </p>
      </div>

      {/* Emotional Support Resources */}
      <div className="bg-white rounded-2xl p-6 shadow-sm">
        <h3 className="font-semibold text-warm-gray-700 mb-3 text-sm">💚 Support Resources</h3>
        <div className="space-y-2 text-xs text-warm-gray-600">
          <div className="flex justify-between">
            <span>Crisis Text Line:</span>
            <span className="font-medium">Text HOME to 741741</span>
          </div>
          <div className="flex justify-between">
            <span>National Suicide Prevention:</span>
            <span className="font-medium">988</span>
          </div>
          <div className="flex justify-between">
            <span>SAMHSA Helpline:</span>
            <span className="font-medium">1-800-662-4357</span>
          </div>
        </div>
      </div>

      <div className="text-center mt-6">
        <p className="text-xs text-warm-gray-600">
          © 2024 Hushed Haven • Made with 💝 for emotional wellness
        </p>
      </div>
    </footer>
  );
}
