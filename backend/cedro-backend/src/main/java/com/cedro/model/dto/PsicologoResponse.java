package com.cedro.model.dto;

import com.cedro.model.entity.Usuario;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

public class PsicologoResponse {
    
    private Integer id;
    private String nome;
    private String email;
    private String telefone;
    private String bio;
    private String especialidade;
    private String tipoPsicologo;
    
    @JsonProperty("precoSessao")
    private BigDecimal precoSessao;
    
    private BigDecimal avaliacao;
    
    @JsonProperty("fotoUrl")
    private String fotoUrl;

    private String crp;
    private String areaInteresse;

    private List<Integer> diasAtendimento;
    private List<String> horariosAtendimento;
    
    public PsicologoResponse() {}
    
    public PsicologoResponse(Integer id, String nome, String email, String telefone, 
                            String bio, String especialidade, BigDecimal precoSessao, 
                            BigDecimal avaliacao, String fotoUrl) {
        this.id = id;
        this.nome = nome;
        this.email = email;
        this.telefone = telefone;
        this.bio = bio;
        this.especialidade = especialidade;
        this.precoSessao = precoSessao;
        this.avaliacao = avaliacao;
        this.fotoUrl = fotoUrl;
    }

    public static PsicologoResponse fromUsuario(Usuario u) {
        PsicologoResponse p = new PsicologoResponse(
                u.getId(), u.getNome(), u.getEmail(), u.getTelefone(),
                u.getBio(), u.getEspecialidade(), u.getPrecoSessao(),
                u.getAvaliacao(), u.getFotoUrl());
        p.setCrp(u.getCrp());
        p.setTipoPsicologo(u.getTipoPsicologo());
        p.setAreaInteresse(u.getAreaInteresse());
        p.setDiasAtendimento(parseDias(u.getDiasAtendimento()));
        p.setHorariosAtendimento(parseHorarios(u.getHorariosAtendimento()));
        return p;
    }

    /** "1,2,3,5" (0=Domingo a 6=Sábado) -> [1,2,3,5] */
    public static List<Integer> parseDias(String valor) {
        if (valor == null || valor.isBlank()) return new ArrayList<>();
        List<Integer> dias = new ArrayList<>();
        for (String parte : valor.split(",")) {
            try {
                int d = Integer.parseInt(parte.trim());
                if (d >= 0 && d <= 6) dias.add(d);
            } catch (NumberFormatException ignored) {
                // ignora partes inválidas
            }
        }
        return dias;
    }

    /** "08:00,09:00,14:00" -> ["08:00","09:00","14:00"] */
    public static List<String> parseHorarios(String valor) {
        if (valor == null || valor.isBlank()) return new ArrayList<>();
        return Arrays.stream(valor.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .toList();
    }
    
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }
    
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    
    public String getEspecialidade() { return especialidade; }
    public void setEspecialidade(String especialidade) { this.especialidade = especialidade; }

    public String getTipoPsicologo() { return tipoPsicologo; }
    public void setTipoPsicologo(String tipoPsicologo) { this.tipoPsicologo = tipoPsicologo; }
    
    public BigDecimal getPrecoSessao() { return precoSessao; }
    public void setPrecoSessao(BigDecimal precoSessao) { this.precoSessao = precoSessao; }
    
    public BigDecimal getAvaliacao() { return avaliacao; }
    public void setAvaliacao(BigDecimal avaliacao) { this.avaliacao = avaliacao; }
    
    public String getFotoUrl() { return fotoUrl; }
    public void setFotoUrl(String fotoUrl) { this.fotoUrl = fotoUrl; }

    public String getCrp() { return crp; }
    public void setCrp(String crp) { this.crp = crp; }

    public String getAreaInteresse() { return areaInteresse; }
    public void setAreaInteresse(String areaInteresse) { this.areaInteresse = areaInteresse; }

    public List<Integer> getDiasAtendimento() { return diasAtendimento; }
    public void setDiasAtendimento(List<Integer> diasAtendimento) { this.diasAtendimento = diasAtendimento; }

    public List<String> getHorariosAtendimento() { return horariosAtendimento; }
    public void setHorariosAtendimento(List<String> horariosAtendimento) { this.horariosAtendimento = horariosAtendimento; }
}
