"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Clock,
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
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useLanguage } from "@/context/language-context";

// Message type
type Message = {
  id: number;
  userId: number | null;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  isAdmin: boolean;
  attachmentType?: "image" | "audio" | "video";
  attachmentUrl?: string;
};

export default function ProfileChatPage() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const { t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showScrollButton, setShowScrollButton] = useState(false);
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

  const getSignalKeyPrefix = (userId: number) => `rtcSignal_${userId}`;
  const sendSignal = (userId: number, data: any) => {
    try {
      const key = `${getSignalKeyPrefix(userId)}_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2)}`;
      localStorage.setItem(key, JSON.stringify(data));
      setTimeout(() => localStorage.removeItem(key), 2000);
    } catch (e) {
      console.error("Failed to send signal", e);
    }
  };
  const createPeerConnection = (userId: number) => {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
    });
    pc.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignal(userId, {
          role: "user",
          type: "candidate",
          candidate: event.candidate,
        });
      }
    };
    pc.ontrack = (event) => {
      const [stream] = event.streams;
      const video = remoteVideoRef.current;
      if (video && stream) {
        video.srcObject = stream;
        video.play().catch(() => {});
      }
    };
    pcRef.current = pc;
    return pc;
  };

  useEffect(() => {
    const onStorage = async (e: StorageEvent) => {
      if (!user) return;
      if (!e.key || !e.newValue) return;
      if (!e.key.startsWith(getSignalKeyPrefix(user.id))) return;
      try {
        const msg = JSON.parse(e.newValue);
        if (msg.role !== "admin") return;
        if (msg.type === "offer") {
          // incoming call
          setIsInCall(true);
          setCallType(msg.callType || "audio");
          const constraints =
            msg.callType === "video"
              ? { video: true, audio: true }
              : { audio: true };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          localStreamRef.current = stream;
          if (msg.callType === "video" && localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
            await localVideoRef.current.play().catch(() => {});
          }
          const pc = createPeerConnection(user.id);
          stream.getTracks().forEach((track) => pc.addTrack(track, stream));
          await pc.setRemoteDescription(new RTCSessionDescription(msg.sdp));
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          sendSignal(user.id, { role: "user", type: "answer", sdp: answer });
        } else if (msg.type === "candidate") {
          if (pcRef.current && msg.candidate) {
            try {
              await pcRef.current.addIceCandidate(
                new RTCIceCandidate(msg.candidate)
              );
            } catch (err) {
              console.error("Failed to add ICE candidate", err);
            }
          }
        } else if (msg.type === "end") {
          handleEndCall();
        }
      } catch (err) {
        console.error("Failed to parse signal", err);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [user]);

  // Load messages from localStorage
  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      return;
    }

    try {
      const storedMessages = localStorage.getItem(`userChat_${user?.id}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        // Welcome message if no messages exist
        const welcomeMessage: Message = {
          id: 1,
          userId: null,
          userName: "Admin",
          userAvatar: "/placeholder.svg?height=40&width=40&text=A",
          content: "Xush kelibsiz! Qanday yordam bera olaman?",
          timestamp: new Date().toISOString(),
          isAdmin: true,
        };
        setMessages([welcomeMessage]);
        localStorage.setItem(
          `userChat_${user?.id}`,
          JSON.stringify([welcomeMessage])
        );
      }
    } catch (error) {
      console.error("Failed to load messages:", error);
      toast({
        title: t("error"),
        description: t("failedToLoadMessages"),
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, user, toast, t]);

  // Scroll to bottom of messages when new message is added
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Check for scroll position to show/hide scroll button
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollArea;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);

      // If user scrolls up, count unread messages
      if (!isNearBottom) {
        setUnreadCount((prev) => prev + 1);
      } else {
        setUnreadCount(0);
      }
    };

    scrollArea.addEventListener("scroll", handleScroll);
    return () => scrollArea.removeEventListener("scroll", handleScroll);
  }, []);

  // Simulate admin responses
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && !lastMessage.isAdmin) {
      setIsTyping(true);

      // Simulate admin typing and responding
      const typingTimeout = setTimeout(() => {
        const adminResponses = [
          "Albatta, sizga qanday yordam bera olaman?",
          "Savolingiz uchun rahmat. Tez orada javob beraman.",
          "Bu haqida ko'proq ma'lumot bera olasizmi?",
          "Tushunarli. Muammoni hal qilish uchun harakat qilaman.",
          "Kurslarimiz haqida ko'proq ma'lumot olmoqchimisiz?",
          "Xavotir olmang, muammoni hal qilamiz.",
          "Iltimos, biroz kuting, ma'lumotlarni tekshiryapman.",
          "Sizga qo'shimcha ma'lumot kerak bo'lsa, so'rashingiz mumkin.",
        ];

        const randomResponse =
          adminResponses[Math.floor(Math.random() * adminResponses.length)];

        const adminReply: Message = {
          id: Date.now(),
          userId: null,
          userName: "Admin",
          userAvatar: "/placeholder.svg?height=40&width=40&text=A",
          content: randomResponse,
          timestamp: new Date().toISOString(),
          isAdmin: true,
        };

        setMessages((prev) => {
          const updatedMessages = [...prev, adminReply];
          localStorage.setItem(
            `userChat_${user?.id}`,
            JSON.stringify(updatedMessages)
          );
          return updatedMessages;
        });

        setIsTyping(false);

        if (document.hidden) {
          if (
            "Notification" in window &&
            Notification.permission === "granted"
          ) {
            new Notification("Yangi xabar", {
              body: "Administratordan yangi xabar keldi",
              icon: "/placeholder.svg?height=40&width=40&text=A",
            });
          }
        }
      }, 2000 + Math.random() * 2000);

      return () => clearTimeout(typingTimeout);
    }
  }, [messages, user?.id]);

  const persistMessages = (updated: Message[]) => {
    if (user) {
      localStorage.setItem(`userChat_${user.id}`, JSON.stringify(updated));
    }
    setMessages(updated);
  };

  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const userMessage: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: newMessage,
      timestamp: new Date().toISOString(),
      isAdmin: false,
    };

    persistMessages([...messages, userMessage]);

    setNewMessage("");
    setUnreadCount(0);
  };

  const handleUploadImageClick = () => fileInputRef.current?.click();

  const handleFileSelected: React.ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    const url = URL.createObjectURL(file);

    const imageMessage: Message = {
      id: Date.now(),
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar,
      content: "",
      timestamp: new Date().toISOString(),
      isAdmin: false,
      attachmentType: "image",
      attachmentUrl: url,
    };

    persistMessages([...messages, imageMessage]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleStartAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      recordedChunksRef.current = [];
      const recorder = new MediaRecorder(stream);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) recordedChunksRef.current.push(event.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const blob = new Blob(recordedChunksRef.current, {
          type: "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        if (user) {
          const audioMessage: Message = {
            id: Date.now(),
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar,
            content: "",
            timestamp: new Date().toISOString(),
            isAdmin: false,
            attachmentType: "audio",
            attachmentUrl: url,
          };
          persistMessages([...messages, audioMessage]);
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

  const handleStopAudioRecording = () => mediaRecorderRef.current?.stop();

  const handleStartCall = async (type: "audio" | "video") => {
    try {
      const constraints =
        type === "video" ? { video: true, audio: true } : { audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      localStreamRef.current = stream;
      setIsInCall(true);
      setCallType(type);
      if (type === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        await localVideoRef.current.play();
      }
      if (!user) return;
      const pc = createPeerConnection(user.id);
      stream.getTracks().forEach((track) => pc.addTrack(track, stream));
      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);
      sendSignal(user.id, {
        role: "user",
        type: "offer",
        sdp: offer,
        callType: type,
      });
    } catch (err) {
      console.error(err);
      toast({ title: t("error"), description: t("failedToStartCall") });
    }
  };

  const handleEndCall = () => {
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    localStreamRef.current = null;
    if (pcRef.current) {
      try {
        pcRef.current.getSenders().forEach((s) => s.track && s.track.stop());
        pcRef.current.close();
      } catch {}
    }
    if (user) {
      sendSignal(user.id, { role: "user", type: "end" });
    }
    setIsInCall(false);
    setCallType(null);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  // Format date for conversation list
  const formatMessageDate = (dateString: string) => {
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

  if (isLoading) {
    return (
      <div className="container mx-auto py-10">
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>{t("chatSupport")}</CardTitle>
            <CardDescription>{t("pleaseLoginToChat")}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>{t("loginRequired")}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => (window.location.href = "/login")}>
              {t("login")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40&text=A"
                  alt="Admin"
                />
                <AvatarFallback>A</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">{t("supportChat")}</CardTitle>
                <CardDescription className="text-xs">
                  {isTyping ? (
                    <span className="flex items-center text-green-500">
                      <span className="mr-1">{t("typing")}</span>
                      <span className="typing-animation">
                        <span>.</span>
                        <span>.</span>
                        <span>.</span>
                      </span>
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1"></div>
                      {t("online")}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartCall("audio")}
              >
                <Phone className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleStartCall("video")}
              >
                <Video className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 p-0 relative">
          <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isAdmin ? "justify-start" : "justify-end"
                  }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-[80%] ${
                      message.isAdmin ? "" : "flex-row-reverse"
                    }`}
                  >
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage
                        src={message.userAvatar}
                        alt={message.userName}
                      />
                      <AvatarFallback>
                        {message.userName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`rounded-lg p-3 text-sm ${
                        message.isAdmin
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      {message.attachmentType === "image" &&
                      message.attachmentUrl ? (
                        <img
                          src={message.attachmentUrl}
                          alt="image"
                          className="rounded-md max-w-[240px] mb-1"
                        />
                      ) : null}
                      {message.attachmentType === "audio" &&
                      message.attachmentUrl ? (
                        <audio
                          src={message.attachmentUrl}
                          controls
                          className="w-[240px] mb-1"
                        />
                      ) : null}
                      {message.attachmentType === "video" &&
                      message.attachmentUrl ? (
                        <video
                          src={message.attachmentUrl}
                          controls
                          className="w-[240px] rounded mb-1"
                        />
                      ) : null}
                      {message.content ? <p>{message.content}</p> : null}
                      <div
                        className={`flex items-center mt-1 text-xs ${
                          message.isAdmin
                            ? "text-muted-foreground"
                            : "text-primary-foreground/70"
                        }`}
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{formatMessageDate(message.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex items-start gap-2 max-w-[80%]">
                    <Avatar className="h-8 w-8 mt-0.5">
                      <AvatarImage
                        src="/placeholder.svg?height=40&width=40&text=A"
                        alt="Admin"
                      />
                      <AvatarFallback>A</AvatarFallback>
                    </Avatar>
                    <div className="rounded-lg p-3 bg-muted">
                      <div className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {showScrollButton && (
            <div className="absolute bottom-4 right-4">
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
        </CardContent>

        <CardFooter className="p-3 border-t">
          <div className="flex items-center gap-2 w-full">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelected}
            />
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
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleUploadImageClick}
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Input
              placeholder={t("typeMessage")}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="px-3"
            >
              <Send className="h-4 w-4 mr-1" />
              <span>{t("send")}</span>
            </Button>
          </div>
        </CardFooter>

        {isInCall && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-background rounded-lg p-4 w-full max-w-sm shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium">
                  {callType === "video" ? t("videoCall") : t("audioCall")}
                </p>
                <Button variant="ghost" size="icon" onClick={handleEndCall}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              {callType === "video" ? (
                <div>
                  <video
                    ref={remoteVideoRef}
                    className="w-full rounded bg-black mb-2"
                    playsInline
                  />
                  <video
                    ref={localVideoRef}
                    className="w-32 h-24 rounded bg-black"
                    playsInline
                    muted
                  />
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

        .typing-dots {
          display: flex;
          align-items: center;
          column-gap: 4px;
          height: 10px;
        }

        .typing-dots span {
          display: block;
          width: 5px;
          height: 5px;
          background-color: currentColor;
          border-radius: 50%;
          opacity: 0.6;
          animation: typingDots 1.4s infinite ease-in-out;
          animation-fill-mode: both;
        }

        .typing-dots span:nth-child(1) {
          animation-delay: 0s;
        }

        .typing-dots span:nth-child(2) {
          animation-delay: 0.2s;
        }

        .typing-dots span:nth-child(3) {
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
