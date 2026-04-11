import { useState, useEffect } from "react";
import MainLayout from "@/components/MainLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useApp } from "@/contexts/AppContext";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MessageSquare, Lightbulb } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FeedbackItem {
  id: string;
  type: string;
  message: string;
  created_at: string;
}

export default function Feedback() {
  const [type, setType] = useState<"suggestion" | "feedback">("feedback");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const { user, isLoggedIn } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoggedIn && user) {
      loadFeedback();
    } else {
      setIsLoading(false);
    }
  }, [isLoggedIn, user]);

  const loadFeedback = async () => {
    try {
      const { data, error } = await supabase
        .from("feedback" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setFeedbackList((data as any[]) || []);
    } catch (err) {
      console.error("Load feedback error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    if (!isLoggedIn || !user) {
      toast({ title: "Please log in", description: "You need to be logged in to submit feedback.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("feedback" as any).insert({
        user_id: user.id,
        type,
        message: message.trim(),
      } as any);
      if (error) throw error;
      toast({ title: "Thank you! 🎉", description: `Your ${type} has been submitted.` });
      setMessage("");
      loadFeedback();
    } catch (err: any) {
      console.error("Submit feedback error:", err);
      toast({ title: "Submission failed", description: err.message || "Could not submit feedback.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="p-8 lg:p-12 max-w-3xl">
        <h1 className="font-display text-3xl font-bold mb-2">Suggestions & Feedback</h1>
        <p className="text-muted-foreground mb-8">We'd love to hear from you</p>

        <div className="flex gap-3 mb-6">
          {(["feedback", "suggestion"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium capitalize transition-all flex items-center gap-2 ${
                type === t ? "burgundy-gradient text-primary-foreground" : "bg-muted text-muted-foreground"
              }`}
            >
              {t === "feedback" ? <MessageSquare size={14} /> : <Lightbulb size={14} />}
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
          <Button type="submit" className="burgundy-gradient border-none text-primary-foreground" disabled={isSubmitting}>
            {isSubmitting ? <><Loader2 size={14} className="mr-2 animate-spin" /> Submitting...</> : "Submit"}
          </Button>
        </form>

        {/* Display submitted feedback */}
        <div className="mt-12">
          <h2 className="font-display text-2xl font-bold mb-4">Your Submissions</h2>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 size={24} className="animate-spin text-primary" />
            </div>
          ) : !isLoggedIn ? (
            <p className="text-muted-foreground text-sm">Log in to see your submitted feedback.</p>
          ) : feedbackList.length === 0 ? (
            <p className="text-muted-foreground text-sm">No feedback submitted yet.</p>
          ) : (
            <div className="space-y-3">
              {feedbackList.map((item) => (
                <div key={item.id} className="bg-card rounded-xl border border-border p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      item.type === "suggestion" ? "bg-accent/20 text-accent" : "bg-primary/20 text-primary"
                    }`}>
                      {item.type === "suggestion" ? <Lightbulb size={12} /> : <MessageSquare size={12} />}
                      {item.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(item.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed">{item.message}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
