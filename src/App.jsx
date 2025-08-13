import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart, CreditCard, PieChart, TrendingUp, DollarSign, Calendar, Book, Users, Clipboard, List, ArrowDown, ArrowUp, Zap, Link, Sun, Moon, Bold, Type, ChevronDown, LayoutGrid } from 'lucide-react';

const App = () => {
  const [theme, setTheme] = useState('black');
  const [boldnessLevel, setBoldnessLevel] = useState(3);
  const boldnessClasses = ['font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold'];

  const fontFamilies = [
    'Inter', 'Roboto', 'Poppins', 'Lato', 'Montserrat',
    'Open Sans', 'Source Sans 3', 'Nunito', 'Oswald', 'Merriweather'
  ];
  const [fontIndex, setFontIndex] = useState(0);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const fontDropdownRef = useRef(null);
  
  // State for drag-and-drop functionality
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState(null);
  const cardGridRef = useRef(null);

  // New state to hold all card data
  const [cards, setCards] = useState([
    {
      id: 'profit_and_loss',
      title: 'Profit & Loss',
      content: {
        currentMonth: 24580,
        lastMonthChange: 12.5,
        lastYearChange: -7.5,
      },
      component: 'ProfitLoss',
      className: 'lg:col-span-1',
    },
    {
      id: 'balance_sheet',
      title: 'Balance Sheet',
      content: {
        totalAssets: 50000,
        totalLiabilities: 40000,
        equity: 10000,
      },
      component: 'BalanceSheet',
      className: 'lg:col-span-1',
    },
    {
      id: 'cash_flow',
      title: 'Cash Flow',
      content: {
        cashInflow: 32150,
        cashOutflow: 18420,
        netCashFlow: 13730,
      },
      component: 'CashFlow',
      className: 'lg:col-span-1',
    },
    {
      id: 'receivables',
      title: 'Receivables',
      content: [
        { period: "7 days", amount: 5000 },
        { period: "30 days", amount: 15600 },
        { period: "Total", amount: 52120 },
      ],
      component: 'FinancialList',
    },
    {
      id: 'payables',
      title: 'Payables',
      content: [
        { period: "7 days", amount: 5000 },
        { period: "30 days", amount: 15600 },
        { period: "Total", amount: 52120 },
      ],
      component: 'FinancialList',
    },
    {
      id: 'authorities',
      title: 'with Authorities',
      content: [
        { type: "GST ITC", amount: 32150 },
        { type: "TDS", amount: 18420 },
        { type: "Total", amount: 13730 },
      ],
      component: 'FinancialList',
    },
    {
      id: 'recent_entries',
      title: 'Recent Entries / Edits',
      content: [
        { type: "Sales - Inv002", reference: "Secure Finance Corp.", date: "Mar 18, 2025", time: "12:00am", amount: 10000, user: "accountant 1" },
        { type: "Purchase", reference: "Secure Finance Corp.", date: "Mar 18, 2025", time: "11:00am", amount: 10000, user: "accountant 1" },
        { type: "Direct Expense", reference: "Secure Finance Corp.", date: "Mar 18, 2025", time: "11:00am", amount: 10000, user: "accountant 1" },
      ],
      component: 'EntriesList',
      className: 'lg:col-span-1',
    },
    {
      id: 'sales_chart',
      title: 'Sales',
      content: [
        { name: 'Jan', sales: 4000 },
        { name: 'Feb', sales: 3000 },
        { name: 'Mar', sales: 2000 },
        { name: 'Apr', sales: 2780 },
        { name: 'May', sales: 1890 },
        { name: 'Jun', sales: 2390 },
      ],
      component: 'SalesChart',
      className: 'lg:col-span-2',
    },
    {
      id: 'new_entry',
      title: 'New Entry',
      content: [
        { text: "Sales" },
        { text: "Direct Expenses" },
        { text: "Purchase" },
        { text: "Indirect Expenses" },
        { text: "Journal" },
        { text: "Stock Journal" },
      ],
      component: 'NewEntryButtons',
    },
    {
      id: 'custom_widget',
      title: 'Custom Widget',
      content: [
        { name: "*** Balance", amount: 50530, className: "font-bold" },
        { name: "CC outstanding", amount: 12103 },
        { name: "EB payable", amount: 2410, className: "font-bold" },
      ],
      component: 'CustomWidget',
    },
    {
      id: 'todo_list',
      title: 'To do list',
      content: [
        { task: "Bank Entries", time: "18:00:00" },
        { task: "Send TDS data", time: "15:00:00" },
        { task: "Mail *** Ledger", time: "17-08-2025" },
      ],
      component: 'TodoList',
    },
  ]);

  // Close font dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target)) {
        setIsFontDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [fontDropdownRef]);

  // Drag and Drop Logic for Cards
  const handleCardDragStart = (e, id) => {
    if (!isRearrangeMode) {
      e.preventDefault();
      return;
    }
    setDraggedCardId(id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleCardDragOver = (e, id) => {
    e.preventDefault();
    if (!isRearrangeMode || !draggedCardId) return;

    const draggedOverIndex = cards.findIndex(card => card.id === id);
    const draggedIndex = cards.findIndex(card => card.id === draggedCardId);

    if (draggedOverIndex === draggedIndex) return;

    const newCards = [...cards];
    const [reorderedCard] = newCards.splice(draggedIndex, 1);
    newCards.splice(draggedOverIndex, 0, reorderedCard);
    setCards(newCards);
  };

  const handleCardDragEnd = () => {
    setDraggedCardId(null);
  };

  const toggleTheme = () => {
    setTheme(prevTheme => {
      if (prevTheme === 'light') return 'dark';
      if (prevTheme === 'dark') return 'black';
      return 'light';
    });
  };

  const toggleBold = () => {
    setBoldnessLevel((prevLevel) => (prevLevel + 1) % boldnessClasses.length);
  };

  const toggleFont = () => {
    setFontIndex((prevIndex) => (prevIndex + 1) % fontFamilies.length);
  };

  const selectFont = (index) => {
    setFontIndex(index);
    setIsFontDropdownOpen(false);
  };

  const getBackgroundColor = () => {
    if (theme === 'light') return 'bg-[#FFF3E7]';
    if (theme === 'dark') return 'bg-slate-900';
    return 'bg-zinc-950'; // Pure black theme
  };

  const getTextColor = () => {
    if (theme === 'light') return 'text-gray-800';
    return 'text-gray-100';
  };

  const getCardClasses = (isBeingDragged, isRearranging) => {
    const baseClasses = `backdrop-blur-sm border shadow-lg rounded-lg transition-all duration-300 ease-in-out p-6`;
    const dragClasses = isBeingDragged ? 'opacity-50 z-10' : '';
    const hoverClasses = isRearranging ? 'cursor-grab animate-pulse-once' : 'hover:scale-[1.02] hover:shadow-xl';

    if (theme === 'light') return `${baseClasses} bg-white/50 border-gray-200 ${dragClasses} ${hoverClasses}`;
    return `${baseClasses} bg-white/5 border-white/10 ${dragClasses} ${hoverClasses}`;
  };

  const FinancialValue = ({ label, value, valueColor = getTextColor(), icon }) => (
    <div className="flex justify-between items-center py-1">
      <span className={`flex items-center ${theme === 'light' ? "text-gray-600" : "text-gray-400"}`}>
        {icon && <span className="mr-2">{icon}</span>}
        {label}
      </span>
      <span className={`font-semibold ${valueColor}`}>
        ₹{value.toLocaleString()}
      </span>
    </div>
  );

  const EntryItem = ({ type, reference, date, time, amount, user }) => (
    <div className={`flex justify-between items-center py-2 border-b ${theme === 'light' ? "border-gray-200" : "border-white/10"} last:border-b-0`}>
      <div className="flex items-start">
        <div>
          <p className={`font-semibold text-sm ${getTextColor()}`}>{type}</p>
          <p className={`text-xs ${theme === 'light' ? "text-gray-500" : "text-gray-400"}`}>{reference}</p>
          <p className={`text-sm font-bold mt-1 ${getTextColor()}`}>₹{amount.toLocaleString()}</p>
        </div>
      </div>
      <div className="text-right">
        <p className={`text-xs ${theme === 'light' ? "text-gray-500" : "text-gray-400"}`}>{user}</p>
        <p className={`text-xs ${theme === 'light' ? "text-gray-500" : "text-gray-400"}`}>{date}</p>
        <p className={`text-xs ${theme === 'light' ? "text-gray-500" : "text-gray-400"}`}>{time}</p>
      </div>
    </div>
  );

  const TodoItem = ({ task, time }) => (
    <div className={`flex justify-between items-center py-2 border-b ${theme === 'light' ? "border-gray-200" : "border-white/10"} last:border-b-0`}>
      <p className={`text-sm font-medium ${getTextColor()}`}>{task}</p>
      <p className={`text-xs ${theme === 'light' ? "text-gray-500" : "text-gray-400"}`}>{time}</p>
    </div>
  );

  const NewEntryButton = ({ text }) => (
    <button className={`flex justify-center items-center p-4 rounded-lg transition duration-200 ${theme === 'light' ? "bg-gray-100 hover:bg-gray-200 text-gray-800" : "bg-white/5 hover:bg-white/10 text-gray-100"}`}>
      <span className="font-semibold">{text}</span>
    </button>
  );

  const StatCard = ({ card, index }) => {
    const { title, component, content, className } = card;

    const isBeingDragged = draggedCardId === card.id;

    const renderContent = () => {
      switch (component) {
        case 'ProfitLoss':
          return (
            <>
              <p className="text-3xl font-extrabold text-green-400">₹{content.currentMonth.toLocaleString()}</p>
              <div className="mt-4 text-sm">
                <p className="text-green-400">
                  +{content.lastMonthChange}% from Mar 24 (Last Month)
                </p>
                <p className="text-red-400">
                  {content.lastYearChange}% from Apr 23 (Last Year's)
                </p>
              </div>
            </>
          );
        case 'BalanceSheet':
          return (
            <>
              <FinancialValue label="Total Assets" value={content.totalAssets} />
              <FinancialValue label="Total Liabilities" value={content.totalLiabilities} />
              <div className={`w-full h-px my-2 ${theme === 'light' ? "bg-gray-200" : "bg-white/10"}`}></div>
              <FinancialValue label="Equity" value={content.equity} valueColor={theme === 'light' ? "text-blue-600" : "text-blue-400"} />
            </>
          );
        case 'CashFlow':
          return (
            <>
              <FinancialValue label="Cash Inflow" value={content.cashInflow} valueColor="text-green-400" />
              <FinancialValue label="Cash Outflow" value={content.cashOutflow} valueColor="text-red-400" />
              <div className={`w-full h-px my-2 ${theme === 'light' ? "bg-gray-200" : "bg-white/10"}`}></div>
              <FinancialValue label="Net Cash Flow" value={content.netCashFlow} valueColor={theme === 'light' ? "text-blue-600" : "text-blue-400"} />
            </>
          );
        case 'FinancialList':
          return content.map((item, i) => (
            <FinancialValue key={i} label={item.period || item.type} value={item.amount} valueColor={item.period === "Total" || item.type === "Total" ? (theme === 'light' ? "text-blue-600" : "text-blue-400") : (i % 2 === 0 ? "text-green-400" : "text-red-400")} />
          ));
        case 'EntriesList':
          return (
            <div className="space-y-4">
              {content.map((entry, i) => (
                <EntryItem key={i} {...entry} />
              ))}
            </div>
          );
        case 'SalesChart':
          return (
            <>
              <p className={`${theme === 'light' ? "text-gray-500" : "text-gray-400"} text-sm mb-4`}>6months trend - graph</p>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={content}>
                  <CartesianGrid stroke={theme === 'light' ? "#e5e7eb" : "#374151"} strokeDasharray="3 3" />
                  <XAxis dataKey="name" stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} />
                  <YAxis stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} />
                  <Tooltip contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(55, 65, 81, 0.8)', border: 'none', color: theme === 'light' ? '#1f2937' : '#f9fafb' }} />
                  <Line type="monotone" dataKey="sales" stroke={theme === 'light' ? "#4f46e5" : "#8b5cf6"} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </>
          );
        case 'NewEntryButtons':
          return (
            <div className="grid grid-cols-2 gap-4">
              {content.map((btn, i) => (
                <NewEntryButton key={i} text={btn.text} />
              ))}
            </div>
          );
        case 'CustomWidget':
          return (
            <div className="space-y-2">
              {content.map((item, i) => (
                <div key={i} className="flex justify-between items-center">
                  <p className={`text-sm ${item.className}`}>{item.name}</p>
                  <p className={`text-sm ${item.className}`}>₹{item.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          );
        case 'TodoList':
          return (
            <div className="space-y-2">
              {content.map((item, i) => (
                <TodoItem key={i} {...item} />
              ))}
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <div
        className={`${getCardClasses(isBeingDragged, isRearrangeMode)} ${className}`}
        draggable={isRearrangeMode}
        onDragStart={(e) => handleCardDragStart(e, card.id)}
        onDragOver={(e) => handleCardDragOver(e, card.id)}
        onDragEnd={handleCardDragEnd}
      >
        <h3 className={`text-lg font-bold mb-4 ${getTextColor()}`}>{title}</h3>
        {renderContent()}
      </div>
    );
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} ${getTextColor()} p-4 md:p-8 ${boldnessClasses[boldnessLevel]}`} style={{ fontFamily: fontFamilies[fontIndex] }}>
      {/* Embedded CSS for fonts */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Lato:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700;800&family=Merriweather:wght@400;700;900&display=swap');
          @keyframes pulse-once {
            0%, 100% {
              transform: scale(1);
            }
            50% {
              transform: scale(0.98);
            }
          }
          .animate-pulse-once {
            animation: pulse-once 1s ease-in-out;
          }
        `}
      </style>

      {/* Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className={`text-2xl md:text-3xl font-extrabold ${theme === 'light' ? "text-gray-900" : "text-white"}`}>
          Accounting Dashboard
        </h1>
        <div className="flex items-center space-x-2 mt-2 md:mt-0">
          {/* Font Toggle and Dropdown */}
          <div className="relative" ref={fontDropdownRef}>
            <button
              onClick={toggleFont}
              className={`relative p-2 rounded-l-lg transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}
            >
              <Type size={20} className={theme === 'light' ? "text-gray-800" : "text-gray-100"} />
            </button>
            <button
              onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)}
              className={`relative p-2 rounded-r-lg transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-300 text-gray-800' : 'bg-gray-600 text-gray-100'}`}
            >
              <ChevronDown size={20} />
            </button>
            {isFontDropdownOpen && (
              <div className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg z-10 py-1 ${theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`} style={{ fontFamily: 'Inter' }}>
                {fontFamilies.map((font, index) => (
                  <button
                    key={font}
                    onClick={() => selectFont(index)}
                    className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-100 hover:bg-gray-700'}`}
                    style={{ fontFamily: font }}
                  >
                    {font}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rearrange Mode Toggle */}
          <button
            onClick={() => setIsRearrangeMode(!isRearrangeMode)}
            className={`p-2 rounded-lg transition-colors duration-200 focus:outline-none ${isRearrangeMode ? (theme === 'light' ? 'bg-blue-200 text-blue-800' : 'bg-blue-700 text-blue-100') : (theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100')} hover:bg-gray-300 dark:hover:bg-gray-600`}
          >
            <LayoutGrid size={20} />
          </button>

          {/* Bold Toggle Button */}
          <button
            onClick={toggleBold}
            className={`relative p-2 rounded-lg transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}
          >
            <Bold
              size={20}
              className={boldnessLevel > 0 ? (theme === 'light' ? "text-blue-600" : "text-blue-400") : ""}
              strokeWidth={2.5 + boldnessLevel * 0.5}
            />
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className={`relative p-2 rounded-lg transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}
          >
            {theme === 'light' ? (
              <Sun size={20} className="text-yellow-500" strokeWidth={3} />
            ) : (
              <Moon size={20} className={theme === 'black' ? 'text-gray-400' : 'text-blue-500'} style={{ transform: 'rotate(270deg)' }} />
            )}
          </button>

          <span className={theme === 'light' ? "text-gray-600" : "text-gray-400"}>Period:</span>
          <select className={`rounded-md border p-2 ${theme === 'light' ? "bg-white border-gray-300 text-gray-800" : "bg-gray-700 border-gray-700 text-gray-100"}`}>
            <option>Apr-24</option>
            <option>Mar-24</option>
            <option>Feb-24</option>
          </select>
        </div>
      </header>

      {/* Main Dashboard Grid */}
      <div ref={cardGridRef} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {cards.map((card, index) => (
          <StatCard key={card.id} card={card} index={index} />
        ))}
      </div>
    </div>
  );
};

export default App;
