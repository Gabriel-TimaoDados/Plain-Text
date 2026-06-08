import { ScrollView, Text, View, TextInput, TouchableOpacity, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useState } from "react";
import { router } from "expo-router";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Erro", "Por favor, preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      // TODO: Integrar com API de autenticação
      console.log("Login:", { email, password });
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Integrar com Google OAuth
      console.log("Login com Google");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login com Google");
    }
  };

  const handleFacebookLogin = async () => {
    try {
      // TODO: Integrar com Facebook OAuth
      console.log("Login com Facebook");
      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert("Erro", "Falha ao fazer login com Facebook");
    }
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="flex-1">
        <View className="flex-1 justify-center p-6 gap-6">
          {/* Logo */}
          <View className="items-center gap-2 mb-4">
            <Text className="text-4xl font-bold text-primary">Timão</Text>
            <Text className="text-2xl font-bold text-foreground">Dados</Text>
            <Text className="text-sm text-muted">Guia Completo do Corinthians</Text>
          </View>

          {/* Email Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Email</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              placeholder="seu@email.com"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-foreground">Senha</Text>
            <TextInput
              className="border border-border rounded-lg px-4 py-3 text-foreground bg-surface"
              placeholder="Sua senha"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 items-center"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-white font-semibold text-base">
              {loading ? "Entrando..." : "Entrar"}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View className="flex-row items-center gap-3 my-2">
            <View className="flex-1 h-px bg-border" />
            <Text className="text-sm text-muted">ou</Text>
            <View className="flex-1 h-px bg-border" />
          </View>

          {/* Google Login */}
          <TouchableOpacity
            className="border border-border rounded-lg py-3 items-center flex-row justify-center gap-2"
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text className="text-foreground font-semibold">Entrar com Google</Text>
          </TouchableOpacity>

          {/* Facebook Login */}
          <TouchableOpacity
            className="border border-border rounded-lg py-3 items-center flex-row justify-center gap-2"
            onPress={handleFacebookLogin}
            disabled={loading}
          >
            <Text className="text-foreground font-semibold">Entrar com Facebook</Text>
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center gap-1 mt-4">
            <Text className="text-sm text-muted">Não tem conta?</Text>
            <TouchableOpacity onPress={() => router.push("/signup")}>
              <Text className="text-sm text-primary font-semibold">Criar conta</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
