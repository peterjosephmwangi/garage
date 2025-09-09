// Enhanced M-Pesa Status Display Component for Checkout
import React from 'react';
import { AlertCircle, CheckCircle, Clock, XCircle, Smartphone, Loader } from 'lucide-react';

interface MpesaStatusDisplayProps {
  mpesaState: {
    isInitiating: boolean;
    isPolling: boolean;
    status: string;
    message: string;
    checkoutRequestID?: string;
  };
  onRetry?: () => void;
  onCancel?: () => void;
}

const MpesaStatusDisplay: React.FC<MpesaStatusDisplayProps> = ({ 
  mpesaState, 
  onRetry, 
  onCancel 
}) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5" />,
          bgColor: 'bg-green-100',
          textColor: 'text-green-700',
          borderColor: 'border-green-200',
        };
      case 'failed':
        return {
          icon: <XCircle className="w-5 h-5" />,
          bgColor: 'bg-red-100',
          textColor: 'text-red-700',
          borderColor: 'border-red-200',
        };
      case 'timeout':
        return {
          icon: <Clock className="w-5 h-5" />,
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-700',
          borderColor: 'border-yellow-200',
        };
      case 'pending':
        return {
          icon: <AlertCircle className="w-5 h-5" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
      default:
        return {
          icon: <Smartphone className="w-5 h-5" />,
          bgColor: 'bg-blue-100',
          textColor: 'text-blue-700',
          borderColor: 'border-blue-200',
        };
    }
  };

  if (!mpesaState.message) return null;

  const config = getStatusConfig(mpesaState.status);

  return (
    <div className={`p-4 rounded-lg border ${config.bgColor} ${config.borderColor} ${config.textColor}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          {mpesaState.isInitiating || mpesaState.isPolling ? (
            <Loader className="w-5 h-5 animate-spin" />
          ) : (
            config.icon
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium mb-1">
            {mpesaState.status === 'success' && 'Payment Successful!'}
            {mpesaState.status === 'failed' && 'Payment Failed'}
            {mpesaState.status === 'timeout' && 'Payment Timeout'}
            {mpesaState.status === 'pending' && 'Payment Pending'}
            {mpesaState.isInitiating && 'Initiating Payment...'}
            {mpesaState.isPolling && 'Confirming Payment...'}
          </div>
          
          <p className="text-sm leading-relaxed">
            {mpesaState.message}
          </p>

          {/* Progress indicator for polling */}
          {mpesaState.isPolling && (
            <div className="mt-3">
              <div className="w-full bg-white bg-opacity-50 rounded-full h-2">
                <div className="bg-current h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
              </div>
              <p className="text-xs mt-1 opacity-75">
                This usually takes 10-30 seconds
              </p>
            </div>
          )}

          {/* Action buttons */}
          {(mpesaState.status === 'failed' || mpesaState.status === 'timeout') && (
            <div className="mt-3 flex gap-2">
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="px-3 py-1.5 text-xs font-medium bg-white bg-opacity-80 rounded border border-current hover:bg-opacity-100 transition"
                >
                  Try Again
                </button>
              )}
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-3 py-1.5 text-xs font-medium bg-white bg-opacity-50 rounded border border-current hover:bg-opacity-80 transition"
                >
                  Cancel
                </button>
              )}
            </div>
          )}

          {/* Helpful tips based on status */}
          {mpesaState.status === 'failed' && (
            <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
              <p className="font-medium mb-1">Common solutions:</p>
              <ul className="list-disc list-inside space-y-0.5 opacity-90">
                <li>Ensure you have sufficient M-Pesa balance</li>
                <li>Check if your M-Pesa account is active</li>
                <li>Try using a different Safaricom number</li>
              </ul>
            </div>
          )}

          {mpesaState.isPolling && (
            <div className="mt-3 p-2 bg-white bg-opacity-50 rounded text-xs">
              <p className="font-medium mb-1">What to do:</p>
              <ol className="list-decimal list-inside space-y-0.5 opacity-90">
                <li>Check your phone for M-Pesa popup</li>
                <li>Enter your M-Pesa PIN</li>
                <li>Wait for confirmation</li>
              </ol>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MpesaStatusDisplay;