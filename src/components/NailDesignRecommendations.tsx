
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Paintbrush, Loader2 } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const nailDesignOptions = [
  {
    id: 1,
    name: 'French Manicure',
    image: '/placeholder.svg',
    description: 'A timeless classic with a nude base and white tips.'
  },
  {
    id: 2,
    name: 'Ombré Nails',
    image: '/placeholder.svg',
    description: 'A gradient effect transitioning between two or more colors.'
  },
  {
    id: 3,
    name: 'Geometric Designs',
    image: '/placeholder.svg',
    description: 'Modern patterns featuring lines, shapes, and bold colors.'
  },
  {
    id: 4,
    name: 'Marble Effect',
    image: '/placeholder.svg',
    description: 'Elegant swirls mimicking the look of natural marble stone.'
  }
];

const NailDesignRecommendations: React.FC = () => {
  const [nailShape, setNailShape] = useState('');
  const [nailLength, setNailLength] = useState('');
  const [occasion, setOccasion] = useState('');
  const [preferences, setPreferences] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<Array<typeof nailDesignOptions[0]>>([]);

  const handleGenerateRecommendations = () => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      // Filter designs based on input criteria
      // In a real app, this would be the response from the AI service
      
      // Sample logic - in a real app, this would be more sophisticated
      let filteredOptions = [...nailDesignOptions];
      
      if (occasion === 'formal') {
        filteredOptions = filteredOptions.filter(design => 
          design.name.toLowerCase().includes('french') || 
          design.name.toLowerCase().includes('marble')
        );
      } else if (occasion === 'casual') {
        filteredOptions = filteredOptions.filter(design => 
          design.name.toLowerCase().includes('ombré') ||
          design.name.toLowerCase().includes('geometric')
        );
      }
      
      // Shuffle and select random options if needed to simulate AI variety
      const shuffled = filteredOptions.sort(() => 0.5 - Math.random());
      setRecommendations(shuffled.slice(0, 2)); // Show 2 recommendations
      
      setLoading(false);
      toast({
        title: "Nail design recommendations generated",
        description: "We've analyzed your preferences and generated personalized nail design recommendations.",
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
                <Paintbrush className="h-5 w-5 text-salon" />
              </div>
              <h3 className="text-xl font-semibold">Find Your Perfect Nail Design</h3>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="nailShape">Nail Shape</Label>
                <Select value={nailShape} onValueChange={setNailShape}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred nail shape" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="round">Round</SelectItem>
                    <SelectItem value="square">Square</SelectItem>
                    <SelectItem value="oval">Oval</SelectItem>
                    <SelectItem value="almond">Almond</SelectItem>
                    <SelectItem value="stiletto">Stiletto</SelectItem>
                    <SelectItem value="coffin">Coffin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="nailLength">Nail Length</Label>
                <Select value={nailLength} onValueChange={setNailLength}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your preferred nail length" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="long">Long</SelectItem>
                    <SelectItem value="extra-long">Extra Long</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="occasion">Occasion</Label>
                <Select value={occasion} onValueChange={setOccasion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select the occasion" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="everyday">Everyday</SelectItem>
                    <SelectItem value="formal">Formal Event</SelectItem>
                    <SelectItem value="casual">Casual Event</SelectItem>
                    <SelectItem value="wedding">Wedding</SelectItem>
                    <SelectItem value="vacation">Vacation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="preferences">Design Preferences</Label>
                <Textarea 
                  id="preferences" 
                  placeholder="Tell us more about your style preferences..."
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
                    Generating Design Recommendations...
                  </>
                ) : (
                  'Generate Design Recommendations'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Your Design Recommendations</h3>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-salon" />
            <span className="ml-2">Analyzing your preferences...</span>
          </div>
        ) : recommendations.length > 0 ? (
          <div className="space-y-4">
            {recommendations.map((design) => (
              <Card key={design.id} className="overflow-hidden">
                <div className="aspect-video bg-secondary/50">
                  <img 
                    src={design.image} 
                    alt={design.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="pt-4">
                  <h4 className="text-lg font-semibold">{design.name}</h4>
                  <p className="text-muted-foreground mt-2">{design.description}</p>
                  <Button className="mt-4 bg-salon hover:bg-salon-dark">Book This Design</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-64 text-center bg-secondary/30 rounded-lg p-6">
            <Paintbrush className="h-12 w-12 text-muted-foreground mb-4" />
            <h4 className="text-lg font-medium">No recommendations yet</h4>
            <p className="text-muted-foreground mt-2">
              Fill out the form and generate recommendations to see personalized nail designs.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NailDesignRecommendations;
