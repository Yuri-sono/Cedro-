import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from '../config';
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
        axios.get(`${API_BASE_URL}/api/usuarios`),
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
      await axios.put(`${API_BASE_URL}/api/usuarios/${id}/ativar`, { ativo: !ativo });
      carregarTodos();
    } catch (error) {
      alert('Erro ao atualizar status');
    }
  };

  const deletarUsuario = async (id) => {
    if (!window.confirm('Deseja deletar?')) return;
    try {
      await axios.delete(`${API_BASE_URL}/api/usuarios/${id}`);
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

  if (loading) return <div className="container mt-5 text-center"><div className="spinner-border"></div></div>;

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Administração</h1>
      
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${tab === 'usuarios' ? 'active' : ''}`} onClick={() => setTab('usuarios')}>Usuários</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'psicologos' ? 'active' : ''}`} onClick={() => setTab('psicologos')}>Psicólogos</button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${tab === 'pacientes' ? 'active' : ''}`} onClick={() => setTab('pacientes')}>Pacientes</button>
        </li>
      </ul>

      {tab === 'usuarios' && (


      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>Tipo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.nome}</td>
                <td>{user.email}</td>
                <td><span className="badge bg-primary">{user.tipoUsuario}</span></td>
                <td>
                  <span className={`badge ${user.ativo ? 'bg-success' : 'bg-danger'}`}>
                    {user.ativo ? 'Ativo' : 'Inativo'}
                  </span>
                </td>
                <td>
                  <button className="btn btn-sm btn-warning me-2" onClick={() => toggleAtivo(user.id, user.ativo)}>
                    {user.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button className="btn btn-sm btn-danger" onClick={() => deletarUsuario(user.id)}>
                    Deletar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}

      {tab === 'psicologos' && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h5>{editando ? 'Editar' : 'Novo'} Psicólogo</h5>
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
                <button type="submit" className="btn btn-primary me-2">{editando ? 'Atualizar' : 'Criar'}</button>
                {editando && <button type="button" className="btn btn-secondary" onClick={limparForm}>Cancelar</button>}
              </form>
            </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr><th>ID</th><th>Nome</th><th>Email</th><th>Especialidade</th><th>Preço</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {psicologos.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.nome}</td><td>{p.email}</td><td>{p.especialidade}</td><td>R$ {p.precoSessao}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeletar(p.id)}>Desativar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {tab === 'pacientes' && (
        <>
          <div className="card mb-4">
            <div className="card-body">
              <h5>{editando ? 'Editar' : 'Novo'} Paciente</h5>
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
                <button type="submit" className="btn btn-primary me-2">{editando ? 'Atualizar' : 'Criar'}</button>
                {editando && <button type="button" className="btn btn-secondary" onClick={limparForm}>Cancelar</button>}
              </form>
            </div>
          </div>
          <table className="table table-striped">
            <thead>
              <tr><th>ID</th><th>Nome</th><th>Email</th><th>Telefone</th><th>Ações</th></tr>
            </thead>
            <tbody>
              {pacientes.map(p => (
                <tr key={p.id}>
                  <td>{p.id}</td><td>{p.nome}</td><td>{p.email}</td><td>{p.telefone}</td>
                  <td>
                    <button className="btn btn-sm btn-warning me-2" onClick={() => handleEditar(p)}>Editar</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDeletar(p.id)}>Deletar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

export default AdminUsuarios;
