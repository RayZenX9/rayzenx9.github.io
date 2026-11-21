/* Direitos autorais (C) 2023-2025 anônimo

Este arquivo faz parte do PSFree.

PSFree é um software livre: você pode redistribuí-lo e/ou modificá-lo
sob os termos da GNU Affero General Public License conforme
publicada pela Free Software Foundation, seja na versão 3 da
Licença ou (a seu critério) qualquer versão posterior.

PSFree é distribuído na esperança de que seja útil,
mas SEM NENHUMA GARANTIA; sem mesmo a garantia implícita de
COMERCIABILIDADE ou ADEQUAÇÃO A UM PROPÓSITO ESPECÍFICO. Veja a
GNU Affero General Public License para mais detalhes.

Você deve ter recebido uma cópia da GNU Affero General Public License
junto com este programa. Caso contrário, veja <https://www.gnu.org/licenses/>.  */

// Não podemos simplesmente abrir um console no navegador do ps4, garanta que os erros lançados
// pelo nosso programa sejam alertados.

// Não usamos uma função de log personalizada para evitar dependência de um módulo
// de log, já que queremos que este arquivo seja independente. Também não queremos copiar a
// função de log aqui para evitar dependências, já que usar
// alert() já é suficiente.

// Também registramos os números de linha e coluna, pois algumas exceções (como
// SyntaxError) não mostram isso no stack trace.

addEventListener('unhandledrejection', event => {
    const reason = event.reason;
    alert(
        'Rejeição não tratada\n'
        + `${reason}\n`
        + `${reason.sourceURL}:${reason.line}:${reason.column}\n`
        + `${reason.stack}`
    );
});

addEventListener('error', event => {
    const reason = event.error;
    alert(
        'Erro não tratado\n'
        + `${reason}\n`
        + `${reason.sourceURL}:${reason.line}:${reason.column}\n`
        + `${reason.stack}`
    );
    return true;
});

// precisamos importar o programa dinamicamente se quisermos capturar seus erros
// de sintaxe
import('./psfree.js');