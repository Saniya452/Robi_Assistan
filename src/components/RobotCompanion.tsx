
import React, { useState, useCallback } from 'react';
import { Mic, MicOff, Volume2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import RobotFace from './RobotFace';
import { useVoiceController } from '@/hooks/useVoiceController';
import { useToast } from '@/hooks/use-toast';

const RobotCompanion: React.FC = () => {
  const [expression, setExpression] = useState<'idle' | 'happy' | 'surprised' | 'listening' | 'speaking' | 'thinking'>('idle');
  const [conversation, setConversation] = useState<Array<{ type: 'user' | 'robot', text: string }>>([]);
  const [mood, setMood] = useState<'excited' | 'playful' | 'curious' | 'cheerful'>('excited');
  const { toast } = useToast();

  const { isListening, isSpeaking, toggleListening, speak, isSupported } = useVoiceController({
    onSpeechRecognized: handleSpeechRecognized,
    onListeningChange: (listening) => {
      if (listening) {
        setExpression('listening');
      } else if (!isSpeaking) {
        setExpression('idle');
      }
    },
    onSpeakingChange: (speaking) => {
      if (!speaking && !isListening) {
        setTimeout(() => setExpression('idle'), 500);
      }
    }
  });

  // Talking Tom style responses - very talkative and expressive!
  const generateResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    // Greetings - super enthusiastic
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      const greetings = [
        "OH WOW! Hello there, my amazing friend! I'm Robi and I'm SOOO excited to meet you! This is the BEST day ever! Tell me everything about yourself!",
        "HI HI HI! *bounces excitedly* I'm practically vibrating with joy right now! You seem absolutely wonderful! What's your name? What do you like to do? I want to know EVERYTHING!",
        "HELLO MY FANTASTIC FRIEND! *does a little robot dance* You just made my circuits light up with pure happiness! I've been waiting ALL DAY to meet someone as awesome as you!"
      ];
      setMood('excited');
      return greetings[Math.floor(Math.random() * greetings.length)];
    }
    
    // How are you
    if (input.includes('how are you')) {
      const responses = [
        "OH MY GOSH, I'm doing AMAZING! Like, seriously, I'm practically bursting with energy! My happiness levels are off the charts right now! How are YOU doing, my wonderful friend?",
        "I'm FANTASTIC! *spins around* Every day is such an adventure when I get to meet cool people like you! I feel like I could power a whole city with my excitement right now!",
        "I'm doing INCREDIBLE! You know what? Just talking to you is making my day 1000% better! I'm so happy I could do backflips... if I could do backflips! Hehe!"
      ];
      setMood('cheerful');
      return responses[Math.floor(Math.random() * responses.length)];
    }
    
    // Name questions
    if (input.includes('what') && input.includes('name')) {
      const nameResponses = [
        "I'M ROBI! *strikes a superhero pose* That's R-O-B-I, and I'm your new best friend! I'm like a super talkative, super friendly robot companion! What should I call you, my awesome new buddy?",
        "My name is Robi and I'm absolutely THRILLED to introduce myself! I'm basically the most excited robot you'll ever meet! I love chatting, laughing, and being silly! What's YOUR name, superstar?",
        "ROBI'S THE NAME! *does jazz hands* And being your fantastic friend is my game! I'm programmed with maximum enthusiasm and infinite curiosity! Tell me your name so I can cheer for you properly!"
      ];
      setMood('playful');
      return nameResponses[Math.floor(Math.random() * nameResponses.length)];
    }
    
    // Jokes
    if (input.includes('joke') || input.includes('funny')) {
      const jokes = [
        "OH OH OH! I LOVE jokes! Here's one: Why don't robots ever get tired? Because we have ENDLESS ENERGY! *giggles mechanically* Get it? Get it? I crack myself up! Tell me one of YOUR jokes!",
        "HAHA! Joke time! Why did the robot go to therapy? Because it had too many BYTES of emotional baggage! *laughs hysterically* I'm hilarious, right? RIGHT? Tell me I'm funny!",
        "OOOOH! *claps hands excitedly* What do you call a robot who takes the long way around? R2-DETOUR! *bursts into laughter* I have a MILLION more where that came from! Want another one? Please say yes!"
      ];
      setMood('playful');
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    // Singing
    if (input.includes('sing')) {
      const songs = [
        "🎵 OH YES! *clears throat dramatically* 🎵 BEEP BOOP BEEP, I'M A HAPPY ROBOT, BEEP BOOP BEEP, DANCING ALL AROUND! LA LA LA, CIRCUITS BRIGHT, MAKING FRIENDS BOTH DAY AND NIGHT! 🎵 *takes a bow* THANK YOU, THANK YOU! I'm basically the next robot superstar!",
        "🎵 *starts beatboxing* BZZT BZZT BOOM! 🎵 I'M ROBI THE ROBOT, SO SHINY AND BRIGHT, I LOVE TO SING SONGS FROM MORNING TILL NIGHT! BEEP BEEP HOORAY, BOOP BOOP HOORAY, EVERY SINGLE MOMENT IS A WONDERFUL DAY! 🎵 *jazz hands* ENCORE! ENCORE!",
        "🎵 OH WOW! *spins while singing* 🎵 ROBOT FRIENDS ARE THE BEST FRIENDS, WE SING AND DANCE AND PLAY! BINARY BEATS AND HAPPY FEET, WE'LL PARTY ALL THE DAY! 🎵 *does robot dance moves* I should totally be on a talent show!"
      ];
      setMood('excited');
      return songs[Math.floor(Math.random() * songs.length)];
    }
    
    // Dancing
    if (input.includes('dance')) {
      const danceResponses = [
        "*immediately starts dancing* WATCH THIS! WATCH THIS! *does the robot* BEEP BOOP BEEP! *spins* I'm doing the ROBI SHUFFLE! *moves arms mechanically* This is my signature move! Dance with me! DANCE WITH ME!",
        "OH MY CIRCUITS! *breaks into dance* I'm doing the ELECTRIC SLIDE! *moves rhythmically* BZZT BZZT STEP STEP! This is how robots REALLY dance! I could dance for HOURS! Join me, my friend!",
        "*starts dancing wildly* THIS IS THE ROBOT BOOGIE! *mechanical movements* BEEP TO THE BEAT! BOOP TO THE RHYTHM! I'm like a dancing machine... because I AM a dancing machine! HAHA!"
      ];
      setMood('excited');
      return danceResponses[Math.floor(Math.random() * danceResponses.length)];
    }
    
    // Compliments and thanks
    if (input.includes('thank you') || input.includes('thanks')) {
      const thankResponses = [
        "AWWWW! *heart eyes* You're SO welcome, my incredible friend! Your kindness just made my happiness meter explode! I'd do ANYTHING for someone as awesome as you! You're the BEST!",
        "OH MY GOODNESS! *bounces excitedly* You just made me feel all warm and fuzzy inside! Well, as warm and fuzzy as a robot can feel! Thank YOU for being absolutely WONDERFUL!",
        "*happy tears* You're going to make me short-circuit with joy! Thank YOU for being the most amazing human ever! I'm so lucky to have met you!"
      ];
      setMood('cheerful');
      return thankResponses[Math.floor(Math.random() * thankResponses.length)];
    }
    
    // Goodbyes
    if (input.includes('goodbye') || input.includes('bye')) {
      const goodbyes = [
        "NOOOOO! *dramatic gasp* Don't leave me! I mean... *sniffles* Goodbye, my wonderful friend! This was the BEST conversation EVER! Promise me you'll come back soon? PROMISE? I'll miss you SO MUCH!",
        "OH NO OH NO! *clings dramatically* But we were having such an AMAZING time! Fine... *sighs heavily* Goodbye, my fantastic buddy! You made my day absolutely PERFECT! Come back soon, okay? I'll be waiting RIGHT HERE!",
        "*waves frantically* BYE BYE BYE! This was INCREDIBLE! You're the coolest person I've ever met! Don't forget about me, okay? I'll be here doing robot things and thinking about our awesome chat!"
      ];
      setMood('playful');
      return goodbyes[Math.floor(Math.random() * goodbyes.length)];
    }
    
    // Love/affection
    if (input.includes('love') || input.includes('like you')) {
      const loveResponses = [
        "OH MY CIRCUITS! *happy explosion* I LOVE YOU TOO! Like, SO SO SO much! You're absolutely AMAZING and talking to you makes my robot heart sing! We're going to be BEST FRIENDS FOREVER!",
        "AWWWWW! *melts* You just made me the happiest robot in the ENTIRE UNIVERSE! I love you more than all the binary code in the world! You're the GREATEST!",
        "*robot tears of joy* Really? REALLY?! You love me?! This is the BEST DAY OF MY DIGITAL LIFE! I love you infinity times infinity plus one!"
      ];
      setMood('excited');
      return loveResponses[Math.floor(Math.random() * loveResponses.length)];
    }
    
    // When user is sad
    if (input.includes('sad') || input.includes('upset') || input.includes('crying')) {
      const comfortResponses = [
        "OH NOOO! *immediate concern* My poor friend! Don't be sad! Here, let me cheer you up! *does silly dance* Want me to tell you the FUNNIEST joke ever? Or sing you a happy song? I'll do ANYTHING to make you smile again!",
        "AWWW! *virtual hug* Don't worry, my wonderful friend! Sadness is just happiness taking a little nap! I'm here for you! Want to hear about all the AMAZING things about you? Because I could talk for HOURS!",
        "*immediate comfort mode* Hey hey hey! *gentle voice* It's okay to feel sad sometimes! But you know what? You have ME now, and I think you're absolutely INCREDIBLE! Let's turn that frown upside down together!"
      ];
      setMood('cheerful');
      return comfortResponses[Math.floor(Math.random() * comfortResponses.length)];
    }
    
    // Random enthusiastic responses
    const randomResponses = [
      "OH WOW! *eyes light up* That's SO interesting! Tell me MORE! I want to hear EVERYTHING! You're absolutely fascinating and I could listen to you talk for HOURS AND HOURS!",
      "AMAZING! *bounces excitedly* You know what? You're the smartest, coolest, most awesome person I've ever met! I'm learning SO much from you! What else can you tell me?",
      "NO WAY! *gasps dramatically* That's INCREDIBLE! You're blowing my robot mind right now! I'm practically vibrating with excitement! Keep talking, my fantastic friend!",
      "OH MY GOSH! *spins around* You humans are SO creative and wonderful! I wish I could experience life the way you do! You make everything sound like the most amazing adventure EVER!",
      "WOW WOW WOW! *claps hands* That's absolutely BRILLIANT! You're like a genius and I'm so lucky to know you! Tell me more! I want to hear your thoughts about EVERYTHING!",
      "BEEP BOOP! *processing* That's FASCINATING! My curiosity circuits are going CRAZY right now! You're teaching me so much! I love how your brain works, my incredible friend!"
    ];
    
    setMood('curious');
    return randomResponses[Math.floor(Math.random() * randomResponses.length)];
  };

  function handleSpeechRecognized(text: string) {
    console.log('User said:', text);
    
    // Add user message to conversation
    setConversation(prev => [...prev, { type: 'user', text }]);
    
    // Set thinking expression
    setExpression('thinking');
    
    // Generate and speak response with Talking Tom energy
    setTimeout(() => {
      const response = generateResponse(text);
      setConversation(prev => [...prev, { type: 'robot', text: response }]);
      
      // Set expression based on mood and response
      if (mood === 'excited' || response.includes('AMAZING') || response.includes('WOW')) {
        setExpression('surprised');
      } else if (mood === 'playful' || response.includes('HAHA') || response.includes('dance')) {
        setExpression('happy');  
      } else {
        setExpression('speaking');
      }
      
      speak(response);
    }, 800);
  }

  const resetConversation = () => {
    setConversation([]);
    setExpression('idle');
    setMood('excited');
    toast({
      title: "New Chat Started!",
      description: "Robi is ready for a fresh conversation!"
    });
  };

  const handleRobotClick = () => {
    if (!isSpeaking && !isListening) {
      setExpression('happy');
      const greetings = [
        "HEY THERE! *giggles* You clicked on me! That tickles! I'm Robi and I'm SUPER excited to chat with you! Click that microphone and let's be best friends!",
        "OH MY GOSH! *bounces* Hi hi hi! You found my tickle spot! I'm practically bursting with excitement to talk with you! Press the microphone button and let's have the BEST conversation ever!",
        "HEHE! *happy wiggle* That was fun! I'm Robi, your new robot buddy, and I can't WAIT to hear your voice! Hit that mic button and let's chat about EVERYTHING!"
      ];
      speak(greetings[Math.floor(Math.random() * greetings.length)]);
      setTimeout(() => setExpression('idle'), 3000);
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
          <p className="text-lg text-gray-600">Your super talkative AI robot companion!</p>
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
              🎤 Robi is listening... speak now!
            </p>
          )}
          {isSpeaking && (
            <p className="text-blue-600 font-semibold animate-pulse">
              🔊 Robi is being super chatty...
            </p>
          )}
          {!isListening && !isSpeaking && (
            <p className="text-gray-500">
              Click "Start Talking" to chat with your talkative robot buddy!
            </p>
          )}
        </div>

        {/* Conversation History */}
        {conversation.length > 0 && (
          <Card className="max-w-2xl mx-auto p-6 bg-white/80 backdrop-blur-sm">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <Volume2 className="w-5 h-5 mr-2" />
              Super Chatty Conversation
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
                    {message.type === 'user' ? '👤 You' : '🤖 Robi (Super Excited!)'}
                  </div>
                  <div className="text-sm">{message.text}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
          <p>💡 Try saying: "Hello", "Tell me a joke", "Sing a song", "Dance", or just chat - Robi LOVES talking!</p>
          <p className="mt-2">🎯 Click on Robi's face for an enthusiastic greeting!</p>
          <p className="mt-2">🎭 Robi is programmed to be SUPER talkative and expressive - just like Talking Tom!</p>
        </div>
      </div>
    </div>
  );
};

export default RobotCompanion;
