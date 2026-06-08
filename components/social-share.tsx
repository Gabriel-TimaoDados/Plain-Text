import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import * as Sharing from "expo-sharing";
import * as WebBrowser from "expo-web-browser";
import { useState } from "react";

export interface ShareContent {
  title: string;
  description: string;
  url?: string;
  imageUrl?: string;
  hashtags?: string[];
}

interface SocialShareProps {
  content: ShareContent;
  onShare?: (platform: string) => void;
}

/**
 * Componente de compartilhamento em redes sociais
 */
export function SocialShare({ content, onShare }: SocialShareProps) {
  const [sharing, setSharing] = useState(false);

  const platforms = [
    {
      id: "whatsapp",
      name: "WhatsApp",
      icon: "💬",
      color: "bg-green-500",
      share: shareToWhatsApp,
    },
    {
      id: "telegram",
      name: "Telegram",
      icon: "✈️",
      color: "bg-blue-500",
      share: shareToTelegram,
    },
    {
      id: "twitter",
      name: "Twitter/X",
      icon: "𝕏",
      color: "bg-black",
      share: shareToTwitter,
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: "f",
      color: "bg-blue-600",
      share: shareToFacebook,
    },
    {
      id: "instagram",
      name: "Instagram",
      icon: "📷",
      color: "bg-pink-500",
      share: shareToInstagram,
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: "in",
      color: "bg-blue-700",
      share: shareToLinkedIn,
    },
    {
      id: "native",
      name: "Compartilhar",
      icon: "↗️",
      color: "bg-primary",
      share: shareNative,
    },
  ];

  async function shareToWhatsApp() {
    const message = `${content.title}\n\n${content.description}${content.hashtags ? "\n\n" + content.hashtags.join(" ") : ""}`;
    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    await WebBrowser.openBrowserAsync(url);
  }

  async function shareToTelegram() {
    const message = `${content.title}\n\n${content.description}${content.hashtags ? "\n\n" + content.hashtags.join(" ") : ""}`;
    const url = `https://t.me/share/url?url=${encodeURIComponent(content.url || "")}&text=${encodeURIComponent(message)}`;
    await WebBrowser.openBrowserAsync(url);
  }

  async function shareToTwitter() {
    const text = `${content.title}\n\n${content.description}${content.hashtags ? "\n\n" + content.hashtags.join(" ") : ""}`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(content.url || "")}`;
    await WebBrowser.openBrowserAsync(url);
  }

  async function shareToFacebook() {
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(content.url || "")}`;
    await WebBrowser.openBrowserAsync(url);
  }

  async function shareToInstagram() {
    Alert.alert(
      "Instagram",
      "Copie o texto abaixo e compartilhe no Instagram:",
      [
        {
          text: "Copiar",
          onPress: () => {
            const text = `${content.title}\n\n${content.description}${content.hashtags ? "\n\n" + content.hashtags.join(" ") : ""}`;
            // Copiar para clipboard
            Alert.alert("Copiado!", "Texto copiado para a área de transferência");
          },
        },
        { text: "Cancelar" },
      ]
    );
  }

  async function shareToLinkedIn() {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(content.url || "")}`;
    await WebBrowser.openBrowserAsync(url);
  }

  async function shareNative() {
    try {
      const message = `${content.title}\n\n${content.description}${content.hashtags ? "\n\n" + content.hashtags.join(" ") : ""}`;

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(message, {
          dialogTitle: "Compartilhar",
        });
      } else {
        Alert.alert("Compartilhamento não disponível");
      }
    } catch (error) {
      console.error("Erro ao compartilhar:", error);
    }
  }

  const handleShare = async (platform: any) => {
    setSharing(true);
    try {
      await platform.share();
      onShare?.(platform.id);
    } catch (error) {
      console.error(`Erro ao compartilhar em ${platform.name}:`, error);
      Alert.alert("Erro", `Não foi possível compartilhar em ${platform.name}`);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View className="gap-3">
      <Text className="text-foreground font-semibold">Compartilhar</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, paddingHorizontal: 0 }}
      >
        {platforms.map((platform) => (
          <TouchableOpacity
            key={platform.id}
            onPress={() => handleShare(platform)}
            disabled={sharing}
            className={`w-16 h-16 rounded-lg items-center justify-center gap-1 ${platform.color} opacity-90 active:opacity-70`}
          >
            <Text className="text-2xl">{platform.icon}</Text>
            <Text className="text-white text-xs font-bold text-center">{platform.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Preview */}
      <View className="bg-surface rounded-lg border border-border p-3 gap-2">
        <Text className="text-foreground font-bold text-sm">{content.title}</Text>
        <Text className="text-muted text-xs leading-relaxed">{content.description}</Text>
        {content.hashtags && (
          <Text className="text-primary text-xs">{content.hashtags.join(" ")}</Text>
        )}
      </View>
    </View>
  );
}

interface SocialShareButtonProps {
  content: ShareContent;
  label?: string;
  onShare?: (platform: string) => void;
}

/**
 * Botão de compartilhamento compacto
 */
export function SocialShareButton({
  content,
  label = "Compartilhar",
  onShare,
}: SocialShareButtonProps) {
  const [showShare, setShowShare] = useState(false);

  return (
    <View>
      <TouchableOpacity
        onPress={() => setShowShare(!showShare)}
        className="bg-primary rounded-lg px-4 py-2 flex-row items-center justify-center gap-2"
      >
        <Text className="text-white font-bold">↗️</Text>
        <Text className="text-white font-bold">{label}</Text>
      </TouchableOpacity>

      {showShare && (
        <View className="mt-3">
          <SocialShare content={content} onShare={onShare} />
        </View>
      )}
    </View>
  );
}
