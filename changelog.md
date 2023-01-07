# Changelog

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

O formato é baseado em [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
e este projeto segue o padrão do [Semantic Versioning](https://semver.org/spec/v2.0.0.html).


## [0.0.1] - 11-12-2022

### Whait...

 - Confirmar senha ao cadastrar

 - Tratar erro de usuário deletado e provavelmente usuário atualizado
 
 - Tratar todos os erros da aplicação no idioma definido. E depois usar o i18n.

 - Recuperação de senha e outras melhorias na API.
    - Caso o usuário digite a mesma senha de anteriormente : A senha fornecida não deve ser igual à senha usada anteriormente

 - Persmissões de usário ex: admin, corretor, editor etc.

### Fixed

- Adicionado limite mínimo(8) e máximo(25-30) de caracteres para o campo de nome sobrenome email senha.

- Aumentado o tempo do token para 86400s - 24h

- Adicionado erro no retorno da API para o cadastro duplicado.

- Foi corrigido o cadastro com e-mail repetido, permitindo que o cadastro seja feito por apenas 1 e-mail.

- Foi fixado o UseGuards que estava em todas as rotas, assim fazendo com que o usuário não pudesse fazer o primeiro cadastro, apenas tendo um usuário main responsável por esses cadastros. No futuro isso seria interessante caso a regra de negócio não permitisse o cadastro automático do usuário (exemplo: só o admin dono do sistema pode cadastrar seus afiliados).
