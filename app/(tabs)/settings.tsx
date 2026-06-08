import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { cn } from "@/lib/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { getCacheSize, clearAllCache, getSearchHistory, clearSearchHistory } from "@/lib/_core/offline-cache";
import { trpc } from "@/lib/trpc";

interface SettingsState {
  notificationsEnabled: boolean;
  gameNotifications: boolean;
  resultNotifications: boolean;
  milestoneNotifications: boolean;
  offlineMode: boolean;
  darkMode: boolean;
  autoSync: boolean;
}

export default function SettingsScreen() {
  const colors = useColors();
  const [settings, setSettings] = useState<SettingsState>({
    notificationsEnabled: true,
    gameNotifications: true,
    resultNotifications: true,
    milestoneNotifications: true,
    offlineMode: true,
    darkMode: false,
    autoSync: true,
  });

  const [cacheSize, setCacheSize] = useState(0);
  const [searchHistoryCount, setSearchHistoryCount] = useState(0);
  const [syncStatus, setSyncStatus] = useState<any>(null);
  const [syncLoading, setSyncLoading] = useState(false);

  useEffect(() => {
    loadSettings();
    updateCacheInfo();
    loadSyncStatus();
  }, []);

  const loadSettings = async () => {
    try {
      const saved = await AsyncStorage.getItem("app_settings");
      if (saved) {
        setSettings(JSON.parse(saved));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações:", error);
    }
  };

  const updateCacheInfo = async () => {
    const size = await getCacheSize();
    setCacheSize(Math.round(size / 1024)); // Converter para KB

    const history = await getSearchHistory();
    setSearchHistoryCount(history.length);
  };

  const saveSettings = async (newSettings: SettingsState) => {
    try {
      await AsyncStorage.setItem("app_settings", JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error("Erro ao salvar configurações:", error);
    }
  };

  const toggleSetting = (key: keyof SettingsState) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  const handleClearCache = () => {
    Alert.alert(
      "Limpar Cache",
      "Tem certeza que deseja limpar todo o cache? Você precisará sincronizar os dados novamente.",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Limpar",
          onPress: async () => {
            await clearAllCache();
            setCacheSize(0);
            Alert.alert("✅", "Cache limpo com sucesso!");
          },
        },
      ]
    );
  };

  const handleClearSearchHistory = () => {
    Alert.alert(
      "Limpar Histórico",
      "Tem certeza que deseja limpar o histórico de buscas?",
      [
        { text: "Cancelar", onPress: () => {} },
        {
          text: "Limpar",
          onPress: async () => {
            await clearSearchHistory();
            setSearchHistoryCount(0);
            Alert.alert("✅", "Histórico limpo com sucesso!");
          },
        },
      ]
    );
  };

  const loadSyncStatus = async () => {
    try {
      const status = await trpc.autoSync.status.query();
      setSyncStatus(status);
    } catch (error) {
      console.error("Erro ao carregar status de sincronização:", error);
    }
  };

  const handleStartSync = async () => {
    setSyncLoading(true);
    try {
      await trpc.autoSync.start.mutate({ intervalMinutes: 360 });
      Alert.alert("✅", "Sincronização automática iniciada!");
      await loadSyncStatus();
    } catch (error) {
      Alert.alert("❌", "Erro ao iniciar sincronização");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleStopSync = async () => {
    setSyncLoading(true);
    try {
      await trpc.autoSync.stop.mutate();
      Alert.alert("✅", "Sincronização automática parada!");
      await loadSyncStatus();
    } catch (error) {
      Alert.alert("❌", "Erro ao parar sincronização");
    } finally {
      setSyncLoading(false);
    }
  };

  const handleRequestNotificationPermissions = async () => {
    try {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status === "granted") {
        Alert.alert("✅", "Permissão de notificações concedida!");
      } else {
        Alert.alert("⚠️", "Permissão de notificações negada");
      }
    } catch (error) {
      console.error("Erro ao solicitar permissões:", error);
    }
  };

  const SettingRow = ({
    label,
    description,
    value,
    onChange,
  }: {
    label: string;
    description?: string;
    value: boolean;
    onChange: () => void;
  }) => (
    <View className="flex-row items-center justify-between py-3 px-4 border-b border-border">
      <View className="flex-1">
        <Text className="text-foreground font-medium">{label}</Text>
        {description && <Text className="text-muted text-xs mt-1">{description}</Text>}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.border, true: colors.primary }}
        thumbColor={value ? colors.background : colors.muted}
      />
    </View>
  );

  const ActionButton = ({
    label,
    onPress,
    variant = "default",
  }: {
    label: string;
    onPress: () => void;
    variant?: "default" | "danger";
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className={cn(
        "py-3 px-4 rounded-lg mb-2 items-center",
        variant === "danger" ? "bg-error" : "bg-primary"
      )}
    >
      <Text className="text-background font-semibold">{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenContainer className="p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="mb-6">
          <Text className="text-3xl font-bold text-foreground mb-2">Configurações</Text>
          <Text className="text-muted">Personalize sua experiência</Text>
        </View>

        {/* Notificações */}
        <View className="bg-surface rounded-lg mb-6 overflow-hidden">
          <View className="bg-primary px-4 py-3">
            <Text className="text-background font-semibold">🔔 Notificações</Text>
          </View>

          <SettingRow
            label="Ativar Notificações"
            description="Receba alertas do app"
            value={settings.notificationsEnabled}
            onChange={() => toggleSetting("notificationsEnabled")}
          />

          {settings.notificationsEnabled && (
            <>
              <SettingRow
                label="Próximos Jogos"
                description="Notificações antes dos jogos"
                value={settings.gameNotifications}
                onChange={() => toggleSetting("gameNotifications")}
              />

              <SettingRow
                label="Resultados"
                description="Alertas de resultados finalizados"
                value={settings.resultNotifications}
                onChange={() => toggleSetting("resultNotifications")}
              />

              <SettingRow
                label="Marcos Históricos"
                description="Notificações de eventos especiais"
                value={settings.milestoneNotifications}
                onChange={() => toggleSetting("milestoneNotifications")}
              />

              <View className="p-4">
                <ActionButton
                  label="Solicitar Permissões de Notificação"
                  onPress={handleRequestNotificationPermissions}
                />
              </View>
            </>
          )}
        </View>

        {/* Dados e Sincronização */}
        <View className="bg-surface rounded-lg mb-6 overflow-hidden">
          <View className="bg-primary px-4 py-3">
            <Text className="text-background font-semibold">📊 Dados e Sincronização</Text>
          </View>

          <SettingRow
            label="Modo Offline"
            description="Usar dados em cache quando offline"
            value={settings.offlineMode}
            onChange={() => toggleSetting("offlineMode")}
          />

          <SettingRow
            label="Sincronização Automática"
            description="Atualizar dados a cada 6 horas"
            value={settings.autoSync}
            onChange={() => toggleSetting("autoSync")}
          />

          <View className="px-4 py-3 border-b border-border">
            <Text className="text-foreground font-medium mb-2">Informações de Cache</Text>
            <View className="bg-background rounded p-3">
              <View className="flex-row justify-between mb-2">
                <Text className="text-muted">Tamanho do Cache:</Text>
                <Text className="text-foreground font-semibold">{cacheSize} KB</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-muted">Buscas Recentes:</Text>
                <Text className="text-foreground font-semibold">{searchHistoryCount}</Text>
              </View>
            </View>
          </View>

          <View className="p-4 gap-2">
            <ActionButton
              label="Limpar Cache"
              onPress={handleClearCache}
              variant="danger"
            />
            <ActionButton
              label="Limpar Histórico de Buscas"
              onPress={handleClearSearchHistory}
              variant="danger"
            />
          </View>
        </View>

        {/* Aparência */}
        <View className="bg-surface rounded-lg mb-6 overflow-hidden">
          <View className="bg-primary px-4 py-3">
            <Text className="text-background font-semibold">🎨 Aparência</Text>
          </View>

          <SettingRow
            label="Modo Escuro"
            description="Ativar tema escuro"
            value={settings.darkMode}
            onChange={() => toggleSetting("darkMode")}
          />
        </View>

        {/* Sobre */}
        <View className="bg-surface rounded-lg mb-6 overflow-hidden">
          <View className="bg-primary px-4 py-3">
            <Text className="text-background font-semibold">ℹ️ Sobre</Text>
          </View>

          <View className="p-4">
            <View className="gap-3">
              <View>
                <Text className="text-muted text-xs">Aplicativo</Text>
                <Text className="text-foreground font-semibold">Timão Dados</Text>
              </View>

              <View>
                <Text className="text-muted text-xs">Versão</Text>
                <Text className="text-foreground font-semibold">1.0.0</Text>
              </View>

              <View>
                <Text className="text-muted text-xs">Baseado em</Text>
                <Text className="text-foreground font-semibold">Timão Dados - Baseado no Almanaque do Timão de Celso Unzelte</Text>
              </View>

              <View>
                <Text className="text-muted text-xs">Dados de Jogos</Text>
                <Text className="text-foreground font-semibold">API-Football</Text>
              </View>

              <View className="pt-2 border-t border-border">
                <Text className="text-muted text-xs">Desenvolvido com ❤️ para Corinthianos</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Feedback */}
        <View className="bg-surface rounded-lg mb-6 overflow-hidden">
          <View className="p-4">
            <ActionButton
              label="Enviar Feedback"
              onPress={() => {
                Alert.alert(
                  "Feedback",
                  "Obrigado por usar Timão Dados! Suas sugestões nos ajudam a melhorar."
                );
              }}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
