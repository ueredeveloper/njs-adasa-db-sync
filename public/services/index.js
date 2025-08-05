import fetchInsertOrUpdateSuperficiais from "./fetch-insert-or-update-superficial-service.js";
import fetchInsertOrUpdateSubterraneaManual from "./fetch-insert-or-update-subterranera-manual-service.js";
import fetchInsertOrUpdateSubterraneaTubular from "./fetch-insert-or-update-subterranera-tubular-service.js";
import fetchInsertOrUpdateBarragens from "./fetch-insert-or-update-barragem-service.js";
import fetchInsertOrUpdateFraturado from "./fetch-insert-or-update-fraturado-service.js";
import fetchInsertOrUpdatePoroso from "./fetch-insert-or-update-poroso-service.js";

export {
    fetchInsertOrUpdateSuperficiais,
    fetchInsertOrUpdateSubterraneaManual,
    fetchInsertOrUpdateSubterraneaTubular,
    fetchInsertOrUpdateBarragens, 
    // atualização da quantidade de poços e porcentagem de utilização de um subsistema
    fetchInsertOrUpdateFraturado,
    fetchInsertOrUpdatePoroso
}