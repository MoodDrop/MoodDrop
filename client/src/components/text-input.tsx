import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TextInput({ value, onChange }: TextInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    if (newValue.length <= 500) {
      onChange(newValue);
    }
  };

  return (
    <div className="bg-blush-50 rounded-2xl p-6 mb-6">
      <Textarea
        value={value}
        onChange={handleChange}
        placeholder="Share what's on your mind... You're safe here."
        className="w-full h-40 p-4 border-2 border-blush-200 rounded-xl focus:border-blush-300 focus:outline-none resize-none text-warm-gray-700 bg-white"
        data-testid="textarea-message"
      />
      <div className="flex justify-between items-center mt-3">
        <span className="text-sm text-warm-gray-500">Express yourself freely</span>
        <span className="text-sm text-blush-400" data-testid="char-count">
          {value.length}/500
        </span>
      </div>
    </div>
  );
}
