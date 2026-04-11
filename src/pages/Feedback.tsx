import { useState } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

export default function Feedback() {
  const [type, setType] = useState<"suggestion" | "feedback">("feedback");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ title: "Thank you!", description: "Your feedback has been received." });
    setMessage("");
  };

  return (
    <MainLayout>
      <div className="p-8 lg:p-12 max-w-xl">
        <h1 className="font-display text-3xl font-bold mb-2">Suggestions & Feedback</h1>
        <p className="text-muted-foreground mb-8">We'd love to hear from you</p>

        <div className="flex gap-3 mb-6">
          {(["feedback", "suggestion"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all ${
                type === t ? "burgundy-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Textarea
            placeholder={`Write your ${type} here...`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            required
          />
          <Button type="submit" className="burgundy-gradient border-none text-primary-foreground">
            Submit
          </Button>
        </form>
      </div>
    </MainLayout>
  );
}
