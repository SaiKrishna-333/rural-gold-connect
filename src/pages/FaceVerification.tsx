import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useNavigate } from 'react-router-dom';
import { Camera, CheckCircle, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { faceApi } from '@/lib/api';
import { toast } from 'sonner';

const FaceVerification = () => {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  const handleVerification = async () => {
    setVerifying(true);
    setProgress(20);

    // Simulate camera capture and verification
    setTimeout(() => setProgress(50), 500);
    
    // Mock verification - replace with actual face API integration
    setTimeout(async () => {
      setProgress(80);
      
      // In real implementation, capture image and send to backend
      // const imageData = captureFromCamera();
      // const response = await faceApi.verify(imageData);
      
      setProgress(100);
      setVerified(true);
      toast.success('Face verification successful!');
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl relative z-10"
      >
        <GlassCard className="space-y-8">
          <div className="text-center space-y-4">
            {verified ? (
              <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
            ) : (
              <div className="w-20 h-20 mx-auto rounded-full bg-gold/20 flex items-center justify-center">
                <Camera className="w-10 h-10 text-gold" />
              </div>
            )}
            
            <h1 className="text-3xl font-bold">
              {verified ? 'Verification Complete!' : 'Face Verification'}
            </h1>
            <p className="text-muted-foreground">
              {verified 
                ? 'Your identity has been verified successfully.' 
                : 'We need to verify your identity to ensure secure transactions.'}
            </p>
          </div>

          {verifying ? (
            <div className="space-y-4">
              <div className="aspect-video glass-panel rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-32 mx-auto border-4 border-gold rounded-full animate-pulse" />
                  <p className="text-gold font-medium">Analyzing...</p>
                </div>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="aspect-video glass-panel rounded-lg flex items-center justify-center">
                <div className="text-center space-y-4">
                  <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
                  <p className="text-muted-foreground">Click below to start verification</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">
                    Please ensure your face is clearly visible and well-lit
                  </p>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <AlertCircle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-muted-foreground">
                    Remove any accessories that may obstruct your face
                  </p>
                </div>
              </div>

              <Button
                onClick={handleVerification}
                className="w-full bg-gold-gradient hover:opacity-90 text-background font-semibold"
                disabled={verifying || verified}
              >
                {verified ? 'Verified!' : 'Start Verification'}
              </Button>
            </div>
          )}
        </GlassCard>
      </motion.div>
    </div>
  );
};

export default FaceVerification;
