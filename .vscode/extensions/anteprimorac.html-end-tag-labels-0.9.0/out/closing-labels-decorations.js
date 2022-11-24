"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const vscode_html_languageservice_1 = require("vscode-html-languageservice");
class ClosingLabelsDecorations {
    constructor() {
        this.subscriptions = [];
        this.decorationType = this.createTextEditorDecoration();
        this.update = this.update.bind(this);
        this.languageService = (0, vscode_html_languageservice_1.getLanguageService)();
        this.subscriptions.push(vscode.workspace.onDidChangeConfiguration((event) => {
            if (!event.affectsConfiguration('htmlEndTagLabels')) {
                return;
            }
            this.decorationType = this.createTextEditorDecoration();
            if (this.activeEditor && event.affectsConfiguration('htmlEndTagLabels', this.activeEditor.document)) {
                this.triggerUpdate();
            }
        }));
        // Listen to active editor change
        this.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((event) => this.setActiveEditor(event)));
        // Listen to text change
        this.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
            if (this.activeEditor && event.document === this.activeEditor.document) {
                this.triggerUpdate();
            }
        }));
        // Set current editor as active if it's available
        if (vscode.window.activeTextEditor) {
            this.setActiveEditor(vscode.window.activeTextEditor);
        }
    }
    createTextEditorDecoration() {
        let color = vscode.workspace.getConfiguration('htmlEndTagLabels').labelColor;
        return vscode.window.createTextEditorDecorationType({
            after: {
                color: color || new vscode.ThemeColor('editorCodeLens.foreground'),
                margin: '2px',
            },
            rangeBehavior: vscode.DecorationRangeBehavior.ClosedOpen,
        });
    }
    setActiveEditor(editor) {
        if (editor) {
            this.activeEditor = editor;
            this.triggerUpdate();
        }
        else {
            this.activeEditor = undefined;
        }
    }
    triggerUpdate() {
        if (this.updateTimeout) {
            clearTimeout(this.updateTimeout);
            this.updateTimeout = undefined;
        }
        this.updateTimeout = setTimeout(this.update, 500);
    }
    getDocumentDecorations(input) {
        if (!this.languageService) {
            return [];
        }
        const document = Object.assign(Object.assign({}, input), { uri: input.uri.toString() });
        const symbols = this.languageService.findDocumentSymbols(document, this.languageService.parseHTMLDocument(document));
        const decorations = symbols
            .filter((symbol) => {
            // field symbol
            return (symbol.kind === vscode_html_languageservice_1.SymbolKind.Field &&
                // isn't html document
                !symbol.name.startsWith('html') &&
                // isn't child of html
                symbol.containerName !== 'html' &&
                // isn't child of head
                symbol.containerName !== 'head' &&
                // end tag and start tag are on different lines
                symbol.location.range.start.line !== symbol.location.range.end.line &&
                // symbol can be labeled
                (symbol.name.indexOf('#') !== -1 || symbol.name.indexOf('.') !== -1));
        })
            .map((symbol) => {
            const hashCharIndex = symbol.name.indexOf('#');
            const dotCharIndex = symbol.name.indexOf('.');
            const hasIdAttr = hashCharIndex !== -1;
            const hasClassAttr = dotCharIndex !== -1;
            const separatorCharIndex = hasIdAttr ? hashCharIndex : dotCharIndex;
            const tagName = symbol.name.substring(0, separatorCharIndex);
            let id = '';
            let classes = '';
            if (hasIdAttr) {
                let idAttr;
                if (hasClassAttr) {
                    idAttr = symbol.name.substring(hashCharIndex + 1, dotCharIndex);
                }
                else {
                    idAttr = symbol.name.substring(hashCharIndex + 1);
                }
                idAttr = idAttr.trim();
                if (idAttr.length) {
                    id = `#${idAttr}`;
                }
            }
            if (hasClassAttr) {
                const classAttr = symbol.name
                    .substring(dotCharIndex + 1)
                    .trim()
                    .split('.')
                    .map((item) => item.trim())
                    .filter((item) => Boolean(item.length))
                    .join('.');
                if (classAttr.length) {
                    classes = `.${classAttr}`;
                }
            }
            const label = `${id}${classes}`;
            const endTagLength = tagName.length + 3; // 3 chars for `</>`
            const endTagLine = symbol.location.range.end.line;
            const endTagEndChar = symbol.location.range.end.character;
            const endTagStartChar = endTagEndChar >= endTagLength ? endTagEndChar - endTagLength : endTagEndChar;
            return {
                range: new vscode.Range(new vscode.Position(endTagLine, endTagStartChar), new vscode.Position(endTagLine, endTagEndChar)),
                renderOptions: { after: { contentText: `/${label}` } },
            };
        })
            // Filter out decorations with empty label.
            .filter((item) => item.renderOptions.after.contentText.length > 1);
        return decorations;
    }
    update() {
        if (!this.languageService || !this.activeEditor) {
            return;
        }
        this.activeEditor.setDecorations(this.decorationType, this.getDocumentDecorations(this.activeEditor.document));
    }
    dispose() {
        this.activeEditor = undefined;
        this.subscriptions.forEach((s) => s.dispose());
    }
}
exports.default = ClosingLabelsDecorations;
//# sourceMappingURL=closing-labels-decorations.js.map