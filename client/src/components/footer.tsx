export default function Footer() {
  return (
    <footer className="bg-blush-50 px-6 py-8 mt-auto">
      <div className="max-w-4xl mx-auto">
        {/* Contact Us Section */}
        <div className="text-center mb-6">
          <p className="text-sm text-warm-gray-600 mb-2">
            We'd love to hear from you. Reach us anytime at:
          </p>
          <a
            href="mailto:mooddrops2@gmail.com"
            className="text-blush-400 hover:text-blush-500 font-medium text-sm transition-colors"
            data-testid="link-contact-email"
          >
            mooddrops2@gmail.com
          </a>
        </div>

        {/* Disclaimer and Resources Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {/* Legal Disclaimer */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-warm-gray-700 mb-2 text-sm">
              ⚖️ Important Disclaimer
            </h3>
            <p className="text-xs text-warm-gray-600 leading-relaxed">
              MoodDrop is not a substitute for professional medical advice,
              diagnosis, or treatment. This platform provides a space for expression
              but does not offer therapeutic support or crisis intervention.
            </p>
          </div>

          {/* Emotional Support Resources */}
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-warm-gray-700 mb-2 text-sm">
              💚 Support Resources
            </h3>
            <div className="space-y-1.5 text-xs text-warm-gray-600">
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
        </div>

        {/* Copyright */}
        <div className="text-center">
          <p className="text-xs text-warm-gray-600">
            © 2024 MoodDrop • Made with 💝 for emotional wellness
          </p>
        </div>
      </div>
    </footer>
  );
}
