"use client";

import { useState, useEffect, useRef } from "react";
import {
  Search,
  Send,
  Clock,
  MoreHorizontal,
  MessageSquare,
  ArrowDown,
  Mic,
  Image as ImageIcon,
  Phone,
  Video,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAdminLanguage } from "@/context/admin-language-context";
import { useIsMobile } from "@/hooks/use-is-mobile";
import { useAuth } from "@/context/auth-context";

// Chat message type
type Message = {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  attachmentType?: "image" | "audio" | "video";
  attachmentUrl?: string;
};

// Chat conversation type
type Conversation = {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: boolean;
  messages: Message[];
};

export default function AdminChatPage() {
  const { t } = useAdminLanguage();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const { user } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] =
    useState<Conversation | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [filteredConversations, setFilteredConversations] = useState<
    Conversation[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<BlobPart[]>([]);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [callType, setCallType] = useState<"audio" | "video" | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pcRef = useRef<RTCPeerConnection | null>(null);

  const getSignalKeyPrefix = (userId: number) => `rtcSignal_${userId}`
  const sendSignal = (userId: number, data: any) => {
    try {
      const key = `${getSignalKeyPrefix(userId)}_${Date.now()}_${Math.random().toString(36).slice(2)}`
      localStorage.setItem(key, JSON.stringify(data))
      // Cleanup shortly after to avoid storage bloat
      setTimeout(() => localStorage.removeItem(key), 2000)
    } catch (e) {
      console.error("Failed to send signal", e)
    }
  }
  const createPeerConnection = (userId: number) => {
    const pc = new RTCPeerConnection({ iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }] })
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(userId, { role: "admin", type: "candidate", candidate: event.candidate })
      }
    }
    pc.ontrack = (event) => {
      const [stream] = event.streams
      const video = remoteVideoRef.current
      if (video && stream) {
        video.srcObject = stream
        video.play().catch(() => {})
      }
    }
    pcRef.current = pc
    return pc
  }

  useEffect(() => {
    const onStorage = async (e: StorageEvent) => {
      if (!activeConversation) return
      if (!e.key || !e.newValue) return
      if (!e.key.startsWith(getSignalKeyPrefix(activeConversation.userId))) return
      try {
        const msg = JSON.parse(e.newValue)
        if (msg.role !== "user") return
        if (msg.type === "answer") {
          if (pcRef.current) {
            await pcRef.current.setRemoteDescription(new RTCSessionDescription(msg.sdp))
          }
        } else if (msg.type === "candidate") {
          if (pcRef.current && msg.candidate) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(msg.candidate))
            } catch (err) {
              console.error("Failed to add ICE candidate", err)
            }
          }
        } else if (msg.type === "end") {
          handleEndCall()
        }
      } catch (err) {
        console.error("Failed to parse signal", err)
      }
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [activeConversation])

  // Load conversations from localStorage
  useEffect(() => {
    try {
      // Get all registered users
      const allUsers = JSON.parse(
        localStorage.getItem("registeredUsers") || "[]"
      );

      // Load all user chats
      const loadedConversations: Conversation[] = [];

      allUsers.forEach((user: any) => {
        const userChatKey = `userChat_${user.id}`;
        const userChat = localStorage.getItem(userChatKey);

        if (userChat) {
          const messages = JSON.parse(userChat) as Message[];

          if (messages.length > 0) {
            const lastMessage = messages[messages.length - 1];

            loadedConversations.push({
              id: user.id,
              userId: user.id,
              userName: user.name,
              userAvatar: user.avatar || "/placeholder.svg?height=40&width=40",
              lastMessage:
                lastMessage.content ||
                (lastMessage.attachmentType ? lastMessage.attachmentType : ""),
              lastMessageTime: lastMessage.timestamp,
              unread: !lastMessage.isAdmin, // Mark as unread if last message is from user
              messages: messages,
            });
          }
        }
      });

      // Sort conversations by last message time (newest first)
      loadedConversations.sort(
        (a, b) =>
          new Date(b.lastMessageTime).getTime() -
          new Date(a.lastMessageTime).getTime()
      );

      if (loadedConversations.length > 0) {
        setConversations(loadedConversations);
        setFilteredConversations(loadedConversations);
        setActiveConversation(loadedConversations[0]);
      } else {
        // Sample data if no conversations found
        const sampleConversations: Conversation[] = [
          {
            id: 1,
            userId: 101,
            userName: "Alisher Karimov",
            userAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Kursni boshlash uchun qanday qilishim kerak?",
            lastMessageTime: "2023-11-10T14:30:00",
            unread: true,
            messages: [
              {
                id: 1,
                userId: 101,
                userName: "Alisher Karimov",
                userAvatar: "/placeholder.svg?height=40&width=40",
                content: "Salom, IT English kursiga qanday yozilsam bo'ladi?",
                timestamp: "2023-11-10T14:25:00",
                isAdmin: false,
              },
              {
                id: 2,
                userId: 1,
                userName: "Admin",
                userAvatar: "/placeholder.svg?height=40&width=40&text=A",
                content:
                  "Salom Alisher! Kursga yozilish uchun ro'yxatdan o'tib, kerakli kursni tanlab, to'lovni amalga oshirishingiz kerak.",
                timestamp: "2023-11-10T14:28:00",
                isAdmin: true,
              },
              {
                id: 3,
                userId: 101,
                userName: "Alisher Karimov",
                userAvatar: "/placeholder.svg?height=40&width=40",
                content: "Kursni boshlash uchun qanday qilishim kerak?",
                timestamp: "2023-11-10T14:30:00",
                isAdmin: false,
              },
            ],
          },
          {
            id: 2,
            userId: 102,
            userName: "Malika Umarova",
            userAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Rahmat, tushundim!",
            lastMessageTime: "2023-11-09T16:45:00",
            unread: false,
            messages: [
              {
                id: 1,
                userId: 102,
                userName: "Malika Umarova",
                userAvatar: "/placeholder.svg?height=40&width=40",
                content: "Kursni tugatgandan so'ng sertifikat beriladi?",
                timestamp: "2023-11-09T16:40:00",
                isAdmin: false,
              },
              {
                id: 2,
                userId: 1,
                userName: "Admin",
                userAvatar: "/placeholder.svg?height=40&width=40&text=A",
                content:
                  "Ha, albatta. Kursni muvaffaqiyatli tugatganingizdan so'ng sertifikat beriladi.",
                timestamp: "2023-11-09T16:42:00",
                isAdmin: true,
              },
              {
                id: 3,
                userId: 102,
                userName: "Malika Umarova",
                userAvatar: "/placeholder.svg?height=40&width=40",
                content: "Rahmat, tushundim!",
                timestamp: "2023-11-09T16:45:00",
                isAdmin: false,
              },
            ],
          },
          {
            id: 3,
            userId: 103,
            userName: "Bobur Aliyev",
            userAvatar: "/placeholder.svg?height=40&width=40",
            lastMessage: "Qachon yangi kurslar qo'shiladi?",
            lastMessageTime: "2023-11-08T10:15:00",
            unread: false,
            messages: [
              {
                id: 1,
                userId: 103,
                userName: "Bobur Aliyev",
                userAvatar: "/placeholder.svg?height=40&width=40",
                content: "Salom, yangi kurslar haqida ma'lumot bera olasizmi?",
                timestamp: "2023-11-08T10:10:00",
                isAdmin: false,
              },
              {
                id: 2,
                userId: 1,
                userName: "Admin",
                userAvatar: "/placeholder.svg?height=40&width=40&text=A",
                content:
                  "Salom Bobur! Yangi kurslar haqida ma'lumotni veb-saytimizda e'lon qilamiz.",
                timestamp: "2023-11-08T10:12:00",
                isAdmin: true,
              },
              {
                id: 3,
                userId: 103,
                userName: "Bobur Aliyev",
                userAvatar: "/placeholder.svg?height=40&width=40",
                content: "Qachon yangi kurslar qo'shiladi?",
                timestamp: "2023-11-08T10:15:00",
                isAdmin: false,
              },
            ],
          },
        ];
        setConversations(sampleConversations);
        setFilteredConversations(sampleConversations);
        setActiveConversation(sampleConversations[0]);
      }
    } catch (error) {
      console.error("Failed to load conversations:", error);
      toast({
        title: t("error"),
        description: t("failedToLoadConversations"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [t, toast]);

  // Check for scroll position to show/hide scroll button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);

      // If user scrolls up, count unread messages
      if (!isNearBottom && activeConversation) {
        const unreadMessages = activeConversation.messages.filter(
          (msg) =>
            !msg.isAdmin &&
            new Date(msg.timestamp) > new Date(Date.now() - 60000)
        ).length;
        setUnreadCount(unreadMessages);
      } else {
        setUnreadCount(0);
      }
    };

    scrollArea.addEventListener("scroll", handleScroll);
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, [activeConversation]);

  // Scroll to bottom of messages when active conversation changes or new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeConversation]);

  // Filter conversations when search query changes
  useEffect(() => {
    if (searchQuery) {
      const filtered = conversations.filter((conversation) =>
        conversation.userName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredConversations(filtered);
    } else {
      setFilteredConversations(conversations);
    }
  }, [searchQuery, conversations]);

  const persistActiveConversation = (updated: Conversation) => {
    setActiveConversation(updated);
    setConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    setFilteredConversations((prev) =>
      prev.map((c) => (c.id === updated.id ? updated : c))
    );
    const userChatKey = `userChat_${updated.userId}`;
    localStorage.setItem(userChatKey, JSON.stringify(updated.messages));
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation || !user) return;

    const newMessageObj: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: true,
    };

    const updatedActiveConversation = {
      ...activeConversation,
      lastMessage: newMessage,
      lastMessageTime: new Date().toISOString(),
      unread: false,
      messages: [...activeConversation.messages, newMessageObj],
    };

    persistActiveConversation(updatedActiveConversation);
    setNewMessage("");
  };

  // Handle selecting a conversation
  const handleSelectConversation = (conversation: Conversation) => {
    const updatedConversations = conversations.map((c) => {
      if (c.id === conversation.id && c.unread) {
        return { ...c, unread: false };
      }
      return c;
    });
    setConversations(updatedConversations);
    setFilteredConversations(
      filteredConversations.map((c) => {
        if (c.id === conversation.id && c.unread) {
          return { ...c, unread: false };
        }
        return c;
      })
    );
    setActiveConversation(conversation);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for conversation list
  const formatConversationDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else if (date.toDateString() === yesterday.toDateString()) {
      return t("yesterday");
    } else {
      return date.toLocaleDateString();
    }
  };

  // Scroll to bottom function
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      setUnreadCount(0);
    }
  };

  const handleUploadImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file || !activeConversation || !user) return;

    const url = URL.createObjectURL(file);

    const imageMessage: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: "",
      timestamp: new Date().toISOString(),
      isAdmin: true,
      attachmentType: "image",
      attachmentUrl: url,
    };

    const updated = {
      ...activeConversation,
      lastMessage: "[image]",
      lastMessageTime: new Date().toISOString(),
      unread: false,
      messages: [...activeConversation.messages, imageMessage],
    };

    persistActiveConversation(updated);
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStartAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        if (activeConversation && user) {
          const audioMessage: Message = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: "",
            timestamp: new Date().toISOString(),
            isAdmin: true,
            attachmentType: "audio",
            attachmentUrl: url,
          };
          const updated = {
            ...activeConversation,
            lastMessage: "[audio]",
            lastMessageTime: new Date().toISOString(),
            unread: false,
            messages: [...activeConversation.messages, audioMessage],
          };
          persistActiveConversation(updated);
        }
        setIsRecordingAudio(false);
      };

      recorder.start();
      setIsRecordingAudio(true);
    } catch (err) {
      console.error(err);
      toast({ title: t("error"), description: t("microphoneAccessDenied") });
    }
  };

  const handleStopAudioRecording = () => {
    mediaRecorderRef.current?.stop();
  };

  const handleStartCall = async (type: "audio" | "video") => {
    try {
      const constraints = type === "video" ? { video: true, audio: true } : { audio: true }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      localStreamRef.current = stream
      setIsInCall(true)
      setCallType(type)
      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = stream
        await localVideoRef.current.play().catch(() => {})
      }
      if (!activeConversation) return
      const pc = createPeerConnection(activeConversation.userId)
      // add local tracks
      stream.getTracks().forEach((track) => pc.addTrack(track, stream))
      // create and send offer
      const offer = await pc.createOffer()
      await pc.setLocalDescription(offer)
      sendSignal(activeConversation.userId, { role: "admin", type: "offer", sdp: offer, callType: type })
    } catch (err) {
      console.error(err)
      toast({ title: t("error"), description: t("failedToStartCall") })
    }
  }

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop())
    localStreamRef.current = null
    if (pcRef.current) {
      try {
        pcRef.current.getSenders().forEach((s) => s.track && s.track.stop())
        pcRef.current.close()
      } catch {}
    }
    if (activeConversation) {
      sendSignal(activeConversation.userId, { role: "admin", type: "end" })
    }
    setIsInCall(false)
    setCallType(null)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-bold tracking-tight">{t("chat")}</h2>
      </div>

      <Card className="admin-card">
        <CardHeader className="p-3">
          <CardTitle className="text-base">{t("supportChat")}</CardTitle>
          <CardDescription className="text-xs">
            {t("chatWithStudents")}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Tabs defaultValue="all" className="w-full">
            <div className="border-b px-3">
              <TabsList className="h-9">
                <TabsTrigger value="all" className="text-xs h-8">
                  {t("allChats")}
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs h-8">
                  {t("unread")}
                </TabsTrigger>
                <TabsTrigger value="archived" className="text-xs h-8">
                  {t("archived")}
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="all" className="m-0">
              <div className="grid md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] h-[600px] border-b">
                {/* Conversations List */}
                <div className="border-r flex flex-col h-full">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-2 top-1.5 h-3 w-3 text-muted-foreground" />
                      <Input
                        placeholder={t("searchConversations")}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-7 h-7 text-xs"
                      />
                    </div>
                  </div>

                  <ScrollArea className="flex-1">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-muted-foreground">
                          {t("loading")}
                        </p>
                      </div>
                    ) : filteredConversations.length > 0 ? (
                      filteredConversations.map((conversation) => (
                        <div
                          key={conversation.id}
                          className={`p-2 border-b cursor-pointer hover:bg-muted/50 transition-colors ${
                            activeConversation?.id === conversation.id
                              ? "bg-muted"
                              : ""
                          } ${conversation.unread ? "bg-primary/5" : ""}`}
                          onClick={() => handleSelectConversation(conversation)}
                        >
                          <div className="flex items-start gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarImage
                                src={conversation.userAvatar}
                                alt={conversation.userName}
                              />
                              <AvatarFallback>
                                {conversation.userName.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p
                                  className={`text-xs font-medium truncate ${
                                    conversation.unread ? "font-bold" : ""
                                  }`}
                                >
                                  {conversation.userName}
                                </p>
                                <span className="text-[10px] text-muted-foreground">
                                  {formatConversationDate(
                                    conversation.lastMessageTime
                                  )}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground truncate">
                                {conversation.lastMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-muted-foreground">
                          {t("noConversationsFound")}
                        </p>
                      </div>
                    )}
                  </ScrollArea>
                </div>

                {/* Chat Area */}
                {activeConversation ? (
                  <div className="flex flex-col h-full relative">
                    {/* Chat Header */}
                    <div className="p-3 border-b flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage
                            src={activeConversation.userAvatar}
                            alt={activeConversation.userName}
                          />
                          <AvatarFallback>
                            {activeConversation.userName.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium">
                            {activeConversation.userName}
                          </p>
                          <div className="flex items-center">
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
                            <p className="text-[10px] text-muted-foreground">
                              {t("online")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleStartCall("audio")}
                        >
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => handleStartCall("video")}
                        >
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
                      <div className="space-y-3">
                        {activeConversation.messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${
                              message.isAdmin ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`flex items-start gap-2 max-w-[80%] ${
                                message.isAdmin ? "flex-row-reverse" : ""
                              }`}
                            >
                              {!message.isAdmin && (
                                <Avatar className="h-6 w-6 mt-0.5">
                                  <AvatarImage
                                    src={message.userAvatar}
                                    alt={message.userName}
                                  />
                                  <AvatarFallback>
                                    {message.userName.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              )}
                              <div
                                className={`rounded-lg p-2 text-xs ${
                                  message.isAdmin
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                }`}
                              >
                                {message.attachmentType === "image" &&
                                message.attachmentUrl ? (
                                  <img
                                    src={message.attachmentUrl}
                                    alt="image"
                                    className="rounded-md max-w-[220px] mb-1"
                                  />
                                ) : null}
                                {message.attachmentType === "audio" &&
                                message.attachmentUrl ? (
                                  <audio
                                    src={message.attachmentUrl}
                                    controls
                                    className="w-[220px] mb-1"
                                  />
                                ) : null}
                                {message.attachmentType === "video" &&
                                message.attachmentUrl ? (
                                  <video
                                    src={message.attachmentUrl}
                                    controls
                                    className="w-[220px] rounded mb-1"
                                  />
                                ) : null}
                                {message.content ? (
                                  <p>{message.content}</p>
                                ) : null}
                                <div
                                  className={`flex items-center mt-1 text-[10px] ${
                                    message.isAdmin
                                      ? "text-primary-foreground/70"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  <Clock className="h-2 w-2 mr-1" />
                                  <span>{formatDate(message.timestamp)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {showScrollButton && (
                      <div className="absolute bottom-20 right-4">
                        <Button
                          size="sm"
                          className="rounded-full h-10 w-10 p-0 flex items-center justify-center shadow-lg"
                          onClick={scrollToBottom}
                        >
                          <ArrowDown className="h-5 w-5" />
                          {unreadCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full h-5 w-5 flex items-center justify-center text-xs">
                              {unreadCount}
                            </span>
                          )}
                        </Button>
                      </div>
                    )}

                    {/* Message Input */}
                    <div className="p-3 border-t">
                      <div className="flex items-center gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileSelected}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={handleUploadImageClick}
                        >
                          <ImageIcon className="h-4 w-4" />
                        </Button>
                        {isRecordingAudio ? (
                          <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleStopAudioRecording}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={handleStartAudioRecording}
                          >
                            <Mic className="h-4 w-4" />
                          </Button>
                        )}
                        <Input
                          placeholder={t("typeMessage")}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          className="h-8 text-xs"
                          onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                              e.preventDefault();
                              handleSendMessage();
                            }
                          }}
                        />
                        <Button
                          size="sm"
                          className="h-8 px-3"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          <span className="text-xs">{t("send")}</span>
                        </Button>
                      </div>
                    </div>

                    {isInCall && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4 z-10">
                        <div className="bg-background rounded-lg p-4 w-full max-w-sm shadow-lg">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-sm font-medium">{callType === "video" ? t("videoCall") : t("audioCall")}</p>
                            <Button variant="ghost" size="icon" onClick={handleEndCall}>
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          {callType === "video" ? (
                            <div>
                              <video ref={remoteVideoRef} className="w-full rounded bg-black mb-2" playsInline />
                              <video ref={localVideoRef} className="w-32 h-24 rounded bg-black" playsInline muted />
                            </div>
                          ) : (
                            <div className="p-6 text-center">
                              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse mx-auto mb-2" />
                              <p className="text-xs text-muted-foreground">{t("inCall")}</p>
                            </div>
                          )}
                          <div className="mt-3 flex justify-end">
                            <Button variant="destructive" onClick={handleEndCall}>
                              {t("endCall")}
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                      <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm font-medium">
                        {t("selectConversation")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t("selectConversationDescription")}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="m-0">
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <p className="text-sm font-medium">{t("unreadMessages")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("unreadMessagesDescription")}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="archived" className="m-0">
              <div className="flex items-center justify-center h-[600px]">
                <div className="text-center">
                  <p className="text-sm font-medium">{t("archivedChats")}</p>
                  <p className="text-xs text-muted-foreground">
                    {t("archivedChatsDescription")}
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <style jsx global>{`
        .typing-animation span {
          animation: typingDots 1.4s infinite ease-in-out;
          animation-fill-mode: both;
        }

        .typing-animation span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-animation span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-animation span:nth-child(3) {
          animation-delay: 0.4s;
        }

        @keyframes typingDots {
          0%,
          80%,
          100% {
            transform: scale(0.6);
            opacity: 0.6;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
