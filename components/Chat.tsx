"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import "./chat.css";
import garageIntents from "../app/data/garageIntents.json";

// Levenshtein distance implementation for fuzzy matching
function levenshteinDistance(a, b) {
  const matrix = [];
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  return matrix[b.length][a.length];
}

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Hello! Welcome to Speedy Auto Repairs. How can we help with your vehicle today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [context, setContext] = useState(null);
  const messagesEndRef = useRef(null);

  // Pre-process intents for better matching
  const processedIntents = useMemo(() => {
    return garageIntents.intents.map(intent => ({
      ...intent,
      keywords: intent.patterns.join(" ").toLowerCase().match(/\b(\w+)\b/g) || [],
      regexPatterns: intent.patterns.map(pattern => 
        new RegExp(pattern.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
      )
    }));
  }, []);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  // Fuzzy match function
  const fuzzyMatch = (str1, str2, threshold = 0.7) => {
    const distance = levenshteinDistance(str1.toLowerCase(), str2.toLowerCase());
    const maxLength = Math.max(str1.length, str2.length);
    const similarity = 1 - distance / maxLength;
    return similarity >= threshold;
  };

  // Keyword scoring function
  const calculateKeywordScore = (input, intent) => {
    const inputWords = input.toLowerCase().match(/\b(\w+)\b/g) || [];
    const matchedKeywords = intent.keywords.filter(keyword => 
      inputWords.some(inputWord => fuzzyMatch(inputWord, keyword))
    );
    return matchedKeywords.length / intent.keywords.length;
  };

  // Find the best matching intent
  const findBestMatch = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    let bestMatch = null;
    let highestScore = 0;

    // Check for context first
    if (context) {
      const contextualIntent = processedIntents.find(intent => intent.tag === context);
      if (contextualIntent) {
        for (const pattern of contextualIntent.regexPatterns) {
          if (pattern.test(lowerInput)) {
            return {
              intent: contextualIntent,
              score: 1,
              isExact: true
            };
          }
        }
      }
    }

    // Score all intents
    for (const intent of processedIntents) {
      let score = 0;
      let isExact = false;

      // 1. Check for exact regex matches
      for (const pattern of intent.regexPatterns) {
        if (pattern.test(lowerInput)) {
          score = 1;
          isExact = true;
          break;
        }
      }

      // 2. If no exact match, use keyword scoring
      if (score === 0) {
        score = calculateKeywordScore(lowerInput, intent);
      }

      // 3. Check for fuzzy matches with patterns
      if (score < 0.7) {
        for (const pattern of intent.patterns) {
          if (fuzzyMatch(lowerInput, pattern)) {
            score = Math.max(score, 0.8);
            break;
          }
        }
      }

      // Update best match
      if (score > highestScore) {
        highestScore = score;
        bestMatch = { intent, score, isExact };
      }
    }

    return bestMatch || {
      intent: processedIntents.find(intent => intent.tag === "default") || processedIntents[0],
      score: 0,
      isExact: false
    };
  };

  // Handle context tracking
  const updateContext = (intentTag) => {
    const contextIntents = ["diagnostics", "estimates", "appointments"];
    if (contextIntents.includes(intentTag)) {
      setContext(intentTag);
    } else {
      setContext(null);
    }
  };

  // Get appropriate response
  const getResponse = (userInput) => {
    const { intent, score, isExact } = findBestMatch(userInput);
    updateContext(intent.tag);

    if (score < 0.3 && !isExact) {
      return "I'm not quite sure I understand. Could you rephrase your question about your vehicle?";
    }

    return intent.responses[
      Math.floor(Math.random() * intent.responses.length)
    ];
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const botResponse = getResponse(input);

    setTimeout(() => {
      setMessages((prev) => [...prev, { from: "bot", text: botResponse }]);
    }, 500);

    setInput("");
  };

  // Toggle chat visibility
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <div className="chat-widget">
          <div className="chat-header">
            💬 Speedy Auto Repairs Chat
            <button className="chat-close-btn" onClick={toggleChat}>
              ×
            </button>
          </div>
          <div className="chat-body">
            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg ${msg.from}`}>
                {msg.text}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <form className="chat-input" onSubmit={handleSubmit}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about repairs, pricing, or appointments..."
              autoFocus
            />
            <button type="submit">Send</button>
          </form>
        </div>
      ) : (
        <button className="chat-fab" onClick={toggleChat}>
         💬
        </button>
      )}
    </>
  );
};

export default Chat;