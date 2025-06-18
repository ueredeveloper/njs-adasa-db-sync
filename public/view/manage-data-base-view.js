
/**
 * Gerencia a visualização e interação da interface de atualização do banco de dados.
 *
 * @namespace ManageDataBaseView
 * @description
 * Este objeto encapsula a inicialização e renderização de botões para atualização de dados no banco de dados,
 * além de gerenciar os eventos associados às ações dos botões.
 */

import fetchInsertOrUpdateLancEflService from "../services/fetch-insert-or-update-lanc-efl-service.js";
import fetchInsertOrUpdateLancPluService from "../services/fetch-insert-or-update-lanc-plu-service copy.js";
import {
    fetchInsertOrUpdateBarragens, fetchInsertOrUpdateSubterraneaManual,
    fetchInsertOrUpdateSubterraneaTubular, fetchInsertOrUpdateSuperficiais
} from "../services/index.js";

const ManageDataBaseView = {

    /**
    * Inicializa a visualização de gerenciamento do banco de dados.
    *
    * @async
    * @function init
    * @memberof ManageDataBaseView
    * @description
    * Seleciona o elemento DOM principal utilizando jQuery e chama o método `render`
    * para configurar os botões e eventos necessários.
    */

    init: async function () {
        this.div = $('#manage-db'); // Select the element with jQuery
        this.render();
    },

    /**
    * Renderiza os botões na interface e configura os eventos de clique.
    *
    * @async
    * @function render
    * @memberof ManageDataBaseView
    * @description
    * Adiciona os botões de atualização na div selecionada e associa os eventos de clique
    * aos respectivos métodos de atualização. Quando o botão "Atualizar Superficial" é clicado,
    * chama a função `fetchInsertOrUpdateSuperficial` e exibe as mensagens no console.
    */

    render: async function () {
        // Append the button to the `#buttons` div
        this.div.append(`
            <div style="display:flex; flex-direction: column;">
                <button id="btn-superficial-sync" style="margin:5px;">Atualizar Outorgas Superficiais</button>
                <button id="btn-subterranea-manual-sync" style="margin:5px;">Atualizar - Poço Manual</button>
                <button id="btn-subterranea-tubular-sync" style="margin:5px;">Atualizar - Poço Tubular</button>
                <button id="btn-barragem-sync" style="margin:5px;">Atualizar - Barragem</button>
                <button id="btn-lanc-plu-sync" style="margin:5px;">Atualizar - Lançamentos Pluviais</button>
                <button id="btn-lanc-efl-sync" style="margin:5px;">Atualizar - Lançamentos Efluentes</button>
                
            </div>
            `);

        // Configura o evento de clique para o botão de atualização superficial
        $('#btn-superficial-sync').on('click', async () => {
            try {
                console.log("Atualizar Outorgas Superficiais! ");
                let message = await fetchInsertOrUpdateSuperficiais();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-subterranea-manual-sync').on('click', async () => {
            try {

                console.log("Atualizar Outorgas Subterrâneas! ")
                let message = await fetchInsertOrUpdateSubterraneaManual();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-subterranea-tubular-sync').on('click', async () => {
            try {

                console.log("Atualizar Outorgas Subterrâneas! ")
                let message = await fetchInsertOrUpdateSubterraneaTubular();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-barragem-sync').on('click', async () => {
            try {

                console.log("Atualizar Barragens! ")
                let message = await fetchInsertOrUpdateBarragens();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-lanc-plu-sync').on('click', async () => {
            try {

                console.log("Atualizar Lançamento Águas Pluviais! ")
                let message = await fetchInsertOrUpdateLancPluService();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-lanc-efl-sync').on('click', async () => {
            try {

                console.log("Atualizar Lançamento de Efluentes! ")
                let message = await fetchInsertOrUpdateLancEflService();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });


    }
};

export default ManageDataBaseView;
