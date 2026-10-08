import React, { useEffect, useRef, useState } from "react";
import { api } from "./api.js";
import { t } from "./i18n.js";

export default function Chat({ initialMessage, lang = "en" }) {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: t(lang, "chat_welcome"),
    },
  ]);
  const [input, setInput] = useState(initialMessage || "");
  const [sending, setSending] = useState(false);
  const [listening, setListening] = useState(false);
  const [error, setError] = useState(null);
  const sessionId = useRef(null);
  const scrollRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    // Auto-send if the user typed something on the Home page and navigated here.
    if (initialMessage && initialMessage !== "__voice__") {
      send(initialMessage);
    }
    if (initialMessage === "__voice__") {
      toggleVoice();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function send(text) {
    const message = (text ?? input).trim();
    if (!message || sending) return;

    setMessages((prev) => [...prev, { role: "user", text: message }]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const data = await api.chat(message, sessionId.current);
      sessionId.current = data.session_id;
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      setError(
        err.message.includes("Failed to fetch")
          ? t(lang, "chat_could_not_reach_backend")
          : err.message
      );
    } finally {
      setSending(false);
    }
  }

  function toggleVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError(t(lang, "chat_voice_error"));
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = false;
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  return (
    <div className="page chat-page">
      <div className="chat-header">
        <div>
          <h2>{t(lang, "welcome_title")}</h2>
          <span className="online-dot" /> {t(lang, "chat_online")}
        </div>
      </div>

      <div className="chat-messages" ref={scrollRef}>
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {sending && <div className="chat-bubble assistant typing">{t(lang, "chat_thinking")}</div>}
        {error && <div className="chat-error">{error}</div>}
      </div>

      <form
        className="chat-input-bar"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <button
          type="button"
          className={`mic-btn ${listening ? "listening" : ""}`}
          onClick={toggleVoice}
          title={t(lang, "chat_speak")}
        >
          🎤
        </button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t(lang, "chat_input_placeholder")}
        />
        <button type="submit" disabled={sending}>
          {t(lang, "chat_send")}
        </button>
      </form>
    </div>
  );
}
