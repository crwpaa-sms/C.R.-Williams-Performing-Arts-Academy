import React, { useState } from 'react';
import { Payment, UserRole } from '../types';
import { CreditCard, Search, Plus, CheckCircle, AlertCircle, Clock, Edit2, Trash2, Save, X, ArrowUpDown, FileText, Printer, Mail } from 'lucide-react';

interface PaymentsProps {
  role: UserRole;
  payments: Payment[];
  setPayments: React.Dispatch<React.SetStateAction<Payment[]>>;
}

type SortField = 'date' | 'amount' | 'status' | 'studentName';

const Payments: React.FC<PaymentsProps> = ({ role, payments, setPayments }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Payment>>({});
  const [isAdding, setIsAdding] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Document Viewing State
  const [viewingDocument, setViewingDocument] = useState<{ type: 'INVOICE' | 'RECEIPT', payment: Payment } | null>(null);

  const isAdmin = role === 'ADMIN';

  // If student, only show their mock data
  const displayPayments = isAdmin ? payments : payments.filter(p => p.studentName === 'Dexena Dharangit'); // Mock logged in student match

  const filteredPayments = displayPayments.filter(p => 
    p.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    // Handle optional fields
    if (valA === undefined) valA = '';
    if (valB === undefined) valB = '';

    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const totalDue = displayPayments.filter(p => p.status !== 'Paid').reduce((acc, curr) => acc + curr.amount, 0);

  const handleAddNew = () => {
    setIsAdding(true);
    setEditingId('new');
    setEditForm({
      studentName: '',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      method: 'Cash'
    });
  };

  const savePayment = () => {
    if (isAdding) {
      const newPayment: Payment = {
        id: (payments.length + 1).toString(),
        studentId: '99', // Mock
        studentName: editForm.studentName || 'Unknown',
        amount: editForm.amount || 0,
        description: editForm.description || 'Fee',
        date: editForm.date || new Date().toISOString().split('T')[0],
        status: editForm.status || 'Pending',
        method: editForm.method || 'Cash'
      } as Payment;
      setPayments([...payments, newPayment]);
      setIsAdding(false);
    } else {
      setPayments(prev => prev.map(p => p.id === editingId ? { ...p, ...editForm } as Payment : p));
    }
    setEditingId(null);
    setEditForm({});
  };

  const deletePayment = (id: string) => {
    if (window.confirm("Delete this payment record?")) {
      setPayments(prev => prev.filter(p => p.id !== id));
    }
  };

  const generateDocument = (type: 'INVOICE' | 'RECEIPT', payment: Payment) => {
    if (type === 'RECEIPT' && payment.status !== 'Paid') {
      alert("Receipts can only be generated for paid items.");
      return;
    }
    setViewingDocument({ type, payment });
  };

  const handleEmail = (payment: Payment) => {
    alert(`Sending email to ${payment.studentName} for amount $${payment.amount}... (Simulation)`);
  };

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* Document Modal (Printable) */}
      {viewingDocument && (
        <div className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 print:p-0 print:bg-white print:absolute print:inset-0">
          <div className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden print:shadow-none print:w-full print:max-w-none print:rounded-none">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center print:hidden bg-slate-50">
              <h3 className="font-bold text-slate-700">Generated {viewingDocument.type === 'INVOICE' ? 'Invoice' : 'Receipt'}</h3>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="flex items-center gap-2 px-3 py-1 bg-[#8e44ad] text-white rounded hover:bg-[#4a235a]">
                  <Printer size={16}/> Print
                </button>
                <button onClick={() => setViewingDocument(null)} className="p-1 bg-slate-200 text-slate-600 rounded hover:bg-slate-300">
                  <X size={20}/>
                </button>
              </div>
            </div>
            
            <div className="p-12 print:p-8" id="printable-area">
               {/* Document Header */}
               <div className="flex justify-between items-start mb-12">
                  <div>
                     <h1 className="text-3xl font-bold text-[#4a235a] mb-2">C.R.Williams</h1>
                     <p className="text-sm text-slate-500 font-bold uppercase tracking-widest">Performing Arts Academy</p>
                     <div className="mt-4 text-sm text-slate-600">
                        <p>La Sagesse, St. David</p>
                        <p>Grenada, W.I.</p>
                        <p>contact@crwilliams.edu</p>
                     </div>
                  </div>
                  <div className="text-right">
                     <h2 className="text-4xl font-bold text-slate-200 uppercase tracking-widest">{viewingDocument.type}</h2>
                     <p className="font-mono text-slate-500 mt-2">#{viewingDocument.payment.id.padStart(6, '0')}</p>
                     <p className="text-sm font-bold text-slate-700 mt-1">Date: {new Date().toLocaleDateString()}</p>
                  </div>
               </div>

               {/* Bill To */}
               <div className="mb-12">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Bill To</h4>
                  <p className="text-xl font-bold text-slate-800">{viewingDocument.payment.studentName}</p>
                  <p className="text-slate-600">Student ID: {viewingDocument.payment.studentId}</p>
               </div>

               {/* Line Items */}
               <table className="w-full mb-12">
                  <thead>
                     <tr className="border-b-2 border-[#8e44ad]">
                        <th className="text-left py-2 font-bold text-[#4a235a]">Description</th>
                        <th className="text-right py-2 font-bold text-[#4a235a]">Amount</th>
                     </tr>
                  </thead>
                  <tbody>
                     <tr className="border-b border-slate-100">
                        <td className="py-4 text-slate-700">{viewingDocument.payment.description}</td>
                        <td className="py-4 text-right font-mono font-medium">${viewingDocument.payment.amount.toFixed(2)}</td>
                     </tr>
                  </tbody>
               </table>

               {/* Total */}
               <div className="flex justify-end mb-12">
                  <div className="text-right w-1/2">
                     <div className="flex justify-between py-2 border-b border-slate-200">
                        <span className="font-bold text-slate-600">Subtotal</span>
                        <span className="font-mono">${viewingDocument.payment.amount.toFixed(2)}</span>
                     </div>
                     <div className="flex justify-between py-2">
                        <span className="font-bold text-[#4a235a] text-lg">Total</span>
                        <span className="font-mono text-2xl font-bold text-[#4a235a]">${viewingDocument.payment.amount.toFixed(2)}</span>
                     </div>
                  </div>
               </div>
               
               {/* Footer */}
               {viewingDocument.type === 'RECEIPT' && (
                  <div className="border-2 border-emerald-500 text-emerald-600 px-6 py-4 rounded-lg inline-block font-bold uppercase tracking-widest transform -rotate-12 mb-8 opacity-80">
                     PAID IN FULL
                  </div>
               )}
               
               <div className="text-center text-xs text-slate-400 mt-12 border-t border-slate-100 pt-8">
                  <p>Thank you for your business. Please contact the administration for any inquiries.</p>
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Main UI */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
           <h2 className="text-2xl font-bold text-slate-800 flex items-center">
             <CreditCard className="mr-2 text-indigo-600" />
             {isAdmin ? 'Billing & Payments' : 'My Tuition & Fees'}
           </h2>
        </div>
        
        {!isAdmin && (
           <div className="flex items-center gap-4 bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm">
              <div className="text-right">
                 <p className="text-xs text-slate-500 font-bold uppercase">Balance Due</p>
                 <p className="text-xl font-bold text-slate-800">${totalDue.toFixed(2)}</p>
              </div>
              <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700">
                Pay Now
              </button>
           </div>
        )}

        {isAdmin && !isAdding && (
          <button 
            onClick={handleAddNew}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Plus size={18} />
            <span>New Transaction</span>
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden print:hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/50">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={isAdmin ? "Search by student or description..." : "Search history..."}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 font-medium text-sm">
              <tr>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('date')}>
                  <div className="flex items-center">Date <ArrowUpDown size={14} className="ml-1"/></div>
                </th>
                {isAdmin && (
                  <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('studentName')}>
                    <div className="flex items-center">Student <ArrowUpDown size={14} className="ml-1"/></div>
                  </th>
                )}
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('amount')}>
                  <div className="flex items-center">Amount <ArrowUpDown size={14} className="ml-1"/></div>
                </th>
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-100" onClick={() => handleSort('status')}>
                  <div className="flex items-center">Status <ArrowUpDown size={14} className="ml-1"/></div>
                </th>
                {isAdmin && <th className="px-6 py-4 text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
               {isAdding && (
                 <tr className="bg-indigo-50/30">
                   <td className="px-6 py-4">
                      <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="border rounded p-1 text-sm bg-white" />
                   </td>
                   <td className="px-6 py-4">
                      <input placeholder="Student Name" value={editForm.studentName} onChange={e => setEditForm({...editForm, studentName: e.target.value})} className="border rounded p-1 text-sm w-full bg-white" />
                   </td>
                   <td className="px-6 py-4">
                      <input placeholder="Description" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border rounded p-1 text-sm w-full bg-white" />
                   </td>
                   <td className="px-6 py-4">
                      <select value={editForm.method} onChange={e => setEditForm({...editForm, method: e.target.value})} className="border rounded p-1 text-sm bg-white w-full">
                        <option>Cash</option>
                        <option>Credit Card</option>
                        <option>Bank Transfer</option>
                        <option>Check</option>
                        <option>Online</option>
                      </select>
                   </td>
                   <td className="px-6 py-4">
                      <input type="number" placeholder="0.00" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: parseFloat(e.target.value)})} className="border rounded p-1 text-sm w-24 bg-white" />
                   </td>
                   <td className="px-6 py-4">
                      <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as any})} className="border rounded p-1 text-sm bg-white">
                        <option>Pending</option>
                        <option>Paid</option>
                        <option>Overdue</option>
                      </select>
                   </td>
                   <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                         <button onClick={savePayment} className="text-emerald-600"><Save size={18}/></button>
                         <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-slate-400"><X size={18}/></button>
                      </div>
                   </td>
                 </tr>
               )}

               {sortedPayments.map(payment => {
                 const isEditing = editingId === payment.id;
                 return (
                  <tr key={payment.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-600 text-sm">
                       {isEditing ? <input type="date" value={editForm.date} onChange={e => setEditForm({...editForm, date: e.target.value})} className="border rounded p-1 text-sm" /> : payment.date}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 font-medium text-slate-800">
                         {isEditing ? <input value={editForm.studentName} onChange={e => setEditForm({...editForm, studentName: e.target.value})} className="border rounded p-1 text-sm w-full" /> : payment.studentName}
                      </td>
                    )}
                    <td className="px-6 py-4 text-slate-600">
                        {isEditing ? <input value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} className="border rounded p-1 text-sm w-full" /> : payment.description}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-sm">
                        {isEditing ? (
                          <select value={editForm.method || 'Cash'} onChange={e => setEditForm({...editForm, method: e.target.value})} className="border rounded p-1 text-sm w-full">
                            <option>Cash</option>
                            <option>Credit Card</option>
                            <option>Bank Transfer</option>
                            <option>Check</option>
                            <option>Online</option>
                          </select>
                        ) : (
                          payment.method || '-'
                        )}
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">
                        {isEditing ? <input type="number" value={editForm.amount} onChange={e => setEditForm({...editForm, amount: parseFloat(e.target.value)})} className="border rounded p-1 text-sm w-24" /> : `$${payment.amount.toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4">
                       {isEditing ? (
                         <select value={editForm.status} onChange={e => setEditForm({...editForm, status: e.target.value as any})} className="border rounded p-1 text-sm">
                            <option>Pending</option>
                            <option>Paid</option>
                            <option>Overdue</option>
                          </select>
                       ) : (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border
                          ${payment.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                            payment.status === 'Overdue' ? 'bg-red-50 text-red-700 border-red-100' : 
                            'bg-amber-50 text-amber-700 border-amber-100'}`}>
                          {payment.status === 'Paid' && <CheckCircle size={12} className="mr-1" />}
                          {payment.status === 'Overdue' && <AlertCircle size={12} className="mr-1" />}
                          {payment.status === 'Pending' && <Clock size={12} className="mr-1" />}
                          {payment.status}
                        </span>
                       )}
                    </td>
                    {isAdmin && (
                      <td className="px-6 py-4 text-right">
                         <div className="flex justify-end gap-2">
                           {isEditing ? (
                              <>
                                <button onClick={savePayment} className="text-emerald-600 hover:bg-emerald-50 p-1 rounded"><Save size={18}/></button>
                                <button onClick={() => setEditingId(null)} className="text-slate-400 hover:bg-slate-100 p-1 rounded"><X size={18}/></button>
                              </>
                           ) : (
                              <>
                                <button onClick={() => handleEmail(payment)} className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1 rounded" title="Email Student"><Mail size={18}/></button>
                                <button 
                                  onClick={() => generateDocument(payment.status === 'Paid' ? 'RECEIPT' : 'INVOICE', payment)} 
                                  className="text-slate-400 hover:text-purple-600 hover:bg-purple-50 p-1 rounded" 
                                  title="Generate Document"
                                >
                                  <FileText size={18}/>
                                </button>
                                <button onClick={() => { setEditingId(payment.id); setEditForm(payment); }} className="text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 p-1 rounded"><Edit2 size={18}/></button>
                                <button onClick={() => deletePayment(payment.id)} className="text-slate-400 hover:text-red-600 hover:bg-red-50 p-1 rounded"><Trash2 size={18}/></button>
                              </>
                           )}
                         </div>
                      </td>
                    )}
                  </tr>
                 );
               })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Payments;