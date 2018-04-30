'use strict';

const assert = require('assert');
const Executable = require('./entities/executable');
const Compilation = require('./entities/compilation');

function assemblerInterpreter(program) {
    const executors = program.match(
        /(^|\n)[^\n\;]+/g
    ).map(cur => {
        return new Executable(cur.trim());
    });
    return (new Compilation(...executors)).run(
        (executor, compilation, index) => {
            return executor.execute(compilation, index);
        }
    );
}

console.log(assemblerInterpreter(
    `mov   a, 5
mov   b, a
mov   c, a
call  proc_fact
call  print
end

proc_fact:
    dec   b
    mul   c, b
    cmp   b, 1
    jne   proc_fact
    ret

print:
    msg   a, '! = ', c ; output text
    ret`
));