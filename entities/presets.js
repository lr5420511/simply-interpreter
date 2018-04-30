'use strict';

const assert = require('assert');
const Executable = require('./executable');

const replace = Executable.replace;

Executable.presets = {
    mov: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        compilation.domain[args[0]] =
            compilation.isVariable(args[1]) ?
            compilation.domain[args[1]] : args[1];
    },
    inc: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        assert(compilation.isVariable(args[0]),
            'constant can not increase.'
        );
        compilation.domain[args[0]]++;
    },
    dec: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        assert(compilation.isVariable(args[0]),
            'constant can not decrease.'
        );
        compilation.domain[args[0]]--;
    },
    add: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        assert(compilation.isVariable(args[0]),
            'constant can not add.'
        );
        compilation.domain[args[0]] = args.reduce(
            (res, cur, i) => {
                if (i === 1) res = compilation.domain[res];
                return compilation.isVariable(cur) ?
                    Number(res) + Number(compilation.domain[cur]) :
                    Number(res) + Number(cur);
            }
        );
    },
    sub: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        assert(compilation.isVariable(args[0]),
            'constant can not add.'
        );
        compilation.domain[args[0]] = args.reduce(
            (res, cur, i) => {
                if (i === 1) res = compilation.domain[res];
                return compilation.isVariable(cur) ?
                    Number(res) - Number(compilation.domain[cur]) :
                    Number(res) - Number(cur);
            }
        );
    },
    mul: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        assert(compilation.isVariable(args[0]),
            'constant can not add.'
        );
        compilation.domain[args[0]] = args.reduce(
            (res, cur, i) => {
                if (i === 1) res = compilation.domain[res];
                return compilation.isVariable(cur) ?
                    Number(res) * Number(compilation.domain[cur]) :
                    Number(res) * Number(cur);
            }
        );
    },
    div: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        assert(compilation.isVariable(args[0]),
            'constant can not add.'
        );
        compilation.domain[args[0]] = Math.floor(args.reduce(
            (res, cur, i) => {
                if (i === 1) res = compilation.domain[res];
                return compilation.isVariable(cur) ?
                    Number(res) / Number(compilation.domain[cur]) :
                    Number(res) / Number(cur);
            }
        ));
    },
    jmp: function(compilation, index) {
        const args = [].slice.call(arguments, 2),
            label = args[0] + Executable.struct.LABEL,
            jumpIndex = compilation.getJumpIndex(
                label,
                (executor, label) => {
                    return executor.jumpable &&
                        executor.command === label;
                }
            );
        return jumpIndex;
    },
    cmp: function(compilation, index) {
        const args = [].slice.call(arguments, 2);
        let fir = compilation.isVariable(args[0]) ?
            compilation.domain[args[0]] :
            args[0],
            sec = compilation.isVariable(args[1]) ?
            compilation.domain[args[1]] :
            args[1];
        fir = Number(fir);
        sec = Number(sec);
        compilation.previours = fir === sec ?
            null : (fir === Math.max(fir, sec));
    },
    jne: function(compilation, index) {
        if (compilation.previours === null) return;
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    je: function(compilation, index) {
        if (compilation.previours !== null) return;
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    jge: function(compilation, index) {
        if (compilation.previours === false) return;
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    jg: function(compilation, index) {
        if (!compilation.previours) return;
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    jle: function(compilation, index) {
        if (compilation.previours) return;
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    jl: function(compilation, index) {
        if (compilation.previours !== false) return;
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    call: function(compilation, index) {
        compilation.retain(index);
        return Executable.presets.jmp.apply(
            null, arguments
        );
    },
    ret: function(compilation, index) {
        return compilation.resume();
    },
    msg: function(compilation, index) {
        compilation.result = [].slice.call(arguments, 2)
            .map(cur =>
                compilation.isVariable(cur) ?
                compilation.domain[cur] :
                cur.replace(/^\'/, '').replace(/\'$/, '')
            ).join('');
    },
    end: function(compilation, index) {
        compilation.end = true;
    }
};