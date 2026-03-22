import { ReactNode, useState, useEffect } from 'react';
import { isAdminAuthenticated, authenticateAdmin } from '@/lib/admin-auth';
import { Lock } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(false);
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authenticateAdmin(password)) {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      setError('Invalid admin password');
      setPassword('');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="font-paragraph text-lg text-foreground/60">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          <div className="bg-white border border-foreground/10 rounded-lg p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-primary/10 p-4 rounded-full">
                <Lock className="w-8 h-8 text-primary" />
              </div>
            </div>

            <h1 className="font-heading text-3xl font-bold text-foreground text-center mb-2">
              Admin Access
            </h1>
            <p className="font-paragraph text-center text-foreground/60 mb-8">
              Enter your admin password to access the orders dashboard
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block font-paragraph text-sm font-semibold text-foreground mb-2">
                  Admin Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-3 border border-foreground/20 rounded-lg font-paragraph text-base focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-paragraph text-sm text-destructive">{error}</p>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-primary text-primary-foreground font-heading font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity"
              >
                Unlock Admin Dashboard
              </button>
            </form>

            <p className="font-paragraph text-xs text-foreground/40 text-center mt-6">
              This dashboard is restricted to administrators only
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
