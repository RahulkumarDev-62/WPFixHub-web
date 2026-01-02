import axios from 'axios'
import { supabase } from './supabaseClient'

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID
const PHONPE_MERCHANT_ID = import.meta.env.VITE_PHONPE_MERCHANT_ID
const PHONPE_API_KEY = import.meta.env.VITE_PHONPE_API_KEY

// ==================== RAZORPAY INTEGRATION ====================

// Create Razorpay Order
export const createRazorpayOrder = async (amount, orderId, userEmail, userName) => {
  try {
    // Create order in Razorpay
    const response = await axios.post(
      'https://api.razorpay.com/v1/orders',
      {
        amount: Math.round(amount * 100), // Convert to paise
        currency: 'INR',
        receipt: `order_${orderId}`,
        notes: {
          orderId,
          userEmail,
          userName,
        },
      },
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
        },
      }
    )

    return {
      success: true,
      razorpayOrderId: response.data.id,
      amount: response.data.amount,
      currency: response.data.currency,
    }
  } catch (error) {
    console.error('Razorpay order creation failed:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Verify Razorpay Payment
export const verifyRazorpayPayment = async (
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature
) => {
  try {
    // In production, verify signature on backend
    // For now, we'll create a payment record
    const paymentData = {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      status: 'Completed',
      verifiedAt: new Date(),
    }

    return {
      success: true,
      payment: paymentData,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get Razorpay Payment Details
export const getRazorpayPaymentDetails = async (paymentId) => {
  try {
    const response = await axios.get(`https://api.razorpay.com/v1/payments/${paymentId}`, {
      auth: {
        username: RAZORPAY_KEY_ID,
        password: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
      },
    })

    return {
      success: true,
      payment: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Refund Razorpay Payment
export const refundRazorpayPayment = async (paymentId, amount) => {
  try {
    const response = await axios.post(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      {
        amount: Math.round(amount * 100), // Convert to paise
      },
      {
        auth: {
          username: RAZORPAY_KEY_ID,
          password: import.meta.env.VITE_RAZORPAY_KEY_SECRET || '',
        },
      }
    )

    return {
      success: true,
      refund: response.data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== PHONPE INTEGRATION ====================

// Create PhonePe Order
export const createPhonePeOrder = async (amount, orderId, userEmail, userName, userPhone) => {
  try {
    const merchantTransactionId = `TXN_${orderId}_${Date.now()}`

    const payload = {
      merchantId: PHONPE_MERCHANT_ID,
      merchantTransactionId,
      merchantUserId: orderId,
      amount: Math.round(amount * 100), // Convert to paise
      redirectUrl: `${window.location.origin}/payment-success`,
      redirectMode: 'REDIRECT',
      callbackUrl: `${window.location.origin}/api/payment-callback`,
      mobileNumber: userPhone,
      paymentInstrument: {
        type: 'PAY_PAGE',
      },
    }

    // In production, encode and sign the payload
    // For now, return the payload structure
    return {
      success: true,
      merchantTransactionId,
      payload,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Verify PhonePe Payment
export const verifyPhonePePayment = async (merchantTransactionId) => {
  try {
    // In production, verify with PhonePe API
    const paymentData = {
      merchantTransactionId,
      status: 'Completed',
      verifiedAt: new Date(),
    }

    return {
      success: true,
      payment: paymentData,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== PAYMENT RECORD MANAGEMENT ====================

// Save Payment Record to Database
export const savePaymentRecord = async (userId, paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .insert([
        {
          userId,
          ...paymentData,
          createdAt: new Date(),
        },
      ])
      .select()

    if (error) throw error

    return {
      success: true,
      payment: data[0],
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Update Payment Record
export const updatePaymentRecord = async (paymentId, paymentData) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .update({
        ...paymentData,
        updatedAt: new Date(),
      })
      .eq('id', paymentId)
      .select()

    if (error) throw error

    return {
      success: true,
      payment: data[0],
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get Payment Record
export const getPaymentRecord = async (paymentId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('id', paymentId)
      .single()

    if (error) throw error

    return {
      success: true,
      payment: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get Payment by Transaction ID
export const getPaymentByTransactionId = async (transactionId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .or(`razorpayOrderId.eq.${transactionId},merchantTransactionId.eq.${transactionId}`)
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return {
      success: true,
      payment: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== PAYMENT UTILITIES ====================

// Calculate Total Amount with Tax
export const calculateTotalAmount = (baseAmount, taxPercentage = 18) => {
  const tax = (baseAmount * taxPercentage) / 100
  const total = baseAmount + tax
  return {
    baseAmount,
    tax,
    total,
    taxPercentage,
  }
}

// Format Amount for Display
export const formatPaymentAmount = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

// Check Payment Status
export const checkPaymentStatus = async (paymentId) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('status')
      .eq('id', paymentId)
      .single()

    if (error) throw error

    return {
      success: true,
      status: data.status,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Get Payment History
export const getPaymentHistory = async (userId, limit = 10) => {
  try {
    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .eq('userId', userId)
      .order('createdAt', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      success: true,
      payments: data,
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}
