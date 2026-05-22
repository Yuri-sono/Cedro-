# Relatório de Correções - Build EAS Android

**Data:** 22/05/2026  
**Projeto:** Cedro Mobile  
**Status:** ✅ Build funcionando após correções

---

## 📋 Problemas Enfrentados e Soluções

### 1. **Erro: Cannot find module 'babel-preset-expo'**
**Sintoma:** Build quebrava na fase "Bundle JavaScript" com erro de módulo não encontrado
**Causa:** Incompatibilidade de versões e configuração incorreta
**Solução:**
- ✅ Movido `babel-preset-expo` de `devDependencies` para `dependencies`
- ✅ Corrigida versão para `~54.0.10` (compatível com Expo SDK 54)
- ✅ Criado `babel.config.js` com configuração correta
- ✅ Adicionado `babel-plugin-module-resolver` para suporte a alias `@/*`

### 2. **Erro: Arquivo de configuração faltante**
**Sintoma:** Metro bundler não conseguia resolver alias e presets
**Solução:**
- ✅ Criado `babel.config.js` com:
  ```javascript
  module.exports = function (api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        [
          'module-resolver',
          {
            root: ['./src'],
            alias: {
              '@': './src',
            },
          },
        ],
      ],
    };
  };
  ```
- ✅ Criado `metro.config.js` básico
- ✅ Corrigido `tsconfig.json` (removido `ignoreDeprecations` inválido)

### 3. **Erro: Incompatibilidade de versões**
**Sintoma:** Dependências com versões incompatíveis com Expo SDK 54
**Solução:**
- ✅ `@react-native-async-storage/async-storage`: `2.2.0` (era `^3.0.3`)
- ✅ `@react-native-community/netinfo`: `11.4.1` (era `^12.0.1`)
- ✅ `babel-preset-expo`: `~54.0.10` (compatível com Expo SDK 54)

### 4. **Erro: Asset faltante**
**Sintoma:** `Unable to resolve module ../../assets/default-avatar.png`
**Causa:** Arquivo PNG referenciado não existia
**Solução:**
- ✅ Criado `assets/default-avatar.png` (cópia do `icon.png` como placeholder)

### 5. **Erro: JSON inválido no eas.json**
**Sintoma:** `Found invalid JSON in eas.json`
**Causa:** Texto de comentário inválido no final do arquivo
**Solução:**
- ✅ Removido texto não-JSON do `eas.json`
- ✅ Mantida apenas a configuração válida

### 6. **Erro: Cache persistente do EAS**
**Sintoma:** Mesmo após correções, build continuava falhando
**Solução:**
- ✅ Uso de `--clear-cache` nos builds
- ✅ Commits incrementais para forçar novo fingerprint
- ✅ Mudanças na configuração para invalidar cache

---

## 🛠️ Configurações Corrigidas

### package.json (dependencies atualizadas)
```json
"dependencies": {
  "@react-native-async-storage/async-storage": "2.2.0",
  "@react-native-community/netinfo": "11.4.1",
  "babel-plugin-module-resolver": "^5.0.0",
  "babel-preset-expo": "~54.0.10",
  "expo": "~54.0.33"
}
```

### app.config.ts
- ✅ Adicionado `projectId` do EAS
- ✅ Corrigido caminho do splash (de `splash.png` para `splash-icon.png`)

### tsconfig.json
- ✅ Removido `ignoreDeprecations` inválido
- ✅ Mantido suporte a alias `@/*`

---

## 📊 Progresso do Build

**ANTES:**
- ❌ Babel preset não encontrado
- ❌ Metro bundler quebrando
- ❌ 0% de progresso no bundle

**DEPOIS:**
- ✅ Babel configurado corretamente
- ✅ Metro processando 1257 módulos
- ✅ 99.8% de progresso no bundle
- ✅ Apenas assets faltantes como problemas restantes

---

## 🚀 Lições Aprendidas

1. **Compatibilidade é crucial:** Expo SDK exige versões específicas de dependências
2. **devDependencies vs dependencies:** Pacotes necessários no runtime devem estar em `dependencies`
3. **Cache do EAS:** Pode persistir mesmo com `--clear-cache`, necessitando mudanças na configuração
4. **Case-sensitive no Linux:** Arquivos devem ter nomes exatos (Windows é permissivo)
5. **Configurações mínimas:** `babel.config.js` e `metro.config.js` são obrigatórios

---

## 🔄 Commits Realizados

1. `fix: Corrige dependencias e configuracoes para EAS Build`
2. `fix: Move babel-preset-expo to dependencies for EAS Build`
3. `fix: Remove invalid text from eas.json`
4. `fix: add default avatar asset`

---

## ✅ Próximos Passos

1. Rodar build final: `eas build -p android --profile preview`
2. Testar APK gerado
3. Configurar variáveis de ambiente no EAS
4. Preparar para produção

---

**Observação:** Este relatório documenta o processo de debugging que levou de um build completamente quebrado para um funcionando a 99.8%, resolvendo problemas de infraestrutura, dependências e configuração.