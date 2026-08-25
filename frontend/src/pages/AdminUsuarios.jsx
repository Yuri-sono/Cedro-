import React, { useState, useEffect } from 'react';
import api from '../services/api.js';
import psicologoService from '../services/psicologoService';
import pacienteService from '../services/pacienteService';

function AdminUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [psicologos, setPsicologos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('usuarios');
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    especialidade: '',
    precoSessao: '',
    bio: '',
    dataNascimento: '',
    genero: ''
  });

  useEffect(() => {
    carregarTodos();
  }, []);

  const carregarTodos = async () => {
    try {
      const [usersRes, psicRes, pacRes] = await Promise.all([
        api.get('/api/usuarios'),
        psicologoService.listar(),
        pacienteService.listar()
      ]);
      setUsuarios(usersRes.data);
      setPsicologos(psicRes);
      setPacientes(pacRes);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleAtivo = async (id, ativo) => {
    try {
      await api.put(`/api/usuarios/${id}/ativar`, { ativo: !ativo });
      carregarTodos();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const deletarUsuario = async (id) => {
    if (!window.confirm('Deseja deletar?')) return;
    try {
      await api.delete(`/api/usuarios/${id}`);
      carregarTodos();
    } catch (error) {
      alert('Erro ao deletar');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dados = {
        ...formData,
        precoSessao: formData.precoSessao ? parseFloat(formData.precoSessao) : null
      };
      
      if (editando) {
        if (tab === 'psicologos') {
          await psicologoService.atualizar(editando, dados);
        } else {
          await pacienteService.atualizar(editando, dados);
        }
        alert('Atualizado!');
      } else {
        if (tab === 'psicologos') {
          await psicologoService.criar(dados);
        } else {
          await pacienteService.criar(dados);
        }
        alert('Criado!');
      }
      limparForm();
      carregarTodos();
    } catch (error) {
      alert('Erro ao salvar');
    }
  };

  const handleEditar = (item) => {
    setEditando(item.id);
    setFormData({
      nome: item.nome,
      email: item.email,
      senha: '',
      telefone: item.telefone || '',
      especialidade: item.especialidade || '',
      precoSessao: item.precoSessao || '',
      bio: item.bio || '',
      dataNascimento: item.dataNascimento || '',
      genero: item.genero || ''
    });
  };

  const handleDeletar = async (id) => {
    if (!window.confirm('Deseja desativar?')) return;
    try {
      if (tab === 'psicologos') {
        await psicologoService.deletar(id);
      } else {
        await pacienteService.deletar(id);
      }
      alert('Desativado!');
      carregarTodos();
    } catch (error) {
      alert('Erro');
    }
  };

  const limparForm = () => {
    setEditando(null);
    setFormData({
      nome: '',
      email: '',
      senha: '',
      telefone: '',
      especialidade: '',
      precoSessao: '',
      bio: '',
      dataNascimento: '',
      genero: ''
    });
  };

  const [busca, setBusca] = useState('');

  const iniciais = (nome) => {
    if (!nome) return '?';
    return nome.trim().split(/\s+/).slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const badgeTipo = (tipo) => {
    const map = { admin: 'admin', psicologo: 'psicologo', paciente: 'paciente' };
    return map[tipo] || 'outro';
  };

  const badgeStatus = (ativo) => (ativo ? 'ativo' : 'inativo');

  const filtrar = (lista, campos) => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return lista;
    return lista.filter(item => campos.some(campo => String(item[campo] || '').toLowerCase().includes(termo)));
  };

  const usuariosFiltrados = filtrar(usuarios, ['nome', 'email', 'tipoUsuario']);
  const psicologosFiltrados = filtrar(psicologos, ['nome', 'email', 'especialidade']);
  const pacientesFiltrados = filtrar(pacientes, ['nome', 'email', 'telefone']);

  const tipoLabel = (tipo) => {
    const map = { admin: 'Admin', psicologo: 'Psicólogo', paciente: 'Paciente' };
    return map[tipo] || tipo;
  };

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-5 admin-page">
      <nav aria-label="breadcrumb" className="mb-3">
        <ol className="breadcrumb mb-1">
          <li className="breadcrumb-item"><a href="/admin/dashboard" className="text-decoration-none">Dashboard</a></li>
          <li className="breadcrumb-item active" aria-current="page">Administração</li>
        </ol>
      </nav>

      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h1 className="admin-page-title mb-0">
          <i className="bi bi-sliders2 me-2"></i>Administração
        </h1>
        <div className="d-flex gap-2 flex-wrap">
          <span className="badge admin-count-badge">👥 {usuarios.length} usuários</span>
          <span className="badge admin-count-badge">🧑‍⚕️ {psicologos.length} psicólogos</span>
          <span className="badge admin-count-badge">🙋 {pacientes.length} pacientes</span>
        </div>
      </div>

      <ul className="nav nav-pills admin-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'usuarios' ? 'active' : ''}`} onClick={() => { setTab('usuarios'); setBusca(''); }}>
            <i className="bi bi-people me-1"></i> Usuários
            <span className="tab-count">{usuarios.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'psicologos' ? 'active' : ''}`} onClick={() => { setTab('psicologos'); setBusca(''); }}>
            <i className="bi bi-person-badge me-1"></i> Psicólogos
            <span className="tab-count">{psicologos.length}</span>
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'pacientes' ? 'active' : ''}`} onClick={() => { setTab('pacientes'); setBusca(''); }}>
            <i className="bi bi-person-heart me-1"></i> Pacientes
            <span className="tab-count">{pacientes.length}</span>
          </button>
        </li>
      </ul>

      <div className="admin-busca mb-4">
        <i className="bi bi-search"></i>
        <input
          type="text"
          className="form-control"
          placeholder={`Buscar ${tab === 'usuarios' ? 'usuários' : tab === 'psicologos' ? 'psicólogos' : 'pacientes'} por nome, e-mail...`}
          value={busca}
          onChange={e => setBusca(e.target.value)}
        />
        {busca && <button type="button" className="btn btn-link btn-clear-busca" onClick={() => setBusca('')}><i className="bi bi-x-circle"></i></button>}
      </div>

      {tab === 'usuarios' && (
        <div className="card admin-table-card">
          <div className="card-header admin-card-header">
            <h5 className="mb-0"><i className="bi bi-people me-2"></i>Todos os usuários</h5>
          </div>
          <div className="table-responsive">
            <table className="table admin-table mb-0">
              <thead>
                <tr>
                  <th>ID</th><th>Nome</th><th>Email</th><th>Tipo</th><th>Status</th><th className="text-end">Ações</th>
                </tr>
              </thead>
              <tbody>
                {usuariosFiltrados.length === 0 && (
                  <tr><td colSpan="6" className="text-center text-muted py-4"><i className="bi bi-inbox me-2"></i>Nenhum resultado encontrado</td></tr>
                )}
                {usuariosFiltrados.map(user => (
                  <tr key={user.id}>
                    <td><span className="admin-id">{user.id}</span></td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <span className="admin-avatar">{iniciais(user.nome)}</span>
                        <strong>{user.nome}</strong>
                      </div>
                    </td>
                    <td className="admin-email">{user.email}</td>
                    <td><span className={`badge tipo-badge tipo-${badgeTipo(user.tipoUsuario)}`}>{tipoLabel(user.tipoUsuario)}</span></td>
                    <td><span className={`badge status-badge status-${badgeStatus(user.ativo)}`}>{user.ativo ? 'Ativo' : 'Inativo'}</span></td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-action btn-toggle" onClick={() => toggleAtivo(user.id, user.ativo)}>
                        <i className={`bi ${user.ativo ? 'bi-pause-circle' : 'bi-play-circle'} me-1`}></i>{user.ativo ? 'Desativar' : 'Ativar'}
                      </button>
                      <button className="btn btn-sm btn-action btn-del" onClick={() => deletarUsuario(user.id)}>
                        <i className="bi bi-trash3 me-1"></i>Deletar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === 'psicologos' && (
        <>
          <div className="card admin-form-card mb-4">
            <div className="card-body">
              <h5 className="admin-form-title">{editando ? 'Editar' : 'Novo'} Psicólogo</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="email" className="form-control" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  {!editando && (
                    <div className="col-md-6 mb-3">
                      <input type="password" className="form-control" placeholder="Senha" value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} required />
                    </div>
                  )}
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Especialidade" value={formData.especialidade} onChange={(e) => setFormData({...formData, especialidade: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="number" className="form-control" placeholder="Preço" value={formData.precoSessao} onChange={(e) => setFormData({...formData, precoSessao: e.target.value})} step="0.01" />
                  </div>
                  <div className="col-12 mb-3">
                    <textarea className="form-control" placeholder="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} rows="2" />
                  </div>
                </div>
                <button type="submit" className="btn btn-primary me-2"><i className="bi bi-check-lg me-1"></i>{editando ? 'Atualizar' : 'Criar'}</button>
                {editando && <button type="button" className="btn btn-secondary" onClick={limparForm}>Cancelar</button>}
              </form>
            </div>
          </div>

          <div className="card admin-table-card">
            <div className="card-header admin-card-header">
              <h5 className="mb-0"><i className="bi bi-person-badge me-2"></i>Psicólogos cadastrados</h5>
            </div>
            <div className="table-responsive">
              <table className="table admin-table mb-0">
                <thead>
                  <tr><th>ID</th><th>Nome</th><th>Email</th><th>Especialidade</th><th>Preço</th><th className="text-end">Ações</th></tr>
                </thead>
                <tbody>
                  {psicologosFiltrados.length === 0 && (
                    <tr><td colSpan="6" className="text-center text-muted py-4"><i className="bi bi-inbox me-2"></i>Nenhum resultado encontrado</td></tr>
                  )}
                  {psicologosFiltrados.map(p => (
                    <tr key={p.id}>
                      <td><span className="admin-id">{p.id}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="admin-avatar admin-avatar-psicologo">{iniciais(p.nome)}</span>
                          <strong>{p.nome}</strong>
                        </div>
                      </td>
                      <td className="admin-email">{p.email}</td>
                      <td>{p.especialidade || '—'}</td>
                      <td className="fw-semibold text-success">R$ {p.precoSessao ?? '—'}</td>
                      <td className="text-end text-nowrap">
                        <button className="btn btn-sm btn-action btn-edit" onClick={() => handleEditar(p)}><i className="bi bi-pencil me-1"></i>Editar</button>
                        <button className="btn btn-sm btn-action btn-del" onClick={() => handleDeletar(p.id)}><i className="bi bi-stop-circle me-1"></i>Desativar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'pacientes' && (
        <>
          <div className="card admin-form-card mb-4">
            <div className="card-body">
              <h5 className="admin-form-title">{editando ? 'Editar' : 'Novo'} Paciente</h5>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Nome" value={formData.nome} onChange={(e) => setFormData({...formData, nome: e.target.value})} required />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="email" className="form-control" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                  </div>
                  {!editando && (
                    <div className="col-md-6 mb-3">
                      <input type="password" className="form-control" placeholder="Senha" value={formData.senha} onChange={(e) => setFormData({...formData, senha: e.target.value})} required />
                    </div>
                  )}
                  <div className="col-md-6 mb-3">
                    <input type="text" className="form-control" placeholder="Telefone" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <input type="date" className="form-control" placeholder="Data Nascimento" value={formData.dataNascimento} onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})} />
                  </div>
                  <div className="col-md-6 mb-3">
                    <select className="form-control" value={formData.genero} onChange={(e) => setFormData({...formData, genero: e.target.value})}>
                      <option value="">Gênero</option>
                      <option value="masculino">Masculino</option>
                      <option value="feminino">Feminino</option>
                      <option value="outro">Outro</option>
                    </select>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary me-2"><i className="bi bi-check-lg me-1"></i>{editando ? 'Atualizar' : 'Criar'}</button>
                {editando && <button type="button" className="btn btn-secondary" onClick={limparForm}>Cancelar</button>}
              </form>
            </div>
          </div>

          <div className="card admin-table-card">
            <div className="card-header admin-card-header">
              <h5 className="mb-0"><i className="bi bi-person-heart me-2"></i>Pacientes cadastrados</h5>
            </div>
            <div className="table-responsive">
              <table className="table admin-table mb-0">
                <thead>
                  <tr><th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th className="text-end">Ações</th></tr>
                </thead>
                <tbody>
                  {pacientesFiltrados.length === 0 && (
                    <tr><td colSpan="5" className="text-center text-muted py-4"><i className="bi bi-inbox me-2"></i>Nenhum resultado encontrado</td></tr>
                  )}
                  {pacientesFiltrados.map(p => (
                    <tr key={p.id}>
                      <td><span className="admin-id">{p.id}</span></td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <span className="admin-avatar admin-avatar-paciente">{iniciais(p.nome)}</span>
                          <strong>{p.nome}</strong>
                        </div>
                      </td>
                      <td className="admin-email">{p.email}</td>
                      <td>{p.telefone || '—'}</td>
                      <td className="text-end text-nowrap">
                        <button className="btn btn-sm btn-action btn-edit" onClick={() => handleEditar(p)}><i className="bi bi-pencil me-1"></i>Editar</button>
                        <button className="btn btn-sm btn-action btn-del" onClick={() => handleDeletar(p.id)}><i className="bi bi-trash3 me-1"></i>Deletar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AdminUsuarios;
