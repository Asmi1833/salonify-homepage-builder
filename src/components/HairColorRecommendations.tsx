
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Palette, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const hairColorOptions = [
  {
    id: 1,
    name: 'Rich Auburn',
    image: '/placeholder.svg',
    description: 'A deep red-brown that adds warmth and dimension to your look.'
  },
  {
    id: 2,
    name: 'Caramel Balayage',
    image: '/placeholder.svg',
    description: 'Hand-painted highlights that blend beautifully with your natural color.'
  },
  {
    id: 3,
    name: 'Platinum Blonde',
    image: '/placeholder.svg',
    description: 'A bold, cool-toned blonde that makes a statement.'
  },
  {
    id: 4,
    name: 'Chestnut Brown',
    image: '/placeholder.svg',
    description: 'A rich, multidimensional brown with subtle red undertones.'
  }
];

const HairColorRecommendations: React.FC = () => {
  const [skinTone, setSkinTone] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [currentHairColor, setCurrentHairColor] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<typeof hairColorOptions[0]>>([]);

  const handleGenerateRecommendations = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter colors based on input criteria
      // In a real app, this would be the response from the AI service
      
      // Sample logic - in a real app, this would be more sophisticated
      let filteredOptions = [...hairColorOptions];
      
      if (skinTone === 'warm') {
        filteredOptions = filteredOptions.filter(color => 
          color.name.toLowerCase().includes('auburn') || 
          color.name.toLowerCase().includes('caramel')
        );
      } else if (skinTone === 'cool') {
        filteredOptions = filteredOptions.filter(color => 
          color.name.toLowerCase().includes('platinum') ||
          color.name.toLowerCase().includes('chestnut')
        );
      }
      
      // Shuffle and select random options if needed to simulate AI variety
      const shuffled = filteredOptions.sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 2)); // Show 2 recommendations
      
      setLoading(false);
      toast({
        title: "Color recommendations generated",
        description: "We've analyzed your features and generated personalized color recommendations.",
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
                <Palette className="h-5 w-5 text-salon" />
              </div>
              <h3 className="text-xl font-semibold">Find Your Perfect Hair Color</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="skinTone">Skin Tone</Label>
                <Select value={skinTone} onValueChange={setSkinTone}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your skin tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cool">Cool</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="olive">Olive</SelectItem>
                    <SelectItem value="deep">Deep</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="eyeColor">Eye Color</Label>
                <Select value={eyeColor} onValueChange={setEyeColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your eye color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="hazel">Hazel</SelectItem>
                    <SelectItem value="green">Green</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="currentHairColor">Current Hair Color</Label>
                <Select value={currentHairColor} onValueChange={setCurrentHairColor}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current hair color" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="black">Black</SelectItem>
                    <SelectItem value="brown">Brown</SelectItem>
                    <SelectItem value="blonde">Blonde</SelectItem>
                    <SelectItem value="red">Red</SelectItem>
                    <SelectItem value="gray">Gray</SelectItem>
                    <SelectItem value="colored">Already Colored</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="preferences">Color Preferences</Label>
                <Textarea 
                  id="preferences" 
                  placeholder="Tell us more about what colors you're interested in..."
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
                    Generating Color Recommendations...
                  </>
                ) : (
                  'Generate Color Recommendations'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Color Recommendations</h3>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-salon" />
            <span className="ml-2">Analyzing your features...</span>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((color) => (
              <Card key={color.id} className="overflow-hidden">
                <div className="aspect-video bg-secondary/50">
                  <img 
                    src={color.image} 
                    alt={color.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="text-lg font-semibold">{color.name}</h4>
                  <p className="text-muted-foreground mt-2">{color.description}</p>
                  <Button className="mt-4 bg-salon hover:bg-salon-dark">Book This Color</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-secondary/30 rounded-lg p-6">
            <Palette className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium">No recommendations yet</h4>
            <p className="text-muted-foreground mt-2">
              Fill out the form and generate recommendations to see personalized hair colors.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HairColorRecommendations;
