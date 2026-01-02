import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!GEMINI_API_KEY) {
  console.warn('⚠️ Gemini API key not configured')
}

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

// System prompt for the AI assistant
const SYSTEM_PROMPT = `You are a helpful AI assistant for WPFixHub, a professional digital marketing agency. 
You help users with:
- Information about our services (WordPress fixes, digital marketing, web development)
- Guidance on service selection and features
- Answering questions about orders and bookings
- Providing business and marketing advice
- General support and assistance

Be professional, friendly, and concise. Always maintain context about the user's needs.
If asked about something outside your scope, politely redirect to contacting support.`

// ==================== CHAT FUNCTIONALITY ====================

// Send Message to Gemini AI
export const sendMessageToGemini = async (userMessage, conversationHistory = []) => {
  try {
    if (!GEMINI_API_KEY) {
      throw new Error('Gemini API key not configured')
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    // Build conversation history for context
    const messages = [
      {
        role: 'user',
        parts: [{ text: SYSTEM_PROMPT }],
      },
      {
        role: 'model',
        parts: [{ text: 'I understand. I am an AI assistant for WPFixHub.' }],
      },
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ]

    // Generate response
    const chat = model.startChat({
      history: messages.slice(0, -1),
    })

    const result = await chat.sendMessage(userMessage)
    const responseText = result.response.text()

    return {
      success: true,
      message: responseText,
      timestamp: new Date(),
    }
  } catch (error) {
    console.error('Gemini API error:', error)
    return {
      success: false,
      error: error.message || 'Failed to get response from AI',
    }
  }
}

// ==================== SERVICE GUIDANCE ====================

// Get Service Recommendations
export const getServiceRecommendations = async (userNeeds) => {
  try {
    const prompt = `Based on the following user needs, recommend appropriate services from WPFixHub:
    
User Needs: ${userNeeds}

Provide 2-3 specific service recommendations with brief explanations of why they would be helpful.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return {
      success: true,
      recommendations: responseText,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== BUSINESS ADVICE ====================

// Get Business Advice
export const getBusinessAdvice = async (topic) => {
  try {
    const prompt = `As a digital marketing expert, provide practical advice on the following topic:
    
Topic: ${topic}

Keep the response concise (2-3 paragraphs) and actionable.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return {
      success: true,
      advice: responseText,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== ORDER SUPPORT ====================

// Get Order Status Explanation
export const getOrderStatusExplanation = async (orderStatus, orderDetails) => {
  try {
    const prompt = `Explain the following order status to a customer in a friendly way:
    
Order Status: ${orderStatus}
Order Details: ${JSON.stringify(orderDetails)}

Provide a brief, reassuring explanation of what this status means and what happens next.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return {
      success: true,
      explanation: responseText,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== CONTENT GENERATION ====================

// Generate Service Description
export const generateServiceDescription = async (serviceName, features) => {
  try {
    const prompt = `Generate a professional and engaging service description for:
    
Service Name: ${serviceName}
Features: ${features.join(', ')}

The description should be 2-3 sentences, highlight benefits, and be suitable for a digital marketing agency website.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return {
      success: true,
      description: responseText,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Generate Email Response
export const generateEmailResponse = async (emailContent, tone = 'professional') => {
  try {
    const prompt = `Generate a ${tone} email response to the following customer inquiry:
    
Customer Message: ${emailContent}

Keep the response concise and helpful.`

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    const result = await model.generateContent(prompt)
    const responseText = result.response.text()

    return {
      success: true,
      response: responseText,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== CONVERSATION MANAGEMENT ====================

// Format Conversation History
export const formatConversationHistory = (messages) => {
  return messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }],
  }))
}

// Save Conversation to Local Storage
export const saveConversation = (conversationId, messages) => {
  try {
    localStorage.setItem(`conversation_${conversationId}`, JSON.stringify(messages))
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Load Conversation from Local Storage
export const loadConversation = (conversationId) => {
  try {
    const conversation = localStorage.getItem(`conversation_${conversationId}`)
    return {
      success: true,
      messages: conversation ? JSON.parse(conversation) : [],
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

// Clear Conversation
export const clearConversation = (conversationId) => {
  try {
    localStorage.removeItem(`conversation_${conversationId}`)
    return { success: true }
  } catch (error) {
    return { success: false, error: error.message }
  }
}
