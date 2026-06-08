import {
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useState, useEffect, useRef } from "react";
import { ScreenContainer } from "@/components/screen-container";
import { useRouter } from "expo-router";
import { trpc } from "@/lib/trpc";

interface ChatMessage {
  id: string;
  userName: string;
  message: string;
  type: "message" | "goal" | "card" | "substitution";
  sentiment: "positive" | "negative" | "neutral";
  likes: number;
  isVerified: boolean;
  createdAt: Date;
}

export default function LiveChatScreen() {
  const router = useRouter();
  const [fixtureId] = useState(1); // Seria passado como parâmetro
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("Torcedor");
  const [userId] = useState(`user_${Date.now()}`);
  const [isJoined, setIsJoined] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    joinChat();
    loadMessages();
    const interval = setInterval(loadMessages, 3000); // Atualiza a cada 3 segundos
    return () => clearInterval(interval);
  }, []);

  const joinChat = async () => {
    try {
      await trpc.liveChat.join.mutate({
        fixtureId,
        userId,
        userName,
      });
      setIsJoined(true);
    } catch (error) {
      console.error("Erro ao entrar no chat:", error);
    }
  };

  const loadMessages = async () => {
    try {
      const result = await trpc.liveChat.getMessages.query({
        fixtureId,
        limit: 50,
      });
      setMessages(
        result.messages.map((msg: any, idx: number) => ({
          id: `msg_${idx}`,
          ...msg,
          createdAt: new Date(msg.createdAt),
        }))
      );

      const usersResult = await trpc.liveChat.getActiveUsers.query({
        fixtureId,
      });
      setActiveUsers(usersResult.count);
    } catch (error) {
      console.error("Erro ao carregar mensagens:", error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      await trpc.liveChat.sendMessage.mutate({
        fixtureId,
        userId,
        userName,
        message: newMessage,
        type: "message",
        isVerified: false,
      });

      setNewMessage("");
      await loadMessages();
      scrollViewRef.current?.scrollToEnd({ animated: true });
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "bg-green-100";
      case "negative":
        return "bg-red-100";
      default:
        return "bg-surface";
    }
  };

  const getSentimentTextColor = (sentiment: string) => {
    switch (sentiment) {
      case "positive":
        return "text-green-700";
      case "negative":
        return "text-red-700";
      default:
        return "text-foreground";
    }
  };

  const renderMessage = (msg: ChatMessage) => (
    <View key={msg.id} className={`${getSentimentColor(msg.sentiment)} rounded-lg p-3 mb-2`}>
      <View className="flex-row justify-between items-start mb-1">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="font-bold text-foreground">{msg.userName}</Text>
          {msg.isVerified && <Text className="text-blue-500">✓</Text>}
        </View>
        <Text className="text-xs text-muted">
          {msg.createdAt?.toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>

      <Text className={`${getSentimentTextColor(msg.sentiment)} text-sm`}>
        {msg.message}
      </Text>

      {msg.likes > 0 && (
        <View className="mt-2 flex-row items-center gap-1">
          <Text className="text-sm">👍 {msg.likes}</Text>
        </View>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1"
    >
      <ScreenContainer className="p-0 flex-1">
        {/* Header */}
        <View className="bg-black px-6 py-4 border-b border-border">
          <Text className="text-2xl font-bold text-white">💬 Live Chat</Text>
          <View className="flex-row items-center gap-2 mt-2">
            <View className="w-2 h-2 bg-green-500 rounded-full" />
            <Text className="text-sm text-orange-400">
              {activeUsers} torcedores online
            </Text>
          </View>
        </View>

        {/* Mensagens */}
        <ScrollView
          ref={scrollViewRef}
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: true })
          }
        >
          {messages.length > 0 ? (
            messages.map((msg) => renderMessage(msg))
          ) : (
            <View className="flex-1 items-center justify-center py-8">
              <Text className="text-muted text-center">
                Nenhuma mensagem ainda. Seja o primeiro a comentar!
              </Text>
            </View>
          )}
        </ScrollView>

        {/* Input de mensagem */}
        <View className="border-t border-border px-4 py-3 gap-2">
          <View className="flex-row gap-2 items-center">
            <TextInput
              placeholder="Escreva seu comentário..."
              placeholderTextColor="#999"
              value={newMessage}
              onChangeText={setNewMessage}
              maxLength={500}
              multiline
              className="flex-1 bg-surface rounded-lg px-3 py-2 text-foreground border border-border"
              style={{ maxHeight: 80 }}
            />
            <TouchableOpacity
              onPress={sendMessage}
              disabled={!newMessage.trim()}
              className={`rounded-lg p-3 ${
                newMessage.trim() ? "bg-primary" : "bg-muted opacity-50"
              }`}
            >
              <Text className="text-background font-bold">Enviar</Text>
            </TouchableOpacity>
          </View>

          {/* Contador de caracteres */}
          <Text className="text-xs text-muted text-right">
            {newMessage.length}/500
          </Text>
        </View>
      </ScreenContainer>
    </KeyboardAvoidingView>
  );
}
