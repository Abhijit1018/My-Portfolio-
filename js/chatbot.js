// ===== CHATBOT CONFIGURATION =====
// Replace this URL with your n8n webhook URL
const N8N_WEBHOOK_URL = 'https://mumbaiclub.online/webhook/e60d1ef8-c207-45f5-b079-9536af6e1785/chat';

// ===== CHATBOT FUNCTIONALITY =====
class Chatbot {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.initElements();
        this.attachEventListeners();
    }

    initElements() {
        this.container = document.getElementById('chatbot-container');
        this.button = document.getElementById('chatbot-button');
        this.window = document.getElementById('chatbot-window');
        this.closeBtn = document.getElementById('chatbot-close');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendBtn = document.getElementById('chatbot-send');
    }

    attachEventListeners() {
        // Open/close chatbot
        this.button.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());

        // Send message on button click
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Send message on Enter key
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Accessibility: keyboard navigation
        this.button.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            }
        });
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.window.classList.add('active');
        this.isOpen = true;
        this.button.setAttribute('aria-label', 'Close chatbot');
        this.input.focus();
    }

    close() {
        this.window.classList.remove('active');
        this.isOpen = false;
        this.button.setAttribute('aria-label', 'Open chatbot');
    }

    async sendMessage() {
        const message = this.input.value.trim();
        
        if (!message || this.isTyping) return;

        // Add user message to chat
        this.addMessage(message, 'user');
        this.input.value = '';

        // Disable input while waiting for response
        this.setTyping(true);

        try {
            // Send message to n8n webhook
            const response = await this.sendToN8N(message);
            
            // Add bot response
            this.addMessage(response, 'bot');
        } catch (error) {
            console.error('Chatbot error:', error);
            this.addMessage('Sorry, I encountered an error. Please try again later.', 'bot');
        } finally {
            this.setTyping(false);
        }
    }

    async sendToN8N(message) {
        // Check if webhook URL is configured
        if (N8N_WEBHOOK_URL === 'YOUR_N8N_WEBHOOK_URL_HERE') {
            return 'Please configure the n8n webhook URL in chatbot.js to enable the chatbot functionality.';
        }

        try {
            console.log('Sending message to n8n:', message);
            
            const response = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chatInput: message,
                    sessionId: this.getSessionId()
                })
            });

            console.log('Response status:', response.status);

            // Try to get error details even if request failed
            let data;
            try {
                data = await response.json();
                console.log('Response data:', data);
            } catch (e) {
                const text = await response.text();
                console.log('Response text:', text);
                data = { error: text };
            }

            if (!response.ok) {
                console.error('Server error response:', data);
                throw new Error(`Server returned error: ${data.error || data.message || response.statusText}`);
            }
            
            // Handle different n8n response formats
            const botResponse = data.output || data.response || data.message || data.text || data.reply;
            
            if (!botResponse) {
                console.error('Unexpected response format:', data);
                return 'Sorry, I received an unexpected response format.';
            }
            
            return botResponse;
            
        } catch (error) {
            console.error('N8N API Error:', error);
            
            // Provide more specific error messages
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                return 'Connection error: Unable to reach the chatbot server. Please check your internet connection or try again later.';
            }
            
            if (error.message.includes('500')) {
                return 'Server error: The chatbot workflow encountered an error. Please check your n8n workflow configuration.';
            }
            
            throw error;
        }
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chatbot-message ${type}-message`;
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        
        const p = document.createElement('p');
        p.textContent = text;
        
        contentDiv.appendChild(p);
        messageDiv.appendChild(contentDiv);
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
        this.sendBtn.disabled = isTyping;
        this.input.disabled = isTyping;

        if (isTyping) {
            this.showTypingIndicator();
        } else {
            this.hideTypingIndicator();
            this.input.focus();
        }
    }

    showTypingIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'chatbot-message bot-message';
        indicator.id = 'typing-indicator';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.innerHTML = '<span></span><span></span><span></span>';
        
        content.appendChild(typingDiv);
        indicator.appendChild(content);
        this.messagesContainer.appendChild(indicator);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const indicator = document.getElementById('typing-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    getSessionId() {
        // Get or create a session ID for conversation continuity
        let sessionId = sessionStorage.getItem('chatbot-session-id');
        if (!sessionId) {
            sessionId = 'session-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('chatbot-session-id', sessionId);
        }
        return sessionId;
    }
}

// Initialize chatbot when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Chatbot();
});
