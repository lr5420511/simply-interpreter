'use strict';

const assert = require('assert');

const Executable = module.exports = function(code) {
    this.jumpable =
        code[code.length - 1] === Executable.struct.LABEL;
    const temp = code.indexOf(' ');
    this.command = code.substring(
        0, temp === -1 ? code.length : temp
    );
    this.arguments = temp === -1 ? [] :
        code.substring(temp + 1).trimLeft().split(', ');
};

Executable.prototype = {
    constructor: Executable,
    execute: function(compilation, index) {
        console.log(this.command);
        if (this.jumpable) return;
        const method = Executable.presets[this.command];
        assert(method,
            this.command + ' has not been registed.'
        );
        const args = [].slice.call(arguments);
        return method.apply(
            null, args.concat(this.arguments)
        );
    }
};

const replace = Executable.replace = function(
    src, oldstr, newstr
) {
    while (src.includes(oldstr)) {
        src = src.replace(oldstr, newstr);
    }
    return src;
};

Executable.struct = {
    COMMENT: ';',
    LABEL: ':'
};

require('./presets');