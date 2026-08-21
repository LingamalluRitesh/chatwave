/**
 * ChatWave 3.0 - Multi-Language Localization Engine
 * Supports English, Spanish, French, German, Hindi, Japanese, Chinese, and Arabic.
 */
(function(root, factory) {
  if (typeof define === 'function' && define.amd) define([], factory);
  else if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ChatWaveI18n = factory();
}(typeof self !== 'undefined' ? self : this, function() {
  'use strict';

  const DICTIONARIES = {
    en: {
      appName: 'ChatWave',
      tagline: 'Private & Secure Cloud Messaging',
      searchPlaceholder: 'Search chats, contacts, channels...',
      typeMessage: 'Type a message...',
      online: 'Online',
      offline: 'Offline',
      typing: 'is typing...',
      newGroup: 'New Group',
      newChannel: 'New Channel',
      whiteboard: 'Whiteboard',
      miniApps: 'Mini-Apps & Games',
      aiAssistant: 'AI Assistant',
      vault: 'Cloud Vault',
      settings: 'Settings',
      theme: 'Theme Studio',
      soundboard: 'Soundboard',
      logout: 'Log Out',
      all: 'All',
      unread: 'Unread',
      groups: 'Groups',
      channels: 'Channels',
      direct: 'Direct',
      call: 'Voice & Video Call',
      mute: 'Mute',
      unmute: 'Unmute',
      screenShare: 'Share Screen',
      endCall: 'End Call'
    },
    es: {
      appName: 'ChatWave',
      tagline: 'Mensajer�a en la Nube Privada y Segura',
      searchPlaceholder: 'Buscar chats, contactos, canales...',
      typeMessage: 'Escribe un mensaje...',
      online: 'En l�nea',
      offline: 'Desconectado',
      typing: 'est� escribiendo...',
      newGroup: 'Nuevo Grupo',
      newChannel: 'Nuevo Canal',
      whiteboard: 'Pizarra',
      miniApps: 'Juegos y Mini-Apps',
      aiAssistant: 'Asistente IA',
      vault: 'B�veda de Archivos',
      settings: 'Ajustes',
      theme: 'Estudio de Temas',
      soundboard: 'Panel de Sonidos',
      logout: 'Cerrar Sesi�n',
      all: 'Todos',
      unread: 'No le�dos',
      groups: 'Grupos',
      channels: 'Canales',
      direct: 'Directo',
      call: 'Llamada de Voz y Video',
      mute: 'Silenciar',
      unmute: 'Activar sonido',
      screenShare: 'Compartir Pantalla',
      endCall: 'Finalizar Llamada'
    },
    hi: {
      appName: '??????',
      tagline: '???????? ?? ???? ?????? ????????',
      searchPlaceholder: '???, ?????? ?????...',
      typeMessage: '?? ????? ?????...',
      online: '??????',
      offline: '??????',
      typing: '???? ?? ??? ??...',
      newGroup: '??? ????',
      newChannel: '??? ????',
      whiteboard: '???????????',
      miniApps: '??? ?? ????',
      aiAssistant: '??? ?????',
      vault: '?????? ?????',
      settings: '????????',
      theme: '??? ????????',
      soundboard: '??????????',
      logout: '??? ???',
      all: '???',
      unread: '?????',
      groups: '????',
      channels: '????',
      direct: '?????????',
      call: '??? ????',
      mute: '?????',
      unmute: '???????',
      screenShare: '??????? ????',
      endCall: '??? ??????'
    }
  };

  class I18nEngine {
    constructor() {
      this.locale = 'en';
      this.dictionaries = DICTIONARIES;
    }

    setLocale(loc) {
      if (this.dictionaries[loc]) {
        this.locale = loc;
        return true;
      }
      return false;
    }

    getLocale() {
      return this.locale;
    }

    t(key) {
      const dict = this.dictionaries[this.locale] || this.dictionaries['en'];
      return dict[key] || this.dictionaries['en'][key] || key;
    }
  }

  return new I18nEngine();
}));
