"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const acornWalk = __importStar(require("acorn-walk"));
function extend(walk) {
    walk.base.JSXExpressionContainer = walk.base.ExpressionStatement;
    walk.base.JSXSpreadChild = walk.base.ExpressionStatement;
    walk.base.JSXClosingFragment = walk.base.Identifier;
    walk.base.JSXEmptyExpression = walk.base.Identifier;
    walk.base.JSXIdentifier = walk.base.Identifier;
    walk.base.JSXOpeningFragment = walk.base.Identifier;
    walk.base.JSXText = walk.base.Identifier;
    walk.base.JSXSpreadAttribute = walk.base.SpreadElement;
    walk.base.JSXAttribute = (node, state, callback) => {
        callback(node.name, state);
        if (node.value) {
            callback(node.value, state);
        }
    };
    walk.base.JSXMemberExpression = (node, state, callback) => {
        callback(node.object, state);
        callback(node.property, state);
    };
    walk.base.JSXNamespacedName = (node, state, callback) => {
        callback(node.namespace, state);
        callback(node.name, state);
    };
    walk.base.JSXOpeningElement = (node, state, callback) => {
        callback(node.name, state);
        for (let i = 0; i < node.attributes.length; ++i) {
            callback(node.attributes[i], state);
        }
    };
    walk.base.JSXClosingElement = (node, state, callback) => {
        callback(node.name, state);
    };
    walk.base.JSXElement = (node, state, callback) => {
        callback(node.openingElement, state);
        for (let i = 0; i < node.children.length; ++i) {
            callback(node.children[i], state);
        }
        if (node.closingElement) {
            callback(node.closingElement, state);
        }
    };
    walk.base.JSXFragment = (node, state, callback) => {
        callback(node.openingFragment, state);
        for (let i = 0; i < node.children.length; ++i) {
            callback(node.children[i], state);
        }
        callback(node.closingFragment, state);
    };
    return walk;
}
exports.default = extend(acornWalk);
//# sourceMappingURL=acorn-walk-jsx.js.map