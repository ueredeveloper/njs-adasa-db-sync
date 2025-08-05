/**
 * Realiza a solicitação para inserir ou atualizar dados na tabela hidrogeo fraturado nos atributos
 * quantidade de poços e porcentagem de utilização.
 *
 * @async
 * @function fetchInsertOrUpdateFraturado
 * @param {string} symbol - Símbolo ou identificador utilizado na solicitação (não utilizado no exemplo, mas pode ser necessário para futuras implementações).
 * @param {string} interval - Intervalo ou parâmetro de tempo para a sincronização (não utilizado no exemplo, mas pode ser necessário para futuras implementações).
 * @returns {Promise<string>} - Retorna uma mensagem de sucesso ou erro após a execução da solicitação.
 *
 * @description
 * Esta função realiza uma requisição HTTP para o backend no endpoint atualizando a 
 * quantidade de poços dentro de cada subsistema e a porcentagem de utilização deste subsistema.
 */

const fetchInsertOrUpdateFraturado = async () => {

    // Make the API request to the backend
    const response = await fetch('http://localhost:3000/services/insert-or-update-fraturado', {
        method: 'GET', // You can use POST if needed
        headers: {
            'Content-Type': 'application/json'
        }
    });

    // Parse the response from the backend
    const data = await response.json();

    // Handle the response based on the status
    if (response.ok) {
        console.log('Success:', data.message); // Display success message
        return data.message;
    } else {
        console.error('Error:', data.error); // Display error message
        return data.error;
    }


}

export default fetchInsertOrUpdateFraturado;