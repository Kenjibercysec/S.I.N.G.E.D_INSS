document.getElementById('cadastroForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const id_tomb = document.getElementById('id_tomb').value;
    const tipo_de_disp = document.getElementById('tipo_de_disp').value;
    const qnt_armaz = document.getElementById('qnt_armaz').value;
    const tipo_armaz = document.getElementById('tipo_armaz').value;
    const marca = document.getElementById('marca').value;
    const funcionando = document.getElementById('funcionando').value === 'true';
    const data_de_an = document.getElementById('data_de_an').value;
    const locat_do_disp = document.getElementById('locat_do_disp').value;
    const descricao = document.getElementById('descricao').value;

    const dispositivo = {
        id_tomb,
        tipo_de_disp,
        qnt_armaz,
        tipo_armaz,
        marca,
        funcionando,
        data_de_an,
        locat_do_disp,
        descricao
    };

    try {
        const response = await fetch('/dispositivos/', { // Certifique-se de que a rota está correta
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dispositivo),
        });

        if (response.ok) {
            alert('Dispositivo cadastrado com sucesso!');
        } else {
            const errorData = await response.json();
            alert(`Erro ao cadastrar dispositivo: ${errorData.detail}`);
        }
    } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao cadastrar dispositivo.');
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
    fetch(`/dispositivos/${query}`)
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
        updateInfoBox([data]); // Atualiza a interface com os dados do dispositivo
    })
    .catch(error => {
        console.error('Erro:', error);
        alert('Erro ao buscar dados');
    });
});

function updateInfoBox(dispositivos) {
    let infoBoxContent = '';
    dispositivos.forEach(dispositivo => {
        infoBoxContent += `
            <div type="button" class="btn-info-box" id="btn-info-box">
                <p><strong>Tipo de dispositivo:</strong> ${dispositivo.tipo_de_disp}</p> 
                <p><strong>Nº de tombamento:</strong> ${dispositivo.id_tomb}</p>
                <p><strong>Quantidade de Armazenamento:</strong> ${dispositivo.qnt_armaz}</p>
                <p><strong>Tipo de Armazenamento:</strong> ${dispositivo.tipo_armaz}</p>
                <p><strong>Marca:</strong> ${dispositivo.marca}</p>
                <p><strong>Funcionando:</strong> ${dispositivo.funcionando ? 'Sim' : 'Não'}</p>
                <p><strong>Data da Análise:</strong> ${dispositivo.data_de_an}</p>
                <p><strong>Local Atual do Dispositivo:</strong> ${dispositivo.locat_do_disp}</p>
                <p><strong>Descrição:</strong> ${dispositivo.descricao || 'N/A'}</p>
                <div class="caract" id="caract">
                    <div class="card-btns" name="card-btns">
                        <button class="btn-b" onclick="editItem(${dispositivo.id_tomb})">Editar</button>
                        <button class="btn-c" onclick="deleteItem(${dispositivo.id_tomb})">Excluir</button>
                        <button class="btn-b" onclick="showHistory(${dispositivo.id_tomb})">Exibir Histórico</button>
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
    fetch(`/dispositivos/${id_tomb}`, {
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