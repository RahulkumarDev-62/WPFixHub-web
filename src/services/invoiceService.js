import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { formatDate, formatCurrency } from '../utils/helpers'

// ==================== INVOICE GENERATION ====================

// Generate Invoice PDF
export const generateInvoicePDF = async (invoiceData, fileName = 'invoice.pdf') => {
  try {
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    let yPosition = 20

    // Header
    doc.setFontSize(24)
    doc.setTextColor(59, 130, 246) // Primary blue
    doc.text('INVOICE', pageWidth / 2, yPosition, { align: 'center' })

    yPosition += 15

    // Company Info
    doc.setFontSize(10)
    doc.setTextColor(31, 41, 55) // Dark gray
    doc.text('WPFixHub', 20, yPosition)
    doc.text('Digital Marketing Agency', 20, yPosition + 5)
    doc.text('Email: info@wp-fixhub.com', 20, yPosition + 10)
    doc.text('Phone: +91-XXXXXXXXXX', 20, yPosition + 15)

    // Invoice Details (Right side)
    doc.setFontSize(9)
    doc.text(`Invoice #: ${invoiceData.invoiceNumber}`, pageWidth - 20, yPosition, {
      align: 'right',
    })
    doc.text(`Date: ${formatDate(invoiceData.date)}`, pageWidth - 20, yPosition + 5, {
      align: 'right',
    })
    doc.text(`Due Date: ${formatDate(invoiceData.dueDate)}`, pageWidth - 20, yPosition + 10, {
      align: 'right',
    })

    yPosition += 30

    // Bill To
    doc.setFontSize(11)
    doc.setFont(undefined, 'bold')
    doc.text('BILL TO:', 20, yPosition)

    doc.setFont(undefined, 'normal')
    doc.setFontSize(10)
    doc.text(invoiceData.customerName, 20, yPosition + 7)
    doc.text(invoiceData.customerEmail, 20, yPosition + 12)
    doc.text(invoiceData.customerPhone, 20, yPosition + 17)

    yPosition += 30

    // Items Table Header
    doc.setFontSize(10)
    doc.setFont(undefined, 'bold')
    doc.setFillColor(59, 130, 246)
    doc.setTextColor(255, 255, 255)

    doc.rect(20, yPosition, pageWidth - 40, 8, 'F')
    doc.text('Description', 25, yPosition + 6)
    doc.text('Qty', 120, yPosition + 6)
    doc.text('Rate', 140, yPosition + 6)
    doc.text('Amount', 165, yPosition + 6)

    yPosition += 10

    // Items
    doc.setFont(undefined, 'normal')
    doc.setTextColor(31, 41, 55)

    invoiceData.items.forEach((item, index) => {
      doc.text(item.description, 25, yPosition)
      doc.text(item.quantity.toString(), 120, yPosition)
      doc.text(formatCurrency(item.rate), 140, yPosition)
      doc.text(formatCurrency(item.amount), 165, yPosition)
      yPosition += 8
    })

    yPosition += 5

    // Totals
    doc.setFont(undefined, 'bold')
    doc.text('Subtotal:', 140, yPosition)
    doc.text(formatCurrency(invoiceData.subtotal), 165, yPosition)

    yPosition += 8
    doc.text('Tax (18%):', 140, yPosition)
    doc.text(formatCurrency(invoiceData.tax), 165, yPosition)

    yPosition += 8
    doc.setFontSize(12)
    doc.setFillColor(59, 130, 246)
    doc.setTextColor(255, 255, 255)
    doc.rect(140, yPosition - 5, 55, 10, 'F')
    doc.text('TOTAL:', 140, yPosition + 2)
    doc.text(formatCurrency(invoiceData.total), 165, yPosition + 2)

    yPosition += 20

    // Notes
    if (invoiceData.notes) {
      doc.setFont(undefined, 'bold')
      doc.setTextColor(31, 41, 55)
      doc.text('Notes:', 20, yPosition)
      doc.setFont(undefined, 'normal')
      doc.setFontSize(9)
      const splitNotes = doc.splitTextToSize(invoiceData.notes, pageWidth - 40)
      doc.text(splitNotes, 20, yPosition + 7)
    }

    // Footer
    doc.setFontSize(8)
    doc.setTextColor(107, 114, 128)
    doc.text(
      'Thank you for your business!',
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )

    // Save PDF
    doc.save(fileName)

    return {
      success: true,
      message: 'Invoice generated successfully',
    }
  } catch (error) {
    console.error('Invoice generation error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// Generate Invoice from HTML Element
export const generateInvoiceFromHTML = async (elementId, fileName = 'invoice.pdf') => {
  try {
    const element = document.getElementById(elementId)
    if (!element) {
      throw new Error('Invoice element not found')
    }

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false,
    })

    const imgData = canvas.toDataURL('image/png')
    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()

    const imgWidth = pageWidth - 20
    const imgHeight = (canvas.height * imgWidth) / canvas.width

    let yPosition = 10
    let remainingHeight = imgHeight

    while (remainingHeight > 0) {
      const pageHeight = doc.internal.pageSize.getHeight()
      const availableHeight = pageHeight - 20

      if (remainingHeight > availableHeight) {
        doc.addImage(
          imgData,
          'PNG',
          10,
          yPosition,
          imgWidth,
          availableHeight
        )
        remainingHeight -= availableHeight
        doc.addPage()
        yPosition = 10
      } else {
        doc.addImage(
          imgData,
          'PNG',
          10,
          yPosition,
          imgWidth,
          remainingHeight
        )
        remainingHeight = 0
      }
    }

    doc.save(fileName)

    return {
      success: true,
      message: 'Invoice generated successfully',
    }
  } catch (error) {
    console.error('Invoice generation error:', error)
    return {
      success: false,
      error: error.message,
    }
  }
}

// ==================== INVOICE UTILITIES ====================

// Calculate Invoice Totals
export const calculateInvoiceTotals = (items, taxPercentage = 18) => {
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const tax = (subtotal * taxPercentage) / 100
  const total = subtotal + tax

  return {
    subtotal,
    tax,
    total,
    taxPercentage,
  }
}

// Generate Invoice Number
export const generateInvoiceNumber = () => {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const random = Math.floor(Math.random() * 10000)
  return `INV-${year}${month}-${String(random).padStart(5, '0')}`
}

// Format Invoice Data
export const formatInvoiceData = (order, customer, items) => {
  const totals = calculateInvoiceTotals(items)

  return {
    invoiceNumber: generateInvoiceNumber(),
    date: new Date(),
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    items,
    subtotal: totals.subtotal,
    tax: totals.tax,
    total: totals.total,
    notes: `Thank you for choosing WPFixHub. Order ID: ${order.id}`,
  }
}

// Send Invoice Email (Mock)
export const sendInvoiceEmail = async (email, invoiceData) => {
  try {
    // In production, integrate with email service
    console.log(`Invoice sent to ${email}`)

    return {
      success: true,
      message: 'Invoice sent successfully',
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    }
  }
}

// Download Invoice
export const downloadInvoice = (invoiceData) => {
  return generateInvoicePDF(invoiceData, `invoice_${invoiceData.invoiceNumber}.pdf`)
}
