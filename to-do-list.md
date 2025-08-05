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



**31/07/2025**
- [] Adicionar filtro de processo vencidos e outros na função `find_points_inside_hidrogeo_fraturado`

Exemplo: find all points in a system
````
-- filtra por tipo de poço e exclui situação de processos 'em análise', 'obturado' e 'indeferidos'
      select * from subterranea _sub where st_contains(hg_info_shape.shape, _sub.int_shape) and _sub.tp_id = find_all_points_in_a_subsystem.tp_id and _sub.sp_id not in (2,7,9)

```

**05/08/2025**
- [] Criar cálculo de número de poços e porcentagem de utilização nos subsistemas.
- [] Criar colunas nas tabelas hidrogeo fraturado e hidrogeo poroso

```
-- Adiciona colunas para salvar quantidade de poços e porcentagem utilizada
alter table hidrogeo_fraturado
add column pct_utilizada double precision default 0.0
add column qtd_pocos integer default 0

-- Verifica uma linha da tabela
select _hg.qtd_pocos, _hg.pct_utilizada from hidrogeo_fraturado _hg
where _hg.objectid = 1

-- Faz update dos valores
update hidrogeo_fraturado
set qtd_pocos = 1.0, pct_utilizada = 1.0 where objectid = 1

```
