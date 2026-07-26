const cron = require('node-cron');
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/vehicles.json');

async function updateVehicleDatabase() {
    console.log('🔄 [Auto-Update] Baixando lista completa de veículos...');
    try {
        // Usando uma fonte pública estável com o JSON completo de veículos
        const response = await fetch('https://raw.githubusercontent.com/gtabase/gta-online-vehicles/main/vehicles.json').catch(() => null);
        
        if (!response || !response.ok) {
            console.log('⚠️ [Auto-Update] Não foi possível baixar a lista nova. Mantendo atual.');
            return;
        }

        const data = await response.json();
        fs.writeFileSync(dbPath, JSON.stringify(data, null, 4), 'utf-8');
        console.log('✅ [Auto-Update] Banco de dados de veículos atualizado com sucesso!');
    } catch (error) {
        console.error('❌ [Auto-Update] Erro ao atualizar veículos:', error);
    }
}

// Executa assim que o bot liga na nuvem
updateVehicleDatabase();

// Agendado para toda quinta-feira às 09:00 da manhã
cron.schedule('0 9 * * 4', () => {
    console.log('📅 [Cron] Quinta-feira 09:00 - Executando atualização semanal...');
    updateVehicleDatabase();
}, {
    scheduled: true,
    timezone: "America/Sao_Paulo"
});

module.exports = { updateVehicleDatabase };
