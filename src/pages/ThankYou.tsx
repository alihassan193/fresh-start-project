import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-20">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center">
            <CheckCircle className="w-24 h-24 text-green-500" />
          </div>
          <h1 className="text-4xl font-bold text-primary">Thank You!</h1>
          <p className="text-lg text-muted-foreground">
            Your message has been successfully sent. We'll get back to you shortly.
          </p>
          <p className="text-sm text-muted-foreground">
            Redirecting to home page in 5 seconds...
          </p>
          <Button 
            onClick={() => navigate("/")} 
            variant="desert"
            size="lg"
            className="mt-4"
          >
            Return to Home
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYou;
