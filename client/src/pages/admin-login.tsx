import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async (credentials: { username: string; password: string }) => {
      const res = await apiRequest("POST", "/api/admin/login", credentials);
      return res.json();
    },
    onSuccess: () => {
      setLocation('/admin/dashboard');
    },
    onError: (error: any) => {
      toast({
        title: "Login Failed",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      toast({
        title: "Missing credentials",
        description: "Please enter both username and password.",
        variant: "destructive",
      });
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div>
      <div className="text-center mb-8">
        <Shield className="text-blush-300 text-4xl mb-4 mx-auto" size={48} />
        <h2 className="text-2xl font-semibold text-warm-gray-700 mb-2">Admin Access</h2>
        <p className="text-warm-gray-600">Secure login for message review</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Label className="block text-warm-gray-700 font-medium mb-2">Username</Label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 border-2 border-blush-200 rounded-xl focus:border-blush-300 focus:outline-none"
              placeholder="Enter admin username"
              data-testid="input-admin-username"
            />
          </div>
          <div className="mb-6">
            <Label className="block text-warm-gray-700 font-medium mb-2">Password</Label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-4 border-2 border-blush-200 rounded-xl focus:border-blush-300 focus:outline-none"
              placeholder="Enter admin password"
              data-testid="input-admin-password"
            />
          </div>
          <Button 
            type="submit" 
            disabled={loginMutation.isPending}
            className="w-full bg-blush-300 hover:bg-blush-400 text-white font-medium py-4 rounded-xl transition-all"
            data-testid="button-admin-login"
          >
            {loginMutation.isPending ? "Logging in..." : "Access Dashboard"}
          </Button>
        </form>
      </div>

      <div className="text-center mt-6">
        <Link href="/">
          <button className="text-blush-400 hover:text-blush-500 text-sm" data-testid="link-back-main">
            ← Back to main app
          </button>
        </Link>
      </div>
    </div>
  );
}
