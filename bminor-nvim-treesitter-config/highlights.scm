"function" @keyword
"return" @keyword.return
"array" @keyword

"if" @conditional
"else" @conditional

"for" @repeat

"!" @operator
"+" @operator
"-" @operator
"*" @operator
"/" @operator
"%" @operator
"^" @operator
"++" @operator
"--" @operator
"||" @operator
"&&" @operator
"<" @operator
"<=" @operator
"==" @operator
">=" @operator
">" @operator
"!=" @operator
"?" @operator
":" @operator
"=" @operator

"," @punctuation.delimiter
";" @punctuation.delimiter

"{" @punctuation.bracket
"}" @punctuation.bracket
"[" @punctuation.bracket
"]" @punctuation.bracket
"(" @punctuation.bracket
")" @punctuation.bracket

(integer) @number
(char_literal) @character
(boolean_literal) @boolean
(string_literal) @string

(type_atomic) @type.builtin

(param (identifier) @parameter)

(func_call (identifier) @function.call)

(comment) @comment
