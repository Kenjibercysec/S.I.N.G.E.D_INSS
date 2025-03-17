document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const descricao = document.getElementById('descricao').value;

    const response = await fetch('http://localhost:8000/items/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: nome, description: descricao }),
    });

    if (response.ok) {
        alert('Equipamento cadastrado com sucesso!');
    } else {
        alert('Erro ao cadastrar equipamento');
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

async function carregarEquipamentos() {
    const response = await fetch('http://localhost:8000/items/');
    const equipamentos = await response.json();

    const tabela = document.getElementById('equipamentosTable');
    // Atualizar a tabela com os dados recebidos
}

//função de busca search bar 
document.getElementById('search-btn').addEventListener('click', function() {
    const query = document.getElementById('search-bar').value;
    fetch(`/devices/${query}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data);
        if (data.detail) {
            alert('Item não encontrado');
            return;
        }
        updateInfoBox([data]); // Update to handle single item
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao buscar dados');
    });
});

function updateInfoBox(devices) {
let infoBoxContent = '';
devices.forEach(device => {
    infoBoxContent += `
        <div type="button" class="btn-info-box" id="btn-info-box">
            <p><strong>Tipo de dispositivo:</strong> ${devices.tipo_de_disp}</p> 
            <p><strong>Nº de tombamento:</strong> ${devices.id_tomb}</p>
            <p><strong>Quantidade de Armazenamento:</strong> ${devices.qnt_armaz}</p>
            <p><strong>Tipo de Armazenamento:</strong> ${devices.tipo_armaz}</p>
            <p><strong>Marca:</strong> ${devices.marca}</p>
            <p><strong>Funcionando:</strong> ${devices.funcionando ? 'Sim' : 'Não'}</p>
            <p><strong>Data da Análise:</strong> ${devices.data_de_an}</p>
            <p><strong>Local Atual do Dispositivo:</strong> ${devices.locat_do_disp}</p>
            <p><strong>Descrição:</strong> ${devices.descricao || 'N/A'}</p>
            <div class="caract" id="caract">
                <div class="card-btns" name="card-btns">
                    <button class="btn-b" onclick="editItem(${devices.id_tomb})">Editar</button>
                    <button class="btn-c" onclick="deleteItem(${devices.id_tomb})">Excluir</button>
                    <button class="btn-b" onclick="showHistory(${devices.id_tomb})">Exibir Histórico</button>
                </div>
            </div>
        </div>
    `;
});
document.getElementById('info-box').innerHTML = infoBoxContent;
}

function editItem(id_tomb) {
window.location.href = `/edit?id=${id_tomb}`;
}

function deleteItem(id_tomb) {
fetch(`/devices/${id_tomb}`, {
    method: 'DELETE'
})
.then(response => {
    if (response.status === 204) {
        alert('Item excluído com sucesso!');
        document.getElementById('search-btn').click(); // Atualiza a busca
    } else {
        alert('Erro ao excluir item');
    }
})
.catch(error => console.error('Erro:', error));
}

function showHistory(id_tomb) {
window.location.href = `/history?id=${id_tomb}`;
}