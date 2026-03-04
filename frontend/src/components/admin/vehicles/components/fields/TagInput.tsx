// Project router: <Routes> JSX in src/App.tsx
// Admin route: <Route path="/admin" element={canAccessAdmin ? <AdminPage /> : <Navigate to="/" replace />} />
// Admin component: src/components/admin/index.tsx

import { X } from "lucide-react";
import { useRef, useState } from "react";
import { Badge } from "../../../../ui/badge";

type TagInputProps = {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
};

const TagInput = ({ value, onChange, placeholder }: TagInputProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [draft, setDraft] = useState("");

  const commitTag = () => {
    const next = draft.trim();
    if (!next || value.includes(next) || value.length >= 15) {
      return;
    }
    onChange([...value, next]);
    setDraft("");
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commitTag();
    }
  };

  return (
    <div
      className="flex flex-wrap gap-2 p-3 border border-input rounded-md min-h-[44px] focus-within:ring-2 focus-within:ring-ring cursor-text"
      onClick={() => inputRef.current?.focus()}
    >
      {value.map((tag, index) => (
        <Badge key={`${tag}-${index}`} variant="secondary" className="flex items-center gap-1 pr-1">
          {tag}
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="ml-0.5 hover:text-destructive"
          >
            <X className="h-3 w-3" />
          </button>
        </Badge>
      ))}

      {value.length < 15 ? (
        <input
          ref={inputRef}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
          placeholder={value.length === 0 ? placeholder : ""}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
        />
      ) : (
        <p className="text-xs text-muted-foreground self-center">Maximum 15 tags reached</p>
      )}
    </div>
  );
};

export default TagInput;
