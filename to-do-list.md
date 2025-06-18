# To-Do List

**11/12/2024**

- Analisar a query de barragem para verificar se a bacia hidrográfica (BH) de cada barragem está sendo corretamente identificada.  
- Há várias barragens com o campo `bh_id` nulo, que precisam ser tratadas.  


**31/01/2025**
- [X] Migrar as tabelas de polígonos para o banco supabase (j-water-grants)

**24/04/2025**
- [] Criar um seletor de banco que será atualizado. 
    Atualmente há três bancos sendo atualizados (postgres-drainage, postgres-j-water-grants e postgres-azure)

**18/05/2025**
- [X] Adicionar mais caracteres na coluna `int_observacao` da tabela lançamento de águas pluviais. O técnio está escrevendo observações maiores que 255 caracteres
em alguns usuários.
    Resolvido.

- [] Remover arquivos json muito grande como bacias otto e Rios do DF.

        git rm --cached -r json/a-d-bho-211022.json 
        git rm --cached -r json/rios-df-141223.json 