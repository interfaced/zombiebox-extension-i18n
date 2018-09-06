/* See http://www.unicode.org/reports/tr35/tr35-numbers.html#Plural_rules_syntax */


%lex
%%

\s+                   /* skip whitespaces */

[0123456789]+         return 'value'
and                   return 'and'
or                    return 'or'
is                    return 'is'
within                return 'within'
in                    return 'in'
not                   return 'not'
'='                   return 'in'
'!='                  return '!='
mod                   return 'mod'
'%'                   return 'mod'
','                   return ','
'..'                  return '..'
'…'                   return '...'
'...'                 return '...'
'@integer'            return '@integer'
'@decimal'            return '@decimal'
'.'                   return '.'
'~'                   return '~'
n|i|f|t|v|w           return 'operand'

<<EOF>>               return 'EOF'
.                     return 'INVALID'

/lex


%start start
%%


start
:   rule EOF {
        return $1;
	}
;


rule
:   condition {
		$$ = {
			condition: $1
		};
	}
|   condition samples {
		$$ = {
			condition: $1,
			samples: $2
		}
	}
|   samples {
		$$ = {
			samples: $1
		}
	}
;


condition
:   and_condition
|   or_condition
;


and_condition
:   relation
|   and_condition 'and' relation {
		$$ = {
			type: "and_condition",
			operands: [$1, $3]
		};
	}
;


or_condition
:   and_condition 'or' and_condition {
		$$ = {
			type: "or_condition",
			operands: [$1, $3]
		};
    }
|   or_condition 'or' and_condition {
		$$ = {
			type: "or_condition",
			operands: $1.operands.concat([$3])
		}
	}
;


relation
:   is_relation
|   in_relation
|   within_relation
;


is_relation
:   expr 'is' value {
		$$ = {
			type: 'is_relation',
			operands: [$1, $3]
		}
	}
|   expr 'is' 'not' value {
		$$ = {
			type: 'is_not_relation',
			operands: [$1, $4]
		}
	}
;


in_relation
:   expr 'in' range_list {
		$$ = {
			type: 'in_relation',
			operands: [$1, $3]
		}
	}
|   expr 'not' 'in' range_list {
        $$ = {
            type: 'not_in_relation',
            operands: [$1, $4]
        }
    }
|   expr '!=' range_list {
		$$ = {
			type: 'not_in_relation',
			operands: [$1, $3]
		}
	}
;


within_relation
:   expr 'within' range_list {
		$$ = {
			type: 'in_relation',
			operands: [$1, $3]
		}
	}
|   expr 'not' 'within' range_list {
        $$ = {
            type: 'not_in_relation',
            operands: [$1, $4]
        }
    }
;


expr
:   operand {
		$$ = {
			type: 'operand',
			value: $1
		}
	}
|   operand 'mod' value {
		$$ = {
			type: 'mod_expression',
			operands: [$1, $3]
		}
	}
;


range_list
:   range {
		$$ = [$1];
	}
|   range_list ',' range {
		$$ = $1.concat([$3]);
	}
;


range
:   value {
		$$ = {
			type: 'equal',
			value: $1
		}
	}
|   value '..' value {
		$$ = {
			type: 'range',
			from: $1,
			to: $3
		}
	}
;


samples
:   '@integer' sample_list {
		$$ = {
			integer: $2
		}
	}
|   '@decimal' sample_list {
		$$ = {
			decimal: $2
		}
	}
|   '@integer' sample_list '@decimal' sample_list {
		$$ = {
			integer: $2,
			decimal: $4
		}
	}
;


sample_list
:   sample_range
|   sample_list ',' sample_range {
		$$ = $1 + ', ' + $3;
	}
|   sample_list ',' '...' {
		$$ = $1 + ', …';
	}
;


sample_range
:   decimal_value
|   decimal_value '~' decimal_value {
		$$ = $1 + '~' + $3;
	}
;


decimal_value
:   value
|   value '.' value {
		$$ = $1 + '.' + $3
	}
;
