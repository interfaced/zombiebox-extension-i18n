/**
 * @typedef {Object}
 */
let ASTNode;


/**
 * @see grammar.jison
 * @typedef {{
 *     condition: ?CLDRCondition,
 *     samples: ?CLDRSampleList
 * }}
 */
let CLDRRule;


/**
 * @typedef {{
 *     integer: ?string,
 *     decimal: ?string
 * }}
 */
let CLDRSampleList;


/**
 * @typedef {{
 *     type: string,
 *     operands: Array<CLDRCondition|CLDRRelation>
 * }}
 */
let CLDRCondition;


/**
 * @typedef {{
 *     type: string,
 *     operands: Array<CLDRExpression|CLDRValue|CLDRRangeList>
 * }}
 */
let CLDRRelation;


/**
 * @typedef {{
 *     type: string,
 *     value: ?string,
 *     operands: ?Array<CLDROperand|CLDRValue>
 * }}
 */
let CLDRExpression;


/**
 * @typedef {Array<CLDRRange>}
 */
let CLDRRangeList;


/**
 * @typedef {{
 *     type: string,
 *     value: ?CLDRValue,
 *     from: ?CLDRValue,
 *     to: ?CLDRValue
 * }}
 */
let CLDRRange;


/**
 * @typedef {string} one of: "n", "i", "f", "t", "v", "w"
 */
let CLDROperand;


/**
 * @typedef {number}
 */
let CLDRValue;


/**
 * @typedef {CLDRCondition|CLDRRelation|CLDRExpression}
 */
let CLDRNode;


module.exports = {
	ASTNode,
	CLDRRule,
	CLDRSampleList,
	CLDRCondition,
	CLDRRelation,
	CLDRExpression,
	CLDRRangeList,
	CLDRRange,
	CLDROperand,
	CLDRValue,
	CLDRNode
};
