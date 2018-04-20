'use strict';

const assert = require('assert');
const Executable = require('./entities/executable');
const Compilation = require('./entities/compilation');

function assemblerInterpreter(program) {
    const executors = program.split('\n').map(
        cur => {
            if (cur.includes(Executable.struct.COMMENT)) {
                cur = cur.substring(
                    0, cur.indexOf(Executable.struct.COMMENT)
                );
            }
            return cur.trim();
        }
    ).filter(cur => cur !== '').map(cur => new Executable(cur));
    return (new Compilation(...executors)).run(
        (executor, compilation, index) => {
            return executor.execute(compilation, index);
        }
    );
}