import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { colors, typography, spacing, borderRadius , useTheme, ThemeColors } from '../../theme';
import { Button } from '../../components/Button';
import {
  OPCOES_EMERGENCIA,
  MENSAGEM_INICIAL,
} from './chatEmergenciaData';

interface Mensagem {
  id: number;
  texto: string;
  isUser: boolean;
  mostrarMenu?: boolean;
}

export const ChatEmergenciaScreen = () => {
  const { colors } = useTheme();
  const styles = React.useMemo(() => createStyles(colors), [colors]);
  const [mensagens, setMensagens] = useState<Mensagem[]>([
    { id: 1, texto: MENSAGEM_INICIAL, isUser: false, mostrarMenu: true },
  ]);
  const [digitando, setDigitando] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const proximoId = useRef(2);

  useEffect(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, [mensagens, digitando]);

  const adicionarMensagem = (texto: string, isUser: boolean, mostrarMenu = false) => {
    setMensagens((prev) => [...prev, { id: proximoId.current++, texto, isUser, mostrarMenu }]);
  };

  const handleOpcao = (opcao: (typeof OPCOES_EMERGENCIA)[number]) => {
    adicionarMensagem(`${opcao.emoji} ${opcao.texto}`, true);
    setDigitando(true);
    setTimeout(() => {
      setDigitando(false);
      adicionarMensagem(opcao.resposta, false);
      setTimeout(() => {
        adicionarMensagem('Posso te ajudar com mais alguma coisa?', false, true);
      }, 800);
    }, 1600);
  };

  const reiniciar = () => {
    setMensagens([
      { id: proximoId.current++, texto: MENSAGEM_INICIAL, isUser: false, mostrarMenu: true },
    ]);
    setDigitando(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        style={styles.flex}
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
      >
        {mensagens.map((m) => (
          <View key={m.id} style={[styles.bolha, m.isUser ? styles.bolhaUser : styles.bolhaBot]}>
            <Text style={[styles.bolhaTexto, m.isUser && styles.bolhaTextoUser]}>{m.texto}</Text>
          </View>
        ))}

        {digitando && (
          <View style={[styles.bolha, styles.bolhaBot, styles.digitando]}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={styles.digitandoTexto}>Digitando...</Text>
          </View>
        )}

        {/* Menu de opções */}
        {!digitando && mensagens[mensagens.length - 1]?.mostrarMenu !== undefined && (
          <View style={styles.menu}>
            {OPCOES_EMERGENCIA.map((opcao) => (
              <TouchableOpacity
                key={opcao.id}
                style={styles.opcao}
                onPress={() => handleOpcao(opcao)}
                activeOpacity={0.7}
              >
                <Text style={styles.opcaoTexto}>
                  {opcao.emoji} {opcao.texto}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.rodape}>
        <Button
          title="Reiniciar conversa"
          variant="outline"
          onPress={reiniciar}
          style={styles.botaoReiniciar}
        />
        <View style={styles.aviso}>
          <Ionicons name="call" size={14} color={colors.error} />
          <Text style={styles.avisoTexto}>Crise agora? Ligue 188 (CVV) ou use o botão SOS.</Text>
        </View>
      </View>
    </View>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.cream,
  },
  flex: {
    flex: 1,
  },
  conteudo: {
    padding: spacing.base,
    paddingBottom: spacing.lg,
  },
  bolha: {
    maxWidth: '85%',
    borderRadius: borderRadius.lg,
    padding: spacing.base,
    marginBottom: spacing.sm,
  },
  bolhaBot: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: borderRadius.sm,
  },
  bolhaUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderBottomRightRadius: borderRadius.sm,
  },
  bolhaTexto: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    lineHeight: typography.size.sm * 1.5,
  },
  bolhaTextoUser: {
    color: colors.white,
  },
  digitando: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  digitandoTexto: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
  menu: {
    marginTop: spacing.sm,
    gap: spacing.xs,
  },
  opcao: {
    backgroundColor: colors.primaryTint,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.base,
    minHeight: 44,
    justifyContent: 'center',
  },
  opcaoTexto: {
    fontSize: typography.size.sm,
    color: colors.textPrimary,
    fontWeight: typography.weight.medium,
  },
  rodape: {
    padding: spacing.base,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.cream,
  },
  botaoReiniciar: {
    minHeight: 44,
  },
  aviso: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  avisoTexto: {
    fontSize: typography.size.xs,
    color: colors.textSecondary,
  },
});
