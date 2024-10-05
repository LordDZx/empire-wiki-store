'use client'; // أضف هذا السطر في بداية الملف

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, MessageCircle, Download, Sun, Moon, Trash2, Facebook, Mail, Phone, Home } from 'lucide-react';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, X, MessageCircle, Download, Sun, Moon, Trash2, Facebook, Mail, Phone, Home } from 'lucide-react';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
};

type CartItem = Product & { quantity: number };

type PaymentMethod = {
  id: string;
  name: string;
};

const products: Product[] = [
  { id: 1, name: "ذهب إضافي", price: 199.99, description: "احصل على 1000 قطعة ذهبية إضافية" },
  { id: 2, name: "تعزيز السرعة", price: 299.99, description: "بناء أسرع بنسبة 50٪ لمدة 24 ساعة" },
  { id: 3, name: "سلاح نادر", price: 499.99, description: "افتح سلاحًا قويًا ونادرًا" },
];

const paymentMethods: PaymentMethod[] = [
  { id: 'vodafone', name: 'فودافون كاش' },
  { id: 'orange', name: 'أورانج كاش' },
];

export default function Component() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [userInput, setUserInput] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [buyerName, setBuyerName] = useState('');
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [chatMessages]);

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getTotalCost = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const generateInvoice = () => {
    const invoiceNumber = Math.floor(Math.random() * 1000000);
    const invoiceDate = new Date().toLocaleDateString('ar-EG');
    let invoiceContent = `فاتورة رقم ${invoiceNumber}\n`;
    invoiceContent += `التاريخ: ${invoiceDate}\n`;
    invoiceContent += `اسم المشتري: ${buyerName}\n`;
    invoiceContent += `طريقة الدفع: ${paymentMethods.find(m => m.id === selectedPaymentMethod)?.name || 'غير محدد'}\n\n`;
    invoiceContent += "المنتجات:\n";
    cart.forEach(item => {
      invoiceContent += `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} جنيه مصري\n`;
    });
    invoiceContent += `\nالإجمالي: ${getTotalCost()} جنيه مصري`;
    return invoiceContent;
  };

  const sendToWhatsApp = () => {
    const invoiceContent = generateInvoice();
    const encodedMessage = encodeURIComponent(invoiceContent);
    window.open(`https://wa.me/201098662418?text=${encodedMessage}`, '_blank');
  };

  const downloadInvoice = () => {
    const invoiceContent = generateInvoice();
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoice.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleChatSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInput.trim() === '') return;

    setChatMessages(prev => [...prev, `أنت: ${userInput}`]);
    
    let botResponse = "عذرًا، لا أفهم هذا الأمر. اكتب 'مساعدة' للحصول على قائمة الأوامر.";
    if (userInput === 'مساعدة') {
      botResponse = "الأوامر المتاحة: 'المنتجات' - عرض المنتجات المتاحة، 'السلة' - عرض سلة التسوق الحالية، 'الإجمالي' - عرض التكلفة الإجمالية";
    } else if (userInput === 'المنتجات') {
      botResponse = "المنتجات المتاحة:\n" + products.map(p => `${p.name} - ${p.price.toFixed(2)} جنيه مصري`).join('\n');
    } else if (userInput === 'السلة') {
      botResponse = "سلة التسوق الخاصة بك:\n" + cart.map(item => `${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} جنيه مصري`).join('\n');
    } else if (userInput === 'الإجمالي') {
      botResponse = `الإجمالي هو: ${getTotalCost()} جنيه مصري`;
    }

    setChatMessages(prev => [...prev, `البوت: ${botResponse}`]);
    setUserInput('');
  };

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
          <span className="ml-2">{getCartItemsCount()}</span>
        </button>

        {showCart && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg relative">
              <button
                onClick={() => setShowCart(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">سلة التسوق</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">لا توجد عناصر في السلة.</p>
              ) : (
                <div>
                  <ul>
                    {cart.map(item => (
                      <li key={item.id} className="flex justify-between mb-2">
                        <span>{item.name} x{item.quantity}</span>
                        <span>{(item.price * item.quantity).toFixed(2)} جنيه مصري</span>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-700 ml-2"
                        >
                          <Trash2 size={18} />
                        </button>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-4">
                    <strong>الإجمالي: {getTotalCost()} جنيه مصري</strong>
                  </div>
                  <div className="mt-4">
                    <h3 className="text-lg font-bold mb-2">طريقة الدفع</h3>
                    {paymentMethods.map(method => (
                      <label key={method.id} className="block">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value={method.id}
                          checked={selectedPaymentMethod === method.id}
                          onChange={() => setSelectedPaymentMethod(method.id)}
                        />
                        {method.name}
                      </label>
                    ))}
                  </div>
                  <div className="mt-4">
                    <label className="block mb-1">اسم المشتري:</label>
                    <input
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="border rounded p-2 w-full"
                      placeholder="أدخل اسمك"
                    />
                  </div>
                  <button
                    onClick={sendToWhatsApp}
                    className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600 transition duration-300"
                  >
                    إرسال إلى WhatsApp
                  </button>
                  <button
                    onClick={downloadInvoice}
                    className="bg-purple-500 text-white px-4 py-2 rounded mt-4 ml-2 hover:bg-purple-600 transition duration-300"
                  >
                    تحميل الفاتورة
                  </button>
                </div>
              )}
              <button
                onClick={clearCart}
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
              >
                مسح السلة
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowChatbot(true)}
          className="fixed bottom-4 right-4 bg-blue-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-blue-600 transition duration-300"
        >
          <MessageCircle size={24} />
        </button>

        {showChatbot && (
          <div className="fixed bottom-20 right-4 w-80 bg-white p-4 rounded-lg shadow-lg">
            <button
              onClick={() => setShowChatbot(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            <div className="overflow-y-auto h-48" ref={chatRef}>
              {chatMessages.map((message, index) => (
                <p key={index} className="mb-2">{message}</p>
              ))}
            </div>
            <form onSubmit={handleChatSubmit} className="flex mt-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="border rounded p-2 flex-1"
                placeholder="اكتب هنا..."
              />
              <button type="submit" className="bg-blue-500 text-white px-4 rounded ml-2">
                إرسال
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setShowContactUs(true)}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white p-3 md:p-4 rounded-full shadow-lg hover:bg-green-600 transition duration-300"
        >
          اتصل بنا
        </button>

        {showContactUs && (
          <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <div className="bg-white p-4 md:p-6 rounded-lg shadow-lg relative">
              <button
                onClick={() => setShowContactUs(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              >
                <X size={24} />
              </button>
              <h2 className="text-xl font-bold mb-4">اتصل بنا</h2>
              <div className="flex flex-col space-y-4">
                <a href="mailto:example@example.com" className="flex items-center">
                  <Mail size={24} className="mr-2" />
                  <span>example@example.com</span>
                </a>
                <a href="tel:+201234567890" className="flex items-center">
                  <Phone size={24} className="mr-2" />
                  <span>+20 123 456 7890</span>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="flex items-center">
                  <Facebook size={24} className="mr-2" />
                  <span>صفحتنا على فيسبوك</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
