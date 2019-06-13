const b = require('ast-types').builders;

/**
 * TODO: is_relation, is_not_relation, within_relation, not_within_relation
 * @param {CLDRNode} node
 * @return {ASTNode}
 */
function traverse(node) {
	switch (node.type) {
		case 'and_condition':
			return processAndCondition(node.operands);

		case 'or_condition':
			return processOrCondition(node.operands);

		case 'in_relation':
			return processInRelation(...node.operands);

		case 'not_in_relation':
			return processNotInRelation(...node.operands);

		case 'mod_expression':
			return processModExpression(...node.operands);

		case 'operand':
			return processOperand(node.value);

		default:
			return null;
	}
}

/**
 * @param {Array<CLDRCondition|CLDRRelation>} operands
 * @return {ASTNode}
 */
function processAndCondition(operands) {
	if (operands.length === 1) {
		return traverse(operands[0]);
	}

	return b.logicalExpression(
		'&&',
		...operands.map(traverse)
	);
}

/**
 * @param {Array<CLDRCondition|CLDRRelation>} operands
 * @return {ASTNode}
 */
function processOrCondition(operands) {
	if (operands.length === 1) {
		return traverse(operands[0]);
	}

	return b.logicalExpression(
		'||',
		traverse(operands[0]),
		processOrCondition(operands.slice(1))
	);
}

/**
 * @param {CLDRExpression} left
 * @param {CLDRRangeList} rangeList
 * @return {ASTNode}
 */
function processInRelation(left, rangeList) {
	const value = traverse(left);

	const options = rangeList.map((range) => {
		switch (range.type) {
			case 'equal':
				return b.binaryExpression(
					'===',
					value,
					processValue(range.value)
				);

			case 'range':
				return b.callExpression(
					b.identifier('isInIntegerRange'),
					[value, processValue(range.from), processValue(range.to)]
				);

			default:
				return null;
		}
	});

	if (options.length === 1) {
		return options[0];
	}

	return b.logicalExpression(
		'||',
		...options
	);
}

/**
 * @param {CLDRExpression} left
 * @param {CLDRRangeList} rangeList
 * @return {ASTNode}
 */
function processNotInRelation(left, rangeList) {
	return b.unaryExpression(
		'!',
		processInRelation(left, rangeList)
	);
}

/**
 * @param {CLDROperand} operand
 * @param {CLDRValue} value
 * @return {ASTNode}
 */
function processModExpression(operand, value) {
	return b.binaryExpression(
		'%',
		processOperand(operand),
		processValue(value)
	);
}

/**
 * @param {CLDROperand} name
 * @return {ASTNode}
 */
function processOperand(name) {
	return b.identifier(name);
}

/**
 * @param {CLDRValue} value
 * @return {ASTNode}
 */
function processValue(value) {
	return b.literal(parseInt(value, 10));
}

/**
 * @param {string} valueName
 * @return {Array<ASTNode>}
 */
function generateVariables(valueName) {
	const helpers = [];
	const operands = [];

	// Generates: const numericValue = <valueName>;
	helpers.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('numericValue'),
			b.identifier(valueName)
		)
	]));

	// Generates: const stringValue = <valueName>.toString();
	helpers.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('stringValue'),
			b.callExpression(
				b.memberExpression(b.identifier(valueName), b.identifier('toString')),
				[]
			)
		)
	]));

	// Generates: let [integer, fractional] = stringValue.split('.');
	helpers.push(b.variableDeclaration('let', [
		b.variableDeclarator(
			b.arrayPattern([
				b.identifier('integer'),
				b.identifier('fractional')
			]),
			b.callExpression(
				b.memberExpression(b.identifier('stringValue'), b.identifier('split')),
				[b.literal('.')]
			)
		)
	]));

	// Generates: integer = integer || '';
	helpers.push(b.assignmentStatement(
		'=',
		b.identifier('integer'),
		b.logicalExpression(
			'||',
			b.identifier('integer'),
			b.literal('')
		)
	));

	// Generates: fractional = fractional || '';
	helpers.push(b.assignmentStatement(
		'=',
		b.identifier('fractional'),
		b.logicalExpression(
			'||',
			b.identifier('fractional'),
			b.literal('')
		)
	));

	// Generates: integer = Math.abs(parseInt(integer, 10)).toFixed(0);
	helpers.push(b.assignmentStatement(
		'=',
		b.identifier('integer'),
		b.callExpression(
			b.memberExpression(
				b.callExpression(
					b.memberExpression(b.identifier('Math'), b.identifier('abs')),
					[
						b.callExpression(
							b.identifier('parseInt'),
							[b.identifier('integer'), b.literal(10)]
						)
					]
				),
				b.identifier('toFixed')
			),
			[b.literal(0)]
		)
	));

	// Generates: const fractionalNoZeroes = fractional.replace(/0+$/, '');
	helpers.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('fractionalNoZeroes'),
			b.callExpression(
				b.memberExpression(b.identifier('fractional'), b.identifier('replace')),
				[
					b.literal(/0+$/),
					b.literal('')
				]
			)
		)
	]));

	// See http://www.unicode.org/reports/tr35/tr35-numbers.html#Operands

	// Generates: const n = Math.abs(numericValue) || 0;
	operands.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('n'),
			b.logicalExpression(
				'||',
				b.callExpression(
					b.memberExpression(b.identifier('Math'), b.identifier('abs')),
					[b.identifier('numericValue')]
				),
				b.literal(0)
			)
		)
	]));

	// Generates: const i = parseInt(integer, 10) || 0;
	operands.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('i'),
			b.logicalExpression(
				'||',
				b.callExpression(
					b.identifier('parseInt'),
					[
						b.identifier('integer'),
						b.literal(10)
					]
				),
				b.literal(0)
			)
		)
	]));

	// Generates: const v = fractional.length;
	operands.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('v'),
			b.memberExpression(b.identifier('fractional'), b.identifier('length'))
		)
	]));

	// Generates: const w = fractionalNoZeroes.length;
	operands.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('w'),
			b.memberExpression(b.identifier('fractionalNoZeroes'), b.identifier('length'))
		)
	]));

	// Generates: const f = parseInt(fractional, 10) || 0;
	operands.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('f'),
			b.logicalExpression(
				'||',
				b.callExpression(
					b.identifier('parseInt'),
					[
						b.identifier('fractional'),
						b.literal(10)
					]
				),
				b.literal(0)
			)
		)
	]));

	// Generates: const t = parseInt(fractionalNoZeroes, 10) || 0;
	operands.push(b.variableDeclaration('const', [
		b.variableDeclarator(
			b.identifier('t'),
			b.logicalExpression(
				'||',
				b.callExpression(
					b.identifier('parseInt'),
					[
						b.identifier('fractionalNoZeroes'),
						b.literal(10)
					]
				),
				b.literal(0)
			)
		)
	]));

	return helpers.concat(operands);
}

const transpiler = {
	/**
	 * @param {Object<string, CLDRRule>} forms
	 * @return {ASTNode}
	 */
	transpile(forms) {
		const cases = [];

		Object.keys(forms)
			.forEach((form) => {
				const rule = forms[form];
				const condition = rule.condition;

				if (!condition) {
					return;
				}

				const predicate = traverse(condition);

				cases.push(b.switchCase(
					predicate,
					[b.returnStatement(b.literal(form))]
				));
			});

		cases.push(b.switchCase(
			null,
			[b.returnStatement(b.literal('other'))]
		));

		// TODO: generate only necessary ones, generate variables for repeated expressions like n%100
		const variables = generateVariables('value');

		return b.arrowFunctionExpression(
			[
				b.identifier('value')
			],
			b.blockStatement([
				...variables,
				b.switchStatement(
					b.literal(true),
					cases
				)
			])
		);
	}
};

module.exports = transpiler;
