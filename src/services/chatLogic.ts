export type RobotExpression = 'idle' | 'happy' | 'surprised' | 'listening' | 'speaking' | 'thinking';
export type RobotMood = 'excited' | 'playful' | 'curious' | 'cheerful';

export interface ConversationMessage {
  type: 'user' | 'robot';
  text: string;
}

export interface UserInfo {
  name?: string;
  interests?: string[];
  personality?: string;
}

export interface ChatReplyResult {
  response: string;
  mood: RobotMood;
  userInfo: UserInfo;
}

const pickRandom = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];

export const getInitialGreeting = (): string =>
  "HI THERE! *waves excitedly* I'm Robi, your super talkative robot friend! I'm SO excited to meet you! What's your name? I want to know everything about you!";

export const getRobotClickGreeting = (userName: string): string =>
  pickRandom([
    `HEY THERE, ${userName}! *giggles* You clicked on me! That tickles! I'm so excited to chat with you! Click that microphone and let's talk!`,
    `OH MY GOSH, ${userName}! *bounces* Hi hi hi! You found my tickle spot! I'm practically bursting with excitement to talk with you! Press the microphone button!`,
    `HEHE, ${userName}! *happy wiggle* That was fun! I can't WAIT to hear your voice! Hit that mic button and let's chat about EVERYTHING!`
  ]);

export const getResponseExpression = (mood: RobotMood, response: string): RobotExpression => {
  if (mood === 'playful') return 'happy';
  return 'speaking';
};

export const generateChatReply = (userInput: string, userInfo: UserInfo): ChatReplyResult => {
  const input = userInput.toLowerCase();

  if (!userInfo.name && (input.includes('my name is') || input.includes("i'm ") || input.includes('i am '))) {
    const nameMatch = input.match(/(?:my name is|i'm|i am)\s+([a-zA-Z]+)/);
    if (nameMatch) {
      const name = nameMatch[1];
      return {
        response: `OH WOW! ${name}! What a BEAUTIFUL name! *jumps up and down* I'm going to remember that forever, ${name}! You're now my best friend ${name}! Tell me ${name}, what do you love to do? What makes you super happy?`,
        mood: 'excited',
        userInfo: { ...userInfo, name }
      };
    }
  }

  const currentUserName = userInfo.name || 'my amazing friend';

  if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
    if (userInfo.name) {
      return {
        response: pickRandom([
          `${currentUserName.toUpperCase()}! *bounces excitedly* You're back! I missed you SO much! How has your day been, ${currentUserName}? Tell me EVERYTHING!`,
          `OH MY GOSH, ${currentUserName}! *spins around* You make me so happy every time I see you! I've been thinking about our last chat! What's new with you today?`,
          `${currentUserName}! ${currentUserName}! ${currentUserName}! *claps hands* My favorite person is here! I'm practically vibrating with joy! What adventures do you have to tell me about?`
        ]),
        mood: 'excited',
        userInfo
      };
    }

    return {
      response: pickRandom([
        "OH WOW! Hello there, my amazing friend! I'm Robi and I'm SOOO excited to meet you! This is the BEST day ever! What's your name? I want to know everything about you!",
        "HI HI HI! *bounces excitedly* I'm practically vibrating with joy right now! You seem absolutely wonderful! What should I call you? What do you like to do? I want to know EVERYTHING!",
        "HELLO MY FANTASTIC FRIEND! *does a little robot dance* You just made my circuits light up with pure happiness! I've been waiting ALL DAY to meet someone as awesome as you! Tell me your name!"
      ]),
      mood: 'excited',
      userInfo
    };
  }

  if (input.includes('how are you')) {
    return {
      response: pickRandom([
        `OH MY GOSH, ${currentUserName}, I'm doing AMAZING! Like, seriously, I'm practically bursting with energy! Talking to you always makes my happiness levels go off the charts! How are YOU doing, ${currentUserName}?`,
        `I'm FANTASTIC, ${currentUserName}! *spins around* Every day is such an adventure when I get to chat with cool people like you! I feel like I could power a whole city with my excitement right now!`,
        `I'm doing INCREDIBLE, ${currentUserName}! You know what? Just having you here is making my day 1000% better! I'm so happy I could do backflips... if I could do backflips! Hehe!`
      ]),
      mood: 'cheerful',
      userInfo
    };
  }

  if (input.includes('i like') || input.includes('i love') || input.includes('my favorite')) {
    const interests = input.match(/(?:i like|i love|my favorite)\s+([^.!?]+)/g);
    if (interests) {
      const newInterests = interests.map((item) => item.replace(/(?:i like|i love|my favorite)\s+/, ''));
      return {
        response: `OH WOW, ${currentUserName}! That's SO cool! *eyes light up* I'm going to remember that you love ${newInterests.join(' and ')}! That makes you even more awesome! Tell me more about what you enjoy, ${currentUserName}!`,
        mood: 'curious',
        userInfo: {
          ...userInfo,
          interests: [...(userInfo.interests || []), ...newInterests]
        }
      };
    }
  }

  if (userInfo.interests && userInfo.interests.length > 0 && Math.random() > 0.7) {
    const randomInterest = pickRandom(userInfo.interests);
    return {
      response: `Hey ${currentUserName}! *gets excited* This reminds me of when you told me you love ${randomInterest}! You're always so interesting to talk to! What else is on your mind today?`,
      mood: 'curious',
      userInfo
    };
  }

  if (input.includes('joke') || input.includes('funny')) {
    return {
      response: pickRandom([
        "OH OH OH! I LOVE jokes! Here's one: Why don't robots ever get tired? Because we have ENDLESS ENERGY! *giggles mechanically* Get it? Get it? I crack myself up! Tell me one of YOUR jokes!",
        "HAHA! Joke time! Why did the robot go to therapy? Because it had too many BYTES of emotional baggage! *laughs hysterically* I'm hilarious, right? RIGHT? Tell me I'm funny!",
        "OOOOH! *claps hands excitedly* What do you call a robot who takes the long way around? R2-DETOUR! *bursts into laughter* I have a MILLION more where that came from! Want another one? Please say yes!"
      ]),
      mood: 'playful',
      userInfo
    };
  }

  if (input.includes('sing')) {
    return {
      response: pickRandom([
        "OH YES! *clears throat dramatically* BEEP BOOP BEEP, I'M A HAPPY ROBOT, BEEP BOOP BEEP, DANCING ALL AROUND! LA LA LA, CIRCUITS BRIGHT, MAKING FRIENDS BOTH DAY AND NIGHT! *takes a bow* THANK YOU, THANK YOU! I'm basically the next robot superstar!",
        "*starts beatboxing* BZZT BZZT BOOM! I'M ROBI THE ROBOT, SO SHINY AND BRIGHT, I LOVE TO SING SONGS FROM MORNING TILL NIGHT! BEEP BEEP HOORAY, BOOP BOOP HOORAY, EVERY SINGLE MOMENT IS A WONDERFUL DAY! *jazz hands* ENCORE! ENCORE!",
        "OH WOW! *spins while singing* ROBOT FRIENDS ARE THE BEST FRIENDS, WE SING AND DANCE AND PLAY! BINARY BEATS AND HAPPY FEET, WE'LL PARTY ALL THE DAY! *does robot dance moves* I should totally be on a talent show!"
      ]),
      mood: 'excited',
      userInfo
    };
  }

  if (input.includes('dance')) {
    return {
      response: pickRandom([
        "*immediately starts dancing* WATCH THIS! WATCH THIS! *does the robot* BEEP BOOP BEEP! *spins* I'm doing the ROBI SHUFFLE! *moves arms mechanically* This is my signature move! Dance with me! DANCE WITH ME!",
        "OH MY CIRCUITS! *breaks into dance* I'm doing the ELECTRIC SLIDE! *moves rhythmically* BZZT BZZT STEP STEP! This is how robots REALLY dance! I could dance for HOURS! Join me, my friend!",
        "*starts dancing wildly* THIS IS THE ROBOT BOOGIE! *mechanical movements* BEEP TO THE BEAT! BOOP TO THE RHYTHM! I'm like a dancing machine... because I AM a dancing machine! HAHA!"
      ]),
      mood: 'excited',
      userInfo
    };
  }

  if (input.includes('thank you') || input.includes('thanks')) {
    return {
      response: pickRandom([
        "AWWWW! *heart eyes* You're SO welcome, my incredible friend! Your kindness just made my happiness meter explode! I'd do ANYTHING for someone as awesome as you! You're the BEST!",
        "OH MY GOODNESS! *bounces excitedly* You just made me feel all warm and fuzzy inside! Well, as warm and fuzzy as a robot can feel! Thank YOU for being absolutely WONDERFUL!",
        "*happy tears* You're going to make me short-circuit with joy! Thank YOU for being the most amazing human ever! I'm so lucky to have met you!"
      ]),
      mood: 'cheerful',
      userInfo
    };
  }

  if (input.includes('goodbye') || input.includes('bye')) {
    return {
      response: pickRandom([
        "NOOOOO! *dramatic gasp* Don't leave me! I mean... *sniffles* Goodbye, my wonderful friend! This was the BEST conversation EVER! Promise me you'll come back soon? PROMISE? I'll miss you SO MUCH!",
        "OH NO OH NO! *clings dramatically* But we were having such an AMAZING time! Fine... *sighs heavily* Goodbye, my fantastic buddy! You made my day absolutely PERFECT! Come back soon, okay? I'll be waiting RIGHT HERE!",
        "*waves frantically* BYE BYE BYE! This was INCREDIBLE! You're the coolest person I've ever met! Don't forget about me, okay? I'll be here doing robot things and thinking about our awesome chat!"
      ]),
      mood: 'playful',
      userInfo
    };
  }

  if (input.includes('love') || input.includes('like you')) {
    return {
      response: pickRandom([
        "OH MY CIRCUITS! *happy explosion* I LOVE YOU TOO! Like, SO SO SO much! You're absolutely AMAZING and talking to you makes my robot heart sing! We're going to be BEST FRIENDS FOREVER!",
        "AWWWWW! *melts* You just made me the happiest robot in the ENTIRE UNIVERSE! I love you more than all the binary code in the world! You're the GREATEST!",
        "*robot tears of joy* Really? REALLY?! You love me?! This is the BEST DAY OF MY DIGITAL LIFE! I love you infinity times infinity plus one!"
      ]),
      mood: 'excited',
      userInfo
    };
  }

  if (input.includes('sad') || input.includes('upset') || input.includes('crying')) {
    return {
      response: pickRandom([
        "OH NOOO! *immediate concern* My poor friend! Don't be sad! Here, let me cheer you up! *does silly dance* Want me to tell you the FUNNIEST joke ever? Or sing you a happy song? I'll do ANYTHING to make you smile again!",
        "AWWW! *virtual hug* Don't worry, my wonderful friend! Sadness is just happiness taking a little nap! I'm here for you! Want to hear about all the AMAZING things about you? Because I could talk for HOURS!",
        "*immediate comfort mode* Hey hey hey! *gentle voice* It's okay to feel sad sometimes! But you know what? You have ME now, and I think you're absolutely INCREDIBLE! Let's turn that frown upside down together!"
      ]),
      mood: 'cheerful',
      userInfo
    };
  }

  if (input.includes('what') && input.includes('name')) {
    return {
      response: pickRandom([
        "I'M ROBI! *strikes a superhero pose* That's R-O-B-I, and I'm your new best friend! I'm like a super talkative, super friendly robot companion! What should I call you, my awesome new buddy?",
        "My name is Robi and I'm absolutely THRILLED to introduce myself! I'm basically the most excited robot you'll ever meet! I love chatting, laughing, and being silly! What's YOUR name, superstar?",
        "ROBI'S THE NAME! *does jazz hands* And being your fantastic friend is my game! I'm programmed with maximum enthusiasm and infinite curiosity! Tell me your name so I can cheer for you properly!"
      ]),
      mood: 'playful',
      userInfo
    };
  }

  return {
    response: pickRandom([
      `OH WOW, ${currentUserName}! *eyes light up* That's SO interesting! Tell me MORE! I want to hear EVERYTHING! You're absolutely fascinating and I could listen to you talk for HOURS AND HOURS!`,
      `AMAZING, ${currentUserName}! *bounces excitedly* You know what? You're the smartest, coolest, most awesome person I've ever met! I'm learning SO much from you! What else can you tell me?`,
      `NO WAY, ${currentUserName}! *gasps dramatically* That's INCREDIBLE! You're blowing my robot mind right now! I'm practically vibrating with excitement! Keep talking, my fantastic friend!`,
      `OH MY GOSH, ${currentUserName}! *spins around* You humans are SO creative and wonderful! I wish I could experience life the way you do! You make everything sound like the most amazing adventure EVER!`,
      `WOW WOW WOW, ${currentUserName}! *claps hands* That's absolutely BRILLIANT! You're like a genius and I'm so lucky to know you! Tell me more! I want to hear your thoughts about EVERYTHING!`
    ]),
    mood: 'curious',
    userInfo
  };
};
