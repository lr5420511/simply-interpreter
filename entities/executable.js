'use strict';

const assert = require('assert');

const Executable = module.exports = function(code) {
    this.jumpable =
        code[code.length - 1] === Executable.struct.LABEL;
    const temp = code.match(
        /(^[^\s]+|[^\,\']+(\,|$)|\'[^\']+\'(\,|$))/g
    ).map(cur => {
        return cur.replace(/(^\s+)/, '')
            .replace(/\,$/, '');
    });
    this.command = temp[0];
    this.arguments = temp.slice(1);
};

Executable.prototype = {
    constructor: Executable,
    execute: function(compilation, index) {
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
    LABEL: ':'
};

require('./presets');