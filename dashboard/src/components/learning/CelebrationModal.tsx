import React from 'react';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Award } from 'lucide-react';

interface CelebrationModalProps {
  show: boolean;
  badge: string;
  onClose: () => void;
}

export function CelebrationModal({ show, badge, onClose }: CelebrationModalProps) {
  return (
    <Dialog open={show} onOpenChange={onClose}>
      <DialogContent className="max-w-md p-8 text-center">
        <DialogTitle className="sr-only">
          Badge Earned - Congratulations
        </DialogTitle>
        <DialogDescription className="sr-only">
          You have successfully earned a new learning badge: {badge}. This achievement recognizes your progress in the training program.
        </DialogDescription>
        
        <div className="mb-4">
          <div className="w-20 h-20 bg-gradient-brand rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
            <Award className="h-10 w-10 text-white" />
          </div>
          <h3 className="text-xl text-gray-900 mb-2">Congratulations!</h3>
          <p className="text-gray-600 mb-4">You've earned a new badge:</p>
          <Badge className="bg-brand-primary text-white text-lg px-4 py-2">
            {badge}
          </Badge>
        </div>
        <Button 
          onClick={onClose}
          className="bg-brand-primary hover:bg-brand-primary/90"
        >
          Continue Learning
        </Button>
      </DialogContent>
    </Dialog>
  );
}