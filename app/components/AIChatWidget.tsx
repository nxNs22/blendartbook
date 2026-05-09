"use client";

import { useState, useRef, useEffect, useCallback, useId } from "react";
import { useLanguage } from "../context/LanguageContext";
import { MessageCircle, X, Send, Sparkles, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function AIChatWidget() {
  const { t, language } = useLanguage();
  
  const SUGGESTIONS = [
    t("recommend_book"),
    t("popular_genres"),
    t("gift_ideas"),
    t("books_in_english"),
  ];

  const instanceId = useId();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        t("ai_greeting"),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const idCounterRef = useRef(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    const userMessageId = `${instanceId}-m-${++idCounterRef.current}`;
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Prepare messages for API (skip welcome message)
    const apiMessages = [...messages.filter((m) => m.id !== "welcome"), userMessage].map(
      (m) => ({
        role: m.role === "assistant" ? "model" : "user",
        content: m.content,
      })
    );

    const assistantId = `${instanceId}-m-${++idCounterRef.current}`;

    // Add empty assistant message for streaming
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: apiMessages, language }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to get response");
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response stream");

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6).trim();
            if (data === "[DONE]") continue;

            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + parsed.text }
                      : m
                  )
                );
              }
            } catch {
              // Skip malformed chunks
            }
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Something went wrong";
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: `Sorry, I couldn't process that request. ${errorMessage} 😔 Please try again!`,
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    // Remove emoji prefix
    const text = suggestion.replace(/^[^\s]+\s/, "");
    sendMessage(text);
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          id="ai-chat-toggle"
          onClick={() => setIsOpen(true)}
          className="ai-chat-button"
          aria-label="Open AI Book Assistant"
        >
          <div className="ai-chat-button-inner">
            <Sparkles size={26} className="ai-chat-sparkle" />
            <MessageCircle size={26} />
          </div>
          <span className="ai-chat-button-label">Ask AI</span>
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && (
        <div className="ai-chat-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="ai-chat-panel"
            onClick={(e) => e.stopPropagation()}
            ref={chatContainerRef}
          >
            {/* Header */}
            <div className="ai-chat-header">
              <div className="ai-chat-header-left">
                <div className="ai-chat-avatar">
                  <Bot size={22} />
                  <span className="ai-chat-status" />
                </div>
                <div>
                  <h3 className="ai-chat-title">blendartbook AI</h3>
                  <p className="ai-chat-subtitle">Your Book Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="ai-chat-close"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`ai-chat-msg ${msg.role === "user" ? "ai-chat-msg-user" : "ai-chat-msg-bot"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="ai-chat-msg-avatar">
                      <Bot size={14} />
                    </div>
                  )}
                  <div
                    className={`ai-chat-bubble ${msg.role === "user" ? "ai-chat-bubble-user" : "ai-chat-bubble-bot"}`}
                  >
                    {msg.content || (
                      <span className="ai-typing-indicator">
                        <span />
                        <span />
                        <span />
                      </span>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="ai-chat-msg-avatar ai-chat-msg-avatar-user">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isLoading &&
                messages[messages.length - 1]?.content !== "" && (
                  <div className="ai-chat-msg ai-chat-msg-bot">
                    <div className="ai-chat-msg-avatar">
                      <Bot size={14} />
                    </div>
                    <div className="ai-chat-bubble ai-chat-bubble-bot">
                      <span className="ai-typing-indicator">
                        <span />
                        <span />
                        <span />
                      </span>
                    </div>
                  </div>
                )}

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions — only show if just the welcome message */}
            {messages.length === 1 && (
              <div className="ai-chat-suggestions">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestion(s)}
                    className="ai-chat-chip"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="ai-chat-input-area">
              <input
                ref={inputRef}
                type="text"
                placeholder={t("ask_me_about")}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={isLoading}
                className="ai-chat-input"
                id="ai-chat-input"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="ai-chat-send"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </div>

            {/* Footer */}
            <div className="ai-chat-footer">
              {t("powered_by")}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
