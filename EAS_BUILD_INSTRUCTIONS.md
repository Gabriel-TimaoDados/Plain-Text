# Gerar Builds com EAS (Expo Application Services)

## Pré-requisitos

1. **Conta Expo**: Crie em [expo.dev](https://expo.dev)
2. **EAS CLI instalado**: `npm install -g eas-cli`
3. **Credenciais configuradas**: `eas login`
4. **Certificados Apple**: Para iOS (opcional, EAS pode gerar)
5. **Google Play Console**: Para Android

## Passo 1: Fazer Login no EAS

```bash
eas login
```

Insira suas credenciais do Expo quando solicitado.

## Passo 2: Configurar EAS (se necessário)

```bash
eas build:configure
```

Selecione as plataformas: iOS e Android.

## Passo 3: Gerar Build iOS

```bash
eas build --platform ios --auto-submit
```

**Tempo estimado**: 20-30 minutos

**O que acontece**:
- EAS compila o app para iOS
- Gera um arquivo `.ipa` (iOS App Package)
- Submete automaticamente para a App Store (se configurado)

**Monitorar progresso**:
- Acesse [expo.dev/builds](https://expo.dev/builds)
- Ou execute: `eas build:list`

## Passo 4: Gerar Build Android

```bash
eas build --platform android --auto-submit
```

**Tempo estimado**: 15-25 minutos

**O que acontece**:
- EAS compila o app para Android
- Gera um arquivo `.aab` (Android App Bundle)
- Submete automaticamente para o Google Play (se configurado)

**Monitorar progresso**:
- Acesse [expo.dev/builds](https://expo.dev/builds)
- Ou execute: `eas build:list`

## Passo 5: Gerar Ambos os Builds Simultaneamente

```bash
eas build --platform all --auto-submit
```

**Tempo estimado**: 30-60 minutos (ambos em paralelo)

**Recomendado**: Use este comando para gerar iOS e Android ao mesmo tempo.

## Passo 6: Monitorar Builds

### Via CLI:
```bash
eas build:list
```

### Via Dashboard:
Acesse [expo.dev/builds](https://expo.dev/builds) para ver status em tempo real.

## Passo 7: Baixar Builds (Opcional)

Se não usar `--auto-submit`, você pode baixar os builds:

```bash
eas build:download --id <BUILD_ID>
```

## Troubleshooting

### Build falha com erro de certificado iOS
- Execute: `eas credentials`
- Selecione iOS
- Escolha "Generate new certificate"

### Build falha com erro de chave Android
- Execute: `eas credentials`
- Selecione Android
- Escolha "Generate new keystore"

### Build muito lento
- Verifique sua conexão de internet
- Tente novamente em outro horário

### Erro de autenticação
- Execute: `eas logout` e depois `eas login`
- Verifique suas credenciais do Expo

## Próximos Passos

1. **Após gerar builds**: Acompanhe em [expo.dev/builds](https://expo.dev/builds)
2. **Se usar auto-submit**: Builds serão enviados automaticamente para as lojas
3. **Se não usar auto-submit**: Você precisará submeter manualmente via:
   - **App Store Connect** para iOS
   - **Google Play Console** para Android

## Dicas

- Use `--auto-submit` para submissão automática (recomendado)
- Mantenha a janela do terminal aberta durante o build
- Você receberá notificações por email quando o build terminar
- Builds ficam disponíveis por 30 dias no EAS

## Referências

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [App Store Connect](https://appstoreconnect.apple.com)
- [Google Play Console](https://play.google.com/console)
