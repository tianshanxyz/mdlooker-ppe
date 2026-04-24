'use client';

import { useState, useRef, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Trash2, Bot, User, Loader2 } from "lucide-react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Navbar from "@/components/Navbar";

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function AIAssistantContent() {
  const t = useTranslations('aiAssistant');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t('categories').map(cat => `- **${cat.name}**: ${cat.desc}`).join('\n\n') + '\n\n' + '请问有什么可以帮您的？',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 调用豆包API
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      });

      if (!response.ok) throw new Error('API request failed');

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.content || '抱歉，我暂时无法回答您的问题，请稍后再试。',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我遇到了一些问题，请稍后再试，或者联系客服获取帮助。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        role: 'assistant',
        content: t('categories').map(cat => `- **${cat.name}**: ${cat.desc}`).join('\n\n') + '\n\n' + '请问有什么可以帮您的？',
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t('title')}</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">{t('subtitle')}</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {/* 左侧分类 */}
            <div className="md:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('categories')[0].name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {t('categories').map((category) => (
                    <Button 
                      key={category.id} 
                      variant="ghost" 
                      className="w-full justify-start text-left h-auto py-2"
                      onClick={() => setInputValue(`我需要${category.name}：`)}
                    >
                      <div>
                        <div className="font-medium">{category.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{category.desc}</div>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t('history')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-500">暂无历史对话</p>
                </CardContent>
              </Card>
            </div>

            {/* 右侧聊天窗口 */}
            <div className="md:col-span-3 flex flex-col h-[70vh]">
              <Card className="flex-1 flex flex-col">
                <CardHeader className="border-b flex flex-row justify-between items-center">
                  <div>
                    <CardTitle className="text-lg">AI合规助手</CardTitle>
                    <CardDescription>基于豆包大模型，回答PPE合规相关问题</CardDescription>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={clearChat}
                    className="flex items-center gap-1 text-gray-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    {t('clearChat')}
                  </Button>
                </CardHeader>

                <CardContent className="flex-1 p-0 overflow-hidden">
                  <ScrollArea className="h-full p-4">
                    <div className="space-y-6">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex gap-3 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
                        >
                          {message.role === 'assistant' && (
                            <div className="h-8 w-8 rounded-full bg-[#339999] flex items-center justify-center flex-shrink-0 mt-1">
                              <Bot className="h-5 w-5 text-white" />
                            </div>
                          )}

                          <div 
                            className={`max-w-[80%] p-4 rounded-lg ${
                              message.role === 'assistant' 
                                ? 'bg-white border border-gray-200 text-gray-800' 
                                : 'bg-[#339999] text-white'
                            }`}
                          >
                            {message.role === 'assistant' ? (
                              <ReactMarkdown remarkPlugins={[remarkGfm]} className="prose prose-sm max-w-none">
                                {message.content}
                              </ReactMarkdown>
                            ) : (
                              <p className="whitespace-pre-wrap">{message.content}</p>
                            )}
                          </div>

                          {message.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0 mt-1">
                              <User className="h-5 w-5 text-gray-700" />
                            </div>
                          )}
                        </div>
                      ))}

                      {isLoading && (
                        <div className="flex gap-3 justify-start">
                          <div className="h-8 w-8 rounded-full bg-[#339999] flex items-center justify-center flex-shrink-0 mt-1">
                            <Bot className="h-5 w-5 text-white" />
                          </div>
                          <div className="bg-white border border-gray-200 p-4 rounded-lg flex items-center gap-2">
                            <Loader2 className="h-4 w-4 animate-spin text-[#339999]" />
                            <span className="text-gray-600 text-sm">{t('loading')}</span>
                          </div>
                        </div>
                      )}

                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>

                <div className="border-t p-4">
                  <div className="flex gap-3">
                    <Input
                      placeholder={t('inputPlaceholder')}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      disabled={isLoading}
                      className="flex-1"
                    />
                    <Button 
                      className="bg-[#339999] hover:bg-[#2d8a8a] text-white px-6"
                      onClick={handleSend}
                      disabled={isLoading || !inputValue.trim()}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          {t('send')}
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    AI回答仅供参考，具体合规要求请以官方法规为准
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}