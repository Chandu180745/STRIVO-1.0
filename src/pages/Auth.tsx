import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useSettings } from '@/hooks/useSettings';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Auth = () => {
  const { loginWithGoogle, loginWithApple, isAuthenticated, user } = useAuth();
  const { onboardingComplete, lastAuthId } = useSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      const sameUser = user?.id && lastAuthId && user.id === lastAuthId;
      const shouldOnboard = !onboardingComplete || (user?.id && lastAuthId && !sameUser);
      navigate(shouldOnboard ? '/onboarding' : '/');
    }
  }, [isAuthenticated, onboardingComplete, navigate, user?.id, lastAuthId]);

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch {
      toast.error('Google login failed');
    }
  };

  const handleAppleLogin = async () => {
    try {
      await loginWithApple();
    } catch {
      toast.error('Apple login failed');
    }
  };

  return (
    <div className="min-h-screen pixel-grid flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 150 }}
        >
          <h1 className="font-display text-5xl tracking-widest">
            <span className="text-strivo-red">S</span>TRIVO
          </h1>
          <p className="text-sm text-muted-foreground mt-2 tracking-[0.3em]">DEFINE YOUR METRICS</p>
        </motion.div>

        {/* Auth Card */}
        <motion.div
          className="glass-card card-3d space-y-4"
          initial={{ opacity: 0, rotateX: -10 }}
          animate={{ opacity: 1, rotateX: 0 }}
          transition={{ delay: 0.4, type: 'spring', stiffness: 120 }}
        >
          <p className="text-center text-xs font-display tracking-wider text-muted-foreground mb-2">
            SIGN IN TO CONTINUE
          </p>

          {/* Google Login */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 border-2 border-foreground/20 hover:border-foreground/40 transition-all duration-300 font-display tracking-wider text-sm hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            CONTINUE WITH GOOGLE
          </motion.button>

          {/* Apple Login */}
          <motion.button
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleAppleLogin}
            className="w-full flex items-center justify-center gap-3 py-4 bg-foreground text-background border-2 border-foreground hover:opacity-90 transition-all duration-300 font-display tracking-wider text-sm hover:shadow-lg"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            CONTINUE WITH APPLE
          </motion.button>

          <p className="text-center text-[10px] text-muted-foreground mt-4">
            By continuing, you agree to our Terms of Service
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Auth;
