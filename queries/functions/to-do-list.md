# To-Do List

### 13/12/2024

- **Criar a função `find_all_points_in_a_subsystem`**
    - [X] Ok. Funcionando.
    - Lembrete: É preciso criar um tipo de dado antes de criar a função:
        ```CREATE TYPE hg_info_shape AS (info json, shape geometry); ```

- **Testar o `SELECT`**
    - [X] Testado com sucesso.
    - Consulta:
      ```sql
      SELECT * 
      FROM find_all_points_in_a_subsystem(
          'SRID=4674;POINT(-47.5917014 -15.6913214)', 
          2
      );
      ```