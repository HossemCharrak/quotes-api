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
import QuotesGrid from "@/components/QuotesGrid";

const API_URL = "http://127.0.0.1:8000";

export default function QuotesPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  const [quotes, setQuotes] = useState([]);
  const [recommendedQuotes, setRecommendedQuotes] = useState([]);
  const [recommendationRequest, setRecommendationRequest] = useState([]);
  const [newQuote, setNewQuote] = useState({
    quote: "",
    author: "",
    tags: "",
    likes: 0,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch quotes with user_id
  const fetchQuotes = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/quotes`, {
        params: { user_id: userId, limit: 20, skip: 20 },
      });
      setQuotes(response.data);
    } catch (err) {
      setError("Failed to fetch quotes.");
    } finally {
      setIsLoading(false);
    }
  };
  const fetchQuotesByIds = async (idsList) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/quotes/by_ids`, {
        user_id: userId,
        quote_ids: idsList,
      });
      console.log("response", response.data);
      setRecommendedQuotes(response.data);
    } catch (err) {
      setError("Failed to fetch quotes.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedQuotes = async () => {
    setIsLoading(true);
    console.log("recommendationRequest");
    console.log(recommendationRequest);
    try {
      axios
        .post(`${API_URL}/recommend`, recommendationRequest)
        .then((res) => fetchQuotesByIds(res.data.recommendations));
      // const recommendations = await fetchQuotesByIds(
      //   response.data.recommendations
      // );
      // setRecommendedQuotes(recommendations);
    } catch (err) {
      console.log(err.message);
      setError("Failed to fetch recommended quotes.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, []);
  useEffect(() => {
    generateRecommendationRequest();
  }, [userId]);
  useEffect(() => {
    fetchRecommendedQuotes();
  }, [recommendationRequest]);
  const generateRecommendationRequest = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `${API_URL}/recommendation_request/${userId}`
      );
      setRecommendationRequest(response.data);
    } catch (err) {
      setError("Failed to generate recommendation request.");
    } finally {
      setIsLoading(false);
    }
  };
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
        <QuotesGrid
          recommendedQuotes={recommendedQuotes}
          quotes={quotes}
          setQuotes={setQuotes}
          userId={userId}
          type="grid"
        />
      )}
    </div>
  );
}
