/**
 * ChatWave 3.0 - Categorized Emoji Database & Search Engine
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveEmojis = factory();
}(typeof self !== 'undefined' ? self : this, function(root) {
  root = root || (typeof window !== "undefined" ? window : (typeof global !== "undefined" ? global : {}));
  'use strict';

  const CATEGORIES = [
    { id: 'smileys', name: 'Smileys & Emotion', icon: '??' },
    { id: 'people', name: 'People & Body', icon: '??' },
    { id: 'animals', name: 'Animals & Nature', icon: '??' },
    { id: 'food', name: 'Food & Drink', icon: '??' },
    { id: 'activities', name: 'Activities & Games', icon: '?' },
    { id: 'travel', name: 'Travel & Places', icon: '??' },
    { id: 'objects', name: 'Objects & Tech', icon: '??' },
    { id: 'symbols', name: 'Symbols & Hearts', icon: '??' },
    { id: 'flags', name: 'Flags', icon: '??' }
  ];

  const EMOJI_LIST = [
    { char: '??', name: 'Grinning Face', cat: 'smileys', kw: ['smile', 'happy', 'grin'] },
    { char: '??', name: 'Grinning Face with Big Eyes', cat: 'smileys', kw: ['happy', 'joy', 'smile'] },
    { char: '??', name: 'Grinning Face with Smiling Eyes', cat: 'smileys', kw: ['happy', 'laugh', 'pleased'] },
    { char: '??', name: 'Beaming Face with Smiling Eyes', cat: 'smileys', kw: ['beam', 'grin', 'cheerful'] },
    { char: '??', name: 'Grinning Squinting Face', cat: 'smileys', kw: ['laugh', 'lol', 'haha', 'rofl'] },
    { char: '??', name: 'Grinning Face with Sweat', cat: 'smileys', kw: ['sweat', 'nervous', 'relief'] },
    { char: '??', name: 'Rolling on the Floor Laughing', cat: 'smileys', kw: ['rofl', 'laughing', 'hilarious'] },
    { char: '??', name: 'Face with Tears of Joy', cat: 'smileys', kw: ['tears', 'crying laugh', 'joy', 'lmao'] },
    { char: '??', name: 'Slightly Smiling Face', cat: 'smileys', kw: ['smile', 'mild', 'calm'] },
    { char: '??', name: 'Upside-Down Face', cat: 'smileys', kw: ['silly', 'sarcasm', 'irony'] },
    { char: '??', name: 'Winking Face', cat: 'smileys', kw: ['wink', 'flirt', 'joke'] },
    { char: '??', name: 'Smiling Face with Smiling Eyes', cat: 'smileys', kw: ['blush', 'warm', 'sweet'] },
    { char: '??', name: 'Smiling Face with Halo', cat: 'smileys', kw: ['angel', 'innocent', 'good'] },
    { char: '??', name: 'Smiling Face with Hearts', cat: 'smileys', kw: ['love', 'crush', 'adorable', 'infatuated'] },
    { char: '??', name: 'Heart Eyes Face', cat: 'smileys', kw: ['love', 'adore', 'beautiful', 'heart'] },
    { char: '??', name: 'Star-Struck', cat: 'smileys', kw: ['star', 'amazed', 'wow', 'celebrity'] },
    { char: '??', name: 'Face Blowing a Kiss', cat: 'smileys', kw: ['kiss', 'love', 'flirt', 'smooch'] },
    { char: '??', name: 'Kissing Face', cat: 'smileys', kw: ['kiss', 'whistle'] },
    { char: '??', name: 'Kissing Face with Closed Eyes', cat: 'smileys', kw: ['kiss', 'gentle', 'affection'] },
    { char: '??', name: 'Kissing Face with Smiling Eyes', cat: 'smileys', kw: ['kiss', 'happy'] },
    { char: '??', name: 'Face Savoring Food', cat: 'smileys', kw: ['yum', 'tasty', 'delicious', 'lick'] },
    { char: '??', name: 'Face with Tongue', cat: 'smileys', kw: ['tongue', 'playful', 'silly'] },
    { char: '??', name: 'Winking Face with Tongue', cat: 'smileys', kw: ['crazy', 'joke', 'winking tongue'] },
    { char: '??', name: 'Zany Face', cat: 'smileys', kw: ['zany', 'goofy', 'wild', 'crazy'] },
    { char: '??', name: 'Squinting Face with Tongue', cat: 'smileys', kw: ['prank', 'playful', 'silly'] },
    { char: '??', name: 'Money-Mouth Face', cat: 'smileys', kw: ['money', 'rich', 'dollar', 'cash'] },
    { char: '??', name: 'Smiling Face with Open Hands', cat: 'smileys', kw: ['hug', 'embrace', 'friendly'] },
    { char: '??', name: 'Face with Hand Over Mouth', cat: 'smileys', kw: ['giggle', 'oops', 'secret'] },
    { char: '??', name: 'Shushing Face', cat: 'smileys', kw: ['quiet', 'shh', 'secret', 'silence'] },
    { char: '??', name: 'Thinking Face', cat: 'smileys', kw: ['think', 'ponder', 'wonder', 'curious'] },
    { char: '??', name: 'Zipper-Mouth Face', cat: 'smileys', kw: ['zipper', 'silent', 'sealed'] },
    { char: '??', name: 'Face with Raised Eyebrow', cat: 'smileys', kw: ['skeptical', 'doubt', 'suspicious'] },
    { char: '??', name: 'Neutral Face', cat: 'smileys', kw: ['neutral', 'meh', 'blank'] },
    { char: '??', name: 'Expressionless Face', cat: 'smileys', kw: ['expressionless', 'unimpressed'] },
    { char: '??', name: 'Face Without Mouth', cat: 'smileys', kw: ['mute', 'speechless', 'silent'] },
    { char: '??', name: 'Smirking Face', cat: 'smileys', kw: ['smirk', 'flirt', 'sly', 'clever'] },
    { char: '??', name: 'Unamused Face', cat: 'smileys', kw: ['unamused', 'annoyed', 'grumpy'] },
    { char: '??', name: 'Face with Rolling Eyes', cat: 'smileys', kw: ['eyeroll', 'whatever', 'bored'] },
    { char: '??', name: 'Grimacing Face', cat: 'smileys', kw: ['grimace', 'awkward', 'cringe'] },
    { char: '??', name: 'Lying Face', cat: 'smileys', kw: ['pinocchio', 'lie', 'deceit'] },
    { char: '??', name: 'Relieved Face', cat: 'smileys', kw: ['relieved', 'peace', 'zen'] },
    { char: '??', name: 'Pensive Face', cat: 'smileys', kw: ['sad', 'pensive', 'thoughtful'] },
    { char: '??', name: 'Sleepy Face', cat: 'smileys', kw: ['sleepy', 'tired', 'droop'] },
    { char: '??', name: 'Drooling Face', cat: 'smileys', kw: ['drool', 'craving', 'hungry'] },
    { char: '??', name: 'Sleeping Face', cat: 'smileys', kw: ['sleep', 'zzz', 'night', 'rest'] },
    { char: '??', name: 'Face with Medical Mask', cat: 'smileys', kw: ['mask', 'sick', 'virus', 'covid'] },
    { char: '??', name: 'Face with Thermometer', cat: 'smileys', kw: ['sick', 'fever', 'temperature'] },
    { char: '??', name: 'Face with Head-Bandage', cat: 'smileys', kw: ['hurt', 'bandage', 'injury'] },
    { char: '??', name: 'Nauseated Face', cat: 'smileys', kw: ['nauseated', 'gross', 'disgust'] },
    { char: '??', name: 'Face Vomiting', cat: 'smileys', kw: ['vomit', 'barf', 'puke'] },
    { char: '??', name: 'Sneezing Face', cat: 'smileys', kw: ['sneeze', 'tissue', 'allergy'] },
    { char: '??', name: 'Hot Face', cat: 'smileys', kw: ['hot', 'heat', 'sweating', 'summer'] },
    { char: '??', name: 'Cold Face', cat: 'smileys', kw: ['cold', 'freezing', 'frost', 'winter'] },
    { char: '??', name: 'Woozy Face', cat: 'smileys', kw: ['woozy', 'dizzy', 'drunk'] },
    { char: '??', name: 'Dizzy Face', cat: 'smileys', kw: ['dizzy', 'faint', 'confused'] },
    { char: '??', name: 'Exploding Head', cat: 'smileys', kw: ['mindblown', 'shock', 'explode', 'insane'] },
    { char: '??', name: 'Cowboy Hat Face', cat: 'smileys', kw: ['cowboy', 'hat', 'wild'] },
    { char: '??', name: 'Partying Face', cat: 'smileys', kw: ['party', 'celebrate', 'birthday', 'horn'] },
    { char: '??', name: 'Smiling Face with Sunglasses', cat: 'smileys', kw: ['cool', 'sunglasses', 'swag', 'chill'] },
    { char: '??', name: 'Nerd Face', cat: 'smileys', kw: ['nerd', 'geek', 'glasses', 'smart'] },
    { char: '??', name: 'Face with Monocle', cat: 'smileys', kw: ['monocle', 'inspect', 'fancy'] },
    { char: '??', name: 'Confused Face', cat: 'smileys', kw: ['confused', 'puzzled', 'uncertain'] },
    { char: '??', name: 'Worried Face', cat: 'smileys', kw: ['worried', 'nervous', 'anxious'] },
    { char: '??', name: 'Slightly Frowning Face', cat: 'smileys', kw: ['frown', 'sad', 'unhappy'] },
    { char: '??', name: 'Face with Open Mouth', cat: 'smileys', kw: ['surprised', 'wow', 'gasp'] },
    { char: '??', name: 'Hushed Face', cat: 'smileys', kw: ['hushed', 'speechless', 'stunned'] },
    { char: '??', name: 'Astonished Face', cat: 'smileys', kw: ['astonished', 'shocked', 'gasp'] },
    { char: '??', name: 'Flushed Face', cat: 'smileys', kw: ['flushed', 'blushing', 'embarrassed'] },
    { char: '??', name: 'Pleading Face', cat: 'smileys', kw: ['plead', 'puppy eyes', 'beg', 'cute'] },
    { char: '??', name: 'Frowning Face with Open Mouth', cat: 'smileys', kw: ['frown', 'alarmed'] },
    { char: '??', name: 'Anguished Face', cat: 'smileys', kw: ['anguished', 'stunned', 'pain'] },
    { char: '??', name: 'Fearful Face', cat: 'smileys', kw: ['fear', 'scared', 'dread'] },
    { char: '??', name: 'Anxious Face with Sweat', cat: 'smileys', kw: ['anxious', 'worried sweat'] },
    { char: '??', name: 'Sad but Relieved Face', cat: 'smileys', kw: ['whew', 'relief', 'sad'] },
    { char: '??', name: 'Crying Face', cat: 'smileys', kw: ['cry', 'tear', 'sad', 'heartbroken'] },
    { char: '??', name: 'Loudly Crying Face', cat: 'smileys', kw: ['sob', 'weep', 'crying', 'tears'] },
    { char: '??', name: 'Face Screaming in Fear', cat: 'smileys', kw: ['scream', 'horror', 'scared', 'omg'] },
    { char: '??', name: 'Confounded Face', cat: 'smileys', kw: ['confounded', 'frustrated'] },
    { char: '??', name: 'Persevering Face', cat: 'smileys', kw: ['struggle', 'persevere'] },
    { char: '??', name: 'Disappointed Face', cat: 'smileys', kw: ['disappointed', 'down', 'depressed'] },
    { char: '??', name: 'Downcast Face with Sweat', cat: 'smileys', kw: ['sweat', 'exhausted'] },
    { char: '??', name: 'Weary Face', cat: 'smileys', kw: ['weary', 'tired', 'fed up'] },
    { char: '??', name: 'Tired Face', cat: 'smileys', kw: ['tired', 'exhausted', 'done'] },
    { char: '??', name: 'Yawning Face', cat: 'smileys', kw: ['yawn', 'sleepy', 'bored'] },
    { char: '??', name: 'Face with Steam From Nose', cat: 'smileys', kw: ['fume', 'proud', 'triumph', 'angry'] },
    { char: '??', name: 'Enraged Face', cat: 'smileys', kw: ['rage', 'angry', 'mad', 'red'] },
    { char: '??', name: 'Angry Face', cat: 'smileys', kw: ['angry', 'annoyed', 'mad'] },
    { char: '??', name: 'Face with Symbols on Mouth', cat: 'smileys', kw: ['swear', 'curse', 'furious'] },
    { char: '??', name: 'Smiling Face with Horns', cat: 'smileys', kw: ['devil', 'mischief', 'evil smile'] },
    { char: '??', name: 'Angry Face with Horns', cat: 'smileys', kw: ['demon', 'devil', 'furious'] },
    { char: '??', name: 'Skull', cat: 'smileys', kw: ['dead', 'skeleton', 'death', 'dead laughing'] },
    { char: '??', name: 'Skull and Crossbones', cat: 'smileys', kw: ['danger', 'pirate', 'poison'] },
    { char: '??', name: 'Pile of Poo', cat: 'smileys', kw: ['poop', 'poo', 'crap', 'funny'] },
    { char: '??', name: 'Clown Face', cat: 'smileys', kw: ['clown', 'circus', 'fool', 'joker'] },
    { char: '??', name: 'Ghost', cat: 'smileys', kw: ['ghost', 'spooky', 'halloween', 'boo'] },
    { char: '??', name: 'Alien', cat: 'smileys', kw: ['extraterrestrial', 'ufo', 'space'] },
    { char: '??', name: 'Robot', cat: 'smileys', kw: ['bot', 'droid', 'machine', 'ai'] },

    // People & Gestures
    { char: '??', name: 'Waving Hand', cat: 'people', kw: ['wave', 'hello', 'hi', 'bye'] },
    { char: '??', name: 'Raised Back of Hand', cat: 'people', kw: ['backhand', 'stop'] },
    { char: '???', name: 'Hand with Fingers Splayed', cat: 'people', kw: ['five', 'palm', 'high five'] },
    { char: '?', name: 'Raised Hand', cat: 'people', kw: ['high five', 'stop', 'halt'] },
    { char: '??', name: 'Vulcan Salute', cat: 'people', kw: ['spock', 'star trek', 'peace'] },
    { char: '??', name: 'OK Hand', cat: 'people', kw: ['perfect', 'okay', 'great', 'fine'] },
    { char: '??', name: 'Pinched Fingers', cat: 'people', kw: ['italian', 'gesture', 'what'] },
    { char: '??', name: 'Pinching Hand', cat: 'people', kw: ['tiny', 'small', 'little bit'] },
    { char: '??', name: 'Victory Hand', cat: 'people', kw: ['peace', 'victory', 'two'] },
    { char: '??', name: 'Crossed Fingers', cat: 'people', kw: ['luck', 'hope', 'wish'] },
    { char: '??', name: 'Love-You Gesture', cat: 'people', kw: ['ily', 'love you', 'hand'] },
    { char: '??', name: 'Sign of the Horns', cat: 'people', kw: ['rock', 'metal', 'horns', 'party'] },
    { char: '??', name: 'Call Me Hand', cat: 'people', kw: ['shaka', 'phone', 'call', 'hang loose'] },
    { char: '??', name: 'Backhand Index Pointing Left', cat: 'people', kw: ['point left', 'direction'] },
    { char: '??', name: 'Backhand Index Pointing Right', cat: 'people', kw: ['point right', 'direction'] },
    { char: '??', name: 'Backhand Index Pointing Up', cat: 'people', kw: ['point up', 'above'] },
    { char: '??', name: 'Backhand Index Pointing Down', cat: 'people', kw: ['point down', 'below'] },
    { char: '??', name: 'Index Pointing Up', cat: 'people', kw: ['one', 'attention', 'pointer'] },
    { char: '??', name: 'Thumbs Up', cat: 'people', kw: ['like', 'yes', 'approve', 'good', 'upvote'] },
    { char: '??', name: 'Thumbs Down', cat: 'people', kw: ['dislike', 'no', 'bad', 'downvote'] },
    { char: '?', name: 'Raised Fist', cat: 'people', kw: ['fist', 'power', 'solidarity'] },
    { char: '??', name: 'Oncoming Fist', cat: 'people', kw: ['punch', 'fist bump'] },
    { char: '??', name: 'Clapping Hands', cat: 'people', kw: ['applause', 'bravo', 'clap', 'praise'] },
    { char: '??', name: 'Raising Hands', cat: 'people', kw: ['celebrate', 'hooray', 'praise', 'hands'] },
    { char: '??', name: 'Handshake', cat: 'people', kw: ['deal', 'agreement', 'partnership', 'meet'] },
    { char: '??', name: 'Folded Hands', cat: 'people', kw: ['please', 'thank you', 'pray', 'namaste', 'bless'] },
    { char: '??', name: 'Flexed Biceps', cat: 'people', kw: ['muscle', 'strong', 'flex', 'workout', 'power'] },
    { char: '??', name: 'Brain', cat: 'people', kw: ['intellect', 'mind', 'genius', 'smart'] },
    { char: '??', name: 'Eyes', cat: 'people', kw: ['look', 'see', 'watch', 'stare', 'curious'] },

    // Animals & Nature
    { char: '??', name: 'Dog Face', cat: 'animals', kw: ['dog', 'puppy', 'pet', 'woof'] },
    { char: '??', name: 'Cat Face', cat: 'animals', kw: ['cat', 'kitten', 'meow', 'pet'] },
    { char: '??', name: 'Mouse Face', cat: 'animals', kw: ['mouse', 'rodent', 'cheese'] },
    { char: '??', name: 'Hamster Face', cat: 'animals', kw: ['hamster', 'cute', 'pet'] },
    { char: '??', name: 'Rabbit Face', cat: 'animals', kw: ['bunny', 'rabbit', 'easter'] },
    { char: '??', name: 'Fox', cat: 'animals', kw: ['fox', 'clever', 'wild'] },
    { char: '??', name: 'Bear', cat: 'animals', kw: ['bear', 'grizzly', 'wild'] },
    { char: '??', name: 'Panda', cat: 'animals', kw: ['panda', 'bamboo', 'bear', 'cute'] },
    { char: '??', name: 'Tiger Face', cat: 'animals', kw: ['tiger', 'wild', 'cat', 'rawr'] },
    { char: '??', name: 'Lion', cat: 'animals', kw: ['lion', 'king', 'safari', 'rawr'] },
    { char: '??', name: 'Cow Face', cat: 'animals', kw: ['cow', 'moo', 'dairy', 'farm'] },
    { char: '??', name: 'Pig Face', cat: 'animals', kw: ['pig', 'oink', 'farm'] },
    { char: '??', name: 'Frog', cat: 'animals', kw: ['frog', 'toad', 'ribbit', 'amphibian'] },
    { char: '??', name: 'Monkey Face', cat: 'animals', kw: ['monkey', 'ape', 'jungle'] },
    { char: '??', name: 'Unicorn', cat: 'animals', kw: ['unicorn', 'magic', 'fantasy', 'rainbow'] },
    { char: '??', name: 'Honeybee', cat: 'animals', kw: ['bee', 'honey', 'buzz', 'insect'] },
    { char: '??', name: 'Butterfly', cat: 'animals', kw: ['butterfly', 'wings', 'nature'] },
    { char: '??', name: 'Cherry Blossom', cat: 'animals', kw: ['flower', 'sakura', 'bloom', 'spring'] },
    { char: '??', name: 'Rose', cat: 'animals', kw: ['rose', 'flower', 'romance', 'love', 'red'] },
    { char: '??', name: 'Fire', cat: 'animals', kw: ['fire', 'flame', 'lit', 'hot', 'trending', 'burn'] },
    { char: '?', name: 'High Voltage', cat: 'animals', kw: ['lightning', 'bolt', 'electric', 'fast', 'shock'] },
    { char: '??', name: 'Rainbow', cat: 'animals', kw: ['rainbow', 'colorful', 'pride', 'sky'] },

    // Food & Drink
    { char: '??', name: 'Pizza', cat: 'food', kw: ['pizza', 'cheese', 'slice', 'fast food'] },
    { char: '??', name: 'Hamburger', cat: 'food', kw: ['burger', 'beef', 'fast food'] },
    { char: '??', name: 'French Fries', cat: 'food', kw: ['fries', 'potatoes', 'snack'] },
    { char: '??', name: 'Taco', cat: 'food', kw: ['taco', 'mexican', 'food'] },
    { char: '??', name: 'Steaming Bowl', cat: 'food', kw: ['ramen', 'noodles', 'soup', 'asian'] },
    { char: '??', name: 'Sushi', cat: 'food', kw: ['sushi', 'japan', 'fish', 'rice'] },
    { char: '??', name: 'Soft Ice Cream', cat: 'food', kw: ['ice cream', 'dessert', 'sweet', 'summer'] },
    { char: '??', name: 'Shortcake', cat: 'food', kw: ['cake', 'dessert', 'birthday', 'sweet'] },
    { char: '??', name: 'Doughnut', cat: 'food', kw: ['donut', 'sweet', 'pastry'] },
    { char: '??', name: 'Cookie', cat: 'food', kw: ['cookie', 'chocolate chip', 'biscuit', 'snack'] },
    { char: '?', name: 'Hot Beverage', cat: 'food', kw: ['coffee', 'tea', 'cafe', 'morning', 'espresso'] },
    { char: '??', name: 'Bubble Tea', cat: 'food', kw: ['boba', 'bubble tea', 'milk tea'] },
    { char: '??', name: 'Beer Mug', cat: 'food', kw: ['beer', 'drink', 'cheers', 'alcohol'] },
    { char: '??', name: 'Clinking Beer Mugs', cat: 'food', kw: ['cheers', 'toast', 'celebrate', 'party'] },
    { char: '??', name: 'Clinking Glasses', cat: 'food', kw: ['champagne', 'celebration', 'toast'] },
    { char: '??', name: 'Wine Glass', cat: 'food', kw: ['wine', 'drink', 'red wine'] },

    // Activities & Sports
    { char: '?', name: 'Soccer Ball', cat: 'activities', kw: ['football', 'soccer', 'sport', 'goal'] },
    { char: '??', name: 'Basketball', cat: 'activities', kw: ['basketball', 'hoop', 'nba', 'ball'] },
    { char: '??', name: 'American Football', cat: 'activities', kw: ['football', 'nfl', 'touchdown'] },
    { char: '??', name: 'Tennis', cat: 'activities', kw: ['tennis', 'racket', 'court', 'match'] },
    { char: '??', name: 'Video Game', cat: 'activities', kw: ['gaming', 'controller', 'playstation', 'xbox'] },
    { char: '???', name: 'Joystick', cat: 'activities', kw: ['arcade', 'retro', 'gaming'] },
    { char: '??', name: 'Game Die', cat: 'activities', kw: ['dice', 'boardgame', 'chance', 'roll'] },
    { char: '??', name: 'Chess Pawn', cat: 'activities', kw: ['chess', 'game', 'strategy', 'checkmate'] },
    { char: '??', name: 'Direct Hit', cat: 'activities', kw: ['darts', 'target', 'bullseye', 'goal'] },
    { char: '??', name: 'Artist Palette', cat: 'activities', kw: ['art', 'paint', 'canvas', 'creative', 'draw'] },
    { char: '??', name: 'Clapper Board', cat: 'activities', kw: ['movie', 'film', 'action', 'cinema'] },
    { char: '??', name: 'Microphone', cat: 'activities', kw: ['sing', 'karaoke', 'music', 'mic'] },
    { char: '??', name: 'Headphone', cat: 'activities', kw: ['music', 'audio', 'listen', 'sound'] },
    { char: '??', name: 'Guitar', cat: 'activities', kw: ['rock', 'guitar', 'music', 'acoustic'] },
    { char: '??', name: 'Trophy', cat: 'activities', kw: ['winner', 'championship', 'award', 'first', 'gold'] },
    { char: '??', name: '1st Place Medal', cat: 'activities', kw: ['gold', 'first', 'medal', 'champion'] },

    // Travel & Places
    { char: '??', name: 'Rocket', cat: 'travel', kw: ['rocket', 'space', 'launch', 'fast', 'moon'] },
    { char: '??', name: 'Airplane', cat: 'travel', kw: ['flight', 'travel', 'plane', 'trip', 'vacation'] },
    { char: '??', name: 'Automobile', cat: 'travel', kw: ['car', 'drive', 'vehicle', 'roadtrip'] },
    { char: '??', name: 'Flying Saucer', cat: 'travel', kw: ['ufo', 'alien', 'spacecraft'] },
    { char: '??', name: 'Globe Europe-Africa', cat: 'travel', kw: ['earth', 'world', 'planet'] },
    { char: '???', name: 'Beach with Umbrella', cat: 'travel', kw: ['beach', 'vacation', 'summer', 'sea'] },
    { char: '???', name: 'Cityscape', cat: 'travel', kw: ['city', 'skyline', 'buildings', 'urban'] },

    // Objects & Tech
    { char: '??', name: 'Laptop', cat: 'objects', kw: ['computer', 'tech', 'code', 'work', 'laptop'] },
    { char: '??', name: 'Mobile Phone', cat: 'objects', kw: ['phone', 'smartphone', 'iphone', 'android'] },
    { char: '??', name: 'Keyboard', cat: 'objects', kw: ['typing', 'code', 'keyboard', 'computer'] },
    { char: '???', name: 'Desktop Computer', cat: 'objects', kw: ['pc', 'monitor', 'screen', 'workstation'] },
    { char: '?', name: 'Watch', cat: 'objects', kw: ['time', 'clock', 'wristwatch', 'smartwatch'] },
    { char: '??', name: 'Light Bulb', cat: 'objects', kw: ['idea', 'bright', 'innovation', 'eureka'] },
    { char: '??', name: 'Package', cat: 'objects', kw: ['box', 'delivery', 'parcel', 'shipping'] },
    { char: '??', name: 'Wrapped Gift', cat: 'objects', kw: ['present', 'gift', 'birthday', 'celebration'] },
    { char: '??', name: 'Party Popper', cat: 'objects', kw: ['celebrate', 'congrats', 'tada', 'party'] },
    { char: '?', name: 'Sparkles', cat: 'objects', kw: ['sparkle', 'magic', 'shine', 'clean', 'ai', 'special'] },
    { char: '?', name: 'Star', cat: 'objects', kw: ['star', 'favorite', 'rating', 'gold'] },
    { char: '??', name: 'Locked', cat: 'objects', kw: ['security', 'privacy', 'secret', 'password', 'safe'] },
    { char: '??', name: 'Bell', cat: 'objects', kw: ['notification', 'alert', 'chime', 'ring'] },
    { char: '??', name: 'Pushpin', cat: 'objects', kw: ['pin', 'note', 'stick', 'important'] },
    { char: '??', name: 'Paperclip', cat: 'objects', kw: ['attachment', 'attach', 'file', 'link'] },
    { char: '??', name: 'Bar Chart', cat: 'objects', kw: ['analytics', 'data', 'graph', 'growth', 'stats'] },

    // Symbols & Hearts
    { char: '??', name: 'Red Heart', cat: 'symbols', kw: ['heart', 'love', 'like', 'passion', 'red'] },
    { char: '??', name: 'Orange Heart', cat: 'symbols', kw: ['heart', 'warmth', 'friendship'] },
    { char: '??', name: 'Yellow Heart', cat: 'symbols', kw: ['heart', 'bright', 'friendship', 'yellow'] },
    { char: '??', name: 'Green Heart', cat: 'symbols', kw: ['heart', 'nature', 'healthy', 'green'] },
    { char: '??', name: 'Blue Heart', cat: 'symbols', kw: ['heart', 'peace', 'calm', 'trust', 'blue'] },
    { char: '??', name: 'Purple Heart', cat: 'symbols', kw: ['heart', 'royal', 'purple'] },
    { char: '??', name: 'Black Heart', cat: 'symbols', kw: ['heart', 'dark', 'black'] },
    { char: '??', name: 'White Heart', cat: 'symbols', kw: ['heart', 'pure', 'white'] },
    { char: '??', name: 'Broken Heart', cat: 'symbols', kw: ['heartbreak', 'sad', 'breakup', 'broken'] },
    { char: '??', name: 'Sparkling Heart', cat: 'symbols', kw: ['sparkle heart', 'love', 'sweet'] },
    { char: '??', name: 'Growing Heart', cat: 'symbols', kw: ['excited heart', 'love', 'pulse'] },
    { char: '??', name: 'Beating Heart', cat: 'symbols', kw: ['heartbeat', 'alive', 'vibe'] },
    { char: '??', name: 'Hundred Points', cat: 'symbols', kw: ['100', 'perfect', 'full mark', 'score'] },
    { char: '?', name: 'Check Mark Button', cat: 'symbols', kw: ['check', 'done', 'yes', 'verified', 'correct'] },
    { char: '?', name: 'Cross Mark', cat: 'symbols', kw: ['no', 'wrong', 'cancel', 'delete', 'error'] },
    { char: '??', name: 'Warning', cat: 'symbols', kw: ['warning', 'alert', 'caution', 'danger'] },
    { char: '??', name: 'Speech Balloon', cat: 'symbols', kw: ['message', 'chat', 'talk', 'bubble'] },
    { char: '??', name: 'Thought Balloon', cat: 'symbols', kw: ['think', 'dream', 'bubble'] }
  ];

  class EmojiEngine {
    constructor() {
      this.categories = CATEGORIES;
      this.emojis = EMOJI_LIST;
      this.recentList = this.loadRecents();
    }

    loadRecents() {
      try {
        const raw = localStorage.getItem('cw_recent_emojis');
        return raw ? JSON.parse(raw) : ['??', '??', '??', '??', '??', '??', '?', '??'];
      } catch (e) {
        return ['??', '??', '??', '??'];
      }
    }

    recordUsed(char) {
      if (!char) return;
      this.recentList = [char, ...this.recentList.filter(c => c !== char)].slice(0, 32);
      try {
        localStorage.setItem('cw_recent_emojis', JSON.stringify(this.recentList));
      } catch (e) {}
    }

    getRecents() {
      return this.recentList;
    }

    getByCategory(catId) {
      if (catId === 'recents') {
        return this.recentList.map(char => this.emojis.find(e => e.char === char) || { char, name: 'Recent', cat: 'recent' });
      }
      return this.emojis.filter(e => e.cat === catId);
    }

    search(query) {
      if (!query || !query.trim()) return this.emojis.slice(0, 100);
      const q = query.toLowerCase().trim();
      return this.emojis.filter(e => {
        if (e.char === q) return true;
        if (e.name.toLowerCase().includes(q)) return true;
        return e.kw.some(k => k.toLowerCase().includes(q));
      });
    }
  }

  return new EmojiEngine();
}));
