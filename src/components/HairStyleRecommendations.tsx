
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const HairStyleRecommendations: React.FC = () => {
  const [faceShape, setFaceShape] = useState('');
  const [hairType, setHairType] = useState('');
  const [hairLength, setHairLength] = useState('');
  const [generatingResults, setGeneratingResults] = useState(false);
  const navigate = useNavigate();

  const handleGetRecommendations = () => {
    if (!faceShape || !hairType || !hairLength) {
      toast.error('Please fill in all fields to get personalized recommendations');
      return;
    }

    setGeneratingResults(true);

    // Simulate API call for recommendations
    setTimeout(() => {
      // Create a notification for the user
      const userJson = localStorage.getItem('salonifyUser');
      if (userJson) {
        const userId = JSON.parse(userJson).email;
        const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
        const newNotification = {
          id: `notif-${Date.now()}`,
          title: 'Style Recommendations Ready',
          message: `Your personalized hairstyle recommendations based on ${faceShape} face shape and ${hairType} hair are ready to view.`,
          date: new Date(),
          read: false
        };
        localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
      }

      setGeneratingResults(false);
      toast.success('Your personalized hair style recommendations are ready!');

      // Redirect to the dashboard with a tab parameter
      navigate('/dashboard?tab=recommendations');
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Get Personalized Recommendations</h2>
        <p className="text-muted-foreground">
          Our AI algorithm analyzes your features and preferences to recommend the perfect hairstyle for you.
        </p>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="faceShape">Face Shape</Label>
            <Select value={faceShape} onValueChange={setFaceShape}>
              <SelectTrigger id="faceShape">
                <SelectValue placeholder="Select your face shape" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="oval">Oval</SelectItem>
                <SelectItem value="round">Round</SelectItem>
                <SelectItem value="square">Square</SelectItem>
                <SelectItem value="heart">Heart</SelectItem>
                <SelectItem value="diamond">Diamond</SelectItem>
                <SelectItem value="oblong">Oblong</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hairType">Hair Type</Label>
            <Select value={hairType} onValueChange={setHairType}>
              <SelectTrigger id="hairType">
                <SelectValue placeholder="Select your hair type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="straight">Straight</SelectItem>
                <SelectItem value="wavy">Wavy</SelectItem>
                <SelectItem value="curly">Curly</SelectItem>
                <SelectItem value="coily">Coily</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="hairLength">Current Hair Length</Label>
            <Select value={hairLength} onValueChange={setHairLength}>
              <SelectTrigger id="hairLength">
                <SelectValue placeholder="Select your hair length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">Short</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="long">Long</SelectItem>
                <SelectItem value="veryLong">Very Long</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={handleGetRecommendations}
            className="w-full bg-salon hover:bg-salon-dark"
            disabled={generatingResults}
          >
            {generatingResults ? 'Generating Recommendations...' : 'Get Recommendations'}
          </Button>
        </div>
      </div>
      
      <div className="rounded-lg bg-salon/5 p-6 flex flex-col items-center justify-center">
        <img 
          src="/placeholder.svg" 
          alt="Hairstyle recommendation preview" 
          className="w-64 h-64 object-cover rounded-lg mb-4"
        />
        <p className="text-center text-muted-foreground">
          Our AI will analyze your inputs and suggest hairstyles that complement your features.
        </p>
      </div>
    </div>
  );
};

export default HairStyleRecommendations;
