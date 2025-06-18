/**
 * Realiza a solicitação para inserir ou atualizar dados na tabela superficial_sync.
 *
 * @async
 * @function fetchInsertOrUpdateSubterraneaTubular
 * @param {string} symbol - Símbolo ou identificador utilizado na solicitação (não utilizado no exemplo, mas pode ser necessário para futuras implementações).
 * @param {string} interval - Intervalo ou parâmetro de tempo para a sincronização (não utilizado no exemplo, mas pode ser necessário para futuras implementações).
 * @returns {Promise<string>} - Retorna uma mensagem de sucesso ou erro após a execução da solicitação.
 *
 * @description
 * Esta função realiza uma requisição HTTP para o backend no endpoint
 * `/services/insert-or-update-subterranea-manual`. O método utilizado é `GET` (pode ser alterado para `POST`, caso necessário).
 * A resposta é processada para exibir mensagens de sucesso ou erro no console.
 * 
 * Caso a resposta seja bem-sucedida (`response.ok`), retorna a mensagem de sucesso do servidor.
 * Em caso de falha, retorna a mensagem de erro do servidor.
 *
 * @example
 * let users = [{
    us_id: 32978,
    us_nome: 'CAROLINA HELENA LUCAS MÉRIDA',
    us_cpf_cnpj: '69703957153',
    us_email: null,...}, ...
    ]
 * fetchInsertOrUpdateSubterraneas(users)
 *   .then((message) => console.log(message))
 *   .catch((error) => console.error(error));
 */

const fetchInsertOrUpdateSubterraneaTubular = async () => {

     // Make the API request to the backend
     const response = await fetch('http://localhost:3000/services/insert-or-update-subterranea-tubular', {
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

export default fetchInsertOrUpdateSubterraneaTubular;