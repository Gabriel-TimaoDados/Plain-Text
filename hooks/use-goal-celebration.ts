import { useCallback, useRef } from "react";
import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

/**
 * Hook para gerenciar celebração de gol com vibração e som
 */
export function useGoalCelebration() {
  const soundRef = useRef<any>(null);

  /**
   * Ativa vibração haptica para celebração de gol
   */
  const playHapticFeedback = useCallback(async () => {
    if (Platform.OS === "web") return; // Haptics não disponível na web

    try {
      // Sequência de vibrações para celebração
      // 1. Vibração forte inicial
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

      // 2. Pequeno delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 3. Vibração média
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      // 4. Pequeno delay
      await new Promise((resolve) => setTimeout(resolve, 100));

      // 5. Vibração leve
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // 6. Notificação de sucesso
      await new Promise((resolve) => setTimeout(resolve, 200));
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch (error) {
      console.warn("Erro ao reproduzir feedback haptico:", error);
    }
  }, []);

  /**
   * Reproduz som de celebração de gol
   */
  const playGoalSound = useCallback(async () => {
    try {
      // Importar Audio do Expo
      const { Audio } = await import("expo-audio");

      // Criar som simples usando Web Audio API (para web e fallback)
      if (Platform.OS === "web") {
        playWebAudio();
        return;
      }

      // Para dispositivos nativos, usar arquivo de som ou gerar som
      // Aqui usamos uma abordagem simples com tons
      await playWebAudio();
    } catch (error) {
      console.warn("Erro ao reproduzir som de gol:", error);
    }
  }, []);

  /**
   * Reproduz som usando Web Audio API (funciona em web e nativo)
   */
  const playWebAudio = useCallback(() => {
    try {
      // Tentar usar Web Audio API se disponível
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext = AudioContext ? new AudioContext() : null;

      if (!audioContext) {
        console.warn("Web Audio API não disponível");
        return;
      }

      const now = audioContext.currentTime;

      // Criar sequência de notas para celebração
      // Notas: Dó, Mi, Sol (C, E, G) - acorde de Dó maior
      const notes = [
        { frequency: 261.63, duration: 0.2 }, // Dó
        { frequency: 329.63, duration: 0.2 }, // Mi
        { frequency: 392.0, duration: 0.4 }, // Sol
      ];

      notes.forEach((note, index) => {
        const osc = audioContext.createOscillator();
        const gain = audioContext.createGain();

        osc.connect(gain);
        gain.connect(audioContext.destination);

        osc.frequency.value = note.frequency;
        osc.type = "sine";

        const startTime = now + index * 0.25;
        gain.gain.setValueAtTime(0.3, startTime);
        gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

        osc.start(startTime);
        osc.stop(startTime + note.duration);
      });
    } catch (error) {
      console.warn("Erro ao reproduzir som com Web Audio API:", error);
    }
  }, []);

  /**
   * Executa celebração completa (vibração + som)
   */
  const celebrate = useCallback(async () => {
    try {
      // Executar vibração e som em paralelo
      await Promise.all([playHapticFeedback(), playGoalSound()]);
    } catch (error) {
      console.error("Erro durante celebração de gol:", error);
    }
  }, [playHapticFeedback, playGoalSound]);

  /**
   * Executa celebração com delay (para sincronizar com animação)
   */
  const celebrateWithDelay = useCallback(
    async (delayMs: number = 0) => {
      if (delayMs > 0) {
        await new Promise((resolve) => setTimeout(resolve, delayMs));
      }
      await celebrate();
    },
    [celebrate]
  );

  return {
    celebrate,
    celebrateWithDelay,
    playHapticFeedback,
    playGoalSound,
  };
}

/**
 * Hook para gerenciar sons de eventos do jogo
 */
export function useGameSounds() {
  /**
   * Reproduz som de apito (início/fim de tempo)
   */
  const playWhistleSound = useCallback(() => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext = AudioContext ? new AudioContext() : null;
      if (!audioContext) return;

      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (error) {
      console.warn("Erro ao reproduzir som de apito:", error);
    }
  }, []);

  /**
   * Reproduz som de cartão
   */
  const playCardSound = useCallback(() => {
    try {
      const AudioContext = (window as any).AudioContext || (window as any).webkitAudioContext;
      const audioContext = AudioContext ? new AudioContext() : null;
      if (!audioContext) return;

      const now = audioContext.currentTime;
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();

      osc.connect(gain);
      gain.connect(audioContext.destination);

      osc.frequency.value = 600;
      osc.type = "square";

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (error) {
      console.warn("Erro ao reproduzir som de cartão:", error);
    }
  }, []);

  return {
    playWhistleSound,
    playCardSound,
  };
}
