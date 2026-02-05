import React, { useState, useEffect, useRef } from 'react';
import { 
  Accessibility, X, Volume2, VolumeX, Type, MousePointer, Eye, EyeOff,
  Palette, Sun, Moon, Zap, Brain, Keyboard, Focus, Languages, RotateCcw,
  Plus, Minus, AlignLeft, AlignCenter, AlignRight, Link2, Heading, Image,
  Pause, Play, Move, ChevronUp, ChevronDown, BookOpen, Hand, Mic, MicOff,
  ZoomIn, Contrast, Sparkles, Settings, HelpCircle, MessageSquare
} from 'lucide-react';

// Accessibility Widget Component - Full Feature Implementation
const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('profiles');
  const [settings, setSettings] = useState({
    // Text Settings
    fontSize: 100,
    lineHeight: 100,
    letterSpacing: 0,
    wordSpacing: 0,
    fontWeight: 'normal',
    textAlign: 'left',
    dyslexiaFont: false,
    
    // Visual Settings
    contrast: 'normal',
    saturation: 100,
    highlightLinks: false,
    highlightHeadings: false,
    hideImages: false,
    darkMode: false,
    invertColors: false,
    
    // Reading Aids
    readingGuide: false,
    readingMask: false,
    focusMode: false,
    
    // Cursor & Navigation
    bigCursor: false,
    cursorColor: 'default',
    keyboardNav: false,
    focusHighlight: false,
    
    // Motion & Animation
    pauseAnimations: false,
    reduceMotion: false,
    
    // Audio
    textToSpeech: false,
    speechRate: 1,
    
    // Profiles
    activeProfile: null
  });

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const speechSynthesis = typeof window !== 'undefined' ? window.speechSynthesis : null;

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.setProperty('--wa-font-scale', `${settings.fontSize}%`);
    
    // Line height
    root.style.setProperty('--wa-line-height', `${settings.lineHeight}%`);
    
    // Letter spacing
    root.style.setProperty('--wa-letter-spacing', `${settings.letterSpacing}px`);
    
    // Word spacing
    root.style.setProperty('--wa-word-spacing', `${settings.wordSpacing}px`);
    
    // Apply classes
    root.classList.toggle('wa-dyslexia-font', settings.dyslexiaFont);
    root.classList.toggle('wa-highlight-links', settings.highlightLinks);
    root.classList.toggle('wa-highlight-headings', settings.highlightHeadings);
    root.classList.toggle('wa-hide-images', settings.hideImages);
    root.classList.toggle('wa-dark-mode', settings.darkMode);
    root.classList.toggle('wa-invert-colors', settings.invertColors);
    root.classList.toggle('wa-big-cursor', settings.bigCursor);
    root.classList.toggle('wa-pause-animations', settings.pauseAnimations);
    root.classList.toggle('wa-reduce-motion', settings.reduceMotion);
    root.classList.toggle('wa-focus-highlight', settings.focusHighlight);
    root.classList.toggle('wa-reading-guide', settings.readingGuide);
    root.classList.toggle('wa-focus-mode', settings.focusMode);
    
    // Contrast modes
    root.classList.remove('wa-high-contrast', 'wa-low-contrast', 'wa-monochrome');
    if (settings.contrast !== 'normal') {
      root.classList.add(`wa-${settings.contrast}`);
    }
    
    // Saturation
    root.style.setProperty('--wa-saturation', `${settings.saturation}%`);
    
  }, [settings]);

  // Text to Speech
  const speakText = (text) => {
    if (!speechSynthesis) return;
    
    speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.speechRate;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const speakSelectedText = () => {
    const selection = window.getSelection();
    if (selection && selection.toString()) {
      speakText(selection.toString());
    }
  };

  const stopSpeaking = () => {
    if (speechSynthesis) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Voice Commands
  const startVoiceCommands = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice commands not supported in this browser');
      return;
    }
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      handleVoiceCommand(command);
    };
    
    recognition.start();
  };

  const handleVoiceCommand = (command) => {
    if (command.includes('increase font') || command.includes('bigger text')) {
      updateSetting('fontSize', Math.min(settings.fontSize + 10, 200));
    } else if (command.includes('decrease font') || command.includes('smaller text')) {
      updateSetting('fontSize', Math.max(settings.fontSize - 10, 50));
    } else if (command.includes('dark mode')) {
      updateSetting('darkMode', !settings.darkMode);
    } else if (command.includes('high contrast')) {
      updateSetting('contrast', settings.contrast === 'high-contrast' ? 'normal' : 'high-contrast');
    } else if (command.includes('read page') || command.includes('read aloud')) {
      speakText(document.body.innerText.substring(0, 5000));
    } else if (command.includes('stop reading') || command.includes('stop')) {
      stopSpeaking();
    } else if (command.includes('reset')) {
      resetSettings();
    }
  };

  // Profiles
  const profiles = {
    visionImpaired: {
      name: 'Vision Impaired',
      icon: Eye,
      settings: { fontSize: 130, contrast: 'high-contrast', bigCursor: true, focusHighlight: true }
    },
    colorBlind: {
      name: 'Color Blind',
      icon: Palette,
      settings: { contrast: 'monochrome', highlightLinks: true }
    },
    dyslexia: {
      name: 'Dyslexia Friendly',
      icon: BookOpen,
      settings: { dyslexiaFont: true, lineHeight: 150, letterSpacing: 2, wordSpacing: 4 }
    },
    adhd: {
      name: 'ADHD Friendly',
      icon: Focus,
      settings: { focusMode: true, pauseAnimations: true, reduceMotion: true }
    },
    cognitive: {
      name: 'Cognitive',
      icon: Brain,
      settings: { fontSize: 110, lineHeight: 140, highlightHeadings: true }
    },
    motorImpaired: {
      name: 'Motor Impaired',
      icon: Hand,
      settings: { keyboardNav: true, bigCursor: true, focusHighlight: true }
    },
    seizureSafe: {
      name: 'Seizure Safe',
      icon: Zap,
      settings: { pauseAnimations: true, reduceMotion: true, hideImages: false }
    },
    screenReader: {
      name: 'Screen Reader',
      icon: Volume2,
      settings: { textToSpeech: true, focusHighlight: true, keyboardNav: true }
    }
  };

  const applyProfile = (profileKey) => {
    if (settings.activeProfile === profileKey) {
      resetSettings();
      return;
    }
    
    const profile = profiles[profileKey];
    setSettings(prev => ({
      ...prev,
      ...profile.settings,
      activeProfile: profileKey
    }));
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value, activeProfile: null }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 100,
      lineHeight: 100,
      letterSpacing: 0,
      wordSpacing: 0,
      fontWeight: 'normal',
      textAlign: 'left',
      dyslexiaFont: false,
      contrast: 'normal',
      saturation: 100,
      highlightLinks: false,
      highlightHeadings: false,
      hideImages: false,
      darkMode: false,
      invertColors: false,
      readingGuide: false,
      readingMask: false,
      focusMode: false,
      bigCursor: false,
      cursorColor: 'default',
      keyboardNav: false,
      focusHighlight: false,
      pauseAnimations: false,
      reduceMotion: false,
      textToSpeech: false,
      speechRate: 1,
      activeProfile: null
    });
  };

  const tabs = [
    { id: 'profiles', label: 'Profiles', icon: Accessibility },
    { id: 'content', label: 'Content', icon: Type },
    { id: 'visual', label: 'Visual', icon: Eye },
    { id: 'navigation', label: 'Navigation', icon: Keyboard },
    { id: 'audio', label: 'Audio', icon: Volume2 }
  ];

  return (
    <>
      {/* Widget Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 bg-[#2563EB] hover:bg-[#1d4ed8] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110"
        aria-label="Open accessibility menu"
      >
        <Accessibility className="w-7 h-7" />
      </button>

      {/* Widget Panel */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-[9999] w-96 max-h-[80vh] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#2563EB] to-[#3B82F6] p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Accessibility className="w-6 h-6" />
                <span className="font-bold">Webenablix</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={resetSettings} className="p-1.5 hover:bg-white/20 rounded-full" title="Reset all settings">
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-full">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-2 text-xs font-medium flex flex-col items-center gap-1 transition-colors ${
                  activeTab === tab.id ? 'bg-white text-[#2563EB] border-b-2 border-[#2563EB]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            {/* Profiles Tab */}
            {activeTab === 'profiles' && (
              <div className="grid grid-cols-2 gap-2">
                {Object.entries(profiles).map(([key, profile]) => (
                  <button
                    key={key}
                    onClick={() => applyProfile(key)}
                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                      settings.activeProfile === key 
                        ? 'border-[#2563EB] bg-blue-50 text-[#2563EB]' 
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <profile.icon className="w-6 h-6" />
                    <span className="text-xs font-medium text-center">{profile.name}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Content Tab */}
            {activeTab === 'content' && (
              <div className="space-y-4">
                {/* Font Size */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Font Size: {settings.fontSize}%</label>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateSetting('fontSize', Math.max(50, settings.fontSize - 10))} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="range"
                      min="50"
                      max="200"
                      value={settings.fontSize}
                      onChange={(e) => updateSetting('fontSize', parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <button onClick={() => updateSetting('fontSize', Math.min(200, settings.fontSize + 10))} className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200">
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Line Height */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Line Height: {settings.lineHeight}%</label>
                  <input
                    type="range"
                    min="100"
                    max="200"
                    value={settings.lineHeight}
                    onChange={(e) => updateSetting('lineHeight', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Letter Spacing */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Letter Spacing: {settings.letterSpacing}px</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={settings.letterSpacing}
                    onChange={(e) => updateSetting('letterSpacing', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Word Spacing */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Word Spacing: {settings.wordSpacing}px</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={settings.wordSpacing}
                    onChange={(e) => updateSetting('wordSpacing', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                {/* Text Alignment */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Text Alignment</label>
                  <div className="flex gap-2">
                    {[{v: 'left', i: AlignLeft}, {v: 'center', i: AlignCenter}, {v: 'right', i: AlignRight}].map(({v, i: Icon}) => (
                      <button
                        key={v}
                        onClick={() => updateSetting('textAlign', v)}
                        className={`flex-1 p-2 rounded-lg border ${settings.textAlign === v ? 'bg-[#2563EB] text-white border-[#2563EB]' : 'bg-gray-100 border-gray-200'}`}
                      >
                        <Icon className="w-4 h-4 mx-auto" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dyslexia Font */}
                <ToggleSwitch
                  label="Dyslexia Friendly Font"
                  checked={settings.dyslexiaFont}
                  onChange={() => updateSetting('dyslexiaFont', !settings.dyslexiaFont)}
                />
              </div>
            )}

            {/* Visual Tab */}
            {activeTab === 'visual' && (
              <div className="space-y-4">
                {/* Contrast */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Contrast Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    {['normal', 'high-contrast', 'low-contrast', 'monochrome'].map(mode => (
                      <button
                        key={mode}
                        onClick={() => updateSetting('contrast', mode)}
                        className={`p-2 rounded-lg text-xs font-medium capitalize ${
                          settings.contrast === mode ? 'bg-[#2563EB] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {mode.replace('-', ' ')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Saturation */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Saturation: {settings.saturation}%</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={settings.saturation}
                    onChange={(e) => updateSetting('saturation', parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <ToggleSwitch label="Dark Mode" checked={settings.darkMode} onChange={() => updateSetting('darkMode', !settings.darkMode)} />
                <ToggleSwitch label="Invert Colors" checked={settings.invertColors} onChange={() => updateSetting('invertColors', !settings.invertColors)} />
                <ToggleSwitch label="Highlight Links" checked={settings.highlightLinks} onChange={() => updateSetting('highlightLinks', !settings.highlightLinks)} />
                <ToggleSwitch label="Highlight Headings" checked={settings.highlightHeadings} onChange={() => updateSetting('highlightHeadings', !settings.highlightHeadings)} />
                <ToggleSwitch label="Hide Images" checked={settings.hideImages} onChange={() => updateSetting('hideImages', !settings.hideImages)} />
                <ToggleSwitch label="Reading Guide" checked={settings.readingGuide} onChange={() => updateSetting('readingGuide', !settings.readingGuide)} />
                <ToggleSwitch label="Focus Mode" checked={settings.focusMode} onChange={() => updateSetting('focusMode', !settings.focusMode)} />
              </div>
            )}

            {/* Navigation Tab */}
            {activeTab === 'navigation' && (
              <div className="space-y-4">
                <ToggleSwitch label="Keyboard Navigation" checked={settings.keyboardNav} onChange={() => updateSetting('keyboardNav', !settings.keyboardNav)} />
                <ToggleSwitch label="Focus Highlight" checked={settings.focusHighlight} onChange={() => updateSetting('focusHighlight', !settings.focusHighlight)} />
                <ToggleSwitch label="Big Cursor" checked={settings.bigCursor} onChange={() => updateSetting('bigCursor', !settings.bigCursor)} />
                <ToggleSwitch label="Pause Animations" checked={settings.pauseAnimations} onChange={() => updateSetting('pauseAnimations', !settings.pauseAnimations)} />
                <ToggleSwitch label="Reduce Motion" checked={settings.reduceMotion} onChange={() => updateSetting('reduceMotion', !settings.reduceMotion)} />
              </div>
            )}

            {/* Audio Tab */}
            {activeTab === 'audio' && (
              <div className="space-y-4">
                <ToggleSwitch label="Text to Speech" checked={settings.textToSpeech} onChange={() => updateSetting('textToSpeech', !settings.textToSpeech)} />
                
                {settings.textToSpeech && (
                  <>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Speech Rate: {settings.speechRate}x</label>
                      <input
                        type="range"
                        min="0.5"
                        max="2"
                        step="0.1"
                        value={settings.speechRate}
                        onChange={(e) => updateSetting('speechRate', parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={speakSelectedText}
                        className="flex-1 p-3 bg-[#2563EB] text-white rounded-lg flex items-center justify-center gap-2 hover:bg-[#1d4ed8]"
                      >
                        <Volume2 className="w-4 h-4" />
                        Read Selected
                      </button>
                      <button
                        onClick={stopSpeaking}
                        disabled={!isSpeaking}
                        className="p-3 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                      >
                        <VolumeX className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
                
                <div className="border-t pt-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Voice Commands</label>
                  <button
                    onClick={startVoiceCommands}
                    className={`w-full p-3 rounded-lg flex items-center justify-center gap-2 ${
                      isListening ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isListening ? 'Listening...' : 'Start Voice Commands'}
                  </button>
                  <p className="text-xs text-gray-500 mt-2">
                    Try: "increase font", "dark mode", "read page", "reset"
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-3 bg-gray-50">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <a href="#" className="hover:text-[#2563EB]">Accessibility Statement</a>
              <span>Powered by Webenablix</span>
            </div>
          </div>
        </div>
      )}

      {/* Global Styles */}
      <style>{`
        :root {
          --wa-font-scale: 100%;
          --wa-line-height: 100%;
          --wa-letter-spacing: 0px;
          --wa-word-spacing: 0px;
          --wa-saturation: 100%;
        }
        
        .wa-dyslexia-font * {
          font-family: 'OpenDyslexic', 'Comic Sans MS', sans-serif !important;
        }
        
        .wa-highlight-links a {
          outline: 3px solid #2563EB !important;
          background-color: #dbeafe !important;
        }
        
        .wa-highlight-headings h1, .wa-highlight-headings h2, 
        .wa-highlight-headings h3, .wa-highlight-headings h4 {
          background-color: #fef3c7 !important;
          outline: 2px solid #f59e0b !important;
        }
        
        .wa-hide-images img {
          opacity: 0 !important;
        }
        
        .wa-dark-mode {
          filter: invert(1) hue-rotate(180deg);
        }
        
        .wa-dark-mode img, .wa-dark-mode video {
          filter: invert(1) hue-rotate(180deg);
        }
        
        .wa-invert-colors {
          filter: invert(1);
        }
        
        .wa-high-contrast {
          filter: contrast(1.5);
        }
        
        .wa-low-contrast {
          filter: contrast(0.8);
        }
        
        .wa-monochrome {
          filter: grayscale(1);
        }
        
        .wa-big-cursor, .wa-big-cursor * {
          cursor: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="black"><path d="M7 2l10 10-4.5 1 2.5 5.5-2.5 1-2.5-5.5L7 17V2z"/></svg>') 0 0, auto !important;
        }
        
        .wa-pause-animations *, .wa-reduce-motion * {
          animation: none !important;
          transition: none !important;
        }
        
        .wa-focus-highlight *:focus {
          outline: 4px solid #2563EB !important;
          outline-offset: 2px !important;
        }
        
        .wa-reading-guide {
          position: relative;
        }
        
        .wa-focus-mode *:not(:focus):not(:hover) {
          opacity: 0.5;
        }
      `}</style>
    </>
  );
};

// Toggle Switch Component
const ToggleSwitch = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between">
    <span className="text-sm text-gray-700">{label}</span>
    <button
      onClick={onChange}
      className={`w-11 h-6 rounded-full relative transition-colors ${checked ? 'bg-[#2563EB]' : 'bg-gray-200'}`}
    >
      <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'right-0.5' : 'left-0.5'}`} />
    </button>
  </div>
);

export default AccessibilityWidget;
