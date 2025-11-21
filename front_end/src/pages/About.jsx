import React, { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaStar, FaThumbsUp, FaThumbsDown, FaPaperPlane, FaFilm, FaUsers, FaCommentAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import '../css/About.css';

// Local storage keys
const MESSAGE_KEY = "movie_review_messages";
const LIKED_KEY = "movie_review_liked_ids";
const DISLIKED_KEY = "movie_review_disliked_ids";

// Helper functions for local storage operations
const getStoredMessages = () => {
    const data = localStorage.getItem(MESSAGE_KEY);
    if (!data) return [
        { user: "Alice", text: "Great platform for movie lovers!", likes: 2, id: 1 },
        { user: "Bob", text: "I found my new favorite movie here.", likes: 1, id: 2 },
    ];
    return JSON.parse(data);
};

const storeMessages = (messages) => {
    localStorage.setItem(MESSAGE_KEY, JSON.stringify(messages));
};

const getLikedIds = () => {
    try {
        return JSON.parse(localStorage.getItem(LIKED_KEY)) || [];
    } catch {
        return [];
    }
};

const storeLikedIds = (ids) => {
    localStorage.setItem(LIKED_KEY, JSON.stringify(ids));
};

const getDislikedIds = () => {
    try {
        return JSON.parse(localStorage.getItem(DISLIKED_KEY)) || [];
    } catch {
        return [];
    }
};

const storeDislikedIds = (ids) => {
    localStorage.setItem(DISLIKED_KEY, JSON.stringify(ids));
};

// Loading animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
        opacity: 1, 
        y: 0,
        transition: { duration: 0.5 }
    }
};

const About = () => {
    const [messages, setMessages] = useState(getStoredMessages());
    const [input, setInput] = useState("");
    const [likedIds, setLikedIds] = useState(getLikedIds());
    const [dislikedIds, setDislikedIds] = useState(getDislikedIds());
    const [activeTab, setActiveTab] = useState('about');
    const [isLoading, setIsLoading] = useState(true);

    // Simulate loading
    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    // Listen for changes from other tabs/windows
    useEffect(() => {
        const onStorage = () => setMessages(getStoredMessages());
        window.addEventListener("storage", onStorage);
        return () => window.removeEventListener("storage", onStorage);
    }, []);

    const handleSend = (e) => {
        e.preventDefault();
        if (input.trim()) {
            const newMsg = {
                user: "You",
                text: input,
                likes: 0,
                dislikes: 0,
                id: Date.now(),
                timestamp: new Date().toISOString()
            };
            const updated = [newMsg, ...messages];
            storeMessages(updated);
            setMessages(updated);
            setInput("");
        }
    };

    const handleLike = (id) => {
        let updated = [...messages];
        let newLikedIds = [...likedIds];
        let newDislikedIds = [...dislikedIds];

        // If already liked, do nothing
        if (likedIds.includes(id)) return;

        updated = updated.map(msg => {
            if (msg.id === id) {
                let likes = (msg.likes || 0) + 1;
                let dislikes = msg.dislikes || 0;
                // If previously disliked, remove dislike
                if (dislikedIds.includes(id)) {
                    dislikes = Math.max(0, dislikes - 1);
                    newDislikedIds = newDislikedIds.filter(did => did !== id);
                }
                return { ...msg, likes, dislikes };
            }
            return msg;
        });

        newLikedIds = [...newLikedIds, id];

        storeMessages(updated);
        storeLikedIds(newLikedIds);
        storeDislikedIds(newDislikedIds);
        setMessages(updated);
        setLikedIds(newLikedIds);
        setDislikedIds(newDislikedIds);
    };

    const handleDislike = (id) => {
        let updated = [...messages];
        let newLikedIds = [...likedIds];
        let newDislikedIds = [...dislikedIds];

        // If already disliked, do nothing
        if (dislikedIds.includes(id)) return;

        updated = updated.map(msg => {
            if (msg.id === id) {
                let dislikes = (msg.dislikes || 0) + 1;
                let likes = msg.likes || 0;
                // If previously liked, remove like
                if (likedIds.includes(id)) {
                    likes = Math.max(0, likes - 1);
                    newLikedIds = newLikedIds.filter(lid => lid !== id);
                }
                return { ...msg, likes, dislikes };
            }
            return msg;
        });

        newDislikedIds = [...newDislikedIds, id];

        storeMessages(updated);
        storeLikedIds(newLikedIds);
        storeDislikedIds(newDislikedIds);
        setMessages(updated);
        setLikedIds(newLikedIds);
        setDislikedIds(newDislikedIds);
    };

    const sortedMessages = [...messages].sort((a, b) => (b.likes || 0) - (a.likes || 0));

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #232526 0%, #414345 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Inter, Arial, sans-serif",
                color: "#fff",
                flexDirection: "column",
                gap: "36px"
            }}
        >
            <div
                style={{
                    background: "rgba(34, 40, 49, 0.85)",
                    borderRadius: "24px",
                    boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
                    padding: "48px 36px",
                    maxWidth: "480px",
                    width: "100%",
                    textAlign: "center",
                    backdropFilter: "blur(6px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                }}
            >
                <h1
                    style={{
                        fontSize: "2.5rem",
                        fontWeight: 700,
                        marginBottom: "18px",
                        background: "linear-gradient(90deg, #ff512f, #dd2476)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    About Movie Review
                </h1>
                <p style={{ fontSize: "1.15rem", lineHeight: 1.7, marginBottom: "24px" }}>
                    Movie Review is your go-to platform for discovering, 
                    reviewing, and sharing opinions on the latest films. 
                    Our mission is to connect movie enthusiasts and help you find your next favorite watch.

                    Thank you for using our website !!
                </p>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "18px",
                        marginTop: "18px",
                    }}
                >
                    <a
                        href="https://github.com/ygstiffler/movie_view-site"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#ff512f",
                            textDecoration: "none",
                            fontWeight: 600,
                            transition: "color 0.2s",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px"
                        }}
                    >
                        <FaGithub style={{ fontSize: '1.2rem' }} />
                        GitHub
                    </a>
                    <a
                        href="harrisonchapeta44@gmail.com"
                        style={{
                            color: "#dd2476",
                            textDecoration: "none",
                            fontWeight: 600,
                            transition: "color 0.2s",
                        }}
                    >
                        Contact
                    </a>
                </div>
            </div>
            <div
                style={{
                    background: "rgba(44, 62, 80, 0.7)",
                    borderRadius: "16px",
                    padding: "24px",
                    maxWidth: "480px",
                    width: "100%",
                    color: "#fff",
                    boxShadow: "0 4px 16px 0 rgba(31, 38, 135, 0.17)",
                }}
            >
                <h2 style={{ fontSize: "1.5rem", marginBottom: "12px" }}>User Messages</h2>
                <div
                    style={{
                        maxHeight: "180px",
                        overflowY: "auto",
                        marginBottom: "16px",
                        textAlign: "left",
                    }}
                >
                    {sortedMessages.length === 0 ? (
                        <div style={{ color: "#bbb" }}>No messages yet.</div>
                    ) : (
                        sortedMessages.map((msg) => (
                            <div key={msg.id} style={{ marginBottom: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <div>
                                    <span style={{ fontWeight: 600 }}>{msg.user}:</span>{" "}
                                    <span>{msg.text}</span>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                    <button
                                        onClick={() => handleLike(msg.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: likedIds.includes(msg.id) ? "#bbb" : "#ff512f",
                                            cursor: likedIds.includes(msg.id) ? "not-allowed" : "pointer",
                                            fontSize: "1.1rem",
                                            marginRight: "2px"
                                        }}
                                        aria-label="Like"
                                        disabled={likedIds.includes(msg.id)}
                                    >
                                        ❤️
                                    </button>
                                    <span style={{ minWidth: "18px", textAlign: "center" }}>{msg.likes || 0}</span>
                                    <button
                                        onClick={() => handleDislike(msg.id)}
                                        style={{
                                            background: "none",
                                            border: "none",
                                            color: dislikedIds.includes(msg.id) ? "#bbb" : "#2476dd",
                                            cursor: dislikedIds.includes(msg.id) ? "not-allowed" : "pointer",
                                            fontSize: "1.1rem",
                                            marginLeft: "8px",
                                            marginRight: "2px"
                                        }}
                                        aria-label="Dislike"
                                        disabled={dislikedIds.includes(msg.id)}
                                    >
                                        👎
                                    </button>
                                    <span style={{ minWidth: "18px", textAlign: "center" }}>{msg.dislikes || 0}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={handleSend} style={{ display: "flex", gap: "8px" }}>
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        style={{
                            flex: 1,
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "1px solid #444",
                            outline: "none",
                            fontSize: "1rem",
                            background: "#232526",
                            color: "#fff",
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            padding: "8px 18px",
                            borderRadius: "8px",
                            border: "none",
                            background: "linear-gradient(90deg, #ff512f, #dd2476)",
                            color: "#fff",
                            fontWeight: 600,
                            cursor: "pointer",
                            transition: "background 0.2s",
                        }}
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default About;