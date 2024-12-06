
/**
 * Gerencia a visualização e interação da interface de atualização do banco de dados.
 *
 * @namespace ManageDataBaseView
 * @description
 * Este objeto encapsula a inicialização e renderização de botões para atualização de dados no banco de dados,
 * além de gerenciar os eventos associados às ações dos botões.
 */

import fetchInsertOrUpdateSubterraneaManualSync from "../services/fetch-insert-or-update-subterranera-manual-sync.js";
import fetchInsertOrUpdateSubterraneaTubularSync from "../services/fetch-insert-or-update-subterranera-tubular-sync.js";
import fetchInsertOrUpdateSuperficiaisSync from "../services/fetch-insert-or-update-superficial-sync.js";

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
     * chama a função `fetchInsertOrUpdateSuperficialSync` e exibe as mensagens no console.
     */

    render: async function () {
        // Append the button to the `#buttons` div
        this.div.append(`
            <div>
                <button id="btn-superficial-sync">Atualizar Outorgas Superficiais</button>
                <button id="btn-subterranea-manual-sync">Atualizar - Poço Manual</button>
                <button id="btn-subterranea-tubular-sync">Atualizar - Poço Tubular</button>
                
            </div>
            `);

         // Configura o evento de clique para o botão de atualização superficial
        $('#btn-superficial-sync').on('click', async () => {
            try {
                console.log("Atualizar Outorgas Superficiais! ");
                let message = await fetchInsertOrUpdateSuperficiaisSync();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-subterranea-manual-sync').on('click', async () => {
            try {
              
                console.log("Atualizar Outorgas Subterrâneas! ")
                let message = await fetchInsertOrUpdateSubterraneaManualSync();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

        $('#btn-subterranea-tubular-sync').on('click', async () => {
            try {
              
                console.log("Atualizar Outorgas Subterrâneas! ")
                let message = await fetchInsertOrUpdateSubterraneaTubularSync();

                console.log(message);

            } catch (error) {
                console.error('Error:', error);
                alert(error);
            }
        });

    }
};

export default ManageDataBaseView;
