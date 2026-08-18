CONTEXTO
Cedro Plus. Melhorar a configuração de disponibilidade do psicólogo (tela
Configurações no web, PsychologistSettingsScreen no mobile). Hoje o psicólogo só
escolhe entre 9 horários fixos pré-definidos. Objetivo: dar liberdade de definir
uma faixa de horário customizada (início/fim), gerando os horários automaticamente,
mantendo a possibilidade de desmarcar horários individuais dentro da faixa.

NÃO alterar backend, banco de dados nem os endpoints — essa mudança é só de UI/UX
no frontend, reaproveitando os campos diasAtendimento/horariosAtendimento e o
payload já existente em PUT /api/auth/perfil.

=== WEB: frontend/src/pages/ConfiguracoesPsicologo.jsx ===

1. Em frontend/src/utils/psicologoAgenda.js, adicione uma nova função:

   export function gerarHorariosPorFaixa(horaInicio, horaFim) {
     // horaInicio e horaFim no formato "HH:mm" (ex: "07:00", "20:00")
     // Retorna array de strings "HH:mm" de hora em hora, incluindo horaInicio
     // e excluindo horaFim (horaFim é o fim do último atendimento, não um
     // horário de início válido). Ex: gerarHorariosPorFaixa("08:00","12:00")
     // retorna ["08:00","09:00","10:00","11:00"].
     // Validar: se horaFim <= horaInicio, retornar array vazio.
   }

2. No componente, adicione dois estados novos: faixaInicio e faixaFim (strings
   "HH:mm", inicializados vazios ou com o menor/maior valor de
   horariosAtendimento já salvo, se houver).

3. Na seção "Dias e Horários de Atendimento", ACIMA dos chips de horário atuais,
   adicione dois inputs type="time":
   - "Atender a partir de" (faixaInicio)
   - "Atender até" (faixaFim)
   - Um botão pequeno "Gerar horários" ao lado, que ao clicar chama
     gerarHorariosPorFaixa(faixaInicio, faixaFim) e SUBSTITUI o array
     horariosAtendimento pelo resultado (sobrescreve a seleção anterior).
   - Mostrar uma mensagem de erro inline se horaFim <= horaInicio ao tentar gerar.

4. Mantenha os chips de horário exatamente como estão hoje (clicáveis,
   toggleTimeSlot), mas agora eles devem renderizar dinamicamente a partir do
   array horariosAtendimento atual (que pode ter sido gerado pela faixa OU ainda
   conter os 9 horários fixos antigos se o psicólogo nunca usou a faixa nova) —
   ou seja, troque a fonte dos chips renderizados de DEFAULT_TIME_SLOTS fixo para
   horariosAtendimento (ordenado), permitindo desmarcar (toggleTimeSlot já
   remove do array) qualquer horário gerado.
   IMPORTANTE: se o psicólogo desmarcar um chip, o horário deve sumir da lista
   E não reaparecer se ele gerar a faixa de novo com os mesmos valores (ou seja,
   ao clicar "Gerar horários" de novo, é uma substituição total consciente,
   não uma mesclagem — isso já é o comportamento natural pedido no item 3).

5. Adicione um texto de ajuda pequeno abaixo dos inputs: "Os horários serão
   gerados de hora em hora dentro da faixa escolhida. Você pode remover horários
   específicos clicando neles depois de gerar (ex: para um horário de almoço)."

=== MOBILE: mobile/src/utils/psychologistAgenda.ts ===

1. Adicione a mesma função gerarHorariosPorFaixa (ou generateSlotsByRange, em
   inglês seguindo o padrão do arquivo), com a mesma lógica e assinatura.

2. Em mobile/src/screens/profile/PsychologistSettingsScreen.tsx:
   - Adicione dois estados: faixaInicio e faixaFim.
   - Adicione dois inputs de horário ANTES da grade de chips "Horarios
     disponiveis" (usar o componente Input já existente no projeto, com
     keyboardType apropriado, ou se houver um time picker nativo já usado em
     outra tela do projeto, reaproveitar o mesmo padrão — verifique antes de
     escolher).
   - Botão "Gerar horários" que substitui horariosAtendimento pelo resultado da
     função, mesma lógica do web.
   - Os chips de horário (DEFAULT_TIME_SLOTS hoje fixo) devem passar a renderizar
     a partir de horariosAtendimento (ordenado), mesma mudança do web.
   - Mesma mensagem de ajuda abaixo dos inputs.

=== VALIDAÇÃO ===
- Build web: npm run build
- Build mobile: npx tsc --noEmit
- Teste manual (documentar, não precisa executar): psicólogo define faixa
  07:00-20:00, clica "Gerar horários", vê 13 chips aparecerem (07h a 19h),
  desmarca o 12:00 (almoço), salva. Ao reabrir a tela, os 12 horários
  restantes devem aparecer marcados, sem o 12:00.

Ao final, resumo por arquivo alterado + resultado dos builds.