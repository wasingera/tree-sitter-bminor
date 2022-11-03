module.exports = grammar({
    name: 'bminor',

    extras: $ => [
        $.comment,
        /[\t\n \r]/
    ],

    rules: {
        source_file: $ => repeat($._decl),

        comment: $ => token(choice(
            seq('//', /(\\(.|\r?\n)|[^\\\n])*/),
            seq(
                '/*',
                /[^*]*\*+([^/*][^*]*\*+)*/,
                '/'
            )
        )),

        _decl: $ => choice(
            $.decl_func,
            $.decl_var,
        ),

        decl_func: $ => seq(
            $.identifier,
            ':',
            'function',
            $.type_func,
            choice(
                seq('=', $.block),
                ';'
            )
        ),

        decl_var: $ => seq(
            $.identifier,
            ':',
            $.type_var,
            optional(seq(
                '=',
                $._expr
            )),
            ';',
        ),

        type_func: $ => seq(
            choice(
                $.type_atomic,
                seq( 'array', '[', optional($._expr), ']', $.type_func),
                seq('function', $.type_func),
            ),
            '(', optional($.param_list), ')'
        ),

        type_var: $ => choice(
            $.type_atomic,
            seq( 'array', $.bracket_set, $.type_var)
        ),

        type_atomic: $ => choice(
            'boolean',
            'integer',
            'char',
            'string',
            'void',
            'auto',
        ),

        bracket_set: $ => seq(
            '[',
            optional($._expr),
            ']'
        ),

        param_list: $ => seq(
            $.param,
            repeat(seq(',', $.param)),
        ),

        param: $ => seq(
            $.identifier,
            ':',
            $.type_var,
        ),

        _stmt: $ => choice(
            $.if_stmt,
            $.return_stmt,
            $.print_stmt,
            $.expr_stmt,
            $.for_stmt,
            $.block,
        ),

        for_stmt: $ => seq(
            'for',
            '(',
            optional($._expr),
            ';',
            optional($._expr),
            ';',
            optional($._expr),
            ')',
            $._stmt,
        ),

        if_stmt: $ => prec.right(seq(
            'if',
            seq('(', $._expr, ')'),
            $._stmt,
            optional(
                $.else_stmt,
            )
        )),

        else_stmt: $ => seq('else', $._stmt),

        block: $ => seq(
            '{',
            repeat($._stmt),
            '}',
        ),

        expr_stmt: $ => seq($._expr, ';'),

        return_stmt: $ => seq(
            'return',
            optional($._expr),
            ';'
        ),

        print_stmt: $ => seq(
            'print',
            $.expr_list,
            ';'
        ),

        _expr: $ => choice(
            $.ternary_expr,
            $.logical_expr,
            $.comparison_expr,
            $.binary_expr,
            $.unary_expr,
            $.func_call,
            $.array_subscript,
            $._atomic,
        ),

        array_subscript: $ => prec(9, seq(
            $.identifier,
            repeat1(
                seq('[', $._expr, ']')
            )
        )),

        func_call: $ => prec(9, seq(
            $.identifier,
            '(',
            optional($.expr_list),
            ')',
        )),

        unary_expr: $ => choice(
            prec(7, seq('-', $._expr)),
            prec(7, seq('!', $._expr)),
            prec(8, seq($._expr, '++')),
            prec(8, seq($._expr, '--')),
            prec(9, seq('(', $._expr, ')'))
        ),

        binary_expr: $ => choice(
            prec.right(0, seq($._expr, '=', $._expr)),
            prec.left(4, seq($._expr, '+', $._expr)),
            prec.left(4, seq($._expr, '-', $._expr)),
            prec.left(5, seq($._expr, '*', $._expr)),
            prec.left(5, seq($._expr, '/', $._expr)),
            prec.left(5, seq($._expr, '%', $._expr)),
            prec.right(6, seq($._expr, '^', $._expr)),
        ),

        comparison_expr: $ => choice(
            prec.left(3, seq($._expr, '<', $._expr)),
            prec.left(3, seq($._expr, '<=', $._expr)),
            prec.left(3, seq($._expr, '==', $._expr)),
            prec.left(3, seq($._expr, '>=', $._expr)),
            prec.left(3, seq($._expr, '>', $._expr)),
            prec.left(3, seq($._expr, '!=', $._expr)),
        ),

        logical_expr: $ => choice(
            prec.left(1, seq($._expr, '||', $._expr)),
            prec.left(2, seq($._expr, '&&', $._expr)),
        ),

        ternary_expr: $ => choice(
            prec.right(0, seq(
                $._expr,
                '?',
                $._expr,
                ':',
                $._expr
            ))
        ),

        expr_list: $ => seq(
            $._expr,
            repeat(seq(',', $._expr))
        ),

        _atomic: $ => choice(
            $.identifier,
            $.integer,
            $.char_literal,
            $.string_literal,
            $.boolean_literal,
            seq('{', $.expr_list, '}')
        ),

        integer: $ => /[0-9]+/,

        identifier: $ => /[A-Za-z_]+[A-Za-z_0-9]*/,

        char_literal: $ => /'([^\'\\\n]|\\(.|\n))'/,

        string_literal: $ => /[\"]([^\"\\\n]|\\(.|\n))*[\"]/,

        boolean_literal: $ => choice('true', 'false'),
    }
});

