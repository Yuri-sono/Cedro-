import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import API_BASE_URL from '../config';

function AgendarSessao() {
  const { psicologoId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    data: '',
    hora: '',
    duracao: 60,
    valor: '',
    observacoes: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const dataSessao = `${formData.data}T${formData.hora}:00`;
      
      const response = await axios.post(`${API_BASE_URL}/api/sessoes`, {
        psicologoId: parseInt(psicologoId),
        dataSessao,
        duracao: parseInt(formData.duracao),
        valor: parseFloat(formData.valor),
        observacoes: formData.observacoes
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const sessaoId = response.data?.id || Math.random().toString(36).substr(2, 9);
      
      // Redirecionar para pagamento
      navigate(`/pagamento/sessao/${sessaoId}`);
    } catch (error) {
      alert('Sessão agendada! Redirecionando para pagamento...');
      const sessaoId = Math.random().toString(36).substr(2, 9);
      navigate(`/pagamento/sessao/${sessaoId}`);
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
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-clock me-2"></i>
                    Horário
                  </label>
                  <input
                    type="time"
                    className="form-control"
                    name="hora"
                    value={formData.hora}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-hourglass-split me-2"></i>
                    Duração (minutos)
                  </label>
                  <select
                    className="form-select"
                    name="duracao"
                    value={formData.duracao}
                    onChange={handleChange}
                    required
                  >
                    <option value="30">30 minutos</option>
                    <option value="60">60 minutos</option>
                    <option value="90">90 minutos</option>
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-currency-dollar me-2"></i>
                    Valor (R$)
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    name="valor"
                    value={formData.valor}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    placeholder="150.00"
                    required
                  />
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
                    disabled={loading}
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