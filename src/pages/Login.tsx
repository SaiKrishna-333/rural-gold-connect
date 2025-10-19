import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Sparkles, Mail, Lock, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    const success = await login(email, password);
    setLoading(false);

    if (success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-3xl top-0 left-0 animate-float" />
        <div className="absolute w-96 h-96 bg-gold/5 rounded-full blur-3xl bottom-0 right-0 animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <GlassCard className="space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-gold-gradient flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-3xl font-bold text-gold-gradient">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to your RuralConnect account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gold" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="glass-panel border-glass-border focus:border-gold"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-gold" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="glass-panel border-glass-border focus:border-gold"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gold-gradient hover:opacity-90 text-background font-semibold"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="text-center space-y-2">
            <Link to="/forgot-password" className="text-sm text-gold hover:underline block">
              Forgot your password?
            </Link>
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-gold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default Login;
