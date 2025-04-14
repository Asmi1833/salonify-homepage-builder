
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Scissors, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const hairStyleOptions = [
  {
    id: 1,
    name: 'Bob Cut',
    image: '/placeholder.svg',
    description: 'A classic bob is a short to medium-length cut that is typically cut straight around the head at about jaw-level, with a fringe at the front.'
  },
  {
    id: 2,
    name: 'Layered Cut',
    image: '/placeholder.svg',
    description: 'Layered cuts add volume and texture to your hair, making it easier to style and reducing bulk in thick hair.'
  },
  {
    id: 3,
    name: 'Pixie Cut',
    image: '/placeholder.svg',
    description: 'A short hairstyle generally short on the back and sides of the head and slightly longer on the top.'
  },
  {
    id: 4,
    name: 'Long Layers',
    image: '/placeholder.svg',
    description: 'Long hair with layers throughout to add movement and reduce weight without sacrificing length.'
  }
];

const HairStyleRecommendations: React.FC = () => {
  const [faceShape, setFaceShape] = useState('');
  const [hairTexture, setHairTexture] = useState('');
  const [hairLength, setHairLength] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<typeof hairStyleOptions[0]>>([]);

  const handleGenerateRecommendations = () => {
    setLoading(true);
    
    // In a real application, this would call an AI API
    // For demo purposes, we'll simulate an API call with setTimeout
    setTimeout(() => {
      // Filter hairStyleOptions based on input criteria
      // In a real app, this would be the response from the AI service
      
      // Sample logic - in a real app, this would be more sophisticated
      let filteredOptions = [...hairStyleOptions];
      
      if (hairLength === 'short') {
        filteredOptions = filteredOptions.filter(style => 
          style.name.toLowerCase().includes('pixie') || 
          style.name.toLowerCase().includes('bob')
        );
      } else if (hairLength === 'long') {
        filteredOptions = filteredOptions.filter(style => 
          style.name.toLowerCase().includes('long')
        );
      }
      
      // Shuffle and select random options if needed to simulate AI variety
      const shuffled = filteredOptions.sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 2)); // Show 2 recommendations
      
      setLoading(false);
      toast({
        title: "Recommendations generated",
        description: "We've analyzed your preferences and generated personalized recommendations.",
      });
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <Card>
          <CardContent className="pt-6">
            <div className="mb-6 flex items-center">
              <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-full bg-salon/10">
                <Scissors className="h-5 w-5 text-salon" />
              </div>
              <h3 className="text-xl font-semibold">Find Your Perfect Hair Style</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="faceShape">Face Shape</Label>
                <Select value={faceShape} onValueChange={setFaceShape}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your face shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="oval">Oval</SelectItem>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="heart">Heart</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hairTexture">Hair Texture</Label>
                <Select value={hairTexture} onValueChange={setHairTexture}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your hair texture" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="straight">Straight</SelectItem>
                    <SelectItem value="wavy">Wavy</SelectItem>
                    <SelectItem value="curly">Curly</SelectItem>
                    <SelectItem value="coily">Coily</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="hairLength">Preferred Hair Length</Label>
                <Select value={hairLength} onValueChange={setHairLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="preferences">Additional Preferences</Label>
                <Textarea 
                  id="preferences" 
                  placeholder="Tell us more about what you're looking for..."
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                onClick={handleGenerateRecommendations} 
                disabled={loading}
                className="w-full bg-salon hover:bg-salon-dark"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating Recommendations...
                  </>
                ) : (
                  'Generate Recommendations'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Personalized Recommendations</h3>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-salon" />
            <span className="ml-2">Analyzing your features...</span>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((style) => (
              <Card key={style.id} className="overflow-hidden">
                <div className="aspect-video bg-secondary/50">
                  <img 
                    src={style.image} 
                    alt={style.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="text-lg font-semibold">{style.name}</h4>
                  <p className="text-muted-foreground mt-2">{style.description}</p>
                  <Button className="mt-4 bg-salon hover:bg-salon-dark">Book This Style</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-secondary/30 rounded-lg p-6">
            <Scissors className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium">No recommendations yet</h4>
            <p className="text-muted-foreground mt-2">
              Fill out the form and generate recommendations to see personalized hair styles.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HairStyleRecommendations;
