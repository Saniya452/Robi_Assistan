
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

// Add type declarations for Speech APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface UseVoiceControllerProps {
  onSpeechRecognized: (text: string) => void;
  onListeningChange: (isListening: boolean) => void;
  onSpeakingChange: (isSpeaking: boolean) => void;
}

type MicrophonePermissionState = 'idle' | 'granted' | 'denied' | 'unsupported' | 'insecure';

interface SpeakOptions {
  suppressErrors?: boolean;
}

const getSpeechRecognitionErrorMessage = (error: string) => {
  switch (error) {
    case 'not-allowed':
    case 'service-not-allowed':
      return {
        title: 'Microphone Access Blocked',
        description: 'Allow microphone access in your browser settings, then try again.'
      };
    case 'audio-capture':
      return {
        title: 'Microphone Not Available',
        description: 'No microphone was found. Check your device and browser input settings.'
      };
    case 'network':
      return {
        title: 'Network Error',
        description: 'Speech recognition could not reach the service. Check your internet connection and try again.'
      };
    default:
      return {
        title: 'Speech Recognition Error',
        description: 'There was an issue with speech recognition. Please try again.'
      };
  }
};

export const useVoiceController = ({
  onSpeechRecognized,
  onListeningChange,
  onSpeakingChange
}: UseVoiceControllerProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [microphonePermission, setMicrophonePermission] = useState<MicrophonePermissionState>('idle');
  const recognitionRef = useRef<any>(null);
  const isStartingRef = useRef(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check if browser supports speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      setIsSupported(true);
      setMicrophonePermission(window.isSecureContext ? 'idle' : 'insecure');
      recognitionRef.current = new SpeechRecognition();
      
      const recognition = recognitionRef.current;
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        onListeningChange(true);
      };

      recognition.onend = () => {
        setIsListening(false);
        onListeningChange(false);
      };

      recognition.onresult = (event: any) => {
        const current = event.resultIndex;
        const transcript = event.results[current][0].transcript;
        
        if (event.results[current].isFinal) {
          onSpeechRecognized(transcript);
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'aborted' || event.error === 'no-speech') {
          return;
        }
        console.error('Speech recognition error:', event.error);
        const message = getSpeechRecognitionErrorMessage(event.error);
        toast({
          title: message.title,
          description: message.description,
          variant: "destructive"
        });
        setIsListening(false);
        onListeningChange(false);
      };
    } else {
      console.warn('Speech recognition not supported');
      setMicrophonePermission('unsupported');
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support speech recognition.",
        variant: "destructive"
      });
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [onSpeechRecognized, onListeningChange, toast]);

  const requestMicrophonePermission = async () => {
    if (!window.isSecureContext) {
      setMicrophonePermission('insecure');
      toast({
        title: 'Secure Context Required',
        description: 'Speech recognition needs HTTPS or localhost in order to use the microphone.',
        variant: 'destructive'
      });
      return false;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicrophonePermission('unsupported');
      toast({
        title: 'Microphone Not Supported',
        description: 'This browser cannot request microphone access.',
        variant: 'destructive'
      });
      return false;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((track) => track.stop());
      setMicrophonePermission('granted');
      return true;
    } catch (error) {
      console.error('Microphone permission error:', error);
      setMicrophonePermission('denied');
      toast({
        title: 'Microphone Permission Required',
        description: 'Please allow microphone access in your browser and try again.',
        variant: 'destructive'
      });
      setIsListening(false);
      onListeningChange(false);
      return false;
    }
  };

  const toggleListening = async () => {
    if (!recognitionRef.current || !isSupported) return;
    if (isStartingRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      isStartingRef.current = true;
      const hasPermission = await requestMicrophonePermission();
      if (!hasPermission) {
        isStartingRef.current = false;
        return;
      }
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      recognitionRef.current.start();
      isStartingRef.current = false;
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onSpeakingChange(false);
    }
  };

  const speak = (text: string, options?: SpeakOptions) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.1;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;

      utterance.onstart = () => {
        setIsSpeaking(true);
        onSpeakingChange(true);
      };

      utterance.onend = () => {
        setIsSpeaking(false);
        onSpeakingChange(false);
      };

      utterance.onerror = (event: any) => {
        setIsSpeaking(false);
        onSpeakingChange(false);
        if (event?.error === 'interrupted' || event?.error === 'canceled') {
          return;
        }
        if (!options?.suppressErrors) {
          toast({
            title: "Speech Error",
            description: "There was an issue with text-to-speech.",
            variant: "destructive"
          });
        }
      };

      window.speechSynthesis.speak(utterance);
    } else {
      toast({
        title: "Not Supported",
        description: "Your browser doesn't support text-to-speech.",
        variant: "destructive"
      });
    }
  };

  return {
    isListening,
    isSpeaking,
    isSupported,
    microphonePermission,
    requestMicrophonePermission,
    toggleListening,
    stopListening,
    stopSpeaking,
    speak
  };
};
