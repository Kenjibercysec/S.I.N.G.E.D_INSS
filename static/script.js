document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        id_tomb: parseInt(document.getElementById('id_tomb').value),
        tipo_de_disp: 'Computador',
        qnt_ram: parseInt(document.getElementById('qnt_ram').value),
        qnt_armaz: parseInt(document.getElementById('qnt_armaz').value),
        tipo_armaz: document.getElementById('tipo_armaz').value,
        marca: document.getElementById('marca').value,
        modelo: document.getElementById('modelo')?.value || 'Não especificado',
        funcionando: document.getElementById('funcionando').value === 'true',
        data_de_an: document.getElementById('data_de_an').value,
        locat_do_disp: document.getElementById('locat_do_disp').value,
        descricao: document.getElementById('descricao').value
    };

    try {
        const response = await fetch('/dispositivos/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert('Dispositivo cadastrado com sucesso!');
            window.location.href = '/';
        } else {
            const errorData = await response.json();
            alert(`Erro ao cadastrar dispositivo: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar dispositivo. Por favor, tente novamente.');
    }
});

document.getElementById('registroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const equipamentoId = document.getElementById('equipamentoId').value;
    const atividade = document.getElementById('atividade').value;

    const response = await fetch('http://localhost:8000/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ equipamentoId, atividade }),
    });

    if (response.ok) {
        alert('Atividade registrada com sucesso!');
    } else {
        alert('Erro ao registrar atividade');
    }
});

document.getElementById('deviceForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const deviceType = document.getElementById('deviceType').value;
    window.location.href = `cadpc.html?deviceType=${deviceType}`;
});

async function loadDevices() {
    try {
        const response = await fetch(`/dispositivos/`);
        if (!response.ok) {
            throw new Error('Erro ao carregar dispositivos');
        }
        const data = await response.json();
        displayDevices(data);
    } catch (error) {
        console.error("Erro ao carregar dispositivos:", error);
    }
}

function displayDevices(devices) {
    const infoBox = document.getElementById("info-box");
    infoBox.innerHTML = '';
    devices.forEach(device => {
        const deviceCard = document.createElement("div");
        deviceCard.classList.add("device-card");
        deviceCard.innerHTML = `
            <p><strong>Tipo de dispositivo:</strong> ${device.tipo_de_disp || "N/A"}</p>
            <p><strong>Nº de tombamento:</strong> ${device.id_tomb || "N/A"}</p>
            <div class="device-details">
                <p>Marca: ${device.marca || "N/A"}</p>
                <p>Quantidade de Memória RAM: ${device.qnt_ram || "N/A"}</p>
                <p>Quantidade de Armazenamento: ${device.qnt_armaz || "N/A"}</p>
                <p>Tipo de Armazenamento: ${device.tipo_armaz || "N/A"}</p>
                <p>Funcionando: ${device.funcionando ? "Sim" : "Não"}</p>
                <p>Local Atual do Dispositivo: ${device.locat_do_disp || "N/A"}</p>
                <p>Descrição: ${device.descricao || "N/A"}</p>
                <p>Data da Análise: ${device.data_de_an || "N/A"}</p>
                <div class="card-btns">
                    <button class="btn-b" onclick="editItem(${device.id_tomb})">Editar</button>
                    <button class="btn-c" onclick="deleteItem(${device.id_tomb})">Excluir</button>
                    <button class="btn-b" onclick="showHistory(${device.id_tomb})">Exibir Histórico</button>
                </div>
            </div>
        `;
        deviceCard.addEventListener('click', function() {
            const details = this.querySelector('.device-details');
            details.style.display = details.style.display === 'none' ? 'block' : 'none';
        });
        infoBox.appendChild(deviceCard);
    });
}

// Carregar todos os dispositivos na inicialização
loadDevices();

// Função de busca
document.getElementById('search-btn').addEventListener('click', async function() {
    const query = document.getElementById('search-bar').value;
    try {
        const response = await fetch(`/dispositivos/search/${query}`);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
            updateInfoBox(data.results);
        } else {
            alert('Nenhum dispositivo encontrado');
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao buscar dispositivos');
    }
});

function updateInfoBox(dispositivos) {
    const infoBox = document.getElementById('info-box');
    if (!infoBox) return;

    infoBox.innerHTML = '';
    dispositivos.forEach(dispositivo => {
        const dispositivoDiv = document.createElement('div');
        dispositivoDiv.className = 'dispositivo-item';
        dispositivoDiv.innerHTML = `
            <h3>Dispositivo #${dispositivo.id_tomb}</h3>
            <p><strong>Tipo:</strong> ${dispositivo.tipo_de_disp}</p>
            <p><strong>Marca:</strong> ${dispositivo.marca}</p>
            <p><strong>Modelo:</strong> ${dispositivo.modelo}</p>
            <p><strong>Localização:</strong> ${dispositivo.locat_do_disp}</p>
            <p><strong>Status:</strong> ${dispositivo.funcionando ? 'Funcionando' : 'Não funcionando'}</p>
            <div class="action-buttons">
                <button onclick="editItem(${dispositivo.id_tomb})">Editar</button>
                <button onclick="deleteItem(${dispositivo.id_tomb})">Excluir</button>
                <button onclick="showHistory(${dispositivo.id_tomb})">Histórico</button>
            </div>
        `;
        infoBox.appendChild(dispositivoDiv);
    });
}

async function editItem(id_tomb) {
    try {
        const response = await fetch(`/dispositivos/${id_tomb}`);
        const dispositivo = await response.json();
        
        // Preencher o formulário com os dados do dispositivo
        document.getElementById('id_tomb').value = dispositivo.id_tomb;
        document.getElementById('tipo_de_disp').value = dispositivo.tipo_de_disp;
        document.getElementById('qnt_ram').value = dispositivo.qnt_ram;
        document.getElementById('qnt_armaz').value = dispositivo.qnt_armaz;
        document.getElementById('tipo_armaz').value = dispositivo.tipo_armaz;
        document.getElementById('marca').value = dispositivo.marca;
        document.getElementById('modelo').value = dispositivo.modelo;
        document.getElementById('funcionando').value = dispositivo.funcionando;
        document.getElementById('data_de_an').value = dispositivo.data_de_an;
        document.getElementById('locat_do_disp').value = dispositivo.locat_do_disp;
        document.getElementById('descricao').value = dispositivo.descricao;
        
        // Mudar para modo de edição
        document.getElementById('cadastroForm').dataset.mode = 'edit';
        document.getElementById('cadastroForm').dataset.id = id_tomb;
        
        // Redirecionar para a página de cadastro
        window.location.href = '/cadpc';
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar dados do dispositivo');
    }
}

async function deleteItem(id_tomb) {
    if (confirm('Tem certeza que deseja excluir este dispositivo?')) {
        try {
            const response = await fetch(`/dispositivos/${id_tomb}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                alert('Dispositivo excluído com sucesso!');
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(`Erro ao excluir dispositivo: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao excluir dispositivo');
        }
    }
}

async function showHistory(id_tomb) {
    try {
        const response = await fetch(`/dispositivos/${id_tomb}/history`);
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            alert('Nenhum histórico encontrado para este dispositivo');
            return;
        }
        
        // Criar modal para exibir o histórico
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Histórico do Dispositivo #${id_tomb}</h2>
                <div class="history-list">
                    ${data.results.map(item => `
                        <div class="history-item">
                            <p><strong>Data:</strong> ${new Date(item.data_hora_alteracao).toLocaleString()}</p>
                            <p><strong>Campo:</strong> ${item.campo_alterado}</p>
                            <p><strong>Valor anterior:</strong> ${item.valor_antigo}</p>
                            <p><strong>Novo valor:</strong> ${item.valor_novo}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Adicionar o modal ao documento
        document.body.appendChild(modal);
        
        // Configurar o botão de fechar
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.remove();
        };
        
        // Fechar o modal ao clicar fora dele
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.remove();
            }
        };
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao carregar histórico');
    }
}

function toggleEditMode(id_tomb) {
    const isEditMode = document.getElementById('caract').dataset.editMode === 'true';
    
    if (!isEditMode) {
        // Entrar no modo de edição
        document.getElementById('caract').dataset.editMode = 'true';
        
        // Substituir spans por inputs com dropdowns
        const marca = document.getElementById('marca-text').textContent;
        document.getElementById('marca-text').outerHTML = `
            <select id="edit-marca" class="form-select">
                <option value="" disabled selected>Selecione a marca</option>
                <option value="positivo" ${marca === 'positivo' ? 'selected' : ''}>Positivo</option>
                <option value="Lenovo" ${marca === 'Lenovo' ? 'selected' : ''}>Lenovo</option>
                <option value="daten" ${marca === 'daten' ? 'selected' : ''}>Daten</option>
                <option value="dell" ${marca === 'dell' ? 'selected' : ''}>Dell</option>
                <option value="hp" ${marca === 'hp' ? 'selected' : ''}>HP</option>
                <option value="acer" ${marca === 'acer' ? 'selected' : ''}>Acer</option>
            </select>
        `;

        const qntRam = document.getElementById('qnt_ram-text').textContent;
        document.getElementById('qnt_ram-text').outerHTML = `
            <select id="edit-qnt_ram" class="form-select">
                <option value="" disabled selected>Quantidade de memória RAM</option>
                <option value="0" ${qntRam === '0' ? 'selected' : ''}>Sem memória RAM</option>
                <option value="1" ${qntRam === '1' ? 'selected' : ''}>1 GB</option>
                <option value="2" ${qntRam === '2' ? 'selected' : ''}>2 GB</option>
                <option value="4" ${qntRam === '4' ? 'selected' : ''}>4 GB</option>
                <option value="6" ${qntRam === '6' ? 'selected' : ''}>6 GB</option>
                <option value="8" ${qntRam === '8' ? 'selected' : ''}>8 GB</option>
                <option value="12" ${qntRam === '12' ? 'selected' : ''}>12 GB</option>
                <option value="16" ${qntRam === '16' ? 'selected' : ''}>16 GB</option>
            </select>
        `;

        const qntArmaz = document.getElementById('qnt_armaz-text').textContent;
        document.getElementById('qnt_armaz-text').outerHTML = `
            <select id="edit-qnt_armaz" class="form-select">
                <option value="" disabled selected>Quantidade de Armazenamento</option>
                <option value="0" ${qntArmaz === '0' ? 'selected' : ''}>Sem Armazenamento</option>
                <option value="120" ${qntArmaz === '120' ? 'selected' : ''}>120 GB</option>
                <option value="128" ${qntArmaz === '128' ? 'selected' : ''}>128 GB</option>
                <option value="160" ${qntArmaz === '160' ? 'selected' : ''}>160 GB</option>
                <option value="320" ${qntArmaz === '320' ? 'selected' : ''}>320 GB</option>
                <option value="500" ${qntArmaz === '500' ? 'selected' : ''}>500 GB</option>
                <option value="1000" ${qntArmaz === '1000' ? 'selected' : ''}>1 TB</option>
            </select>
        `;

        const tipoArmaz = document.getElementById('tipo_armaz-text').textContent;
        document.getElementById('tipo_armaz-text').outerHTML = `
            <select id="edit-tipo_armaz" class="form-select">
                <option value="" disabled selected>Tipo de Armazenamento</option>
                <option value="NAN" ${tipoArmaz === 'NAN' ? 'selected' : ''}>Sem Armazenamento</option>
                <option value="HDD" ${tipoArmaz === 'HDD' ? 'selected' : ''}>HDD</option>
                <option value="SSD" ${tipoArmaz === 'SSD' ? 'selected' : ''}>SSD</option>
            </select>
        `;

        const funcionando = document.getElementById('funcionando-text').textContent === 'Sim';
        document.getElementById('funcionando-text').outerHTML = `
            <select id="edit-funcionando" class="form-select">
                <option value="" disabled selected>Funcionando?</option>
                <option value="true" ${funcionando ? 'selected' : ''}>Sim</option>
                <option value="false" ${!funcionando ? 'selected' : ''}>Não</option>
            </select>
        `;

        document.getElementById('locat_do_disp-text').outerHTML = `<input type="text" id="edit-locat_do_disp" class="form-input" value="${document.getElementById('locat_do_disp-text').textContent}">`;
        document.getElementById('descricao-text').outerHTML = `<textarea id="edit-descricao" class="form-input desc">${document.getElementById('descricao-text').textContent}</textarea>`;
        document.getElementById('data_de_an-text').outerHTML = `<input type="date" id="edit-data_de_an" class="form-input" value="${document.getElementById('data_de_an-text').textContent}">`;

        // Atualizar botões
        document.querySelector('.card-btns').innerHTML = `
            <button class="btn-b" onclick="saveChanges(${id_tomb})">Salvar</button>
            <button class="btn-c" onclick="toggleEditMode(${id_tomb})">Cancelar</button>
            <button class="btn-b" onclick="showHistory(${id_tomb})">Exibir Histórico</button>
        `;
    } else {
        // Sair do modo de edição
        document.getElementById('caract').dataset.editMode = 'false';
        
        // Recarregar os dados do dispositivo
        const searchBar = document.getElementById("search-bar");
        searchBar.value = id_tomb;
        document.getElementById("search-btn").click();
    }
}

async function saveChanges(id_tomb) {
    const updatedData = {};
    const form = document.getElementById(`edit-form-${id_tomb}`);
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.value !== input.defaultValue) {
            updatedData[input.name] = input.value;
        }
    });

    try {
        const response = await fetch(`/dispositivos/${id_tomb}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Erro ao salvar alterações');
        }

        alert('Alterações salvas com sucesso!');
        toggleEditMode(id_tomb);
        location.reload(); // Recarrega a página para mostrar os dados atualizados
    } catch (error) {
        alert(error.message);
    }
}