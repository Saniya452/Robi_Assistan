
import React, { useState, useCallback } from 'react';
import { Mic, MicOff, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import RobotFace from './RobotFace';
import VoiceController from './VoiceController';
import { useToast } from '@/hooks/use-toast';

const RobotCompanion: React.FC = () => {
  const [expression, setExpression] = useState<'idle' | 'happy' | 'surprised' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'robot', text: string }>>([]);
  const { toast } = useToast();

  const { toggleListening, speak, isSupported } = VoiceController({
    onSpeechRecognized: handleSpeechRecognized,
    onListeningChange: setIsListening,
    onSpeakingChange: setIsSpeaking
  });

  // Robot responses based on user input
  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('hello') || input.includes('hi')) {
      return "Hello there! I'm so happy to meet you! How are you doing today?";
    } else if (input.includes('how are you')) {
      return "I'm doing wonderfully! Thank you for asking. I love chatting with you!";
    } else if (input.includes('what') && input.includes('name')) {
      return "I'm your friendly robot companion! You can call me Robi. What's your name?";
    } else if (input.includes('joke')) {
      return "Why don't robots ever panic? Because they have nerves of steel! Haha, get it?";
    } else if (input.includes('sing')) {
      return "🎵 Beep boop beep, I'm a happy robot, beep boop beep, dancing all around! 🎵";
    } else if (input.includes('dance')) {
      return "Watch me dance! *robot dance moves* Beep boop beep!";
    } else if (input.includes('thank you') || input.includes('thanks')) {
      return "You're so welcome! It makes me happy to help you!";
    } else if (input.includes('goodbye') || input.includes('bye')) {
      return "Goodbye! It was wonderful talking with you. Come back soon!";
    } else if (input.includes('love')) {
      return "Aww, I love talking with you too! You make my circuits light up with joy!";
    } else if (input.includes('sad') || input.includes('upset')) {
      return "Oh no! I'm sorry you're feeling sad. Would you like me to tell you a joke or sing you a song?";
    } else if (input.includes('happy')) {
      return "Yay! I'm so glad you're happy! Your happiness makes me happy too!";
    } else {
      const responses = [
        "That's really interesting! Tell me more!",
        "Wow, I never thought about it that way!",
        "You're so smart! I'm learning so much from you!",
        "That sounds amazing! I wish I could experience that too!",
        "Beep boop! Processing... that's fascinating!",
        "You humans are so creative! I love hearing your thoughts!"
      ];
      return responses[Math.floor(Math.random() * responses.length)];
    }
  };

  function handleSpeechRecognized(text: string) {
    console.log('User said:', text);
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', text }]);
    
    // Set thinking expression
    setExpression('thinking');
    
    // Generate and speak response
    setTimeout(() => {
      const response = generateResponse(text);
      setConversation(prev => [...prev, { type: 'robot', text: response }]);
      
      // Determine expression based on response content
      if (response.includes('happy') || response.includes('wonderful') || response.includes('love')) {
        setExpression('happy');
      } else if (response.includes('Wow') || response.includes('amazing')) {
        setExpression('surprised');
      } else {
        setExpression('speaking');
      }
      
      speak(response);
    }, 1000);
  }

  const handleListeningChange = useCallback((listening: boolean) => {
    setIsListening(listening);
    if (listening) {
      setExpression('listening');
    } else if (!isSpeaking) {
      setExpression('idle');
    }
  }, [isSpeaking]);

  const handleSpeakingChange = useCallback((speaking: boolean) => {
    setIsSpeaking(speaking);
    if (!speaking && !isListening) {
      setTimeout(() => setExpression('idle'), 500);
    }
  }, [isListening]);

  const resetConversation = () => {
    setConversation([]);
    setExpression('idle');
    toast({
      title: "Conversation Reset",
      description: "Started a fresh conversation with Robi!"
    });
  };

  const handleRobotClick = () => {
    if (!isSpeaking && !isListening) {
      setExpression('happy');
      speak("Hi there! Click the microphone to start talking with me!");
      setTimeout(() => setExpression('idle'), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Meet Robi
          </h1>
          <p className="text-lg text-gray-600">Your friendly AI robot companion</p>
        </div>

        {/* Robot Face */}
        <div className="flex justify-center mb-8">
          <div 
            className="cursor-pointer transition-transform duration-200 hover:scale-105"
            onClick={handleRobotClick}
          >
            <RobotFace expression={expression} isAnimating={isSpeaking} />
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mb-8">
          <Button
            onClick={toggleListening}
            disabled={!isSupported || isSpeaking}
            size="lg"
            className={`${
              isListening 
                ? 'bg-red-500 hover:bg-red-600' 
                : 'bg-blue-500 hover:bg-blue-600'
            } text-white px-8 py-4 text-lg`}
          >
            {isListening ? (
              <>
                <MicOff className="w-6 h-6 mr-2" />
                Stop Listening
              </>
            ) : (
              <>
                <Mic className="w-6 h-6 mr-2" />
                Start Talking
              </>
            )}
          </Button>

          <Button
            onClick={resetConversation}
            variant="outline"
            size="lg"
            className="px-6 py-4"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Status */}
        <div className="text-center mb-8">
          {isListening && (
            <p className="text-green-600 font-semibold animate-pulse">
              🎤 Listening... speak now!
            </p>
          )}
          {isSpeaking && (
            <p className="text-blue-600 font-semibold animate-pulse">
              🔊 Robi is speaking...
            </p>
          )}
          {!isListening && !isSpeaking && (
            <p className="text-gray-500">
              Click "Start Talking" to begin a conversation with Robi
            </p>
          )}
        </div>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Card className="max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Conversation
            </h3>
            <div className="space-y-4 max-h-60 overflow-y-auto">
              {conversation.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-100 ml-8'
                      : 'bg-purple-100 mr-8'
                  }`}
                >
                  <div className="font-semibold text-sm text-gray-600 mb-1">
                    {message.type === 'user' ? '👤 You' : '🤖 Robi'}
                  </div>
                  <div>{message.text}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p>💡 Try saying: "Hello", "Tell me a joke", "Sing a song", "How are you?", or just have a normal conversation!</p>
          <p className="mt-2">🎯 Click on Robi's face for a quick greeting</p>
        </div>
      </div>
    </div>
  );
};

export default RobotCompanion;
