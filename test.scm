; basic equaltiy
(displayln (eq? 114514 114514)) ; #t
(displayln (eq? 114514 1919810)) ; #f
(displayln (eq? 'yiiyo 'yiiyo)) ; #t
(displayln (eq? 'yiiyo 'koyiyo)) ; #f
(displayln (eq? 114514 'yiiyokoyiyo)) ; #f
(displayln (eq? #t #t)) ; #t
(displayln (eq? #t #f)) ; #f
(displayln (eq? '(1 2 3) '(1 2 3))) ; #f
(displayln (equal? '压力马斯内 '压力马斯内))
(displayln (equal? '(1 2 3) '(1 2 3))) ; #t
(newline)

(define (check a b . opt-tag)
  (define res (if (equal? a b) 'passed 'failed))
  (if (null? opt-tag) 
      (displayln res) 
      (begin (display (car opt-tag)) (display ':) (displayln res))))

; arithmetic
(check (+) 0 'add-0)
(check (+ 1) 1 'add-1)
(check (+ 1 1) 2 'add-2)
(check (+ 1 2 3 4) 10 'add-n)
(check (- 1) -1 'sub-1)
(check (- 1 2) -1 'sub-2)
(check (- 1 2 3 4) -8 'sub-n)
(check (*) 1 'mul-0)
(check (* 1) 1 'mul-1)
(check (* 1 2) 2 'mul-2)
(check (* 1 2 3 4) 24 'mul-n)
(check (/ 2) 0.5 'div-1)
(check (/ 2 4) 0.5 'div-2)
(check (/ 1 2 4) 0.125 'div-n)
(check (* (+ 1 2) 3) 9 '简单的复合运算)
(check (= (+ 1 2) (+ 2 1) (+ 1 1 1)) #t '多参数相等)
(check (< 1 2) #t '小于:1<2)
(check (< 1 2 3) #t '小于:1<2<3)
(check (< 1 3 2) #f '小于:1<3<2)
(check (> 1 2) #f '大于:1>2)
(check (<= 1 1) #t '不大于:1<=1)
(check (>= 1 2) #f '不小于:1>=2)
(check (!= 1 2) #t '不等于:1!=2)
(newline)

; predicate
(check (null? '()) #t 'null)
(check (null? 1) #f 'not-null)
(check (void? (void)) #t 'void)
(check (void? '1) #f 'not-void)
(check (pair? '(1 . 2)) #t 'pair-1)
(check (pair? (cons 1 '2)) #t 'pair-2)
(check (pair? '()) #f 'not-pair-1)
(check (pair? 1) #f 'not-pair-2)
(check (number? 1) #t 'number-1)
(check (number? '1) #t 'number-2)
(check (number? 'emmmm) #f 'not-number)
(check (boolean? #t) #t 'boolean)
(check (boolean? 1) #f 'not-boolean)
(check (symbol? 'this-is-a-symbol) #t 'symbol-1)
(check (symbol? '这是一个符号) #t 'symbol-2)
(check (symbol? '(this is a list , not a symbol)) #f 'not-symbol-1)
(check (symbol? '(这是一个列表 , 不是个符号)) #f 'not-symbol-2)
(check (procedure? procedure?) #t 'procedure-1)
(check (procedure? (lambda () '(this is a closure))) #t 'procedure-2)
(check (procedure? 1) #f 'not-procedure)
(newline)

; basic pair/list operation
(check (cons 1 2) '(1 . 2) 'cons)
(check (list 1 2 3) '(1 2 3) 'list)
(check (list 1 2 3) (cons 1 (cons 2 (cons 3 '()))) 'cons&list-1)
(check (list 1 2 3) '(1 . (2 . (3 . ()))) 'cons&list-2)
(check (car (cons 1 2)) 1 'car-cons)
(check (cdr (cons 1 2)) 2 'cdr-cons)
(check (car '(1 2 3)) 1 'car-list)
(check (cdr '(1 2 3)) '(2 3) 'cdr-list)
(newline)

; let/let*
(check (let ([x 1] [y 2]) (+ x y)) 3 'let)
(check (let* ([x 1] [y (+ x 1)]) (+ x y)) 3 'let*)
(newline)

; basic side effect operation
(let ()
  (set! x '哦!我的孩子!)
  (check x '哦!我的孩子! 'set!-symbol)
  
  (set! x '(你 , 该何去何从?))
  (check x '(你 , 该何去何从?) 'set!-list)
  
  (set-car! x '我)
  (check x '(我 , 该何去何从?) 'set-car!)
  
  (set-cdr! x '(, 拿着六便士 , 抬头看月亮))
  (check x '(我 , 拿着六便士 , 抬头看月亮) 'set-cdr!)
  )
(newline)

; logical and condition
(check (and) #t 'and-true-0)
(check (and #t #t #t) #t 'and-true-n)
(check (and #t #f) #f 'and-false-n)
(check (or) #f 'or-false-0)
(check (or #t #f #f) #t 'or-true-n)
(check (or #f #f) #f 'or-false-n)
(check (not #t) #f 'not-true)
(check (not #f) #t 'not-false)
(check (if #t 1 2) 1 'if-1)
(check (if #f (if #f 1 2) (if #f 3 4)) 4 'if-n)
(check (cond [#t 1] [#f 2]) 1 'cond-1)
(check (cond [#f 1] [#t 2]) 2 'cond-2)
(check (cond [#f 1] [#f 2] [#f 3] [#t 4]) 4 'cond-4)
(check (cond [#f 1] [#f 2] [#f 3] [else 4]) 4 'cond-else)
(check (cond [#f 1] [#f 2] [#f 3]) (void) 'cond-none)
(newline)

; recursion
(let ()
  (define (check-fib fibonacci tag)
    (check (fibonacci 10) 55 tag)
    (check (fibonacci 20) 6765 tag))
  
  (define (fib-naive n)
    (cond [(<= n 0) 0]
          [(= n 1) 1]
          [else (+ (fib-naive (- n 1)) (fib-naive (- n 2)))]))
  (check-fib fib-naive 'fib-naive)
  
  (define fib-iter-letrec
    (letrec ([iter (lambda (n a b)
                     (if (= n 0)
                         a 
                         (iter (- n 1) b (+ a b))))])
      (lambda (n) (iter n 0 1))))
  (check-fib fib-iter-letrec 'fib-iter-letrec)
  
  (define (fib-iter-def n)
    (define (iter n a b)
      (if (= n 0)
          a
          (iter (- n 1) b (+ a b))))
    (iter n 0 1))
  (check-fib fib-iter-def 'fib-iter-def)
  
  (define (fib-iter-named-let n)
    (let iter ([n n] [a 0] [b 1])
      (if (= n 0)
          a
          (iter (- n 1) b (+ a b)))))
  (check-fib fib-iter-named-let 'fib-named-let)
  
  )
(newline)

; mutual recursion
(letrec ([even? (lambda (n)
                  (if (= n 0)
                      #t
                      (odd? (- n 1))))]
         [odd? (lambda (n)
                 (if (= n 0)
                     #f
                     (even? (- n 1))))])
  (check (even? 12) #t 'even-12)
  (check (even? 9) #f 'even-9)
  (check (odd? 11) #t 'odd-11)
  (check (odd? 10) #f 'odd-10))
(newline)

; lib functions
(check ((partial + 1 2) 3) 6 'partial-1)
(check ((partial < 1) 2) #t 'partial-2)
(check (exist? (partial < 0) '()) #f 'exist-1)
(check (exist? (partial < 0) '(0 1 2)) #t 'exist-2)
(check (exist? (partial < 0) '(0 -1 -2)) #f 'exist-3)
(check (forall? (partial < 0) '()) #t 'forall-1)
(check (forall? (partial < 0) '(1 2 3)) #t 'forall-2)
(check (forall? (partial < 0) '(0 1 2)) #f 'forall-3)
(check (map (partial + 1) '(0 1 2)) '(1 2 3) 'map-1)
(check (map + '(1 2 3) '(4 5 6) '(7 8 9)) '(12 15 18) 'map-2)
(check (map range '(1 2 3)) '((0) (0 1) (0 1 2)) 'map-3)
(check (map range '(1 3 5) '(3 5 7)) '((1 2) (3 4) (5 6)) 'map-4)
(check (filter symbol? '(1 和 2 and 3)) '(和 and) 'filter-1)
(check (filter (partial != 1) '(1 3 1 4 5 2 0)) '(3 4 5 2 0) 'filter-2)
(check (foldl + 0 '(1 2 3)) (+ 0 1 2 3) 'foldl-1)
(check (foldr + 0 '(1 2 3)) (+ 0 1 2 3) 'foldr-1)
(check (foldl - 0 '(1 2 3)) (- (- (- 0 1) 2) 3) 'foldl-2)
(check (foldr - 0 '(1 2 3)) (- 1 (- 2 (- 3 0))) 'foldr-2)
(check (length '(1 2 3)) 3 'length)
(check (append '(1 2 3) '(4 5 6) '(7 8 9)) '(1 2 3 4 5 6 7 8 9) 'append)
(check (append '(1 2 3) '(4 5 6)) (foldr cons '(4 5 6) '(1 2 3)) 'append&foldr)
(check (zip '(1 2 3) '(4 5 6) '(7 8 9)) '((1 4 7) (2 5 8) (3 6 9)) 'zip)
(check (map list '(1 2 3) '(4 5 6) '(7 8 9)) '((1 4 7) (2 5 8) (3 6 9)) 'zip&map)
(check (flat-map range '(1 3 5) '(3 5 7)) '(1 2 3 4 5 6) 'flat-map)
(check (interleave '(1 3 5) '(2 4 6)) '(1 2 3 4 5 6) 'interleave)
(check (flat-map list '(1 3 5) '(2 4 6)) '(1 2 3 4 5 6) 'interleave&flat-map)
(check (reverse '(1 2 3)) '(3 2 1) 'reverse-1)
(check (reverse (range 0 10 2)) (range 8 -1 -2) 'reverse-2)
(check (range 0 10 2) '(0 2 4 6 8) 'range)
(newline)
