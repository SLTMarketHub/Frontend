import React, { useState } from 'react';
import { Search, Send, Paperclip, MoreVertical, Star, Archive, Trash2 } from 'lucide-react';
import Card from '../../components/seller/Card';
import Button from '../../components/seller/Button';
import Layout from '../../components/seller/Layout';
import Header from "../../components/customer/Header";
import Footer from "../../components/customer/Footer";
import { formatDate } from '../../utils/seller/formatters';

const mockMessages = [
  { id: '1', subject: 'Question about my order #ORD-001', sender: 'A1', senderEmail: 'a1@gmail.com', content: "Hi, I placed an order yesterday but haven't received any tracking information yet. Could you please provide an update on my order status?", timestamp: '2025-07-15T10:30:00Z', isRead: false, isStarred: false, type: 'order_issue' },
  { id: '2', subject: 'Product return request', sender: 'B1', senderEmail: 'b1@gmail.com', content: "I received the wireless headphones but they don't fit properly. I would like to initiate a return process. Please let me know the next steps.", timestamp: '2025-08-14T14:22:00Z', isRead: true, isStarred: true, type: 'refund_request' },
  { id: '3', subject: 'Bulk order inquiry', sender: 'C1', senderEmail: 'c1@gmail.com', content: 'We are interested in placing a bulk order for 100 units of your smart fitness watches. Could you provide pricing for bulk purchases and estimated delivery time?', timestamp: '2024-01-13T09:15:00Z', isRead: true, isStarred: false, type: 'customer_inquiry' },
];

const Messages = () => {
  const [messages, setMessages] = useState(mockMessages);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [replyText, setReplyText] = useState('');

  const messageTypes = ['All', 'customer_inquiry', 'order_issue', 'refund_request', 'general'];

  const filteredMessages = messages.filter(message => {
    const matchesSearch = 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.senderEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedType || selectedType === 'All' || message.type === selectedType;
    return matchesSearch && matchesType;
  });

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    if (!message.isRead) {
      setMessages(messages.map(m => m.id === message.id ? { ...m, isRead: true } : m));
    }
  };

  const handleStarToggle = (messageId, e) => {
    e.stopPropagation();
    setMessages(messages.map(m => m.id === messageId ? { ...m, isStarred: !m.isStarred } : m));
  };

  const handleSendReply = () => {
    if (replyText.trim() && selectedMessage) {
      console.log('Sending reply:', replyText);
      setReplyText('');
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'customer_inquiry':
        return 'bg-blue-100 text-blue-800';
      case 'order_issue':
        return 'bg-yellow-100 text-yellow-800';
      case 'refund_request':
        return 'bg-red-100 text-red-800';
      case 'general':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type) => type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());

  const unreadCount = messages.filter(m => !m.isRead).length;
  const starredCount = messages.filter(m => m.isStarred).length;

  return (
    <>
    <Header />
    <Layout>
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Messages</h1>
          <p className="text-gray-600">Communicate with your customers</p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">{unreadCount} unread, {starredCount} starred</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
        <div className="lg:col-span-1">
          <Card className="h-full flex flex-col" padding={false}>
            <div className="p-4 border-b border-gray-200">
              <div className="space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  {messageTypes.map((type) => (
                    <option key={type} value={type === 'All' ? '' : type}>
                      {type === 'All' ? 'All Types' : getTypeLabel(type)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto">
              {filteredMessages.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No messages found</div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      onClick={() => handleMessageClick(message)}
                      className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${selectedMessage?.id === message.id ? 'bg-blue-50 border-r-2 border-blue-500' : ''}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className={`text-sm font-medium ${!message.isRead ? 'text-gray-900' : 'text-gray-600'}`}>{message.sender}</p>
                            {!message.isRead && (<div className="w-2 h-2 bg-blue-500 rounded-full" />)}
                          </div>
                          <p className={`text-sm ${!message.isRead ? 'font-medium text-gray-900' : 'text-gray-600'} truncate`}>{message.subject}</p>
                          <p className="text-xs text-gray-500 mt-1 truncate">{message.content.substring(0, 60)}...</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(message.type)}`}>{getTypeLabel(message.type)}</span>
                            <span className="text-xs text-gray-500">{formatDate(message.timestamp, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                        </div>
                        <button onClick={(e) => handleStarToggle(message.id, e)} className={`ml-2 p-1 rounded hover:bg-gray-100 ${message.isStarred ? 'text-yellow-500' : 'text-gray-400'}`}>
                          <Star className="w-4 h-4" fill={message.isStarred ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="h-full flex flex-col" padding={false}>
            {selectedMessage ? (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-1">{selectedMessage.subject}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <span>From: {selectedMessage.sender}</span>
                        <span>{selectedMessage.senderEmail}</span>
                        <span>{formatDate(selectedMessage.timestamp, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm"><Archive className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm"><Trash2 className="w-4 h-4" /></Button>
                      <Button variant="outline" size="sm"><MoreVertical className="w-4 h-4" /></Button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getTypeColor(selectedMessage.type)}`}>{getTypeLabel(selectedMessage.type)}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                  </div>
                </div>

                <div className="p-6 border-t border-gray-200">
                  <div className="space-y-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your reply..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    />
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm">
                        <Paperclip className="w-4 h-4 mr-2" />
                        Attach File
                      </Button>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" onClick={() => setReplyText('')}>Cancel</Button>
                        <Button onClick={handleSendReply}>
                          <Send className="w-4 h-4 mr-2" />
                          Send Reply
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <Send className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-lg font-medium">Select a message</p>
                  <p className="text-sm">Choose a message from the list to view its contents</p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
    </Layout>
    <Footer />
    </>
  );
};

export default Messages;

