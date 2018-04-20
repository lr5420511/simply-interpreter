'use strict';

const assert = require('assert');

const Compilation = module.exports = function() {
    this.executors = [].slice.call(arguments);
    assert(this.executors.length,
        'current compilation can not run.'
    );
    this.domain = {};
    this.scene = [];
    this.previours = undefined;
    this.result = undefined;
    this.end = false;
};

Compilation.prototype = {
    constructor: Compilation,
    retain: function(cur) {
        assert(typeof cur === 'number',
            'retain index is invaild.'
        );
        this.scene.push(cur);
        return this;
    },
    resume: function() {
        return this.scene.pop();
    },
    isVariable: function(key) {
        return this.domain.hasOwnProperty(key);
    },
    getJumpIndex: function(label, jud) {
        let index = -1;
        for (let i = 0; i < this.executors.length; i++) {
            const cur = this.executors[i],
                isJumpable = jud(cur, label);
            if (isJumpable) {
                index = i;
                break;
            }
        }
        return index;
    },
    run: function(exec) {
        assert(exec instanceof Function,
            'exec is not function.'
        );
        for (let i = 0; i < this.executors.length; i++) {
            const cur = this.executors[i];
            if (this.end) break;
            const jumpIndex = exec(cur, this, i);
            if (typeof jumpIndex === 'number') i = jumpIndex;
        }
        return this.end ? this.result : -1;
    }
};