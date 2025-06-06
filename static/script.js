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
    console.log("Iniciando exibição de dispositivos:", devices);
    const infoBox = document.getElementById("info-box");
    if (!infoBox) {
        console.error("Elemento info-box não encontrado");
        return;
    }
    
    // Limpar conteúdo atual
    infoBox.innerHTML = '';
    
    if (!devices || !Array.isArray(devices) || devices.length === 0) {
        console.log("Nenhum dispositivo para exibir");
        infoBox.innerHTML = '<p>Nenhum dispositivo encontrado</p>';
        return;
    }
    
    devices.forEach(device => {
        console.log("Processando dispositivo:", device);
        
        // Clonar a estrutura HTML existente
        const template = `
            <div class="info-box">
                <div class="info-box-internal" id="info-box-internal">
                        <div type="button" class="btn-info-box">
                            <p><strong>Tipo de dispositivo:</strong> ${device.tipo_de_disp || "N/A"}</p>   
                        <p><strong>Nº de tombamento:</strong> ${device.id_tomb || "N/A"}</p>
                        </div>
                    <div class="caract" id="caract-${device.id_tomb}">
                        <p>Marca: <span class="editable" data-field="marca">${device.marca || "N/A"}</span></p>
                        ${device.tipo_de_disp && device.tipo_de_disp.toLowerCase() === 'computador' ? `
                            <p>Quantidade de Memória RAM: <span class="editable" data-field="qnt_ram">${device.qnt_ram || "N/A"} GB</span></p>
                            <p>Quantidade de Armazenamento: <span class="editable" data-field="qnt_armaz">${device.qnt_armaz || "N/A"} GB</span></p>
                            <p>Tipo de Armazenamento: <span class="editable" data-field="tipo_armaz">${device.tipo_armaz || "N/A"}</span></p>
                        ` : `
                            <p>Modelo: <span class="editable" data-field="modelo">${device.modelo || "N/A"}</span></p>
                        `}
                        <p>Funcionando: <span class="editable" data-field="funcionando">${device.funcionando ? "Sim" : "Não"}</span></p>
                        <p>Local Atual do Dispositivo: <span class="editable" data-field="locat_do_disp">${device.locat_do_disp || "N/A"}</span></p>
                        <p>Descrição: <span class="editable" data-field="descricao">${device.descricao || "N/A"}</span></p>
                        <p>Data da Análise: <span class="editable" data-field="data_de_an">${device.data_de_an || "N/A"}</span></p>
                        <div class="card-btns">
                            <button class="btn-b" onclick="toggleEditMode(${device.id_tomb})">Editar</button>
                            <button class="btn-c" onclick="deleteItem(${device.id_tomb})">Excluir</button>
                            <button class="btn-b" onclick="showHistory(${device.id_tomb})">Exibir Histórico</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Adicionar o dispositivo ao container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template;
        const deviceElement = tempDiv.firstElementChild;
        
        // Adicionar evento de clique para mostrar/esconder detalhes
        const btnInfoBox = deviceElement.querySelector('.btn-info-box');
        const caract = deviceElement.querySelector('.caract');
        btnInfoBox.addEventListener('click', function() {
            caract.style.display = caract.style.display === 'none' ? 'block' : 'none';
        });
        
        infoBox.appendChild(deviceElement);
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
        // Redirecionar para a página de edição com o ID do dispositivo
        window.location.href = `/cadpc?id=${id_tomb}`;
    } catch (error) {
        console.error('Erro ao editar dispositivo:', error);
        alert('Erro ao editar dispositivo. Por favor, tente novamente.');
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
                // Recarregar a lista de dispositivos
                loadDevices();
            } else {
                const errorData = await response.json();
                alert(`Erro ao excluir dispositivo: ${errorData.detail}`);
            }
        } catch (error) {
            console.error('Erro ao excluir dispositivo:', error);
            alert('Erro ao excluir dispositivo. Por favor, tente novamente.');
        }
    }
}

async function showHistory(id_tomb) {
    try {
        const response = await fetch(`/dispositivos/${id_tomb}/history`);
        if (!response.ok) {
            throw new Error('Erro ao carregar histórico');
        }
        
        const history = await response.json();
        
        // Criar e exibir o modal com o histórico
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close">&times;</span>
                <h2>Histórico de Alterações</h2>
                <div class="history-list">
                    ${history.map(item => `
                        <div class="history-item">
                            <p><strong>Data:</strong> ${new Date(item.data_alteracao).toLocaleString()}</p>
                            <p><strong>Campo:</strong> ${item.campo_alterado}</p>
                            <p><strong>Valor Anterior:</strong> ${item.valor_anterior}</p>
                            <p><strong>Novo Valor:</strong> ${item.novo_valor}</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Adicionar evento para fechar o modal
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.remove();
        }
        
        // Fechar modal ao clicar fora dele
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.remove();
            }
        }
    } catch (error) {
        console.error('Erro ao carregar histórico:', error);
        alert('Erro ao carregar histórico. Por favor, tente novamente.');
    }
}

function toggleEditMode(id_tomb) {
    const caract = document.getElementById(`caract-${id_tomb}`);
    const editables = caract.querySelectorAll('.editable');
    const editButton = caract.querySelector('.btn-b');

    // Remove existing listeners to avoid duplicates
    editButton.removeEventListener('click', saveChanges);
    editButton.onclick = null; // Clear existing onclick if any

    if (editButton.textContent === 'Editar') {
        // Entrar no modo de edição
        editables.forEach(span => {
            const currentValue = span.textContent.trim(); // Trim whitespace
            const field = span.dataset.field;

            let inputElement;

            if (field === 'funcionando') {
                inputElement = document.createElement('select');
                inputElement.innerHTML = `
                    <option value="true" ${currentValue === 'Sim' ? 'selected' : ''}>Sim</option>
                    <option value="false" ${currentValue === 'Não' ? 'selected' : ''}>Não</option>
                `;
            } else if (field === 'data_de_an') {
                inputElement = document.createElement('input');
                inputElement.type = 'date';
                // Formatar a data para YYYY-MM-DD se não for 'N/A'
                if (currentValue && currentValue !== 'N/A') {
                    const parts = currentValue.split('/');
                     // Assumindo formato DD/MM/YYYY
                    if (parts.length === 3) {
                        inputElement.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    } else {
                         // Tentar usar o valor atual se não for o formato esperado
                         inputElement.value = currentValue;
                    }
                } else {
                    inputElement.value = ''; // Campo vazio se for N/A
                }
            } else if (field === 'marca') {
                 inputElement = document.createElement('select');
                 inputElement.innerHTML = `
                    <option value="">Selecione a marca</option>
                    <option value="Positivo" ${currentValue.toLowerCase() === 'positivo' ? 'selected' : ''}>Positivo</option>
                    <option value="Lenovo" ${currentValue.toLowerCase() === 'lenovo' ? 'selected' : ''}>Lenovo</option>
                    <option value="Daten" ${currentValue.toLowerCase() === 'daten' ? 'selected' : ''}>Daten</option>
                    <option value="Dell" ${currentValue.toLowerCase() === 'dell' ? 'selected' : ''}>Dell</option>
                    <option value="Acer" ${currentValue.toLowerCase() === 'acer' ? 'selected' : ''}>Acer</option>
                    <option value="Outro" ${!['positivo', 'lenovo', 'daten', 'dell', 'acer'].includes(currentValue.toLowerCase()) && currentValue !== 'N/A' ? 'selected' : ''}>Outro</option>
                 `;
            } else if (field === 'qnt_ram') {
                inputElement = document.createElement('select');
                 inputElement.innerHTML = `
                    <option value="">Quantidade de memória RAM</option>
                    <option value="0" ${currentValue === '0 GB' ? 'selected' : ''}>0</option>
                    <option value="1" ${currentValue === '1 GB' ? 'selected' : ''}>1</option>
                    <option value="2" ${currentValue === '2 GB' ? 'selected' : ''}>2</option>
                    <option value="4" ${currentValue === '4 GB' ? 'selected' : ''}>4</option>
                    <option value="6" ${currentValue === '6 GB' ? 'selected' : ''}>6</option>
                    <option value="8" ${currentValue === '8 GB' ? 'selected' : ''}>8</option>
                    <option value="12" ${currentValue === '12 GB' ? 'selected' : ''}>12</option>
                    <option value="16" ${currentValue === '16 GB' ? 'selected' : ''}>16</option>
                 `;
            } else if (field === 'qnt_armaz') {
                inputElement = document.createElement('select');
                 inputElement.innerHTML = `
                    <option value="">Quantidade de Armazenamento</option>
                    <option value="0" ${currentValue === '0 GB' ? 'selected' : ''}>0</option>
                    <option value="120" ${currentValue === '120 GB' ? 'selected' : ''}>120</option>
                    <option value="128" ${currentValue === '128 GB' ? 'selected' : ''}>128</option>
                    <option value="160" ${currentValue === '160 GB' ? 'selected' : ''}>160</option>
                    <option value="240" ${currentValue === '240 GB' ? 'selected' : ''}>240</option>
                    <option value="256" ${currentValue === '256 GB' ? 'selected' : ''}>256</option>
                    <option value="320" ${currentValue === '320 GB' ? 'selected' : ''}>320</option>
                    <option value="500" ${currentValue === '500 GB' ? 'selected' : ''}>500</option>
                    <option value="1000" ${currentValue === '1000 GB' || currentValue === '1 TB' ? 'selected' : ''}>1000</option>
                 `;
            } else if (field === 'tipo_armaz') {
                 inputElement = document.createElement('select');
                 inputElement.innerHTML = `
                    <option value="">Tipo de Armazenamento</option>
                    <option value="NAN" ${currentValue === 'NAN' ? 'selected' : ''}>NAN</option>
                    <option value="HDD" ${currentValue === 'HDD' ? 'selected' : ''}>HDD</option>
                    <option value="SSD" ${currentValue === 'SSD' ? 'selected' : ''}>SSD</option>
                 `;
            } else if (field === 'descricao') {
                inputElement = document.createElement('textarea');
                inputElement.value = currentValue;
                inputElement.className = 'form-input desc'; // Apply description class if needed
            } else {
                // Default for other fields (like modelo, locat_do_disp)
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.value = currentValue;
            }

            // Copy dataset for saveChanges
            inputElement.dataset.field = field;
            inputElement.className += ' form-input'; // Add a common class for styling
            span.replaceWith(inputElement);
        });

        editButton.textContent = 'Salvar';
        editButton.dataset.id = id_tomb; // Store id_tomb in the button
        editButton.addEventListener('click', saveChanges); // Add event listener

        // Add Cancel button
        const cardBtns = caract.querySelector('.card-btns');
        const cancelButton = document.createElement('button');
        cancelButton.className = 'btn-c';
        cancelButton.textContent = 'Cancelar';
        cancelButton.onclick = () => toggleEditMode(id_tomb); // Revert changes
        cardBtns.insertBefore(cancelButton, editButton.nextSibling);

    } else {
        // Sair do modo de edição (Cancelar ou após Salvar)
        const saveButton = caract.querySelector('.card-btns button:first-child');
        const cancelButton = caract.querySelector('.card-btns .btn-c');

        // Remove event listener from Save button before removing/reverting
        saveButton.removeEventListener('click', saveChanges);

        // Remove Cancel button
        if (cancelButton) {
            cancelButton.remove();
        }

        caract.querySelectorAll('input, select, textarea').forEach(input => {
            const field = input.dataset.field;
            const newSpan = document.createElement('span');
            newSpan.className = 'editable';
            newSpan.dataset.field = field;

            // Convert value back to display text
            if (field === 'funcionando') {
                newSpan.textContent = input.value === 'true' ? 'Sim' : 'Não';
            } else if (field === 'qnt_ram' || field === 'qnt_armaz') {
                 newSpan.textContent = input.value ? `${input.value} GB` : 'N/A';
                 if (field === 'qnt_armaz' && input.value === '1000') newSpan.textContent = '1 TB'; // Special case for 1TB
            } else if (field === 'tipo_armaz') {
                newSpan.textContent = input.value || 'N/A';
            } else if (field === 'marca' || field === 'modelo' || field === 'locat_do_disp' || field === 'descricao') {
                newSpan.textContent = input.value || 'N/A';
            } else if (field === 'data_de_an') {
                 // Formatar a data de volta para DD/MM/YYYY
                 if (input.value) {
                     const parts = input.value.split('-');
                     if (parts.length === 3) {
                         newSpan.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
                     } else {
                          newSpan.textContent = input.value; // Fallback if format is unexpected
                     }
                 } else {
                      newSpan.textContent = 'N/A';
                 }
            } else {
                newSpan.textContent = input.value || 'N/A';
            }

            input.replaceWith(newSpan);
        });

        // Restore Edit button functionality
        editButton.textContent = 'Editar';
        editButton.onclick = () => toggleEditMode(id_tomb);
    }
}

async function saveChanges(event) {
    event.preventDefault(); // Prevent default form submission if any

    const saveButton = event.target; // Get the clicked button
    const id_tomb = saveButton.dataset.id; // Get id_tomb from button dataset

    console.log(`ID do botão Salvar (data-id): ${id_tomb}`); // NOVO LOG AQUI

    if (!id_tomb) {
        console.error('ID do dispositivo não encontrado no botão de salvar!');
        alert('Erro interno: ID do dispositivo não encontrado.');
        return;
    }

    const caract = document.getElementById(`caract-${id_tomb}`);
    const inputs = caract.querySelectorAll('input, select, textarea'); // Include textarea
    // Montar objeto com todos os campos esperados pelo backend
    const changes = {
        id_tomb: parseInt(id_tomb), // Ensure id_tomb is an integer
        // tipo_de_disp is not editable in this view, assume it's always 'Computador' or get it from non-editable span if needed
        tipo_de_disp: caract.querySelector('p strong') ? caract.querySelector('p strong').nextSibling.textContent.replace('<strong>Tipo de dispositivo:</strong>', '').trim() : "Computador",
        qnt_ram: null,
        qnt_armaz: null,
        tipo_armaz: "",
        marca: "",
        modelo: "",
        funcionando: null,
        data_de_an: null,
        locat_do_disp: "",
        descricao: ""
    };

    inputs.forEach(input => {
        const field = input.dataset.field; // Get field from dataset
        if (field) {
            if (field === 'funcionando') {
                changes[field] = input.value === 'true';
            } else if (field === 'qnt_ram' || field === 'qnt_armaz') {
                changes[field] = input.value ? parseInt(input.value) : null;
            } else if (field === 'data_de_an') {
                 changes[field] = input.value || null;
            } else {
                changes[field] = input.value || "";
            }
        }
    });

    // Handle non-editable fields that need to be sent (like tipo_de_disp if not in span dataset)
     if (!changes.tipo_de_disp || changes.tipo_de_disp === 'N/A') {
         const tipoDispElement = caract.parentElement.querySelector('.btn-info-box p strong');
         if (tipoDispElement && tipoDispElement.nextSibling) {
             changes.tipo_de_disp = tipoDispElement.nextSibling.textContent.replace('<strong>Tipo de dispositivo:</strong>', '').trim() || "Computador";
         }
     }

    try {
        console.log(`Attempting PUT for dispositivo ID: ${id_tomb}`); // Log no frontend
        console.log('Sending data:', changes); // Log data being sent
        const response = await fetch(`/dispositivos/${id_tomb}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(changes)
        });
        if (response.ok) {
            // No need to parse JSON on success based on backend (returns DispositivoOut)
            alert('Alterações salvas com sucesso!');
             toggleEditMode(parseInt(id_tomb)); // Exit edit mode, ensure ID is int
            loadDevices(); // Recarregar a lista
        } else {
            const error = await response.json();
            let msg = '';
            if (error.detail) {
                if (Array.isArray(error.detail)) {
                    msg = error.detail.map(e => `${e.loc ? e.loc.join('.') + ': ' : ''}${e.msg}`).join('\n');
                } else {
                    msg = error.detail;
                }
            } else {
                msg = JSON.stringify(error);
            }
            alert(`Erro ao salvar alterações:\n${msg}`);
             // Do not exit edit mode on error, allow user to fix
        }
    } catch (error) {
        alert('Erro ao salvar alterações. Por favor, tente novamente.');
        console.error('Erro ao salvar alterações:', error);
         // Do not exit edit mode on error, allow user to fix
    }
}