import {Parser} from "./Parser.js";

class Givos {
    compile (program) {
        const parser = new Parser();
        //parsing the program to Givos AST
        const GivosAst = parser.parse(program);

        //generating jsAST from GivosAst
        const jsAST = this.gen(GivosAst);

        this.save




    }

    gen (exp){

    }
}