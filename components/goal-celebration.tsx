import { View, Text, Animated, Easing } from "react-native";
import { useEffect, useRef, useState } from "react";

interface GoalCelebrationProps {
  visible: boolean;
  playerName?: string;
  onAnimationComplete?: () => void;
}

/**
 * Componente de celebração de gol com confete e animações
 */
export function GoalCelebration({ visible, playerName = "Corinthians", onAnimationComplete }: GoalCelebrationProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [confetti, setConfetti] = useState<Array<{ id: number; delay: number }>>([]);

  useEffect(() => {
    if (visible) {
      // Gerar confetes
      const confettiPieces = Array.from({ length: 30 }, (_, i) => ({
        id: i,
        delay: Math.random() * 200,
      }));
      setConfetti(confettiPieces);

      // Animação de escala (zoom in)
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.elastic(1.5)),
          useNativeDriver: true,
        }),
        Animated.delay(1500),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        onAnimationComplete?.();
      });

      // Animação de rotação
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start();

      // Fade out
      Animated.sequence([
        Animated.delay(1800),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      opacityAnim.setValue(1);
      rotateAnim.setValue(0);
      setConfetti([]);
    }
  }, [visible, scaleAnim, opacityAnim, rotateAnim, onAnimationComplete]);

  if (!visible) return null;

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <View className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl">
      {/* Confete */}
      {confetti.map((piece) => (
        <ConfettiPiece key={piece.id} delay={piece.delay} />
      ))}

      {/* Celebração principal */}
      <Animated.View
        className="absolute inset-0 items-center justify-center"
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        <Animated.View
          style={{
            transform: [{ rotate: rotation }],
          }}
        >
          <Text className="text-6xl">⚽</Text>
        </Animated.View>

        {/* Texto de celebração */}
        <Animated.View
          className="absolute top-1/3 items-center gap-2"
          style={{
            opacity: opacityAnim,
          }}
        >
          <Text className="text-white font-bold text-2xl drop-shadow-lg">GOL!</Text>
          <Text className="text-white font-semibold text-lg drop-shadow-lg">{playerName}</Text>
        </Animated.View>

        {/* Efeito de brilho */}
        <View className="absolute inset-0 items-center justify-center">
          <View className="w-40 h-40 bg-yellow-300 rounded-full opacity-30 blur-3xl" />
        </View>
      </Animated.View>
    </View>
  );
}

/**
 * Componente individual de confete
 */
function ConfettiPiece({ delay }: { delay: number }) {
  const translateYAnim = useRef(new Animated.Value(0)).current;
  const translateXAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const randomX = (Math.random() - 0.5) * 300;
  const randomDuration = 2000 + Math.random() * 1000;
  const colors = ["bg-red-400", "bg-yellow-300", "bg-blue-400", "bg-green-400", "bg-purple-400"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];

  useEffect(() => {
    Animated.sequence([
      Animated.delay(delay),
      Animated.parallel([
        Animated.timing(translateYAnim, {
          toValue: 400,
          duration: randomDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(translateXAnim, {
          toValue: randomX,
          duration: randomDuration,
          easing: Easing.out(Easing.quad),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: randomDuration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(randomDuration - 300),
          Animated.timing(opacityAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),
      ]),
    ]).start();
  }, [delay, randomDuration, randomX, translateYAnim, translateXAnim, rotateAnim, opacityAnim]);

  const rotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "720deg"],
  });

  return (
    <Animated.View
      className={`absolute w-3 h-3 ${randomColor} rounded-full`}
      style={{
        left: "50%",
        top: "50%",
        marginLeft: -6,
        marginTop: -6,
        transform: [
          { translateY: translateYAnim },
          { translateX: translateXAnim },
          { rotate: rotation },
        ],
        opacity: opacityAnim,
      }}
    />
  );
}
