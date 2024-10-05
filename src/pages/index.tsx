import React, { useState, useEffect, useRef } from 'react'
import { ShoppingCart, X, MessageCircle, Download, Sun, Moon, Trash2, Facebook, Mail, Phone, Home } from 'lucide-react'

type Product = {
  id: number
  name: string
  price: number
  description: string
}

type CartItem = Product & { quantity: number }

type Invoice = {
  id: string
  content: string
  date: string
}

type PaymentMethod = {
  id: string
  name: string
}

const products: Product[] = [
  { id: 1, name: "ذهب إضافي", price: 199.99, description: "احصل على 1000 قطعة ذهبية إضافية" },
  { id: 2, name: "تعزيز السرعة", price: 299.99, description: "بناء أسرع بنسبة 50٪ لمدة 24 ساعة" },
  { id: 3, name: "سلاح نادر", price: 499.99, description: "افتح سلاحًا قويًا ونادرًا" },
]

const paymentMethods: PaymentMethod[] = [
  { id: 'vodafone', name: 'فودافون كاش' },
  { id: 'orange', name: 'أورانج كاش' },
]

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showChatbot, setShowChatbot] = useState(false)
  const [chatMessages, setChatMessages] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [showContactUs, setShowContactUs] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('')
  const [buyerName, setBuyerName] = useState('')
  const chatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [chatMessages])

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode)
  }, [darkMode])

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prevCart, { ...product, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const clearCart = () => {
    setCart([])
  }

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  const generateInvoice = () => {
    const invoiceNumber = Math.floor(Math.random() * 1000000)
    const invoiceDate = new Date().toLocaleDateString('ar-EG')
    let invoiceContent = `فاتورة رقم ${invoiceNumber}\n`
    invoiceContent += `التاريخ: ${invoiceDate}\n`
    invoiceContent += `اسم المشتري: ${buyerName}\n`
    invoiceContent += `تاريخ الاشتراك: ${invoiceDate}\n`
    invoiceContent += `طريقة الدفع: ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'غير محدد'}\n\n`
    invoiceContent += "المنتجات:\n"
    cart.forEach(item => {
      invoiceContent += `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} جنيه مصري\n`
    })
    invoiceContent += `\nالإجمالي: ${getTotalCost()} جنيه مصري`
    return invoiceContent
  }

  const saveInvoice = (invoiceContent: string) => {
    const newInvoice: Invoice = {
      id: Date.now().toString(),
      content: invoiceContent,
      date: new Date().toISOString(),
    }
    setInvoices(prevInvoices => [...prevInvoices, newInvoice])
    console.log("تم حفظ الفاتورة:", newInvoice)
  }

  const sendToWhatsApp = () => {
    const invoiceContent = generateInvoice()
    const encodedMessage = encodeURIComponent(invoiceContent)
    window.open(`https://wa.me/201098662418?text=${encodedMessage}`, '_blank')
  }

  const downloadInvoice = () => {
    const invoiceContent = generateInvoice()
    const blob = new Blob([invoiceContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'invoice.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (userInput.trim() === '') return

    setChatMessages(prev => [...prev, `أنت: ${userInput}`])
    
    let botResponse = "عذرًا، لا أفهم هذا الأمر. اكتب 'مساعدة' للحصول على قائمة الأوامر."
    if (userInput === 'مساعدة') {
      botResponse = "الأوامر المتاحة: 'المنتجات' - عرض المنتجات المتاحة، 'السلة' - عرض سلة التسوق الحالية، 'الإجمالي' - عرض التكلفة الإجمالية"
    } else if (userInput === 'المنتجات') {
      botResponse = "المنتجات المتاحة:\n" + products.map(p => `${p.name} - ${p.price.toFixed(2)} جنيه مصري`).join('\n')
    } else if (userInput === 'السلة') {
      botResponse = "سلة التسوق الخاصة بك:\n" + cart.map(item => `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} جنيه مصري`).join('\n')
    } else if (userInput === 'الإجمالي') {
      botResponse = `الإجمالي هو: ${getTotalCost()} جنيه مصري`
    }

    setChatMessages(prev => [...prev, `البوت: ${botResponse}`])
    setUserInput('')
  }

  return (
    <div className={`min-h-screen p-4 md:p-8 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-black'}`} dir="rtl">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <h1 className={`text-2xl md:text-4xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>متجر Goodgame Empire</h1>
          <div className="flex items-center space-x-2">
            <a
              href="https://www.goodgameempire.com"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-purple-500 text-white px-2 py-1 md:px-4 md:py-2 rounded shadow-lg hover:bg-purple-600 transition duration-300 flex items-center text-sm md:text-base"
            >
              <Home size={18} className="mr-1 md:mr-2" />
              العودة للموقع الرئيسي
            </a>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white p-2 rounded-full shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition duration-300"
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {products.map(product => (
            <div key={product.id} className={`${darkMode ? 'bg-gray-800' : 'bg-white'} p-4 md:p-6 rounded-lg shadow-md`}>
              <h2 className="text-xl font-semibold mb-2">{product.name}</h2>
              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold">{product.price.toFixed(2)} جنيه مصري</span>
                <button
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 text-white px-3 py-1 md:px-4 md:py-2 rounded hover:bg-blue-600 transition duration-300"
                >
                  أضف إلى السلة
                </button>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setShowCart(true)}
          className="fixed bottom-4 left-4 bg-blue-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <ShoppingCart size={24} />
          {getCartItemsCount() > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center text-xs">
              {getCartItemsCount()}
            </span>
          )}
        </button>

        <button
          onClick={() => setShowContactUs(true)}
          className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 md:px-4 md:py-2 rounded shadow-lg hover:bg-green-600 transition duration-300 text-sm md:text-base"
        >
          تواصل معنا
        </button>

        {showCart && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 md:p-8 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto relative`}>
              <button
                onClick={() => setShowCart(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl md:text-2xl font-bold mb-4">سلة التسوق</h2>
              {cart.length === 0 ? (
                <p>سلة التسوق فارغة.</p>
              ) : (
                <>
                  {cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center mb-4">
                      <span>{item.name} x{item.quantity}</span>
                      <span>{(item.price * item.quantity).toFixed(2)} جنيه مصري</span>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        إزالة
                      </button>
                    </div>
                  ))}
                  <div className="border-t pt-4 mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-bold">الإجمالي:</span>
                      <span className="font-bold">{getTotalCost()} جنيه مصري</span>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="buyerName" className="block mb-2">اسم المشتري:</label>
                      <input
                        type="text"
                        id="buyerName"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-black"
                      />
                    </div>
                    <div className="mb-4">
                      <label htmlFor="paymentMethod" className="block mb-2">طريقة الدفع:</label>
                      <select
                        id="paymentMethod"
                        value={selectedPaymentMethod}
                        onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                        className="w-full px-3 py-2 border rounded-lg text-black"
                      >
                        <option value="">اختر طريقة الدفع</option>
                        {paymentMethods.map(method => (
                          <option key={method.id} value={method.id}>{method.name}</option>
                        ))}
                      </select>
                    </div>
                    <button
                      onClick={() => {
                        const invoice = generateInvoice()
                        saveInvoice(invoice)
                        sendToWhatsApp()
                      }}
                      className="bg-green-500 text-white px-4 py-2 rounded w-full mb-2 hover:bg-green-600 transition duration-300"
                    >
                      الدفع عبر واتساب
                    </button>
                    <button
                      onClick={downloadInvoice}
                      className="bg-blue-500 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-blue-600 transition duration-300 mb-2"
                    >
                      <Download size={18} className="ml-2" />
                      تحميل الفاتورة
                    </button>
                    <button
                      onClick={clearCart}
                      className="bg-red-500 text-white px-4 py-2 rounded w-full flex items-center justify-center hover:bg-red-600 transition duration-300 mb-2"
                    >
                      <Trash2 size={18} className="ml-2" />
                      مسح السلة
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-4 right-4 bg-green-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          <MessageCircle size={24} />
        </button>

        {showChatbot && (
          <div className={`fixed bottom-20 right-4 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} rounded-lg shadow-xl w-64 md:w-80`}>
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">المساعد الآلي</h3>
              <button
                onClick={() => setShowChatbot(false)}
                className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div ref={chatRef} className="h-64 overflow-y-auto p-4">
              <p className="mb-2">مرحبًا! اكتب 'مساعدة' للحصول على قائمة الأوامر.</p>
              {chatMessages.map((msg, index) => (
                <p key={index} className="mb-2">{msg}</p>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="p-4 border-t">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="اكتب رسالة..."
                className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 text-white' : 'bg-white text-black'}`}
              />
            </form>
          </div>
        )}

        {showContactUs && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className={`${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'} p-4 md:p-8 rounded-lg shadow-xl max-w-md w-full relative`}>
              <button
                onClick={() => setShowContactUs(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl md:text-2xl font-bold mb-4">تواصل معنا</h2>
              <div className="space-y-4">
                <a
                  href="https://www.facebook.com/profile.php?id=61558933496823"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-blue-500 hover:text-blue-600"
                >
                  <Facebook size={24} />
                  <span>تواصل عبر فيسبوك</span>
                </a>
                <a
                  href="https://wa.me/201098662418"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-green-500 hover:text-green-600"
                >
                  <Phone size={24} />
                  <span>تواصل عبر واتساب</span>
                </a>
                <a
                  href="mailto:sinperrr3ddd@gmail.com"
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                >
                  <Mail size={24} />
                  <span>تواصل عبر البريد الإلكتروني</span>
                </a>
                <a
                  href="mailto:empirewiki200@gmail.com"
                  className="flex items-center space-x-2 text-red-500 hover:text-red-600"
                >
                  <Mail size={24} />
                  <span>تواصل عبر البريد الإلكتروني البديل</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}