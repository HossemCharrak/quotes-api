import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ChevronDown, ChevronUp } from "lucide-react"; // Import toast and Toaster
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

function QuotesGrid({ quotes, setQuotes, userId, type, recommendedQuotes }) {
  const [expandedQuotes, setExpandedQuotes] = useState({});
  const toggleQuoteExpansion = (id) => {
    setExpandedQuotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };
  const handleLike = async (id) => {
    try {
      console.log("id", id);
      console.log("userId", userId);
      const response = await axios.patch(`${API_URL}/quotes/${id}/likes`, {
        id: id,
        user_id: userId,
      });

      // Check if response contains the updated quote and is liked status
      if (response.data) {
        console.log(response.data);
        const updatedQuote = response.data;

        // Update the state with the modified quote
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote.id === id ? { ...quote, ...updatedQuote } : quote
          )
        );
      } else {
        setError("Failed to update like.");
      }
    } catch (err) {
      // Handle different types of errors more explicitly
      if (err.response) {
        // Server responded with a status other than 2xx
        setError(
          `Server Error: ${
            err.response.data.detail || "Failed to update like."
          }`
        );
      } else if (err.request) {
        // No response received from the server
        setError("No response from the server.");
      } else {
        // Other types of errors (e.g., network issues)
        setError(`Error: ${err.message}`);
      }
    }
  };
  const recommendedQuotesIds = recommendedQuotes.map((quote) => quote.id);
  const filteredQuotes = quotes
    .filter((quote) => !recommendedQuotesIds.includes(quote.id))
    .map((quote) => ({ ...quote, isRecommended: false }));

  const filteredRecommendedQuotes = recommendedQuotes
    .map((quote) => ({ ...quote, isRecommended: true }))
    .filter((quote) => quote.id !== 525);
  function shuffle(array1, array2) {
    const min = Math.min(array1.length, array2.length);
    const shuffled = [];
    for (let i = 0; i < min; i++) {
      shuffled.push(array1[i], array2[i]);
    }
    shuffled.push(array1.slice(min), array2.slice(min));
    return shuffled.flat();
  }
  const allQuotes = shuffle(filteredQuotes, filteredRecommendedQuotes);
  const style =
    type === "grid"
      ? "grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8"
      : "flex gap-4 mt-8 overflow-x-auto max-h-64";
  return (
    <div className={style}>
      {allQuotes.map((quote) => (
        <Card
          key={quote.id}
          className={`transition-transform hover:scale-105 overflow-hidden ${
            type !== "grid" ? "min-w-96" : ""
          } `}
        >
          <CardContent className="p-4 ">
            <div className="flex justify-between items-center">
              {quote.isRecommended && (
                <span className="bg-green-500 text-green-50 p-1 rounded-lg font-bold text-xs text-muted-foreground">
                  Recommended
                </span>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleQuoteExpansion(quote.id)}
              >
                {expandedQuotes[quote.id] ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
            </div>
            <blockquote
              className={`text-lg italic mb-2 ${
                expandedQuotes[quote.id] ? "" : "line-clamp-2"
              }`}
            >
              "{quote.quote}"
            </blockquote>
            <p className="text-right font-semibold">- {quote.author}</p>
            <div className="w-full flex justify-between items-center mt-4">
              <div className="w-2/3">
                <p className="text-xs text-muted-foreground">Tags:</p>
                <ul className="text-xs flex flex-wrap gap-1 p-1">
                  {quote.tags.split(";").map((tag, index) => (
                    <li
                      key={index}
                      className="inline bg-zinc-200 px-2 py-1 rounded-sm text-zinc-500"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`flex items-center gap-2 ${
                  quote.isLiked ? "text-red-500" : "text-zinc-500"
                }`}
                onClick={() => handleLike(quote.id)}
              >
                <Heart
                  className="w-4 h-4"
                  fill={quote.isLiked ? "currentColor" : "none"}
                />
                <span>{quote.likes}</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default QuotesGrid;
