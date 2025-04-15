
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { PlusCircle, CreditCard, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'visa' | 'mastercard' | 'amex' | 'discover';
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

const DEFAULT_PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'card-1',
    type: 'visa',
    last4: '4242',
    expiryDate: '04/25',
    isDefault: true
  },
  {
    id: 'card-2',
    type: 'mastercard',
    last4: '5678',
    expiryDate: '07/26',
    isDefault: false
  }
];

interface PaymentMethodsProps {
  userId: string;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ userId }) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardholderName, setCardholderName] = useState('');
  const [cardType, setCardType] = useState<'visa' | 'mastercard' | 'amex' | 'discover'>('visa');
  
  useEffect(() => {
    // Get payment methods from local storage
    const storedPaymentMethods = localStorage.getItem(`payment-methods-${userId}`);
    if (storedPaymentMethods) {
      setPaymentMethods(JSON.parse(storedPaymentMethods));
    } else {
      // For demo purposes, set some default payment methods
      setPaymentMethods(DEFAULT_PAYMENT_METHODS);
      savePaymentMethods(DEFAULT_PAYMENT_METHODS);
    }
  }, [userId]);
  
  const savePaymentMethods = (methods: PaymentMethod[]) => {
    localStorage.setItem(`payment-methods-${userId}`, JSON.stringify(methods));
  };
  
  const handleAddCard = () => {
    if (!cardNumber || !expiryDate || !cvv || !cardholderName) {
      toast.error('Please fill in all card details');
      return;
    }
    
    // Basic validation
    if (cardNumber.length < 16) {
      toast.error('Please enter a valid card number');
      return;
    }
    
    const last4 = cardNumber.slice(-4);
    
    const newCard: PaymentMethod = {
      id: `card-${Date.now()}`,
      type: cardType,
      last4,
      expiryDate,
      isDefault: paymentMethods.length === 0 // Set as default if it's the first card
    };
    
    const updatedMethods = [...paymentMethods, newCard];
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    
    // Save notification
    const notifications = JSON.parse(localStorage.getItem(`notifications-${userId}`) || '[]');
    const newNotification = {
      id: `notif-${Date.now()}`,
      title: 'Payment Method Added',
      message: `You've added a new ${cardType.toUpperCase()} card ending in ${last4} to your account.`,
      date: new Date(),
      read: false
    };
    localStorage.setItem(`notifications-${userId}`, JSON.stringify([...notifications, newNotification]));
    
    // Reset form
    setCardNumber('');
    setExpiryDate('');
    setCvv('');
    setCardholderName('');
    setCardType('visa');
    setIsAddCardOpen(false);
    
    toast.success('New payment method added successfully');
  };
  
  const handleRemoveCard = (id: string) => {
    const updatedMethods = paymentMethods.filter(method => method.id !== id);
    
    // If we removed the default card and there are other cards, make the first one default
    if (paymentMethods.find(m => m.id === id)?.isDefault && updatedMethods.length > 0) {
      updatedMethods[0].isDefault = true;
    }
    
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    toast.success('Payment method removed');
  };
  
  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === id
    }));
    
    setPaymentMethods(updatedMethods);
    savePaymentMethods(updatedMethods);
    toast.success('Default payment method updated');
  };
  
  const getCardIcon = (type: string) => {
    return <CreditCard className="h-5 w-5" />;
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Payment Methods</h2>
        <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
          <DialogTrigger asChild>
            <Button className="bg-salon hover:bg-salon-dark flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add Payment Method</DialogTitle>
              <DialogDescription>
                Enter your card details to add a new payment method.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="card-type">Card Type</Label>
                <RadioGroup 
                  id="card-type" 
                  value={cardType} 
                  onValueChange={(value) => setCardType(value as any)}
                  className="flex space-x-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="visa" id="visa" />
                    <Label htmlFor="visa">Visa</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="mastercard" id="mastercard" />
                    <Label htmlFor="mastercard">Mastercard</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="amex" id="amex" />
                    <Label htmlFor="amex">Amex</Label>
                  </div>
                </RadioGroup>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="cardholder-name">Cardholder Name</Label>
                <Input 
                  id="cardholder-name" 
                  value={cardholderName}
                  onChange={(e) => setCardholderName(e.target.value)}
                  placeholder="Name on card" 
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="card-number">Card Number</Label>
                <Input 
                  id="card-number" 
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  placeholder="1234 5678 9012 3456" 
                  maxLength={16}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry" 
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    placeholder="MM/YY" 
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv" 
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    placeholder="123" 
                    maxLength={4}
                  />
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddCardOpen(false)}>
                Cancel
              </Button>
              <Button 
                className="bg-salon hover:bg-salon-dark"
                onClick={handleAddCard}
              >
                Add Card
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {paymentMethods.length > 0 ? (
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <Card key={method.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    {getCardIcon(method.type)}
                    <CardTitle className="text-lg">{method.type.toUpperCase()} •••• {method.last4}</CardTitle>
                  </div>
                  {method.isDefault && (
                    <div className="flex items-center bg-green-100 text-green-800 text-xs rounded-full px-2 py-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Default
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pb-2">
                <CardDescription>
                  Expires {method.expiryDate}
                </CardDescription>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!method.isDefault && (
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSetDefault(method.id)}
                  >
                    Set as Default
                  </Button>
                )}
                {method.isDefault && (
                  <div className="h-9"></div> // Empty div to maintain layout
                )}
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => handleRemoveCard(method.id)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Remove
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-muted rounded-lg">
          <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-semibold mb-2">No Payment Methods</h3>
          <p className="text-muted-foreground mb-6">
            You haven't added any payment methods yet. Add one to make booking easier.
          </p>
          <Button 
            className="bg-salon hover:bg-salon-dark"
            onClick={() => setIsAddCardOpen(true)}
          >
            Add Payment Method
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
