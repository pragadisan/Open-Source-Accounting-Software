import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Sun, Moon, Bold, Type, ChevronDown, LayoutGrid, X, Plus, Trash2, Search, Save, PlusCircle, Menu, ChevronsLeft, ShoppingCart, DollarSign, BookOpen, ChevronLeft, ChevronRight, Calculator, Banknote, TrendingUp, FileText, Briefcase, Users } from 'lucide-react';

// --- Static Data ---
// Permanent storage for transactions.
const permanentSales = [
    { id: 1, type: "Sales", reference: "INV-00126 to Sunrise Solutions", date: "Aug 23, 2025", amount: 12500, user: "suresh" },
    { id: 2, type: "Sales", reference: "INV-00125 to Innovate Corp", date: "Aug 22, 2025", amount: 5900, user: "suresh" },
    { id: 3, type: "Sales", reference: "INV-00124 to Global Traders", date: "Aug 21, 2025", amount: 8200, user: "suresh" },
];
const permanentPurchases = [
    { id: 1, type: "Purchase", reference: "BILL-801 from Salem Steel", date: "Aug 23, 2025", amount: 22400, user: "suresh" },
    { id: 2, type: "Purchase", reference: "BILL-789 from Core Hardware", date: "Aug 21, 2025", amount: 1770, user: "suresh" },
    { id: 3, type: "Purchase", reference: "BILL-788 from Global Logistics", date: "Aug 20, 2025", amount: 4500, user: "suresh" },
];
const permanentDirectExpense = [
    { id: 1, type: "Direct Expense", reference: "Office Supplies (Cash)", date: "Aug 20, 2025", amount: 500, user: "suresh" },
];
const allPermanentTransactions = [...permanentSales, ...permanentPurchases, ...permanentDirectExpense].sort((a, b) => new Date(b.date) - new Date(a.date));

// --- Generic Placeholder Page ---
// A reusable page for new features.
const GenericPage = ({ title, onClose, theme, children }) => {
  const getBackgroundColor = () => theme === 'light' ? 'bg-white' : (theme === 'dark' ? 'bg-slate-800' : 'bg-zinc-900');
  const getTextColor = () => theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'light' ? 'bg-gray-500/50' : 'bg-black/50'} backdrop-blur-sm`}>
       <div className={`w-full max-w-6xl h-[95vh] m-auto flex flex-col rounded-xl shadow-2xl ${getBackgroundColor()} ${getTextColor()}`}>
        <header className={`flex items-center justify-between p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/20 transition-colors"><X size={24} /></button>
        </header>
        <div className="flex-grow p-6 overflow-y-auto">
            {children ? children : (
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <h3 className="text-2xl font-bold">Coming Soon</h3>
                        <p className="text-gray-500 mt-2">This page is under construction.</p>
                    </div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// --- Report Pages ---
// Displays reports for various transactions.
const ReportPage = ({ title, data, theme, onClose }) => (
    <GenericPage title={title} onClose={onClose} theme={theme}>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}>
                    <tr>
                        <th className="p-3 font-semibold">Date</th>
                        <th className="p-3 font-semibold">Reference</th>
                        <th className="p-3 font-semibold text-right">Amount</th>
                        <th className="p-3 font-semibold">User</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map(item => (
                        <tr key={item.id} className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}>
                            <td className="p-3">{item.date}</td>
                            <td className="p-3">{item.reference}</td>
                            <td className="p-3 text-right font-medium">₹{item.amount.toLocaleString()}</td>
                            <td className="p-3">{item.user}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </GenericPage>
);


// --- Purchase Journal Component ---
// Manages and records purchase entries.
const PurchaseJournal = ({ onClose, theme }) => {
  const mockSuppliers = [
    { id: 1, name: 'Core Hardware Supplies', address: '101 Component Way, Tech City', gst: '29ABCDE1234F1Z5' },
    { id: 2, name: 'Global Logistics Ltd.', address: '202 Freight Lane, Metroplex', gst: '07HIJKL5678M2N9' },
    { id: 3, name: 'Salem Steel & Co.', address: '303 Industrial Zone, Salem, Tamil Nadu', gst: '33PQRST9101U3V4' },
  ];
  const mockProducts = [
    { id: 101, name: 'Cloud Service Subscription', hsn: '998313', rate: 5000 },
    { id: 102, name: 'Software Development', hsn: '998314', rate: 12000 },
    { id: 103, name: 'Hardware Supply', hsn: '8471', rate: 25000 },
    { id: 201, name: 'Office Raw Materials', hsn: '3926', rate: 1500 },
  ];
  const [purchase, setPurchase] = useState({
    billNo: `BILL-${Math.floor(Math.random() * 1000)}`,
    billDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
    supplier: null, supplierAddress: '', placeOfSupply: '',
    items: [{ productId: '', name: '', hsn: '', qty: 1, rate: 0, amount: 0, taxRate: 18 }],
    notes: 'Payment to be made within 30 days.',
    subTotal: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 0,
  });
  const [supplierSearch, setSupplierSearch] = useState('');
  const [supplierResults, setSupplierResults] = useState([]);
  const [isSupplierDropdownOpen, setIsSupplierDropdownOpen] = useState(false);
  const handleJournalChange = (e) => { const { name, value } = e.target; setPurchase(prev => ({ ...prev, [name]: value })); };
  const handleItemChange = (index, e) => {
    const { name, value } = e.target; const items = [...purchase.items]; items[index][name] = value;
    if (name === 'productId') {
        const product = mockProducts.find(p => p.id === parseInt(value));
        if (product) { items[index].name = product.name; items[index].hsn = product.hsn; items[index].rate = product.rate; }
    }
    const qty = parseFloat(items[index].qty) || 0; const rate = parseFloat(items[index].rate) || 0; items[index].amount = qty * rate;
    setPurchase(prev => ({ ...prev, items }));
  };
  const addItem = () => setPurchase(prev => ({ ...prev, items: [...prev.items, { productId: '', name: '', hsn: '', qty: 1, rate: 0, amount: 0, taxRate: 18 }] }));
  const removeItem = (index) => setPurchase(prev => ({ ...prev, items: prev.items.filter((_, i) => i !== index) }));
  const handleSupplierSearch = (e) => {
      setSupplierSearch(e.target.value);
      if (e.target.value) { setIsSupplierDropdownOpen(true); setSupplierResults(mockSuppliers.filter(s => s.name.toLowerCase().includes(e.target.value.toLowerCase()))); } 
      else { setIsSupplierDropdownOpen(false); setSupplierResults([]); }
  };
  const selectSupplier = (supplier) => {
      setPurchase(prev => ({ ...prev, supplier, supplierAddress: supplier.address, placeOfSupply: supplier.address.split(',').pop().trim() }));
      setSupplierSearch(supplier.name); setIsSupplierDropdownOpen(false);
  };
  useEffect(() => {
    const subTotal = purchase.items.reduce((acc, item) => acc + item.amount, 0); let cgst = 0, sgst = 0, igst = 0;
    const isInterstate = purchase.placeOfSupply.toLowerCase() !== 'tamil nadu';
    purchase.items.forEach(item => {
        const tax = (item.amount * (item.taxRate || 0)) / 100;
        if (isInterstate) igst += tax; else { cgst += tax / 2; sgst += tax / 2; }
    });
    const grandTotal = subTotal + cgst + sgst + igst;
    setPurchase(prev => ({ ...prev, subTotal, cgst, sgst, igst, grandTotal }));
  }, [purchase.items, purchase.placeOfSupply]);
  const getBackgroundColor = () => theme === 'light' ? 'bg-white' : (theme === 'dark' ? 'bg-slate-800' : 'bg-zinc-900');
  const getTextColor = () => theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const getInputClasses = () => `w-full px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-gray-100 border border-gray-300 text-gray-900' : 'bg-gray-700 border border-gray-600 text-gray-100'}`;
  const getLabelClasses = () => `block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'light' ? 'bg-gray-500/50' : 'bg-black/50'} backdrop-blur-sm`}>
      <div className={`w-full max-w-6xl h-[95vh] flex flex-col rounded-xl shadow-2xl ${getBackgroundColor()} ${getTextColor()}`}>
        <header className={`flex items-center justify-between p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}><h2 className="text-xl font-bold">New Purchase Journal</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/20 transition-colors"><X size={24} /></button></header>
        <div className="flex-grow p-6 overflow-y-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2 space-y-4">
                    <div className="relative"><label className={getLabelClasses()}>Supplier</label><div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={supplierSearch} onChange={handleSupplierSearch} placeholder="Search or Add a Supplier" className={`${getInputClasses()} pl-10`} /></div>
                        {isSupplierDropdownOpen && supplierResults.length > 0 && (<div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>{supplierResults.map(s => (<div key={s.id} onClick={() => selectSupplier(s)} className={`px-4 py-2 cursor-pointer hover:bg-blue-500/20`}><p className="font-semibold">{s.name}</p><p className="text-sm text-gray-400">{s.address}</p></div>))}</div>)}
                    </div>
                     <div><label className={getLabelClasses()}>Supplier Address</label><textarea name="supplierAddress" value={purchase.supplierAddress} onChange={handleJournalChange} rows="3" className={getInputClasses()}></textarea></div>
                </div>
                <div className="space-y-4">
                    <div><label className={getLabelClasses()}>Bill No.</label><input type="text" name="billNo" value={purchase.billNo} onChange={handleJournalChange} className={getInputClasses()} /></div>
                    <div className="grid grid-cols-2 gap-4"><div><label className={getLabelClasses()}>Bill Date</label><input type="date" name="billDate" value={purchase.billDate} onChange={handleJournalChange} className={getInputClasses()} /></div><div><label className={getLabelClasses()}>Due Date</label><input type="date" name="dueDate" value={purchase.dueDate} onChange={handleJournalChange} className={getInputClasses()} /></div></div>
                    <div><label className={getLabelClasses()}>Place of Supply (State)</label><input type="text" name="placeOfSupply" value={purchase.placeOfSupply} onChange={handleJournalChange} placeholder="e.g., Tamil Nadu" className={getInputClasses()} /></div>
                </div>
            </div>
            <div className="overflow-x-auto"><table className="w-full text-left"><thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}><tr><th className="p-3 font-semibold">#</th><th className="p-3 font-semibold w-2/5">Item Details</th><th className="p-3 font-semibold">HSN/SAC</th><th className="p-3 font-semibold">Qty</th><th className="p-3 font-semibold">Rate</th><th className="p-3 font-semibold">Amount</th><th className="p-3 font-semibold"></th></tr></thead><tbody>{purchase.items.map((item, index) => (<tr key={index} className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}><td className="p-2">{index + 1}</td><td className="p-2"><select name="productId" value={item.productId} onChange={(e) => handleItemChange(index, e)} className={`${getInputClasses()} mb-1`}><option value="">Select Product/Service</option>{mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input type="text" name="name" placeholder="Description" value={item.name} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2"><input type="text" name="hsn" value={item.hsn} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2"><input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2"><input type="number" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2 text-right pr-4 font-medium">₹{item.amount.toFixed(2)}</td><td className="p-2"><button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody></table></div>
            <button onClick={addItem} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-500 hover:text-blue-400"><PlusCircle size={18} /> Add another line</button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-dashed">
                <div><label className={getLabelClasses()}>Notes / Terms & Conditions</label><textarea name="notes" value={purchase.notes} onChange={handleJournalChange} rows="4" className={getInputClasses()}></textarea></div>
                <div className="space-y-2"><div className="flex justify-between items-center"><span className="font-medium">Sub Total:</span><span>₹{purchase.subTotal.toFixed(2)}</span></div>{purchase.cgst > 0 && <div className="flex justify-between items-center"><span>CGST:</span><span>₹{purchase.cgst.toFixed(2)}</span></div>}{purchase.sgst > 0 && <div className="flex justify-between items-center"><span>SGST:</span><span>₹{purchase.sgst.toFixed(2)}</span></div>}{purchase.igst > 0 && <div className="flex justify-between items-center"><span>IGST:</span><span>₹{purchase.igst.toFixed(2)}</span></div>}<div className={`flex justify-between items-center text-xl font-bold pt-2 border-t ${theme === 'light' ? 'border-gray-300' : 'border-white/20'}`}><span>Total:</span><span>₹{purchase.grandTotal.toFixed(2)}</span></div></div>
            </div>
        </div>
        <footer className={`flex items-center justify-end p-4 space-x-3 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'}`}><button onClick={onClose} className={`px-6 py-2 rounded-md font-semibold transition-colors ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-600 hover:bg-gray-500'}`}>Cancel</button><button className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"><Save size={18} /> Save Journal</button></footer>
      </div>
    </div>
  );
};


// --- Sales Journal Component ---
// Manages and records sales entries.
const SalesJournal = ({ onClose, theme }) => {
  const mockCustomers = [ { id: 1, name: 'Innovate Corp', address: '123 Tech Park, Silicon Valley', gst: '29ABCDE1234F1Z5' }, { id: 2, name: 'Global Traders', address: '456 Commerce St, New York', gst: '07HIJKL5678M2N9' }, { id: 3, name: 'Sunrise Solutions (Salem)', address: '789 Industrial Estate, Salem, Tamil Nadu', gst: '33PQRST9101U3V4' }, ];
  const mockProducts = [ { id: 101, name: 'Cloud Service Subscription', hsn: '998313', rate: 5000 }, { id: 102, name: 'Software Development', hsn: '998314', rate: 12000 }, { id: 103, name: 'Hardware Supply', hsn: '8471', rate: 25000 }, ];
  const [journal, setJournal] = useState({ invoiceNo: 'INV-00125', invoiceDate: new Date().toISOString().split('T')[0], dueDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0], customer: null, billingAddress: '', shippingAddress: '', placeOfSupply: '', items: [{ productId: '', name: '', hsn: '', qty: 1, rate: 0, amount: 0, taxRate: 18 }], notes: 'Thank you for your business.', subTotal: 0, cgst: 0, sgst: 0, igst: 0, grandTotal: 0, });
  const [customerSearch, setCustomerSearch] = useState('');
  const [customerResults, setCustomerResults] = useState([]);
  const [isCustomerDropdownOpen, setIsCustomerDropdownOpen] = useState(false);
  const handleJournalChange = (e) => { const { name, value } = e.target; setJournal(prev => ({ ...prev, [name]: value })); };
  const handleItemChange = (index, e) => {
    const { name, value } = e.target; const items = [...journal.items]; items[index][name] = value;
    if (name === 'productId') {
        const product = mockProducts.find(p => p.id === parseInt(value));
        if (product) { items[index].name = product.name; items[index].hsn = product.hsn; items[index].rate = product.rate; }
    }
    const qty = parseFloat(items[index].qty) || 0; const rate = parseFloat(items[index].rate) || 0; items[index].amount = qty * rate;
    setJournal(prev => ({ ...prev, items }));
  };
  const addItem = () => setJournal(prev => ({ ...prev, items: [...prev.items, { productId: '', name: '', hsn: '', qty: 1, rate: 0, amount: 0, taxRate: 18 }]}));
  const removeItem = (index) => setJournal(prev => ({ ...prev, items: journal.items.filter((_, i) => i !== index) }));
  const handleCustomerSearch = (e) => {
      setCustomerSearch(e.target.value);
      if (e.target.value) { setIsCustomerDropdownOpen(true); setCustomerResults(mockCustomers.filter(c => c.name.toLowerCase().includes(e.target.value.toLowerCase()))); } 
      else { setIsCustomerDropdownOpen(false); setCustomerResults([]); }
  };
  const selectCustomer = (customer) => { setJournal(prev => ({ ...prev, customer, billingAddress: customer.address, shippingAddress: customer.address, placeOfSupply: customer.address.split(',').pop().trim() })); setCustomerSearch(customer.name); setIsCustomerDropdownOpen(false); };
  useEffect(() => {
    const subTotal = journal.items.reduce((acc, item) => acc + item.amount, 0); let cgst = 0, sgst = 0, igst = 0;
    const isInterstate = journal.placeOfSupply.toLowerCase() !== 'tamil nadu';
    journal.items.forEach(item => {
        const tax = (item.amount * (item.taxRate || 0)) / 100;
        if (isInterstate) igst += tax; else { cgst += tax / 2; sgst += tax / 2; }
    });
    const grandTotal = subTotal + cgst + sgst + igst;
    setJournal(prev => ({ ...prev, subTotal, cgst, sgst, igst, grandTotal }));
  }, [journal.items, journal.placeOfSupply]);
  const getBackgroundColor = () => theme === 'light' ? 'bg-white' : (theme === 'dark' ? 'bg-slate-800' : 'bg-zinc-900');
  const getTextColor = () => theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const getInputClasses = () => `w-full px-3 py-2 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'light' ? 'bg-gray-100 border border-gray-300 text-gray-900' : 'bg-gray-700 border border-gray-600 text-gray-100'}`;
  const getLabelClasses = () => `block text-sm font-medium mb-1 ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`;
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${theme === 'light' ? 'bg-gray-500/50' : 'bg-black/50'} backdrop-blur-sm`}>
      <div className={`w-full max-w-6xl h-[95vh] flex flex-col rounded-xl shadow-2xl ${getBackgroundColor()} ${getTextColor()}`}>
        <header className={`flex items-center justify-between p-4 border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}><h2 className="text-xl font-bold">New Sales Journal</h2><button onClick={onClose} className="p-2 rounded-full hover:bg-gray-500/20 transition-colors"><X size={24} /></button></header>
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="md:col-span-2 space-y-4">
              <div className="relative"><label className={getLabelClasses()}>Customer</label><div className="relative"><Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" /><input type="text" value={customerSearch} onChange={handleCustomerSearch} placeholder="Search or Add a Customer" className={`${getInputClasses()} pl-10`} /></div>
                {isCustomerDropdownOpen && customerResults.length > 0 && (<div className={`absolute z-10 w-full mt-1 rounded-md shadow-lg ${theme === 'light' ? 'bg-white' : 'bg-gray-800'} border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'}`}>{customerResults.map(c => (<div key={c.id} onClick={() => selectCustomer(c)} className={`px-4 py-2 cursor-pointer hover:bg-blue-500/20`}><p className="font-semibold">{c.name}</p><p className="text-sm text-gray-400">{c.address}</p></div>))}</div>)}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div><label className={getLabelClasses()}>Billing Address</label><textarea name="billingAddress" value={journal.billingAddress} onChange={handleJournalChange} rows="3" className={getInputClasses()}></textarea></div><div><label className={getLabelClasses()}>Shipping Address</label><textarea name="shippingAddress" value={journal.shippingAddress} onChange={handleJournalChange} rows="3" className={getInputClasses()}></textarea></div></div>
            </div>
            <div className="space-y-4"><div><label className={getLabelClasses()}>Invoice No.</label><input type="text" name="invoiceNo" value={journal.invoiceNo} onChange={handleJournalChange} className={getInputClasses()} /></div><div className="grid grid-cols-2 gap-4"><div><label className={getLabelClasses()}>Invoice Date</label><input type="date" name="invoiceDate" value={journal.invoiceDate} onChange={handleJournalChange} className={getInputClasses()} /></div><div><label className={getLabelClasses()}>Due Date</label><input type="date" name="dueDate" value={journal.dueDate} onChange={handleJournalChange} className={getInputClasses()} /></div></div><div><label className={getLabelClasses()}>Place of Supply (State)</label><input type="text" name="placeOfSupply" value={journal.placeOfSupply} onChange={handleJournalChange} placeholder="e.g., Tamil Nadu" className={getInputClasses()} /></div></div>
          </div>
          <div className="overflow-x-auto"><table className="w-full text-left"><thead className={`${theme === 'light' ? 'bg-gray-50' : 'bg-white/5'}`}><tr><th className="p-3 font-semibold">#</th><th className="p-3 font-semibold w-2/5">Item Details</th><th className="p-3 font-semibold">HSN/SAC</th><th className="p-3 font-semibold">Qty</th><th className="p-3 font-semibold">Rate</th><th className="p-3 font-semibold">Amount</th><th className="p-3 font-semibold"></th></tr></thead><tbody>{journal.items.map((item, index) => (<tr key={index} className={`border-b ${theme === 'light' ? 'border-gray-200' : 'border-white/10'}`}><td className="p-2">{index + 1}</td><td className="p-2"><select name="productId" value={item.productId} onChange={(e) => handleItemChange(index, e)} className={`${getInputClasses()} mb-1`}><option value="">Select Product/Service</option>{mockProducts.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select><input type="text" name="name" placeholder="Description" value={item.name} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2"><input type="text" name="hsn" value={item.hsn} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2"><input type="number" name="qty" value={item.qty} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2"><input type="number" name="rate" value={item.rate} onChange={(e) => handleItemChange(index, e)} className={getInputClasses()} /></td><td className="p-2 text-right pr-4 font-medium">₹{item.amount.toFixed(2)}</td><td className="p-2"><button onClick={() => removeItem(index)} className="p-2 text-red-500 hover:text-red-400"><Trash2 size={18} /></button></td></tr>))}</tbody></table></div>
          <button onClick={addItem} className="mt-4 flex items-center gap-2 px-4 py-2 text-sm font-semibold text-blue-500 hover:text-blue-400"><PlusCircle size={18} /> Add another line</button>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-dashed"><div><label className={getLabelClasses()}>Notes / Terms & Conditions</label><textarea name="notes" value={journal.notes} onChange={handleJournalChange} rows="4" className={getInputClasses()}></textarea></div><div className="space-y-2"><div className="flex justify-between items-center"><span className="font-medium">Sub Total:</span><span>₹{journal.subTotal.toFixed(2)}</span></div>{journal.cgst > 0 && (<div className="flex justify-between items-center"><span>CGST:</span><span>₹{journal.cgst.toFixed(2)}</span></div>)}{journal.sgst > 0 && (<div className="flex justify-between items-center"><span>SGST:</span><span>₹{journal.sgst.toFixed(2)}</span></div>)}{journal.igst > 0 && (<div className="flex justify-between items-center"><span>IGST:</span><span>₹{journal.igst.toFixed(2)}</span></div>)}<div className={`flex justify-between items-center text-xl font-bold pt-2 border-t ${theme === 'light' ? 'border-gray-300' : 'border-white/20'}`}><span>Total:</span><span>₹{journal.grandTotal.toFixed(2)}</span></div></div></div>
        </div>
        <footer className={`flex items-center justify-end p-4 space-x-3 border-t ${theme === 'light' ? 'border-gray-200 bg-gray-50' : 'border-white/10 bg-white/5'}`}><button onClick={onClose} className={`px-6 py-2 rounded-md font-semibold transition-colors ${theme === 'light' ? 'bg-gray-200 hover:bg-gray-300' : 'bg-gray-600 hover:bg-gray-500'}`}>Cancel</button><button className="flex items-center gap-2 px-6 py-2 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"><Save size={18} /> Save Journal</button></footer>
      </div>
    </div>
  );
};

// --- Sidebar Component ---
// Provides navigation for the application.
const Sidebar = ({ isExpanded, onToggle, theme, onCreateClick, setActiveScreen }) => {
    const getBgColor = () => theme === 'light' ? 'bg-white/80' : (theme === 'dark' ? 'bg-slate-900/80' : 'bg-black/80');
    const getTextColor = () => theme === 'light' ? 'text-gray-600' : 'text-gray-400';
    const getHoverColor = () => theme === 'light' ? 'hover:bg-gray-200/50 hover:text-gray-900' : 'hover:bg-white/10 hover:text-white';
    const getActiveColor = () => theme === 'light' ? 'bg-blue-100 text-blue-600' : 'bg-blue-500/10 text-blue-400';
    
    const menuItems = [
        { text: "Sales", action: () => setActiveScreen('salesReport') },
        { text: "Purchases", action: () => setActiveScreen('purchaseReport') },
        { text: "Banking", action: () => setActiveScreen('banking') },
        { text: "Cash Flow", action: () => setActiveScreen('cashTransactions') },
        { text: "Direct Expenses", action: () => setActiveScreen('directExpense') },
        { text: "Indirect Expense", action: () => setActiveScreen('indirectExpense') },
    ];

    const MenuItem = ({ text, action, active = false }) => (
        <a href="#" onClick={(e) => { e.preventDefault(); action(); }} className={`flex items-center gap-3 rounded-md px-3 py-2 transition-all ${getTextColor()} ${getHoverColor()} ${active ? getActiveColor() : ''}`}>
            <span className={`origin-left duration-200 font-semibold ${!isExpanded && "scale-0"}`}>{text}</span>
        </a>
    );

    return (
        <aside className={`fixed top-0 left-0 z-40 h-screen border-r backdrop-blur-lg transition-all duration-300 ${isExpanded ? 'w-64' : 'w-20'} ${theme === 'black' ? 'border-gray-800' : (theme === 'light' ? 'border-gray-200' : 'border-white/10')} ${getBgColor()}`}>
            <nav className="h-full flex flex-col">
                <div className={`p-4 pb-2 flex ${isExpanded ? 'justify-between' : 'justify-center'} items-center`}>
                    <h1 className={`overflow-hidden transition-all text-2xl font-bold ${!isExpanded && "w-0"}`}>OSAS 2063</h1>
                    <button onClick={onToggle} className={`p-2 rounded-md ${getHoverColor()}`}>{isExpanded ? <ChevronsLeft /> : <Menu />}</button>
                </div>
                <div className="flex-1 px-4">
                    <div className="my-4">
                        <button onClick={onCreateClick} className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-md font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors`}>
                            <PlusCircle size={20} />
                            <span className={`${!isExpanded && "hidden"}`}>Create</span>
                        </button>
                    </div>
                    <div className="space-y-1">
                        {menuItems.map(item => <MenuItem key={item.text} text={item.text} action={item.action} />)}
                    </div>
                </div>
            </nav>
        </aside>
    );
}


// --- Command Palette Component ---
// Quick search and command execution tool.
const CommandPalette = ({ isOpen, onClose, onSelectCommand, theme, commands, initialQuery = '' }) => {
  const [search, setSearch] = useState(initialQuery);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);
  const filteredCommands = search ? commands.filter(cmd => cmd.label.toLowerCase().includes(search.toLowerCase())) : commands;
  useEffect(() => { if (isOpen) { setSearch(initialQuery); setTimeout(() => inputRef.current?.focus(), 100); } }, [isOpen, initialQuery]);
  useEffect(() => { setActiveIndex(0); }, [search]);
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex(prev => (prev + 1) % filteredCommands.length); } 
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex(prev => (prev - 1 + filteredCommands.length) % filteredCommands.length); } 
    else if (e.key === 'Enter') { e.preventDefault(); if (filteredCommands[activeIndex]) { onSelectCommand(filteredCommands[activeIndex]); } } 
    else if (e.key === 'Escape') { onClose(); }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className={`w-full max-w-lg mx-auto mt-[15vh] rounded-xl shadow-2xl overflow-hidden ${theme === 'light' ? 'bg-white' : 'bg-slate-800'}`} onClick={e => e.stopPropagation()}>
        <div className="relative"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} /><input ref={inputRef} type="text" placeholder="Type a command or search..." value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} className={`w-full p-4 pl-12 text-lg outline-none ${theme === 'light' ? 'text-gray-800 bg-gray-50' : 'text-gray-100 bg-slate-900'}`} /></div>
        <ul className="p-2 max-h-[40vh] overflow-y-auto">{filteredCommands.length > 0 ? filteredCommands.map((cmd, index) => (<li key={cmd.label} onClick={() => onSelectCommand(cmd)} className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${activeIndex === index ? (theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300') : (theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/5')}`} onMouseEnter={() => setActiveIndex(index)}><span className="font-medium">{cmd.label}</span><span className="text-xs text-gray-400">{cmd.category}</span></li>)) : (<li className="p-4 text-center text-gray-500">No results found.</li>)}</ul>
      </div>
    </div>
  );
};

// --- Period Selector Component ---
// Allows selection of financial period.
const PeriodSelector = ({ theme }) => {
    const [currentDate, setCurrentDate] = useState(new Date(2025, 7, 1)); // Start with Aug 2025
    const [isOpen, setIsOpen] = useState(false);
    const [filter, setFilter] = useState('');
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    const formatMonthYear = (date) => {
        return date.toLocaleString('default', { month: 'short' }) + '-' + date.getFullYear().toString().slice(-2);
    };

    const getFinancialYear = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return month >= 3 ? `${year}-${(year + 1).toString().slice(-2)}` : `${year - 1}-${year.toString().slice(-2)}`;
    };
    
    const generateAllSearchableMonths = () => {
        let allMonths = [];
        const baseDate = new Date(2025, 7, 1);
        for (let i = 0; i < 48; i++) {
            const date = new Date(baseDate);
            date.setMonth(baseDate.getMonth() - i);
            allMonths.push(formatMonthYear(date));
        }
        return allMonths;
    };
    
    const [allSearchableMonths] = useState(generateAllSearchableMonths());

    useEffect(() => { if (isOpen) { setTimeout(() => inputRef.current?.focus(), 0); } }, [isOpen]);
    useEffect(() => {
        const handleClickOutside = (event) => { if (dropdownRef.current && !dropdownRef.current.contains(event.target)) { setIsOpen(false); } };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const changeMonth = (offset) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(currentDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const handleSelectMonth = (monthStr) => {
        const [monthName, yearAbbr] = monthStr.split('-');
        const year = parseInt(`20${yearAbbr}`);
        const monthIndex = new Date(Date.parse(monthName +" 1, 2012")).getMonth();
        setCurrentDate(new Date(year, monthIndex, 1));
        setIsOpen(false); 
        setFilter('');
    };

    const filteredMonths = filter ? allSearchableMonths.filter(m => m.toLowerCase().includes(filter.toLowerCase())) : allSearchableMonths.slice(0, 12);

    const getBgColor = (type) => {
        const colors = { main: theme === 'light' ? 'bg-gray-200' : 'bg-gray-700', dropdown: theme === 'light' ? 'bg-white' : 'bg-gray-800', hover: theme === 'light' ? 'hover:bg-gray-300' : 'hover:bg-gray-600', active: theme === 'light' ? 'bg-blue-100 text-blue-700' : 'bg-blue-500/20 text-blue-300' };
        return colors[type];
    };

    return (
        <div className="relative flex items-center h-10" ref={dropdownRef}>
            <button onClick={() => changeMonth(-1)} className={`p-2 h-full rounded-l-md transition-colors ${getBgColor('main')} ${getBgColor('hover')}`}><ChevronLeft size={20} /></button>
            <div className={`px-3 py-0 h-full flex flex-col justify-center cursor-pointer ${getBgColor('main')}`} onClick={() => setIsOpen(!isOpen)}>
                <p className="text-xs text-center font-semibold leading-tight">{getFinancialYear(currentDate)}</p>
                <p className="text-sm font-bold leading-tight -mt-0.5">{formatMonthYear(currentDate)}</p>
            </div>
            <button onClick={() => changeMonth(1)} className={`p-2 h-full rounded-r-md transition-colors ${getBgColor('main')} ${getBgColor('hover')}`}><ChevronRight size={20} /></button>
            {isOpen && (<div className={`absolute top-full mt-2 w-64 rounded-md shadow-xl z-20 overflow-hidden border ${theme === 'light' ? 'border-gray-200' : 'border-gray-700'} ${getBgColor('dropdown')}`}>
                    <div className="p-2"><input ref={inputRef} type="text" placeholder="Type to filter..." value={filter} onChange={(e) => setFilter(e.target.value)} maxLength="8" className={`w-full px-3 py-2 rounded-md outline-none ${theme === 'light' ? 'bg-gray-100 text-gray-900' : 'bg-gray-700 text-gray-100'}`} /></div>
                    <ul className="max-h-60 overflow-y-auto p-1">{filteredMonths.map(month => (<li key={month} onClick={() => handleSelectMonth(month)} className={`p-2 rounded-md cursor-pointer text-sm ${formatMonthYear(currentDate) === month ? getBgColor('active') : (theme === 'light' ? 'hover:bg-gray-100' : 'hover:bg-white/5')}`}>{month}</li>))}</ul>
            </div>)}
        </div>
    );
};


// --- Main App Component ---
// The root component of the application.
const App = () => {
  const [theme, setTheme] = useState('black');
  const [boldnessLevel, setBoldnessLevel] = useState(3);
  const boldnessClasses = ['font-normal', 'font-medium', 'font-semibold', 'font-bold', 'font-extrabold'];
  const [activeScreen, setActiveScreen] = useState('dashboard');
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [initialCommandQuery, setInitialCommandQuery] = useState('');

  const commands = [
    { label: "Sales Journal", category: "Create New", action: () => setActiveScreen('salesJournal') },
    { label: "Purchase Journal", category: "Create New", action: () => setActiveScreen('purchaseJournal') },
    { label: "Sales Return - Credit Note", category: "Create New", action: () => setActiveScreen('salesReturn') },
    { label: "Purchase Return - Debit Note", category: "Create New", action: () => setActiveScreen('purchaseReturn') },
    { label: "Cash Receipts", category: "Create New", action: () => setActiveScreen('cashReceipts') },
    { label: "Cash Payments", category: "Create New", action: () => setActiveScreen('cashPayments') },
    { label: "Bank Receipts", category: "Create New", action: () => setActiveScreen('bankReceipts') },
    { label: "Stock Flow", category: "Create New", action: () => setActiveScreen('stockFlow') },
    { label: "Direct Expense", category: "Create New", action: () => setActiveScreen('directExpense') },
    { label: "Indirect Expense", category: "Create New", action: () => setActiveScreen('indirectExpense') },
    { label: "General Journal", category: "Create New", action: () => setActiveScreen('generalJournal') },
    { label: "Balance Sheet", category: "Reports", action: () => setActiveScreen('balanceSheetReport') },
    { label: "Profit and Loss Account", category: "Reports", action: () => setActiveScreen('plReport') },
    { label: "Trial Balance", category: "Reports", action: () => setActiveScreen('trialBalance') },
    { label: "Day Book", category: "Reports", action: () => setActiveScreen('dayBook') },
    { label: "GSTR 1", category: "GST Reports", action: () => setActiveScreen('gstr1') },
    { label: "GSTR 2B", category: "GST Reports", action: () => setActiveScreen('gstr2b') },
    { label: "GSTR 3B", category: "GST Reports", action: () => setActiveScreen('gstr3b') },
    { label: "GSTR 9", category: "GST Reports", action: () => setActiveScreen('gstr9') },
  ];

  const handleSelectCommand = (command) => { command.action(); setIsCommandPaletteOpen(false); };
  useEffect(() => {
    const handleKeyDown = (e) => {
        if (e.key === 'k' && (e.metaKey || e.ctrlKey)) { e.preventDefault(); setInitialCommandQuery(''); setIsCommandPaletteOpen(true); return; }
        const targetNodeName = e.target.nodeName; const isTypingInInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(targetNodeName);
        if (!isCommandPaletteOpen && e.key.match(/^[a-zA-Z0-9]$/) && !isTypingInInput && !e.metaKey && !e.ctrlKey) { e.preventDefault(); setInitialCommandQuery(e.key); setIsCommandPaletteOpen(true); }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCommandPaletteOpen]);

  const fontFamilies = ['Inter', 'Roboto', 'Poppins', 'Lato', 'Montserrat'];
  const [fontIndex, setFontIndex] = useState(0);
  const [isFontDropdownOpen, setIsFontDropdownOpen] = useState(false);
  const fontDropdownRef = useRef(null);
  const [isRearrangeMode, setIsRearrangeMode] = useState(false);
  const [draggedCardId, setDraggedCardId] = useState(null);

  const [recentEntries, setRecentEntries] = useState(allPermanentTransactions.slice(0, 3));

  const salesChartData = permanentSales.map(sale => ({
      name: new Date(sale.date).toLocaleString('default', { month: 'short' }),
      sales: sale.amount
  })).reverse();

  const [cards, setCards] = useState([
    { id: 'profit_and_loss', title: 'Profit & Loss', content: { currentMonth: 24580, lastMonthChange: 12.5, lastYearChange: -7.5 }, component: 'ProfitLoss', action: () => setActiveScreen('plReport') },
    { id: 'balance_sheet', title: 'Balance Sheet', content: { totalAssets: 50000, totalLiabilities: 40000, equity: 10000 }, component: 'BalanceSheet', action: () => setActiveScreen('balanceSheetReport') },
    { id: 'cash_flow', title: 'Cash Flow', content: { cashInflow: 32150, cashOutflow: 18420, netCashFlow: 13730 }, component: 'CashFlow', action: () => setActiveScreen('cashTransactions') },
    { id: 'banking', title: 'Banking', content: [{ name: "SBI OD", balance: -1212540 }, { name: "Axis CA", balance: 51560 }], component: 'Banking' },
    { id: 'receivables', title: 'Receivables', content: [{ period: "7 days", amount: 5000 }, { period: "30 days", amount: 15600 }, { period: "Total", amount: 52120 }], component: 'FinancialList' },
    { id: 'payables', title: 'Payables', content: [{ period: "7 days", amount: 5000 }, { period: "30 days", amount: 15600 }, { period: "Total", amount: 52120 }], component: 'FinancialList' },
    { id: 'inventory_summary', title: 'Inventory Summary', content: { items: 240, value: 450200 }, component: 'InventorySummary' },
    { id: 'authorities', title: 'with Authorities', content: [{ type: "GST ITC", amount: 32150 }, { type: "TDS", amount: 18420 }, { type: "Total", amount: 13730 }], component: 'FinancialList', action: () => setActiveScreen('gstr1') },
    { id: 'recent_entries', title: 'Recent Entries / Edits', content: recentEntries, component: 'EntriesList', className: 'lg:col-span-2' },
    { id: 'sales_chart', title: 'Sales', content: salesChartData, component: 'SalesChart', className: 'lg:col-span-2', action: () => setActiveScreen('salesReport') },
  ]);

  useEffect(() => {
    setCards(prevCards => prevCards.map(card => 
        card.id === 'recent_entries' ? { ...card, content: recentEntries } : card
    ));
  }, [recentEntries]);

  useEffect(() => { const handleClickOutside = (event) => { if (fontDropdownRef.current && !fontDropdownRef.current.contains(event.target)) setIsFontDropdownOpen(false); }; document.addEventListener('mousedown', handleClickOutside); return () => document.removeEventListener('mousedown', handleClickOutside); }, []);
  const handleCardDragStart = (e, id) => { if (!isRearrangeMode) { e.preventDefault(); return; } setDraggedCardId(id); e.dataTransfer.effectAllowed = "move"; };
  const handleCardDragOver = (e, id) => { e.preventDefault(); if (!isRearrangeMode || !draggedCardId) return; const draggedOverIndex = cards.findIndex(card => card.id === id); const draggedIndex = cards.findIndex(card => card.id === draggedCardId); if (draggedOverIndex === draggedIndex) return; const newCards = [...cards]; const [reorderedCard] = newCards.splice(draggedIndex, 1); newCards.splice(draggedOverIndex, 0, reorderedCard); setCards(newCards); };
  const handleCardDragEnd = () => setDraggedCardId(null);
  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : prev === 'dark' ? 'black' : 'light'));
  const toggleBold = () => setBoldnessLevel(prev => (prev + 1) % boldnessClasses.length);
  const selectFont = (index) => { setFontIndex(index); setIsFontDropdownOpen(false); };
  const getBackgroundColor = () => theme === 'light' ? 'bg-[#FFF3E7]' : (theme === 'dark' ? 'bg-slate-900' : 'bg-zinc-950');
  const getTextColor = () => theme === 'light' ? 'text-gray-800' : 'text-gray-100';
  const getCardClasses = (isBeingDragged, isRearranging, isClickable) => `backdrop-blur-sm border shadow-lg rounded-md transition-all duration-300 ease-in-out p-6 ${isBeingDragged ? 'opacity-50 z-10' : ''} ${isRearranging ? 'cursor-grab animate-pulse-once' : (isClickable ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl' : '')} ${theme === 'light' ? 'bg-white/50 border-gray-200' : 'bg-white/5 border-white/10'}`;
  const FinancialValue = ({ label, value, valueColor = getTextColor() }) => (<div className="flex justify-between items-center py-1"><span className={theme === 'light' ? "text-gray-600" : "text-gray-400"}>{label}</span><span className={`font-semibold ${valueColor}`}>₹{value.toLocaleString()}</span></div>);
  const EntryItem = ({ type, reference, date, amount, user }) => (
    <tr className={`border-b ${theme === 'light' ? "border-gray-200" : "border-white/10"} last:border-b-0`}>
        <td className="py-2 pr-2 text-sm font-semibold">{type}</td>
        <td className="py-2 pr-2 text-xs">{reference}</td>
        <td className="py-2 pr-2 text-xs text-right">{date}</td>
        <td className={`py-2 pr-2 text-sm font-bold text-right`}>₹{amount.toLocaleString()}</td>
        <td className="py-2 pl-2 text-xs text-right">{user}</td>
    </tr>
  );
  
  const StatCard = ({ card }) => {
    const { title, component, content, className, action } = card;
    const isClickable = !!action;
    const renderContent = () => {
      switch (component) {
        case 'ProfitLoss': return (<><p className="text-3xl font-extrabold text-green-500">₹{content.currentMonth.toLocaleString()}</p><div className="mt-4 text-sm"><p className="text-green-500">+{content.lastMonthChange}% from Jul 25</p><p className="text-red-500">{content.lastYearChange}% from Aug 24</p></div></>);
        case 'BalanceSheet': return (<><FinancialValue label="Total Assets" value={content.totalAssets} /><FinancialValue label="Total Liabilities" value={content.totalLiabilities} /><div className={`w-full h-px my-2 ${theme === 'light' ? "bg-gray-200" : "bg-white/10"}`}></div><FinancialValue label="Equity" value={content.equity} valueColor={theme === 'light' ? "text-blue-600" : "text-blue-400"} /></>);
        case 'CashFlow': return (<><FinancialValue label="Cash Inflow" value={content.cashInflow} valueColor="text-green-500" /><FinancialValue label="Cash Outflow" value={content.cashOutflow} valueColor="text-red-500" /><div className={`w-full h-px my-2 ${theme === 'light' ? "bg-gray-200" : "bg-white/10"}`}></div><FinancialValue label="Net Cash Flow" value={content.netCashFlow} valueColor={theme === 'light' ? "text-blue-600" : "text-blue-400"} /></>);
        case 'Banking': return <div className="space-y-2">{content.map((item, i) => <div key={i} className="flex justify-between items-center"><span>{item.name}</span><span className={`font-semibold ${item.balance < 0 ? 'text-red-500' : ''}`}>₹{item.balance.toLocaleString()}</span></div>)}</div>;
        case 'FinancialList': return content.map((item, i) => <FinancialValue key={i} label={item.period || item.type} value={item.amount} valueColor={item.period === "Total" || item.type === "Total" ? (theme === 'light' ? "text-blue-600" : "text-blue-400") : (i % 2 === 0 ? "text-green-500" : "text-red-500")} />);
        case 'EntriesList': return <div className="overflow-x-auto -mx-6 px-6"><table className="w-full text-left"><thead><tr className="text-xs text-gray-400"><th className="pb-2 pr-2 font-semibold">Type</th><th className="pb-2 pr-2 font-semibold">Reference</th><th className="pb-2 pr-2 font-semibold text-right">Date</th><th className="pb-2 pr-2 font-semibold text-right">Amount</th><th className="pb-2 pl-2 font-semibold text-right">User</th></tr></thead><tbody>{content.map((entry, i) => <EntryItem key={i} {...entry} />)}</tbody></table></div>;
        case 'SalesChart': return (<><p className={`${theme === 'light' ? "text-gray-500" : "text-gray-400"} text-sm mb-4`}>Recent sales trend</p><ResponsiveContainer width="100%" height={200}><LineChart data={content}><CartesianGrid stroke={theme === 'light' ? "#e5e7eb" : "#374151"} strokeDasharray="3 3" /><XAxis dataKey="name" stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} /><YAxis stroke={theme === 'light' ? "#6b7280" : "#9ca3af"} /><Tooltip contentStyle={{ backgroundColor: theme === 'light' ? 'rgba(255, 255, 255, 0.8)' : 'rgba(55, 65, 81, 0.8)', border: 'none', color: theme === 'light' ? '#1f2937' : '#f9fafb' }} /><Line type="monotone" dataKey="sales" stroke={theme === 'light' ? "#4f46e5" : "#8b5cf6"} activeDot={{ r: 8 }} /></LineChart></ResponsiveContainer></>);
        case 'InventorySummary': return <div className="flex justify-around items-center h-full"><div className="text-center"><p className="text-2xl font-bold">{content.items}</p><p className="text-sm text-gray-400">Total Items</p></div><div className="text-center"><p className="text-2xl font-bold">₹{content.value.toLocaleString()}</p><p className="text-sm text-gray-400">Total Value</p></div></div>;
        default: return null;
      }
    };
    return (<div onClick={action} className={`${getCardClasses(draggedCardId === card.id, isRearrangeMode, isClickable)} ${className}`} draggable={isRearrangeMode} onDragStart={(e) => handleCardDragStart(e, card.id)} onDragOver={(e) => handleCardDragOver(e, card.id)} onDragEnd={handleCardDragEnd}><h3 className={`text-lg font-bold mb-4 ${getTextColor()}`}>{title}</h3>{renderContent()}</div>);
  };
  const closeJournal = () => setActiveScreen('dashboard');
  const pageMap = {
    salesReturn: "Sales Return - Credit Note", purchaseReturn: "Purchase Return - Debit Note", cashReceipts: "Cash Receipts", cashPayments: "Cash Payments", bankReceipts: "Bank Receipts", stockFlow: "Stock Flow", directExpense: "Direct Expense", indirectExpense: "Indirect Expense", generalJournal: "General Journal", balanceSheetReport: "Balance Sheet", plReport: "Profit and Loss Account", trialBalance: "Trial Balance", dayBook: "Day Book", gstr1: "GSTR 1", gstr2b: "GSTR 2B", gstr3b: "GSTR 3B", gstr9: "GSTR 9", banking: "Banking"
  };

  return (
    <div className={`min-h-screen flex ${getBackgroundColor()} ${getTextColor()} ${boldnessClasses[boldnessLevel]}`} style={{ fontFamily: fontFamilies[fontIndex] }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Roboto:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&family=Lato:wght@400;500;600;700;800&family=Montserrat:wght@400;500;600;700;800&family=Open+Sans:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;500;600;700;800&family=Nunito:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700;800&family=Merriweather:wght@400;700;900&display=swap'); @keyframes pulse-once { 0%, 100% { transform: scale(1); } 50% { transform: scale(0.98); } } .animate-pulse-once { animation: pulse-once 1s ease-in-out; }`}</style>
      <Sidebar isExpanded={isSidebarExpanded} onToggle={() => setIsSidebarExpanded(!isSidebarExpanded)} theme={theme} onCreateClick={() => {setInitialCommandQuery(''); setIsCommandPaletteOpen(true);}} setActiveScreen={setActiveScreen}/>
      {activeScreen === 'salesJournal' && <SalesJournal onClose={closeJournal} theme={theme} />}
      {activeScreen === 'purchaseJournal' && <PurchaseJournal onClose={closeJournal} theme={theme} />}
      {activeScreen === 'salesReport' && <ReportPage title="Sales Report" data={permanentSales} theme={theme} onClose={closeJournal} />}
      {activeScreen === 'purchaseReport' && <ReportPage title="Purchase Report" data={permanentPurchases} theme={theme} onClose={closeJournal} />}
      {activeScreen === 'cashTransactions' && <ReportPage title="Cash Transactions" data={permanentDirectExpense} theme={theme} onClose={closeJournal} />}
      {Object.keys(pageMap).includes(activeScreen) && <GenericPage title={pageMap[activeScreen]} onClose={closeJournal} theme={theme} />}
      <CommandPalette isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} onSelectCommand={handleSelectCommand} theme={theme} commands={commands} initialQuery={initialCommandQuery}/>
      <main className={`flex-1 transition-all duration-300 ${isSidebarExpanded ? 'ml-64' : 'ml-20'}`}>
        <div className={`p-4 md:p-8 ${activeScreen !== 'dashboard' ? 'blur-sm pointer-events-none' : ''}`}>
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                <h1 className={`text-2xl md:text-3xl font-extrabold ${theme === 'light' ? "text-gray-900" : "text-white"}`}>Accounting Dashboard</h1>
                <div className="flex items-center space-x-2 mt-2 md:mt-0">
                    <button onClick={() => {setInitialCommandQuery(''); setIsCommandPaletteOpen(true);}} className={`p-2 h-10 rounded-md transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}><Search size={20} /></button>
                    <div className="relative" ref={fontDropdownRef}><button onClick={() => setIsFontDropdownOpen(!isFontDropdownOpen)} className={`flex items-center p-2 h-10 rounded-md transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}><Type size={20} /><ChevronDown size={20} className="ml-1" /></button>{isFontDropdownOpen && (<div className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg z-10 py-1 ${theme === 'light' ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"}`} style={{ fontFamily: 'Inter' }}>{fontFamilies.map((font, index) => (<button key={font} onClick={() => selectFont(index)} className={`block w-full text-left px-4 py-2 text-sm transition-colors duration-150 ${theme === 'light' ? 'text-gray-700 hover:bg-gray-100' : 'text-gray-100 hover:bg-gray-700'}`} style={{ fontFamily: font }}>{font}</button>))}</div>)}</div>
                    <button onClick={() => setIsRearrangeMode(!isRearrangeMode)} className={`p-2 h-10 rounded-md transition-colors duration-200 focus:outline-none ${isRearrangeMode ? (theme === 'light' ? 'bg-blue-200 text-blue-800' : 'bg-blue-700 text-blue-100') : (theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100')}`}><LayoutGrid size={20} /></button>
                    <button onClick={toggleBold} className={`relative p-2 h-10 rounded-md transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}><Bold size={20} className={boldnessLevel > 0 ? (theme === 'light' ? "text-blue-600" : "text-blue-400") : ""} strokeWidth={2.5 + boldnessLevel * 0.5} /></button>
                    <button onClick={toggleTheme} className={`relative p-2 h-10 rounded-md transition-colors duration-200 focus:outline-none ${theme === 'light' ? 'bg-gray-200 text-gray-800' : 'bg-gray-700 text-gray-100'}`}>{theme === 'light' ? <Sun size={20} className="text-yellow-500" strokeWidth={3} /> : <Moon size={20} className={theme === 'black' ? 'text-gray-400' : 'text-blue-500'} style={{ transform: 'rotate(270deg)' }} />}</button>
                    <PeriodSelector theme={theme} />
                </div>
            </header>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">{cards.map((card) => <StatCard key={card.id} card={card} />)}</div>
        </div>
      </main>
    </div>
  );
};

export default App;
