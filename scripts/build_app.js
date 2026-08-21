const fs = require('fs');
const path = require('path');

const root = path.resolve('.');

const scripts = [
  'src/data/emojis.js',
  'src/data/stickers.js',
  'src/data/soundPresets.js',
  'src/data/triviaQuestions.js',
  'src/data/wallpapers.js',
  'src/core/StateStore.js',
  'src/core/EventBus.js',
  'src/core/Router.js',
  'src/core/SupabaseAdapter.js',
  'src/core/SocketClient.js',
  'src/core/WebRTCManager.js',
  'src/core/CryptoEngine.js',
  'src/core/IndexedDBStorage.js',
  'src/core/SoundSynthesizer.js',
  'src/core/ParticleEffects.js',
  'src/core/I18nEngine.js',
  'src/components/MiniApps/ChessGame.js',
  'src/components/MiniApps/TicTacToeGame.js',
  'src/components/MiniApps/WordleGame.js',
  'src/components/MiniApps/Game2048.js',
  'src/components/MiniApps/TriviaQuizGame.js',
  'src/components/MiniApps/CodePlayground.js',
  'src/components/Whiteboard/WhiteboardComponent.js',
  'src/components/AIAssistant/AIAssistantComponent.js',
  'src/components/Stories/StoriesComponent.js',
  'src/components/Polls/PollComponent.js',
  'src/components/ThemeStudio/ThemeStudioComponent.js',
  'src/components/Soundboard/SoundboardComponent.js',
  'src/components/Vault/VaultComponent.js',
  'src/components/Channels/ChannelsComponent.js',
  'src/components/Calls/CallModalComponent.js',
  'src/components/Settings/SettingsComponent.js',
  'src/components/Sidebar/SidebarComponent.js',
  'src/components/Chat/ChatViewComponent.js',
  'src/components/Input/MessageInputComponent.js',
  'src/components/Auth/AuthModal.js'
];

console.log('Scripts list ready. Length:', scripts.length);
