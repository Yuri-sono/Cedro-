import React, { useCallback, useEffect, useState } from 'react';
import api from '../services/api.js';

const initialFormNova = {
  pacienteId: '',
  data: '',
  observacoes: ''
};

/**
 * Modal compartilhado de criação de consulta.
 * Usado em ConsultasPsicologo.jsx e em PacientesPsicologo.jsx — evita duplicar
 * a lógica de seleção de paciente, data/horário e disponibilidade real.
 *
 * Props:
 * - show:               boolean que controla a exibição
 * - onClose:            callback ao fechar/cancelar
 * - psicologoId:        id do psicólogo logado (pacientes + disponibilidade)
 * - pacienteIdInicial:  (opcional) paciente pré-selecionado ao abrir
 * - onSuccess:          (opcional) callback após a consulta ser criada
 */
const NovaConsultaModal = ({
  show,
  onClose,
  psicologoId,
  pacienteIdInicial,
  onSuccess
}) => {
  const [salvando, setSalvando] = useState(false);
  const [pacientes, setPacientes] = useState([]);
  const [carregandoPacientes, setCarregandoPacientes] = useState(false);
  const [formNova, setFormNova] = useState(initialFormNova);
  const [disponibilidade, setDisponibilidade] = useState(null);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  const carregarPacientes = useCallback(async () => {
    if (!psicologoId) return;
    setCarregandoPacientes(true);
    try {
      const response = await api.get(`/api/psicologos/${psicologoId}/pacientes`);
      setPacientes(response.data || []);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
      window.alert(error?.response?.data?.error || 'Não foi possível carregar os pacientes.');
      setPacientes([]);
    } finally {
      setCarregandoPacientes(false);
    }
  }, [psicologoId]);

  // Ao abrir: reseta o formulário, pré-seleciona o paciente informado (se houver)
  // e recarrega a lista de pacientes.
  useEffect(() => {
    if (!show) return;
    setFormNova({
      ...initialFormNova,
      pacienteId: pacienteIdInicial ? String(pacienteIdInicial) : ''
    });
    setDisponibilidade(null);
    setHorarioSelecionado('');
    carregarPacientes();
  }, [show, pacienteIdInicial, carregarPacientes]);

  const handleNovaChange = (e) => {
    setFormNova((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Ao escolher a data, busca a disponibilidade real do psicólogo
  // (GET /api/sessoes/disponibilidade/{id}?data=YYYY-MM-DD — mesmo padrão de AgendarSessao).
  const handleDataChange = async (e) => {
    const data = e.target.value;
    setFormNova((prev) => ({ ...prev, data }));
    setHorarioSelecionado('');
    setDisponibilidade(null);

    if (!data) {
      setCarregandoHorarios(false);
      return;
    }

    setCarregandoHorarios(true);
    try {
      const response = await api.get(`/api/sessoes/disponibilidade/${psicologoId}`, { params: { data } });
      setDisponibilidade(response.data);
    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
      setDisponibilidade(null);
    } finally {
      setCarregandoHorarios(false);
    }
  };

  const confirmarNovaConsulta = async (e) => {
    e.preventDefault();
    if (!formNova.pacienteId || !formNova.data || !horarioSelecionado) return;
    setSalvando(true);

    try {
      const dataSessao = `${formNova.data}T${horarioSelecionado}:00`;
      await api.post('/api/sessoes', {
        pacienteId: parseInt(formNova.pacienteId, 10),
        dataSessao,
        duracao: 50,
        observacoes: formNova.observacoes
      });
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao criar consulta:', error);
      window.alert(error?.response?.data?.error || 'Erro ao criar consulta.');
    } finally {
      setSalvando(false);
    }
  };

  const hoje = new Date().toISOString().split('T')[0];

  if (!show) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} aria-hidden="true" />
      <div className="modal d-block" tabIndex="-1" role="dialog" aria-modal="true">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content border-0 shadow-lg">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold">Nova Consulta</h5>
              <button type="button" className="btn-close" aria-label="Fechar" onClick={onClose} />
            </div>
            <form onSubmit={confirmarNovaConsulta}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-2"></i>Paciente
                  </label>
                  <select
                    className="form-select"
                    name="pacienteId"
                    value={formNova.pacienteId}
                    onChange={handleNovaChange}
                    required
                    disabled={carregandoPacientes}
                  >
                    <option value="">{carregandoPacientes ? 'Carregando pacientes...' : 'Selecione o paciente...'}</option>
                    {pacientes.map((paciente) => (
                      <option key={paciente.id} value={paciente.id}>
                        {paciente.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar3 me-2"></i>Data da Consulta
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="data"
                    value={formNova.data}
                    onChange={handleDataChange}
                    min={hoje}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-clock me-2"></i>Horário
                  </label>
                  {carregandoHorarios ? (
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <span className="spinner-border spinner-border-sm"></span>
                      Carregando horários...
                    </div>
                  ) : (disponibilidade?.horariosDisponiveis?.length || 0) === 0 && disponibilidade ? (
                    <div className="alert alert-warning mb-0">
                      Nenhum horário disponível nesta data. Escolha outra data.
                    </div>
                  ) : disponibilidade ? (
                    <div className="d-flex flex-wrap gap-2">
                      {disponibilidade.horariosDisponiveis.map((horario) => {
                        const selected = horarioSelecionado === horario;
                        return (
                          <button
                            key={horario}
                            type="button"
                            className={`btn btn-sm rounded-pill px-3 ${selected ? 'btn-primary' : 'btn-outline-secondary'}`}
                            onClick={() => setHorarioSelecionado(horario)}
                          >
                            {horario}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <small className="text-muted">Escolha uma data para ver os horários disponíveis.</small>
                  )}
                </div>

                <div className="mb-2">
                  <label className="form-label">
                    <i className="bi bi-chat-left-text me-2"></i>Observações (opcional)
                  </label>
                  <textarea
                    className="form-control"
                    name="observacoes"
                    value={formNova.observacoes}
                    onChange={handleNovaChange}
                    rows="3"
                    placeholder="Alguma informação adicional..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button type="button" className="btn btn-outline-secondary" onClick={onClose}>
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={salvando || !formNova.pacienteId || !formNova.data || !horarioSelecionado}
                >
                  {salvando ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check-circle me-2"></i>
                      Confirmar Consulta
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default NovaConsultaModal;
