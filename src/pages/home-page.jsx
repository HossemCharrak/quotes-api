import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaSpinner } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast"; // Import toast and Toaster

export default function HomePage() {
  const [username, setUsername] = useState(""); // State to hold the username input
  const [user, setUser] = useState(null); // State to hold the fetched user
  const [loading, setLoading] = useState(false); // State to handle loading state

  // Function to handle the search action
  const handleNavigate = async () => {
    setLoading(true); // Start the loading state
    try {
      const encodedUsername = encodeURIComponent(username); // Encode the username
      const response = await fetch(
        `http://127.0.0.1:8000/users/search?username=${encodedUsername}`
      );

      if (!response.ok) {
        throw new Error(response.statusText); // Throw an error if the response is not ok
      }

      const data = await response.json();
      if (data) {
        setUser(data);
        navigate(`/quotes?userId=${data.id}`);
        toast.success("Logged in successfully!"); // Success notification
      }
    } catch (err) {
      toast.error(err.message); // Show error message
    } finally {
      setLoading(false); // Stop loading once the request is complete
    }
  };
  const navigate = useNavigate();

  // Handle input change for the username
  const handleInputChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-screen">
      <div className="max-w-md mx-auto">
        <Toaster position="top-center" />
        <h1 className="text-3xl font-bold text-center mb-6">
          Enter Your Username
        </h1>
        <div className="space-y-10">
          <div>
            <Input
              id="username"
              name="username"
              value={username}
              onChange={handleInputChange}
              placeholder="Enter your username"
              required
            />
          </div>
          <Button onClick={handleNavigate} className="w-full">
            {loading ? <FaSpinner className="animate-spin w-5 h-5" /> : "Login"}
          </Button>
        </div>
      </div>
    </div>
  );
}
