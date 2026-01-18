# 🚀 Início Rápido - S.I.N.G.E.D INSS com Docker

Siga estes passos simples para ter o sistema rodando em minutos!

## ⚡ 3 Passos Simples

### 1️⃣ Instalar Docker

**Você já tem Docker instalado?** Teste com:
```bash
docker --version
```

Se não aparecer a versão do Docker, [clique aqui para instalar](INSTALACAO-DOCKER.md).

### 2️⃣ Baixar o Projeto

Se ainda não baixou:
```bash
git clone <URL_DO_REPOSITORIO>
cd S.I.N.G.E.D_INSS
```

### 3️⃣ Executar

```bash
docker-compose up -d
```

**Pronto!** 🎉

## 🌐 Acessar o Sistema

Abra seu navegador e acesse:
```
http://localhost:8080
```

**Login:**
- Usuário: `admin`
- Senha: `inss`

## 🛑 Parar o Sistema

```bash
docker-compose down
```

## 📱 Acessar de Outros Computadores

1. Descubra o IP do seu computador:
   
   **Windows:**
   ```cmd
   ipconfig
   ```
   Procure por "Endereço IPv4" (ex: 192.168.1.100)
   
   **Linux/Mac:**
   ```bash
   ip addr
   ```
   ou
   ```bash
   ifconfig
   ```

2. Nos outros computadores, acesse:
   ```
   http://192.168.1.100:8080
   ```
   (substitua pelo seu IP)

3. Configure o firewall para permitir a porta 8080:
   
   **Windows:**
   - Painel de Controle → Firewall → Permitir aplicativo
   - Adicionar porta 8080
   
   **Linux:**
   ```bash
   sudo ufw allow 8080
   ```

## 🔄 Comandos Úteis

```bash
# Ver se está rodando
docker-compose ps

# Ver logs
docker-compose logs -f

# Parar
docker-compose down

# Reiniciar
docker-compose restart

# Atualizar após mudanças
docker-compose up -d --build
```

## 📊 O que o Sistema Faz?

- ✅ Cadastrar computadores e dispositivos
- ✅ Consultar inventário completo
- ✅ Buscar com filtros avançados
- ✅ Ver histórico de alterações
- ✅ Dashboard com gráficos
- ✅ Gerenciar opções do sistema

## 🆘 Problemas?

### Sistema não abre?
```bash
# Ver o que está acontecendo
docker-compose logs

# Reiniciar
docker-compose restart
```

### Porta 8080 em uso?
Edite o arquivo `docker-compose.yml` e mude a porta:
```yaml
ports:
  - "8081:8080"  # Use 8081 em vez de 8080
```

Depois acesse: http://localhost:8081

### Dados não salvam?
Certifique-se que a pasta `data/` existe:
```bash
mkdir -p data
docker-compose restart
```

## 💾 Backup

Seus dados estão em:
- `./data/dispositivos.db` - Banco de dados
- `./static/options.json` - Configurações

Copie esses arquivos para fazer backup!

## 📚 Mais Informações

- [Guia Completo Docker](README-DOCKER.md)
- [Instalar Docker](INSTALACAO-DOCKER.md)
- [README Principal](README.md)

## ✨ Dicas

1. O container reinicia automaticamente quando você reinicia o computador
2. Os dados são salvos e não são perdidos
3. Você pode rodar em múltiplos computadores simultaneamente
4. Cada computador terá seu próprio banco de dados

---

**Dúvidas?** Abra uma issue no repositório! 🤝
