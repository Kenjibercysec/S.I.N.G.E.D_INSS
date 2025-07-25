document.addEventListener('DOMContentLoaded', function() {
    // LÓGICA PARA EXIBIR/ESCONDER O DROPDOWN DE FILTROS
    const filterBtn = document.getElementById('advanced-filter-btn');
    const filterContent = document.getElementById('advanced-filter-content');

    if (filterBtn && filterContent) {
        // Ao clicar no botão de filtros
        filterBtn.addEventListener('click', function(e) {
            e.stopPropagation(); // Impede que o clique se propague para o document
            const isVisible = filterContent.style.display === 'block';
            filterContent.style.display = isVisible ? 'none' : 'block';

            // Se o filtro acabou de se tornar visível, preenche as opções
            if (!isVisible) {
                // A função `preencherFiltrosAvancados` precisa ser definida ou estar acessível aqui
                if (typeof preencherFiltrosAvancados === 'function') {
                    preencherFiltrosAvancados();
                }
            }
        });

        // Ao clicar fora do dropdown, ele se fecha
        document.addEventListener('click', function(event) {
            if (!filterContent.contains(event.target) && event.target !== filterBtn) {
                filterContent.style.display = 'none';
            }
        });
    }

    // Cadastro PC
    const cadastroForm = document.getElementById('cadastroForm');
    if (cadastroForm) {
        cadastroForm.addEventListener('submit', async (e) => {
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
                descricao: document.getElementById('descricao').value,
                estagiario: document.getElementById('estagiario').value
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
    }
    // Registro atividade
    const registroForm = document.getElementById('registroForm');
    if (registroForm) {
        registroForm.addEventListener('submit', async (e) => {
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
    }
    // Device form
    const deviceForm = document.getElementById('deviceForm');
    if (deviceForm) {
        deviceForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const deviceType = document.getElementById('deviceType').value;
            window.location.href = `cadpc.html?deviceType=${deviceType}`;
        });
    }
    // Busca simples
    const searchBtn = document.getElementById('search-btn');
    if (searchBtn) {
        searchBtn.addEventListener('click', async function() {
            const query = document.getElementById('search-bar').value.trim();
            updateDeviceList(query);
        });
    }
    const searchBar = document.getElementById("search-bar");
    if (searchBar) {
        searchBar.addEventListener("input", function() {
            const query = this.value.trim();
            updateDeviceList(query);
        });
    }
    // Filtro avançado
    const applyAdvancedFilter = document.getElementById('apply-advanced-filter');
    if (applyAdvancedFilter) {
        applyAdvancedFilter.addEventListener('click', function() {
            const params = {};
            const tipo_de_disp = document.getElementById('filter-tipo_de_disp').value.trim();
            const marca = document.getElementById('filter-marca').value.trim();
            const modelo = document.getElementById('filter-modelo').value.trim();
            const funcionando = document.getElementById('filter-funcionando').value;
            const tipo_armaz = document.getElementById('filter-tipo_armaz').value.trim();
            const qnt_ram = document.getElementById('filter-qnt_ram').value.trim();
            const qnt_armaz = document.getElementById('filter-qnt_armaz').value.trim();
            const estagiario = document.getElementById('filter-estagiario').value.trim();

            if (modelo) params.modelo = modelo;
            if (tipo_de_disp) params.tipo_de_disp = tipo_de_disp;
            if (marca) params.marca = marca;
            if (funcionando) params.funcionando = funcionando;
            if (tipo_armaz) params.tipo_armaz = tipo_armaz;
            if (qnt_ram) params.qnt_ram = qnt_ram;
            if (qnt_armaz) params.qnt_armaz = qnt_armaz;
            if (estagiario) params.estagiario = estagiario; 

            // Montar query string
            const queryString = Object.keys(params).map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join('&');
            let url = '/dispositivos/search/';
            // Se não houver nenhum filtro, busca todos
            if (queryString) {
                url += `?${queryString}`;
            }
            fetch(url)
                .then(response => response.json())
                .then(data => {
                    displayDevices(data.results || []);
                    document.getElementById('advanced-filter-content').style.display = 'none';
                })
                .catch(error => {
                    console.error('Erro ao buscar dispositivos:', error);
                    alert('Erro ao buscar dispositivos');
                });
        });
    }
    // Carregar todos os dispositivos na inicialização
    loadDevices();

    // Preencher selects do filtro avançado com opções do options.json
    async function preencherFiltrosAvancados() {
        try {
            const response = await fetch('/static/options.json');
            const options = await response.json();

            // Marca (unificada)
            const marcaSelect = document.getElementById('filter-marca');
            if (marcaSelect) {
                let marcas = [];
                if (options.marcas) marcas = marcas.concat(options.marcas);
                if (options.marcas_outros) marcas = marcas.concat(options.marcas_outros);
                marcas = [...new Set(marcas)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
                marcaSelect.innerHTML = '<option value="">Qualquer</option>' +
                    marcas.map(marca => `<option value="${marca}">${marca}</option>`).join('');
            }

            const modeloSelect = document.getElementById('filter-modelo');
            if(modeloSelect) {
                let modelos = [];
                if (options.modelos_pc) modelos = modelos.concat(options.modelos_pc);
                if (options.modelos_outros) modelos = modelos.concat(options.modelos_outros);
                modelos = [...new Set(modelos)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
                modeloSelect.innerHTML = '<option value="">Qualquer</option>' + 
                    modelos.map(modelo => `<option value="${modelo}">${modelo}</option>`).join('');
            }
            // Tipo de Dispositivo (unificado)
            const tipoDispSelect = document.getElementById('filter-tipo_de_disp');
            if (tipoDispSelect) {
                let tipos = [];
                if (options.tipos_dispositivo) tipos = tipos.concat(options.tipos_dispositivo);
                if (options.tipos_outros) tipos = tipos.concat(options.tipos_outros);
                tipos = [...new Set(tipos)].sort((a, b) => a.localeCompare(b, 'pt-BR'));
                tipoDispSelect.innerHTML = '<option value="">Qualquer</option>' +
                    tipos.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('');
            }

            // Tipo de Armazenamento
            const tipoArmazSelect = document.getElementById('filter-tipo_armaz');
            if (tipoArmazSelect && options.tipos_armazenamento) {
                tipoArmazSelect.innerHTML = '<option value="">Qualquer</option>' +
                    options.tipos_armazenamento.map(tipo => `<option value="${tipo}">${tipo}</option>`).join('');
            }

            // RAM
            const ramSelect = document.getElementById('filter-qnt_ram');
            if (ramSelect && options.quantidades_ram) {
                ramSelect.innerHTML = '<option value="">Qualquer</option>' +
                    options.quantidades_ram.map(ram => `<option value="${ram}">${ram} GB</option>`).join('');
            }

            // Quantidade de Armazenamento
            const qntArmazSelect = document.getElementById('filter-qnt_armaz');
            if (qntArmazSelect && options.quantidades_armazenamento) {
                qntArmazSelect.innerHTML = '<option value="">Qualquer</option>' +
                    options.quantidades_armazenamento.map(qtd => 
                        `<option value="${qtd}">${qtd === '1000' ? '1 TB' : qtd + ' GB'}</option>`
                    ).join('');
            }

            // Estagiário
            const estagiarioSelect = document.getElementById('filter-estagiario');
            if (estagiarioSelect && options.estagiarios) {
                estagiarioSelect.innerHTML = '<option value="">Qualquer</option>' +
                    options.estagiarios.map(est => `<option value="${est}">${est}</option>`).join('');
            }
        } catch (e) {
            console.error('Erro ao carregar opções para filtros avançados:', e);
        }
    }

    // Preencher filtros sempre que o dropdown for aberto
    const filterBtnAvancado = document.getElementById('advanced-filter-btn');
    if (filterBtnAvancado) {
        filterBtnAvancado.addEventListener('click', preencherFiltrosAvancados);
    }
});

async function loadDevices() {
    try {
        const response = await fetch(`/dispositivos/`);
        if (!response.ok) {
            throw new Error('Erro ao carregar dispositivos');
        }
        const data = await response.json();
        displayDevices(data); // Corrigido aqui
    } catch (error) {
        console.error("Erro ao carregar dispositivos:", error);
    }
}

function displayDevices(devices) {
    const infoBox = document.getElementById("info-box");
    if (!infoBox) return;
    infoBox.innerHTML = '';

    if (!devices || !Array.isArray(devices) || devices.length === 0) {
        infoBox.innerHTML = '<p>Nenhum dispositivo encontrado</p>';
        return;
    }

    devices.forEach(device => {
        // Defina aqui os tipos que devem ser considerados "computador"
        const tipo = (device.tipo_de_disp || "").toLowerCase();
        const isComputador = ["computador", "desktop", "notebook", "all-in-one"].some(t => tipo.includes(t));

        let template = `
            <div class="info-box">
                <div class="info-box-internal" id="info-box-internal">
                    <div type="button" class="btn-info-box">
                        <p><strong>Tipo de dispositivo:</strong> ${device.tipo_de_disp || "N/A"}</p>   
                        <p><strong>Nº de tombamento:</strong> ${device.id_tomb || "N/A"}</p>
                    </div>
                    <div class="caract" id="caract-${device.id_tomb}">
                        <p>Marca: <span class="editable" data-field="marca">${device.marca || "N/A"}</span></p>
                        <p>Modelo: <span class="editable" data-field="modelo">${device.modelo || "N/A"}</span></p>
        `;

        // Só exibe RAM e armazenamento para computadores
        if (isComputador) {
            template += `
                <p>Quantidade de Memória RAM: <span class="editable" data-field="qnt_ram">${device.qnt_ram !== undefined && device.qnt_ram !== null ? device.qnt_ram + ' GB' : "N/A"}</span></p>
                <p>Quantidade de Armazenamento: <span class="editable" data-field="qnt_armaz">${device.qnt_armaz !== undefined && device.qnt_armaz !== null ? (device.qnt_armaz === 1000 ? '1 TB' : device.qnt_armaz + ' GB') : "N/A"}</span></p>
                <p>Tipo de Armazenamento: <span class="editable" data-field="tipo_armaz">${device.tipo_armaz || "N/A"}</span></p>
            `;
        }

        template += `
                        <p>Funcionando: <span class="editable" data-field="funcionando">${device.funcionando === true ? "Sim" : device.funcionando === false ? "Não" : "N/A"}</span></p>
                        <p>Local Atual do Dispositivo: <span class="editable" data-field="locat_do_disp">${device.locat_do_disp || "N/A"}</span></p>
                        <p>Descrição: <span class="editable" data-field="descricao">${device.descricao || "N/A"}</span></p>
                        <p>Data da Análise: <span class="editable" data-field="data_de_an">${formatDateBR(device.data_de_an)}</span></p>
                        <p>Estagiário: <span class="editable" data-field="estagiario">${device.estagiario || "N/A"}</span></p>
                        <div class="card-btns">
                            <button class="btn-b" onclick="toggleEditMode(${device.id_tomb})">Editar</button>
                            <button class="btn-c" onclick="deleteItem(${device.id_tomb})">Excluir</button>
                            <button class="btn-b" onclick="showHistory(${device.id_tomb})">Exibir Histórico</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = template;
        const deviceElement = tempDiv.firstElementChild;
        const btnInfoBox = deviceElement.querySelector('.btn-info-box');
        const caract = deviceElement.querySelector('.caract');
        btnInfoBox.addEventListener('click', function() {
            caract.style.display = caract.style.display === 'block' ? 'none' : 'block';
        });
        infoBox.appendChild(deviceElement);
    });
}

// Função de busca simples (barra de busca)
document.getElementById('search-btn').addEventListener('click', async function() {
    const query = document.getElementById('search-bar').value.trim();
    updateDeviceList(query);
});

const searchBar = document.getElementById("search-bar");
searchBar.addEventListener("input", function() {
    const query = this.value.trim();
    updateDeviceList(query);
});

async function updateDeviceList(query = '') {
    try {
        let url = '/dispositivos/search/';
        if (query) {
            url += `?q=${encodeURIComponent(query)}`;
        }
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Erro na busca');
        }
        const data = await response.json();
        displayDevices(data.results || data);
    } catch (error) {
        console.error("Erro ao buscar dispositivos:", error);
    }
}

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
            <p><strong>Estagiário:</strong> ${dispositivo.estagiario || "N/A"}</p>
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
    console.log("showHistory chamado com id_tomb:", id_tomb);
    try {
        const modal = document.getElementById("modal-history");
        const contentDiv = document.getElementById("history-content");

        contentDiv.innerHTML = "<p>Carregando...</p>";
        modal.style.display = "block";

        const response = await fetch(`/dispositivos/${id_tomb}/history`);
        if (!response.ok) {
            throw new Error('Erro ao carregar histórico');
        }

        const responseJson = await response.json();
        const historyArr = responseJson.results;

        if (!historyArr || !Array.isArray(historyArr) || historyArr.length === 0) {
            contentDiv.innerHTML = "<p>Nenhuma alteração registrada.</p>";
            return;
        }

        let historyHtml = "";
        for (const item of historyArr) {
            const estado = item.estado_anterior || {};
            historyHtml += `
                <div style="margin-bottom: 12px; padding: 10px; background: #f4f8ff; border-left: 4px solid #0047a5; border-radius: 6px;">
                    <p><strong>Data da alteração:</strong> ${item.data_hora_alteracao || '---'}</p>
                    <p><strong>Nº Tombamento:</strong> ${estado.id_tomb || '---'}</p>
                    <p><strong>Tipo de Dispositivo:</strong> ${estado.tipo_de_disp || '---'}</p>
                    <p><strong>Marca:</strong> ${estado.marca || '---'}</p>
                    <p><strong>Modelo:</strong> ${estado.modelo || '---'}</p>
                    <p><strong>Quantidade de RAM:</strong> ${estado.qnt_ram || '---'}</p>
                    <p><strong>Quantidade de Armazenamento:</strong> ${estado.qnt_armaz || '---'}</p>
                    <p><strong>Tipo de Armazenamento:</strong> ${estado.tipo_armaz || '---'}</p>
                    <p><strong>Funcionando:</strong> ${estado.funcionando === true ? 'Sim' : estado.funcionando === false ? 'Não' : '---'}</p>
                    <p><strong>Local Atual:</strong> ${estado.locat_do_disp || '---'}</p>
                    <p><strong>Descrição:</strong> ${estado.descricao || '---'}</p>
                    <p><strong>Data da Análise:</strong> ${estado.data_de_an || '---'}</p>
                    <p><strong>Estagiário:</strong> ${estado.estagiario || '---'}</p>
                </div>
            `;
        }

        contentDiv.innerHTML = historyHtml || "<p>Nenhuma alteração registrada.</p>";
    } catch (error) {
        console.error("Erro ao carregar histórico:", error);
        document.getElementById("history-content").innerHTML = "<p style='color: red;'>Erro ao carregar histórico.</p>";
    }
}

function closeHistory() {
    const modal = document.getElementById("modal-history");
    if (modal) {
        modal.style.display = "none";
    }
}

async function loadOptions() {
    try {
        const response = await fetch('/admin/options');
        return await response.json();
    } catch (error) {
        console.error('Erro ao carregar opções:', error);
        return null;
    }
}

// function getAdvancedFilterParams() {
//     const params = {};
//     const tipo_de_dispEl = document.getElementById('filter-tipo_de_disp');
//     const marcaEl = document.getElementById('filter-marca');
//     const funcionandoEl = document.getElementById('filter-funcionando');
//     const tipo_armazEl = document.getElementById('filter-tipo_armaz');
//     const qnt_ramEl = document.getElementById('filter-qnt_ram');
//     const qnt_armazEl = document.getElementById('filter-qnt_armaz');
//     const estagiarioEl = document.getElementById('filter-estagiario');

//     if (tipo_de_dispEl && tipo_de_dispEl.value.trim()) {
//         params.tipo_de_disp = tipo_de_dispEl.value.trim();
//     }
//     if (marcaEl && marcaEl.value.trim()) {
//         params.marca = marcaEl.value.trim();
//     }
//     if (funcionandoEl && funcionandoEl.value) {
//         params.funcionando = funcionandoEl.value;
//     }
//     if (tipo_armazEl && tipo_armazEl.value.trim()) {
//         params.tipo_armaz = tipo_armazEl.value.trim();
//     }
//     if (qnt_ramEl && qnt_ramEl.value.trim()) {
//         params.qnt_ram = qnt_ramEl.value.trim();
//     }
//     if (qnt_armazEl && qnt_armazEl.value.trim()) {
//         params.qnt_armaz = qnt_armazEl.value.trim();
//     }
//     if (estagiarioEl && estagiarioEl.value.trim()) {
//         params.estagiario = estagiarioEl.value.trim();
//     }

//     return params;
// }
async function toggleEditMode(id_tomb) {
    const caract = document.getElementById(`caract-${id_tomb}`);
    const editables = caract.querySelectorAll('.editable');
    const editButton = caract.querySelector('.btn-b');

    editButton.removeEventListener('click', saveChanges);
    editButton.onclick = null;

    const tipoText = caract.parentElement.querySelector('.btn-info-box p').textContent || "";
    const tipo = tipoText.replace("Tipo de dispositivo:", "").trim().toLowerCase();
    const isComputador = ["computador", "desktop", "notebook", "all-in-one"].some(t => tipo.includes(t));

    if (editButton.textContent === 'Editar') {
        const options = await loadOptions();
        if (!options) {
            alert('Erro ao carregar opções. Por favor, tente novamente.');
            return;
        }

        editables.forEach(span => {
            const field = span.dataset.field;
            const currentValue = span.textContent.trim();
            let inputElement;

            if (field === 'modelo') {
                inputElement = document.createElement('select');
                const modelos = isComputador ? options.modelos_pc : options.modelo_outros;
                inputElement.innerHTML = `
                    <option value="">Selecione o modelo</option>
                    ${modelos.map(modelo => `
                        <option value="${modelo}" ${currentValue.toLowerCase() === modelo.toLowerCase() ? 'selected' : ''}>${modelo}</option>
                    `).join('')}
                `;
            } else if (field === 'marca') {
                inputElement = document.createElement('select');
                const marcas = isComputador ? options.marcas : options.marcas_outros;
                inputElement.innerHTML = `
                    <option value="">Selecione a marca</option>
                    ${marcas.map(marca => `
                        <option value="${marca}" ${currentValue.toLowerCase() === marca.toLowerCase() ? 'selected' : ''}>${marca}</option>
                    `).join('')}
                `;
            } else if (field === 'tipo') {
                inputElement = document.createElement('select');
                const tipos = isComputador ? options.tipos_dispositivo : options.tipos_outros;
                inputElement.innerHTML = `
                    <option value="">Selecione o tipo</option>
                    ${tipos.map(t => `
                        <option value="${t}" ${currentValue.toLowerCase() === t.toLowerCase() ? 'selected' : ''}>${t}</option>
                    `).join('')}
                `;
            } else if (field === 'qnt_ram') {
                inputElement = document.createElement('select');
                inputElement.innerHTML = `
                    <option value="">Quantidade de memória RAM</option>
                    ${options.quantidades_ram.map(qtd => `
                        <option value="${qtd}" ${currentValue === `${qtd} GB` ? 'selected' : ''}>${qtd}</option>
                    `).join('')}
                `;
            } else if (field === 'qnt_armaz') {
                inputElement = document.createElement('select');
                inputElement.innerHTML = `
                    <option value="">Quantidade de Armazenamento</option>
                    ${options.quantidades_armazenamento.map(qtd => `
                        <option value="${qtd}" ${currentValue === `${qtd} GB` || (qtd === '1000' && currentValue === '1 TB') ? 'selected' : ''}>${qtd}</option>
                    `).join('')}
                `;
            } else if (field === 'tipo_armaz') {
                inputElement = document.createElement('select');
                inputElement.innerHTML = `
                    <option value="">Tipo de Armazenamento</option>
                    ${options.tipos_armazenamento.map(tipo => `
                        <option value="${tipo}" ${currentValue === tipo ? 'selected' : ''}>${tipo}</option>
                    `).join('')}
                `;
            } else if (field === 'funcionando') {
                inputElement = document.createElement('select');
                inputElement.innerHTML = `
                    <option value="true" ${currentValue === 'Sim' ? 'selected' : ''}>Sim</option>
                    <option value="false" ${currentValue === 'Não' ? 'selected' : ''}>Não</option>
                `;
            } else if (field === 'estagiario') {
                inputElement = document.createElement('select');
                inputElement.innerHTML = `
                    <option value="">Estagiário</option>
                    ${options.estagiarios.map(estagiario => `
                        <option value="${estagiario}" ${currentValue === estagiario ? 'selected' : ''}>${estagiario}</option>
                    `).join('')}
                `;
            } else if (field === 'data_de_an') {
                inputElement = document.createElement('input');
                inputElement.type = 'date';
                if (currentValue && currentValue !== 'N/A') {
                    const parts = currentValue.split('/');
                    if (parts.length === 3) {
                        inputElement.value = `${parts[2]}-${parts[1]}-${parts[0]}`;
                    } else {
                        inputElement.value = currentValue;
                    }
                } else {
                    inputElement.value = '';
                }
            } else if (field === 'descricao') {
                inputElement = document.createElement('textarea');
                inputElement.value = currentValue;
                inputElement.className = 'form-input desc';
            } else {
                inputElement = document.createElement('input');
                inputElement.type = 'text';
                inputElement.value = currentValue;
            }

            inputElement.dataset.field = field;
            inputElement.className += ' form-input';
            span.replaceWith(inputElement);
        });

        editButton.textContent = 'Salvar';
        editButton.dataset.id = id_tomb;
        editButton.addEventListener('click', saveChanges);
    } else {
        // sair do modo de edição
        caract.querySelectorAll('input, select, textarea').forEach(input => {
            const field = input.dataset.field;
            const newSpan = document.createElement('span');
            newSpan.className = 'editable';
            newSpan.dataset.field = field;

            if (field === 'funcionando') {
                newSpan.textContent = input.value === 'true' ? 'Sim' : 'Não';
            } else if (field === 'qnt_ram' || field === 'qnt_armaz') {
                newSpan.textContent = input.value ? `${input.value} GB` : 'N/A';
                if (field === 'qnt_armaz' && input.value === '1000') newSpan.textContent = '1 TB';
            } else if (field === 'tipo_armaz') {
                newSpan.textContent = input.value || 'N/A';
            } else if (field === 'marca' || field === 'modelo' || field === 'locat_do_disp' || field === 'descricao' || field === 'estagiario' || field === 'tipo') {
                newSpan.textContent = input.value || 'N/A';
            } else if (field === 'data_de_an') {
                if (input.value) {
                    const parts = input.value.split('-');
                    if (parts.length === 3) {
                        newSpan.textContent = `${parts[2]}/${parts[1]}/${parts[0]}`;
                    } else {
                        newSpan.textContent = input.value;
                    }
                } else {
                    newSpan.textContent = 'N/A';
                }
            } else {
                newSpan.textContent = input.value || 'N/A';
            }

            input.replaceWith(newSpan);
        });

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
        descricao: "",
        estagiario: ""
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

document.addEventListener("DOMContentLoaded", function() {
    console.log("Página carregada, modal deve estar oculto:", document.getElementById("modal-history").style.display);
});

function formatDateBR(dateStr) {
    if (!dateStr || dateStr === "N/A") return "N/A";
    // Aceita tanto "yyyy-mm-dd" quanto "yyyy-mm-ddTHH:MM:SS"
    const date = new Date(dateStr);
    if (isNaN(date)) return dateStr;
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function loadAdminOptions() {
    const options = await fetch('/admin/options').then(r => r.json());

    // Computadores
    renderOptionList('admin-marcas', options.marcas, 'marcas');
    renderOptionList('admin-modelos-pc', options.modelos_pc, 'modelos_pc');
    renderOptionList('admin-tipos-dispositivo', options.tipos_dispositivo, 'tipos_dispositivo');
    renderOptionList('admin-tipos-armazenamento', options.tipos_armazenamento, 'tipos_armazenamento');
    renderOptionList('admin-quantidades-ram', options.quantidades_ram, 'quantidades_ram');
    renderOptionList('admin-quantidades-armaz', options.quantidades_armazenamento, 'quantidades_armazenamento');

    // Outros Dispositivos
    renderOptionList('admin-marcas-outros', options.marcas_outros, 'marcas_outros');
    renderOptionList('admin-modelos-outros', options.modelo_outros, 'modelo_outros');
    renderOptionList('admin-tipos-outros', options.tipos_outros, 'tipos_outros');

    // Globais
    renderOptionList('admin-estagiarios', options.estagiarios, 'estagiarios');
    renderOptionList('admin-funcionando', options.funcionando, 'funcionando');
}

function renderOptionList(containerId, list, optionType) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = (list || []).map(item => `
        <span>${item} <button onclick="deleteOption('${optionType}', '${item}')">x</button></span>
    `).join(' ');
}

async function addOption(optionType) {
    const inputId = {
        'marcas': 'input-marca',
        'modelos_pc': 'input-modelo-pc',
        'tipos_dispositivo': 'input-tipo-dispositivo',
        'tipos_armazenamento': 'input-tipo-armaz',
        'quantidades_ram': 'input-ram',
        'quantidades_armazenamento': 'input-armaz',
        'marcas_outros': 'input-marca-outros',
        'modelo_outros': 'input-modelo-outros',
        'tipos_outros': 'input-tipo-outros',
        'estagiarios': 'input-estagiario',
        'funcionando': 'input-funcionando'
    }[optionType];
    const value = document.getElementById(inputId).value.trim();
    if (!value) return alert('Digite um valor!');
    await fetch(`/admin/options/${optionType}`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({value})
    });
    loadAdminOptions();
}

async function deleteOption(optionType, value) {
    await fetch(`/admin/options/${optionType}/${encodeURIComponent(value)}`, {method: 'DELETE'});
    loadAdminOptions();
}

document.addEventListener('DOMContentLoaded', loadAdminOptions);