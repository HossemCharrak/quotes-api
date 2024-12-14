import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  PlusCircle,
  Heart,
  ChevronDown,
  ChevronUp,
  LogOut,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster

const API_URL = "http://127.0.0.1:8000";

export default function QuotesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [quotes, setQuotes] = useState([]);
  const [newQuote, setNewQuote] = useState({
    quote: "",
    author: "",
    tags: "",
    likes: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedQuotes, setExpandedQuotes] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quotes with user_id
  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/quotes`, {
        params: { user_id: userId, limit: 20, skip: 0 },
      });
      setQuotes(response.data);
    } catch (err) {
      setError("Failed to fetch quotes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newQuote.quote && newQuote.author && newQuote.tags) {
      try {
        const response = await axios.post(`${API_URL}/quotes/`, newQuote);
        setQuotes((prev) => [...prev, response.data]);
        setNewQuote({ quote: "", author: "", tags: "", likes: 0 });
        setIsModalOpen(false);
      } catch {
        setError("Failed to add quote.");
      }
    }
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

  const toggleQuoteExpansion = (id) => {
    setExpandedQuotes((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <Toaster position="top-center" />
      <div className="flex justify-between items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
        </Button>
        <h1 className="text-3xl font-bold">Inspiring Quotes</h1>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <PlusCircle className="w-4 h-4" />
              Add New Quote
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a New Quote</DialogTitle>
              <DialogDescription>
                Fill in the details of the new quote you'd like to add.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="quote">Quote</Label>
                <Input
                  id="quote"
                  name="quote"
                  value={newQuote.quote}
                  onChange={handleInputChange}
                  placeholder="Enter the quote"
                  required
                />
              </div>
              <div>
                <Label htmlFor="author">Author</Label>
                <Input
                  id="author"
                  name="author"
                  value={newQuote.author}
                  onChange={handleInputChange}
                  placeholder="Enter the author's name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={newQuote.tags}
                  onChange={handleInputChange}
                  placeholder="Enter tags (e.g., Inspiration; Life)"
                  required
                />
              </div>
              <Button type="submit">Add Quote</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p>Loading quotes...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-8">
          {quotes.map((quote) => (
            <Card
              key={quote.id}
              className="transition-transform hover:scale-105 overflow-hidden"
            >
              <CardContent className="p-4 ">
                <div className="flex justify-end items-center">
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
      )}
    </div>
  );
}
