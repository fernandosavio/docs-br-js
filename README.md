# docs-br-js

> Biblioteca e documentação em desenvolvimento

Biblioteca de validação e extração de informação de documentos oficiais brasileiros.



Documentos suportados:

- [x] CNPJ - validação com caracteres alfanuméricos (2026)
- [x] CPF
- [ ] Inscrição estadual
- [ ] CNH
- [ ] PIS/PASEP
- [ ] RG
- [ ] RENAVAM
- [ ] Título de eleitor
- [ ] Certidões

## Instalação

```sh
$ npm install @fsavio/docs-br
```

## Como usar

### CNPJ

#### Validação

```ts
import { cnpj } from '@fsavio/docs-br'

// CNPJ válido
const valid = cnpj.validate('48217216000130');
console.log(valid); // { sucesso: true, dados: "48217216000130" }

// CNPJ válido com caracteres alfanuméricos
const alfanumValid = cnpj.validate('UU97L8QM000130');
console.log(alfanumValid); // { sucesso: true, erro: "UU97L8QM000130" }

// CNPJ com tamanho diferentes de 14
const invalidLength = cnpj.validate('123');
console.log(invalidLength); // { sucesso: false, erro: "invalid-length" }

// CNPJ com caracteres inválidos
const invalidChars = cnpj.validate('??????????????');
console.log(invalidChars); // { sucesso: false, erro: "invalid-chars" }

// CNPJ com dígitos verificadores inválidos
const invalidCheckDigits = cnpj.validate('48217216000199');
console.log(invalidCheckDigits); // { sucesso: false, erro: "invalid-check-digits" }

// CNPJ alfanumérico com dígitos verificadores inválidos
const invalidCheckDigitsAlfanum = cnpj.validate('UU97L8QM000199');
console.log(invalidCheckDigitsAlfanum); // { sucesso: false, erro: "invalid-check-digits" }
```

