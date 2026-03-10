import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavbarPsicologo from '../components/NavbarPsicologo.jsx';
import SidebarPsicologo from '../components/SidebarPsicologo.jsx';
import axios from 'axios';
import API_BASE_URL from '../config.js';

const PerfilPsicologo = () => {
  const navigate = useNavigate();
  const [editando, setEditando] = useState(false);
  const [psicologo, setPsicologo] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    especialidade: '',
    precoSessao: '',
    bio: '',
    fotoUrl: ''
  });

  useEffect(() => {
    const psicologoLogado = localStorage.getItem('psicologoLogado');
    if (!psicologoLogado) {
      navigate('/login-psicologo');
      return;
    }
    const dados = JSON.parse(psicologoLogado);
    const dataNasc = (dados.dataNascimento || dados.data_nascimento) ? (dados.dataNascimento || dados.data_nascimento).split('T')[0] : '';
    setPsicologo({
      nome: dados.nome || '',
      email: dados.email || '',
      telefone: dados.telefone || '',
      dataNascimento: dataNasc,
      especialidade: dados.especialidade || '',
      precoSessao: dados.precoSessao || dados.preco_sessao || '',
      bio: dados.bio || '',
      fotoUrl: dados.fotoUrl || dados.foto_url || ''
    });
  }, [navigate]);

  const handleChange = (e) => {
    setPsicologo({ ...psicologo, [e.target.name]: e.target.value });
  };

  const handleSalvar = async () => {
    try {
      const token = localStorage.getItem('token');
      const psicologoLogado = JSON.parse(localStorage.getItem('psicologoLogado'));
      
      await axios.put(`${API_BASE_URL}/api/usuarios/${psicologoLogado.id}`, psicologo, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.setItem('psicologoLogado', JSON.stringify({ ...psicologoLogado, ...psicologo }));
      alert('Perfil atualizado com sucesso!');
      setEditando(false);
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert('Erro ao salvar perfil');
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64 = reader.result;
        try {
          const token = localStorage.getItem('token');
          await axios.put(`${API_BASE_URL}/api/auth/foto-perfil`, 
            { fotoUrl: base64 },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setPsicologo({ ...psicologo, fotoUrl: base64 });
          const psicologoLogado = JSON.parse(localStorage.getItem('psicologoLogado'));
          localStorage.setItem('psicologoLogado', JSON.stringify({ ...psicologoLogado, fotoUrl: base64 }));
          alert('Foto atualizada com sucesso!');
        } catch (error) {
          console.error('Erro ao atualizar foto:', error);
          alert('Erro ao atualizar foto');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="dashboard-psicologo">
      <NavbarPsicologo psicologo={psicologo} />

      <div className="container-fluid py-4">
        <div className="row">
          <SidebarPsicologo />

          <div className="col-md-9 col-lg-10">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <div className="profile-avatar" style={psicologo.fotoUrl ? {
                      backgroundImage: `url(${psicologo.fotoUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    } : {}}>
                      {!psicologo.fotoUrl && <i className="bi bi-person-fill"></i>}
                    </div>
                    <label htmlFor="foto-upload" className="position-absolute bottom-0 end-0 btn btn-primary btn-sm rounded-circle" 
                           style={{width: '40px', height: '40px', cursor: 'pointer'}}>
                      <i className="bi bi-camera-fill"></i>
                    </label>
                    <input 
                      type="file" 
                      id="foto-upload" 
                      accept="image/*" 
                      onChange={handleFotoChange}
                      style={{display: 'none'}}
                    />
                  </div>
                  <h2 className="fw-bold mb-1">{psicologo.nome}</h2>
                  <p className="text-muted">{psicologo.email}</p>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Nome</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nome"
                      value={psicologo.nome}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={psicologo.email}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Telefone</label>
                    <input
                      type="tel"
                      className="form-control"
                      name="telefone"
                      value={psicologo.telefone}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Data de Nascimento</label>
                    <input
                      type="date"
                      className="form-control"
                      name="dataNascimento"
                      value={psicologo.dataNascimento}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Especialidade</label>
                    <input
                      type="text"
                      className="form-control"
                      name="especialidade"
                      value={psicologo.especialidade}
                      onChange={handleChange}
                      disabled={!editando}
                    />
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label">Preço da Sessão (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precoSessao"
                      value={psicologo.precoSessao}
                      onChange={handleChange}
                      disabled={!editando}
                      step="0.01"
                    />
                  </div>
                </div>



                <div className="mb-3">
                  <label className="form-label">Biografia</label>
                  <textarea
                    className="form-control"
                    rows="4"
                    name="bio"
                    value={psicologo.bio}
                    onChange={handleChange}
                    disabled={!editando}
                  ></textarea>
                </div>

                <div className="d-flex gap-2">
                  {!editando ? (
                    <button className="btn btn-primary" onClick={() => setEditando(true)}>
                      <i className="bi bi-pencil me-1"></i>Editar Perfil
                    </button>
                  ) : (
                    <>
                      <button className="btn btn-success" onClick={handleSalvar}>
                        <i className="bi bi-check-lg me-1"></i>Salvar
                      </button>
                      <button className="btn btn-secondary" onClick={() => setEditando(false)}>
                        <i className="bi bi-x-lg me-1"></i>Cancelar
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPsicologo;
