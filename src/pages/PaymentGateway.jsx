import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CreditCard, CheckCircle, ArrowLeft, Lock, Shield } from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';

export default function PaymentGateway() {
    const navigate = useNavigate();
    const [step, setStep] = useState('form'); // form, processing, success
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [name, setName] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setStep('processing');
        // Simulate payment processing
        setTimeout(() => {
            setStep('success');
        }, 2000);
    };

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };

    if (step === 'processing') {
        return (
            <div className="payment-page">
                <div className="payment-container">
                    <Card className="payment-card text-center">
                        <div className="processing-spinner"></div>
                        <h2 className="text-xl font-bold text-slate-800 mt-6">Processing Payment</h2>
                        <p className="text-slate-500 mt-2">Please wait while we process your payment...</p>
                    </Card>
                </div>
            </div>
        );
    }

    if (step === 'success') {
        return (
            <div className="payment-page">
                <div className="payment-container">
                    <Card className="payment-card text-center">
                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>
                        <h2 className="text-2xl font-bold text-slate-800 mt-6">Payment Successful!</h2>
                        <p className="text-slate-500 mt-2 mb-6">
                            Your payment of <strong>$50.00</strong> has been processed successfully.
                        </p>
                        <div className="receipt-box">
                            <div className="receipt-row">
                                <span>Transaction ID</span>
                                <span className="font-bold">#TXN2026020912345</span>
                            </div>
                            <div className="receipt-row">
                                <span>Amount Paid</span>
                                <span className="font-bold text-success">$50.00</span>
                            </div>
                            <div className="receipt-row">
                                <span>Payment Method</span>
                                <span className="font-bold">•••• {cardNumber.slice(-4) || '4242'}</span>
                            </div>
                        </div>
                        <Button variant="primary" className="w-full mt-6" onClick={() => navigate('/parent')}>
                            Back to Dashboard
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-page">
            <div className="payment-container">
                <button className="back-link-payment" onClick={() => navigate('/parent')}>
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>

                <Card className="payment-card">
                    <div className="payment-header">
                        <div className="payment-icon">
                            <CreditCard size={28} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Secure Payment</h2>
                            <p className="text-sm text-slate-500">Complete your transport fee payment</p>
                        </div>
                    </div>

                    <div className="amount-box">
                        <span className="text-slate-500">Amount to Pay</span>
                        <span className="amount-value">$50.00</span>
                    </div>

                    <form onSubmit={handleSubmit} className="payment-form">
                        <div className="form-group">
                            <label>Cardholder Name</label>
                            <input
                                type="text"
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Card Number</label>
                            <div className="card-input-wrapper">
                                <input
                                    type="text"
                                    placeholder="4242 4242 4242 4242"
                                    value={cardNumber}
                                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                                    maxLength={19}
                                    required
                                />
                                <CreditCard size={20} className="card-icon" />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label>Expiry Date</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    maxLength={5}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>CVV</label>
                                <input
                                    type="password"
                                    placeholder="•••"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength={4}
                                    required
                                />
                            </div>
                        </div>

                        <Button type="submit" variant="primary" className="w-full pay-button">
                            <Lock size={18} /> Pay $50.00
                        </Button>
                    </form>

                    <div className="security-notice">
                        <Shield size={16} />
                        <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>
                </Card>
            </div>
        </div>
    );
}
