
const insertOrUpdateSuperficialService = require('./insert-or-update-superfical-service');
const insertOrUpdateSubterraneaManualService = require('./insert-or-update-subterranea-manual-service');
const insertOrUpdateSubterraneaTubularService = require('./insert-or-update-subterranea-tubular-service');
const insertOrUpdateBarragemService = require('./insert-or-update-barragem-service');
const insertOrUpdateLancamentoEfluentesService = require('./insert-or-update-lanc-efl-service');
const insertOrUpdateLancamentoPluviaisService = require('./insert-or-update-lanc-plu-service');
const insertOrUpdateFraturadoService = require('./insert-or-update-fraturado-service');
const insertOrUpdatePorosoService = require('./insert-or-update-poroso-service');
module.exports = {
    insertOrUpdateSuperficialService,
    insertOrUpdateSubterraneaManualService,
    insertOrUpdateSubterraneaTubularService,
    insertOrUpdateBarragemService,
    insertOrUpdateLancamentoEfluentesService,
    insertOrUpdateLancamentoPluviaisService, 
    // Atualiza número de poços e porcentagem de utilização no sistema fraturado
    insertOrUpdateFraturadoService, 
    insertOrUpdatePorosoService

}