const j = require('jscodeshift');
const allowedNodes = require('../AST_ALLOWED');

function secureCodeTransformer(root) {
    noThisStatementInFirstLevel(root);
    onlyAllowedNodes(root.find(j.Program).nodes()[0]);
    asyncprogram(root)
    l = leadingcomLoops(root, root.find(j.Program).nodes()[0]);
    root = l.rt
    return root?.toSource()
}

module.exports = (code) => secureCodeTransformer(j(code));

function asyncprogram (root){
    root.find(j.Program).forEach(path=> {
        const asyncarrow = j.arrowFunctionExpression([], j.blockStatement(path.value.body))
        asyncarrow.async = true ;
        const asyncIIFE = j.callExpression(asyncarrow, []);
        path.value.body = [j.expressionStatement(asyncIIFE) ]

    })
}
function onlyAllowedNodes(node) {
    // Process the current node
    if (node.type && !allowedNodes.includes(node.type)) {
        throw new SyntaxError(`SyntaxError : Unexpected ${node.type}`);
    }
    // Recursively visit child nodes
    for (const key in node) {
        if (node[key] && typeof node[key] === 'object' && key !== 'loc' && key !== 'range') {
            if (Array.isArray(node[key])) {
                node[key].forEach(child => onlyAllowedNodes(child));
            } else {
                onlyAllowedNodes(node[key]);
            }
        }
    }
}

function noThisStatementInFirstLevel(root) {
    root.find(j.ThisExpression).forEach(path => {
        if (isProblematicContext(path)) {
            throw new Error("Unexpected Identifier 'this'");
        }
    })
}

function isProblematicContext(path) {
    while (path) {
        if (path.node.type.includes('Function')) return false;
        path = path.parent;
    }
    return true;
}

function optimiseLoops(root,path) {
    addAwaitPromiseToBody(path)

    /*const asyncarrow = j.arrowFunctionExpression([], j.blockStatement(path.value.body.body))
    asyncarrow.async = true ;
    const asyncIIFE = j.callExpression(asyncarrow, []);

    path.value.body.body = [j.expressionStatement(j.awaitExpression(asyncIIFE)) ]*/


    return root
}

function leadingcomLoops(root, node, visitedNodes = new Set() , optimisednodes = [0] ) {
    if (visitedNodes.has(node)) {
        return root; // Already visited this node, prevent infinite loop
    }
    visitedNodes.add(node);

    if (node?.leadingComments?.length && containsOptimiseSubstring(node.leadingComments)) {
        root.find(j[node.type]).filter(p => {
            if (p.node === node && (node.type.startsWith('For') || node.type.startsWith('While')))
                return true
        }).forEach(path => {
            optimiseLoops(root, path);
            root.find(j.FunctionDeclaration)
                .filter(Fpath=>{
                    return isNodeInSubtree(path, Fpath)
                })
                .forEach(Fpath=>{
                    Fpath.value.async = true ;
                    root.find(j.CallExpression)
                        .filter(path=>path.value.callee.name === Fpath.value.id.name )
                        .forEach(path=>{
                            let Expression = j.awaitExpression(path.node);
                            //Expression = j.expressionStatement(Expression)
                            j(path).replaceWith(Expression);

                        })
                })
            //chatgpt todo : add async to parent function if exists
            //chatgpt todo : add await to all calls of this parent function
        });
    }

    for (const key in node) {
        if (node[key] && typeof node[key] === 'object' && key !== 'loc' && key !== 'range') {
            if (Array.isArray(node[key])) {
                node[key].forEach(child => leadingcomLoops(root, child, visitedNodes,optimisednodes));
            } else {
                leadingcomLoops(root, node[key], visitedNodes,optimisednodes);
            }
        }
    }

    return {
        rt : root,
        optimisednodes
    };
}



function addAwaitPromiseToBody(path) {
    const loopBody = path.get("body");
    const awaitPromise = j.expressionStatement(
        j.awaitExpression(
            j.newExpression(
                j.identifier("Promise"),
                [j.arrowFunctionExpression([j.identifier("resolve")], j.callExpression(j.identifier("setTimeout"), [j.identifier("resolve"), j.literal(0)]))]
            )
        )
    );

    if (loopBody.value?.body?.length > 0)
        j(loopBody).replaceWith(j.blockStatement([awaitPromise,...loopBody.value.body]));
    else
        j(loopBody).replaceWith(j.blockStatement([awaitPromise,loopBody.value]));

    return path
}


function containsOptimiseSubstring(arr) {
    for (let element of arr) {
        if (element.value.includes('@optimise')) {
            return true;
        }
    }
    return false;
}

function callbackfunctions (path){
    let ret = []
    path.find(j.ArrowFunctionExpression).forEach(path => {
        // Check if this function is used as a callback
        const parentCallExpression = path.parentPath.parentPath.value;
        if (parentCallExpression && parentCallExpression.type === 'CallExpression') {
            ret.push(path)
        }
    });

    path.find(j.FunctionExpression).forEach(path => {
        // Check if this function is used as a callback
        const parentCallExpression = path.parentPath.parentPath.value;
        if (parentCallExpression && parentCallExpression.type === 'CallExpression') {
            ret.push(path)
        }
    });
    return ret

}
/*
function leadingcomCallbacks(root, node, visitedNodes = new Set() , optimisednodes = [0] ) {
    if (visitedNodes.has(node)) {
        return root; // Already visited this node, prevent infinite loop
    }
    visitedNodes.add(node);

    if (node?.leadingComments?.length && containsOptimiseSubstring(node.leadingComments)) {

        root.find(j[node.type])
            .forEach(path => {
                const paths = callbackfunctions(j(path))
                if (!paths.length) return
                ++optimisednodes[0]

                paths
                    .filter(path => path.value.body.type !== 'BlockStatement')
                    .forEach(path => {
                        if (path.value.body.type !== 'BlockStatement')
                            path.value.body = j.blockStatement([j.returnStatement(path.node.body)]);
                        optimiseLoops(root,path)
                    })
        });
    }

    for (const key in node) {
        if (node[key] && typeof node[key] === 'object' && key !== 'loc' && key !== 'range') {
            if (Array.isArray(node[key])) {
                node[key].forEach(child => leadingcomCallbacks(root, child, visitedNodes,optimisednodes));
            } else {
                leadingcomCallbacks(root, node[key], visitedNodes,optimisednodes);
            }
        }
    }

    return {
        rt : root,
        optimisednodes
    };
}
*/
function isNodeInSubtree(nodeX, nodeY) {
    nodeY = nodeY.value
    function isDescendant(node, target) {
        if (node === target.node) {
            return true;
        }

        if (  node && typeof node === 'object') {
            for (let key in node) {
                if (node[key] && key !== 'loc' && key !== 'range') {
                    if (isDescendant(node[key], target)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    return isDescendant(nodeY, nodeX);
}
