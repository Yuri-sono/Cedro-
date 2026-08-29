import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api.js';

function AgendarSessao() {
  const { psicologoId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);
  const [disponibilidade, setDisponibilidade] = useState(null);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [horarioSelecionado, setHorarioSelecionado] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Ao escolher a data, consulta a disponibilidade real do psicólogo
  // (GET /api/sessoes/disponibilidade/{psicologoId}?data=YYYY-MM-DD).
  const handleDataChange = async (e) => {
    const data = e.target.value;
    setFormData((prev) => ({ ...prev, data }));
    setHorarioSelecionado('');
    setDisponibilidade(null);

    if (!data) {
      setCarregandoHorarios(false);
      return;
    }

    setCarregandoHorarios(true);
    try {
      const response = await api.get(
        `/api/sessoes/disponibilidade/${psicologoId}`,
        { params: { data } }
      );
      setDisponibilidade(response.data);
    } catch (error) {
      console.error('Erro ao carregar disponibilidade:', error);
      setDisponibilidade(null);
    } finally {
      setCarregandoHorarios(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.data || !horarioSelecionado) return;
    setLoading(true);

    try {
      const dataSessao = `${formData.data}T${horarioSelecionado}:00`;
      
      const response = await api.post('/api/sessoes', {
        psicologoId: parseInt(psicologoId),
        dataSessao,
        duracao: 50,
        observacoes: formData.observacoes
      });

      const sessaoId = response.data?.id;
      navigate(`/pagamento/sessao/${sessaoId}`);
    } catch (error) {
      const msg = error.response?.data?.error || 'Erro ao agendar sessão';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow">
            <div className="card-body p-4">
              <div className="text-center mb-4">
                <div className="bg-primary bg-gradient rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: '80px', height: '80px' }}>
                  <i className="bi bi-calendar-plus text-white" style={{ fontSize: '2rem' }}></i>
                </div>
                <h2 className="fw-bold">Agendar Sessão</h2>
                <p className="text-muted">Preencha os dados para agendar sua sessão</p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-calendar3 me-2"></i>
                    Data da Sessão
                  </label>
                  <input
                    type="date"
                    className="form-control"
                    name="data"
                    value={formData.data}
                    onChange={handleDataChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-clock me-2"></i>
                    Horário
                  </label>

                  {carregandoHorarios ? (
                    <div className="text-muted">
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Carregando horários...
                    </div>
                  ) : !formData.data ? (
                    <p className="text-muted mb-0">
                      Selecione uma data para ver os horários disponíveis.
                    </p>
                  ) : disponibilidade?.atendeNesteDia === false ? (
                    <div className="alert alert-warning mb-0">
                      Este psicólogo não atende neste dia da semana. Escolha outra data.
                    </div>
                  ) : (disponibilidade?.horariosDisponiveis?.length || 0) === 0 ? (
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
                  ) : null}
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    <i className="bi bi-chat-left-text me-2"></i>
                    Observações (opcional)
                  </label>
                  <textarea
                    className="form-control"
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Alguma informação adicional..."
                  ></textarea>
                </div>

                <div className="d-grid gap-2">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg"
                    disabled={loading || !horarioSelecionado}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Agendando...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-credit-card me-2"></i>
                        Agendar e Pagar
                      </>
                    )}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AgendarSessao;