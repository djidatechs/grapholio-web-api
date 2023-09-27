/* 
 * Tokenizer spec.
 */
const Spec = [
    // --------------------------------------
    // Whitespace:
    [/^\s+/, null],

    // --------------------------------------
    // Comments:

    // Skip single-line comments:
    [/^\/\/.*/, null],

    // Skip multi-line comments:
    [/^\/\*[\s\S]*?\*\//, null],

    // --------------------------------------
    // Symbols and delimiters:
    [/^;/, ';'],  // Semicolon
    [/^{/, '{'],  // LeftBrace
    [/^}/, '}'],  // RightBrace
    [/^\(/, '('], // LeftParen
    [/^\)/, ')'], // RightParen
    [/^\[/, '['], // LeftBracket
    [/^\]/, ']'], // RightBracket
    [/^,/, ','],  // Comma
    [/^\./, '.'], // Dot
    [/^\$/,'$'], //special


    // Relational Operators
    // <, >, <=, >=
    [/^[<>]=?/, 'RELATIONAL_OPERATOR'],
    [/^[=!]=/, 'EQUALITY_OPERATOR'],

    // Logical Operators
    // ||, &&, !
    [/^&&/, 'LOGICAL_AND'],
    [/^\|\|/, 'LOGICAL_OR'],
    [/^!/, 'LOGICAL_NOT'],


    // --------------------------------------
    // Keywords
    [/^\blet\b/, 'let'],
    [/^\bif\b/, 'if'],
    [/^\belse\b/, 'else'],
    [/^\btrue\b/, 'true'],
    [/^\bfalse\b/, 'false'],
    [/^\bnull\b/, 'null'],

    [/^\bis\b/, 'is'],
    //Graph Keywords
    /*[/^\badd\b/, 'add'],
    [/^\bnode\b/, 'node'],
    [/^\bedge\b/, 'edge'],
    [/^\bgraph\b/, 'graph'], // TODO : PARSE
    [/^\bset\b/, 'set'], // TODO : PARSE
    [/^\bremove\b/, 'remove'], // TODO : PARSE
    //Graph Preoccupied sets Keywords
    [/^\bNodes\b/, 'Nodes'], // TODO : PARSE
    [/^\bEdges\b/, 'Edges'], // TODO : PARSE
    [/^\bGraph\b/, 'Graph'], // TODO : PARSE*/
    // --------------------------------------
    // OOP keywords
    /*[/^\bclass\b/, 'class'],
    [/^\bthis\b/, 'this'],
    [/^\bextends\b/, 'extends'],
    [/^\bsuper\b/, 'super'],
    [/^\bnew\b/, 'new'],
     */
    // --------------------------------------
    // Iterators
    [/^\bwhile\b/, 'while'],
    [/^\bdo\b/, 'do'],
    [/^\bfor\b/, 'for'],
    [/^\bforeach\b/, 'foreach'],
    [/^\bin\b/, 'in'],
    [/^\blambda\b/, 'lambda'],
    [/^\bmapeach\b/, 'mapeach'],


    [/^\bdef\b/, 'def'],
    [/^\breturn\b/, 'return'],
    [/^\bbreak\b/, 'break'],
    [/^\bcontinue\b/, 'continue'],

    // --------------------------------------
    // Assignment operators: =, *=, /=, +=, -=
    [/^=/, 'SIMPLE_ASSIGN'],
    [/^[\*\\/\+\-]=/, 'COMPLEX_ASSIGN'],


    // --------------------------------------
    // Math operators: +, -, *, /
    [/^[+\-]/, 'ADDITIVE_OPERATOR'],
    [/^[*\/]/, 'MULTIPLICATIVE_OPERATOR'],


    // --------------------------------------
    // Numbers:
    [/^\d+/, 'NUMBER'],

    // --------------------------------------
    // Double quoted String:
    [/^"[^"]*"/, 'STRING'],

    // --------------------------------------
    // Single quoted String:
    [/^'[^']*'/, 'STRING'],

    // --------------------------------------
    // Identifier
    [/^\w+/, 'IDENTIFIER'],
];

/*
 * Tokenizer class
 * Lazily pulls a token from a stream.
 */
export class Tokenizer {
    /*
     * Initializes the string.
     */
    init(string) {
        this._string = string;
        this._cursor = 0; // track the position of each character
    }
    /*
     * Whether the tokenizer reached EOF.
     */
    isEOF() {
        return this._cursor === this._string.length;
    }
    /**
     * Whether we still have more tokens.
     */
    hasMoreTokens() {
        return this._cursor < this._string.length;
    }
    /*
     * Obtains next token.
     */
    getNextToken() {
        if (!this.hasMoreTokens()) {
            return null;
        }
        const string = this._string.slice(this._cursor); // crea un string desde la posici�n this._cursor

        for (const [regexp, tokenType] of Spec) {
            const tokenValue = this._match(regexp, string);
            // Couldn't match this rule, continue.
            if (tokenValue == null) {
                continue;
            }

            // Should skip this null token because could be a whitespace or something else
            if (tokenType == null) {
                // no llamamos a continue para que no salte a la siguiente expresi�n regular
                // sino que llamamos a getNextToken() para que comience de cero con las RegExp.
                return this.getNextToken();
            }

            // We return the token
            return {
                type: tokenType,
                value: tokenValue,
            };
        }

        throw new SyntaxError(`Unexpected token: "${string[0]}"`);
    }
    getRest(){
        return this._string.slice(this._cursor,this._cursor+30);
    }

    /*
     * Matches a token for a regular expression.
     */
    _match(regexp, string) {
        const matched = regexp.exec(string);
        if (matched == null) {
            return null;
        }
        this._cursor += matched[0].length;
        return matched[0];
    }
}
